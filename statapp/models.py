from django.db import models

class UploadedFile(models.Model):
    file = models.FileField(upload_to='uploads/')  # Store files in the 'uploads/' folder
    uploaded_at = models.DateTimeField(auto_now_add=True)  # Timestamp for when the file is uploaded

    def __str__(self):
        return f"File: {self.file.name} - Uploaded at {self.uploaded_at}"
    
class TrimesterSnapshot(models.Model):
    trimester = models.CharField(max_length=10)  # e.g. "Q1-2024"
    materia = models.CharField(max_length=100)
    pendenti_iniziali = models.IntegerField()
    pendenti_finali = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('trimester', 'materia')

    def __str__(self):
        return f"{self.trimester} - {self.materia}"
