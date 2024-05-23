from django.db import models

class FileRecord(models.Model):
    file_name = models.CharField(max_length=255)
    upload_time = models.DateTimeField(auto_now_add=True)
    file_path = models.CharField(max_length=255)
    is_enriched = models.BooleanField(default=False)
    original_file = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='enriched_versions')

    def __str__(self):
        return self.file_name
