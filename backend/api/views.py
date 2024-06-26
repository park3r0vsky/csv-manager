import os
import requests
import time
import pandas as pd
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.conf import settings
from .models import FileRecord
from .serializers import FileRecordSerializer

@api_view(['GET'])
def file_list(request):
    try:
        files = FileRecord.objects.all()
        serializer = FileRecordSerializer(files, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST', 'DELETE'])
def file_add_del(request):
    if request.method == 'POST':
        try:
            file = request.FILES['file']
            if not file.name.endswith('.csv'):
                return Response({"error": "Only CSV files are allowed."}, status=status.HTTP_400_BAD_REQUEST)
            file_name = os.path.splitext(file.name)[0]
            timestamp = str(int(time.time()))
            unique_file_name = f"{os.path.splitext(file.name)[0]}_{timestamp}.csv"
            upload_dir = os.path.join(settings.MEDIA_ROOT, 'uploads')
            os.makedirs(upload_dir, exist_ok=True)
            file_path = os.path.join(upload_dir, unique_file_name)
            file_record = FileRecord.objects.create(
                file_name=unique_file_name,
                file_path=file_path, 
            )
            with open(file_record.file_path, 'wb+') as destination:
                for chunk in file.chunks():
                    destination.write(chunk)
            return Response(status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    elif request.method == 'DELETE':
        file_id = request.data.get('id')
        try:
            file_record = FileRecord.objects.get(id=file_id)
            if os.path.exists(file_record.file_path):
                os.remove(file_record.file_path)
            file_record.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except FileRecord.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
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
        api_df = pd.json_normalize(api_data)

        enriched_df = df.merge(api_df, left_on=join_column, right_on=api_key_column, how='left')
        enriched_df = enriched_df.fillna('-')
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
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['GET'])
def get_csv_columns(request, id):
    try:
        file_record = FileRecord.objects.get(id=id)
        df = pd.read_csv(file_record.file_path, encoding='utf-8')
        columns = df.columns.tolist()
        return Response(columns)
    except FileRecord.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)