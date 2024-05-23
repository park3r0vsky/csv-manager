import os
import requests
import pandas as pd
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.conf import settings
from .models import FileRecord
from .serializers import FileRecordSerializer

@api_view(['GET'])
def file_list(request):
    files = FileRecord.objects.all()
    serializer = FileRecordSerializer(files, many=True)
    return Response(serializer.data)

@api_view(['POST', 'DELETE'])
def file_add_del(request):
    if request.method == 'POST':
        file = request.FILES['file']
        file_name = file.name
        upload_dir = os.path.join(settings.MEDIA_ROOT, 'uploads')
        os.makedirs(upload_dir, exist_ok=True)
        file_path = os.path.join(upload_dir, file_name)
        file_record = FileRecord.objects.create(
            file_name=file_name,
            file_path=file_path, 
        )
        with open(file_record.file_path, 'wb+') as destination:
            for chunk in file.chunks():
                destination.write(chunk)
        return Response(status=status.HTTP_201_CREATED)
    
    elif request.method == 'DELETE':
        file_id = request.data.get('id')
        try:
            file_record = FileRecord.objects.get(id=file_id)
            os.remove(file_record.file_path)
            file_record.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except FileRecord.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
@api_view(['GET'])
def file_preview(request, id):
    try:
        file_record = FileRecord.objects.get(id=id)
        df = pd.read_csv(file_record.file_path, encoding='utf-8') 
        data = df.to_dict(orient='records')
        return Response(data)
    except FileRecord.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def file_enrich(request, id):
    try:
        file_record = FileRecord.objects.get(id=id)
        enrich_url = request.data.get('enrich_url')
        join_column = request.data.get('join_column', None) 
        api_key_column = request.data.get('api_key_column', None) 

        df = pd.read_csv(file_record.file_path)
        if join_column is None:
            join_column = df.columns[0] 

        response = requests.get(enrich_url)
        api_data = response.json()

        api_df = pd.DataFrame(api_data)

        enriched_df = df.merge(api_df, left_on=join_column, right_on=api_key_column, how='left')

        enriched_file_name = f"enriched_{file_record.file_name}"
        enriched_file_path = os.path.join(settings.MEDIA_ROOT, 'uploads', enriched_file_name)
        enriched_df.to_csv(enriched_file_path, index=False)

        FileRecord.objects.create(
            file_name=enriched_file_name,
            file_path=enriched_file_path,
            is_enriched=True,
            original_file=file_record
        )

        return Response(status=status.HTTP_201_CREATED)
    except FileRecord.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
