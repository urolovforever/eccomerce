from django.db import models
from django.utils.text import slugify
from django.contrib.auth.models import User

class Category(models.Model):
    name = models.CharField(max_length=100, verbose_name="Kategoriya nomi")
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField(blank=True, verbose_name="Tavsif")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Kategoriya"
        verbose_name_plural = "Kategoriyalar"
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=200, verbose_name="Mahsulot nomi")
    slug = models.SlugField(unique=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products', verbose_name="Kategoriya")
    description = models.TextField(verbose_name="Tavsif")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Narx (so'm)")
    image = models.ImageField(upload_to='products/', verbose_name="Asosiy rasm")
    image_2 = models.ImageField(upload_to='products/', blank=True, null=True, verbose_name="Rasm 2")
    image_3 = models.ImageField(upload_to='products/', blank=True, null=True, verbose_name="Rasm 3")
    uzum_link = models.URLField(verbose_name="Uzum Market havola")
    yandex_market_link = models.URLField(blank=True, null=True, verbose_name="Yandex Market havola")
    discount_percentage = models.IntegerField(default=0, verbose_name="Chegirma foizi (0-100)")
    is_featured = models.BooleanField(default=False, verbose_name="Mashhur")
    is_active = models.BooleanField(default=True, verbose_name="Faol")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Mahsulot"
        verbose_name_plural = "Mahsulotlar"
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    @property
    def discounted_price(self):
        """Chegirmali narxni hisoblash"""
        if self.discount_percentage > 0:
            discount = self.price * (self.discount_percentage / 100)
            return self.price - discount
        return self.price


class Cart(models.Model):
    """Foydalanuvchi savati"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cart', verbose_name="Foydalanuvchi")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Savat"
        verbose_name_plural = "Savatlar"

    def __str__(self):
        return f"{self.user.username} ning savati"

    @property
    def total_price(self):
        """Savat umumiy narxi"""
        return sum(item.subtotal for item in self.items.all())

    @property
    def total_items(self):
        """Savat umumiy mahsulotlar soni"""
        return sum(item.quantity for item in self.items.all())


class CartItem(models.Model):
    """Savatdagi mahsulotlar"""
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items', verbose_name="Savat")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, verbose_name="Mahsulot")
    quantity = models.PositiveIntegerField(default=1, verbose_name="Miqdori")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Savat elementi"
        verbose_name_plural = "Savat elementlari"
        unique_together = ['cart', 'product']

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"

    @property
    def subtotal(self):
        """Mahsulot uchun jami narx"""
        return self.product.discounted_price * self.quantity


class Order(models.Model):
    """Buyurtmalar"""
    STATUS_CHOICES = [
        ('pending', 'Kutilmoqda'),
        ('processing', 'Jarayonda'),
        ('shipped', 'Yuborildi'),
        ('delivered', 'Yetkazildi'),
        ('cancelled', 'Bekor qilindi'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders', verbose_name="Foydalanuvchi")
    full_name = models.CharField(max_length=200, verbose_name="To'liq ism")
    phone = models.CharField(max_length=20, verbose_name="Telefon")
    email = models.EmailField(verbose_name="Email")
    address = models.TextField(verbose_name="Yetkazib berish manzili")
    city = models.CharField(max_length=100, verbose_name="Shahar")
    postal_code = models.CharField(max_length=20, blank=True, verbose_name="Pochta indeksi")
    total_price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Jami narx")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name="Holat")
    notes = models.TextField(blank=True, verbose_name="Izohlar")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Buyurtma"
        verbose_name_plural = "Buyurtmalar"
        ordering = ['-created_at']

    def __str__(self):
        return f"Buyurtma #{self.id} - {self.full_name}"


class OrderItem(models.Model):
    """Buyurtmadagi mahsulotlar"""
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items', verbose_name="Buyurtma")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, verbose_name="Mahsulot")
    quantity = models.PositiveIntegerField(verbose_name="Miqdori")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Narx")

    class Meta:
        verbose_name = "Buyurtma elementi"
        verbose_name_plural = "Buyurtma elementlari"

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"

    @property
    def subtotal(self):
        """Mahsulot uchun jami narx"""
        return self.price * self.quantity
