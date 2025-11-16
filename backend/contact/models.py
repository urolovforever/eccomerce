from django.db import models

class ContactMessage(models.Model):
    name = models.CharField(max_length=100, verbose_name="Ism")
    email = models.EmailField(blank=True, null=True, verbose_name="Email")
    phone = models.CharField(max_length=20, verbose_name="Telefon")
    message = models.TextField(verbose_name="Xabar")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Vaqt")
    is_read = models.BooleanField(default=False, verbose_name="O'qildi")
    
    class Meta:
        verbose_name = "Murojat"
        verbose_name_plural = "Murojatlar"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.phone}"
