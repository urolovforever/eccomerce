from django.db import models
from django.utils.text import slugify
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid


class Category(models.Model):
    """Mahsulot kategoriyalari - nested structure support"""
    name = models.CharField(max_length=100, verbose_name="Kategoriya nomi")
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField(blank=True, verbose_name="Tavsif")
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='children',
        verbose_name="Asosiy kategoriya"
    )
    image = models.ImageField(
        upload_to='categories/',
        blank=True,
        null=True,
        verbose_name="Kategoriya rasmi"
    )
    is_active = models.BooleanField(default=True, verbose_name="Faol")
    display_order = models.IntegerField(default=0, verbose_name="Tartib raqami")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Kategoriya"
        verbose_name_plural = "Kategoriyalar"
        ordering = ['display_order', 'name']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['parent']),
            models.Index(fields=['is_active']),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        if self.parent:
            return f"{self.parent.name} → {self.name}"
        return self.name

    @property
    def full_path(self):
        """Kategoriya to'liq yo'li"""
        path = [self.name]
        parent = self.parent
        while parent:
            path.insert(0, parent.name)
            parent = parent.parent
        return ' → '.join(path)

    def get_all_children(self):
        """Barcha ichki kategoriyalarni olish"""
        children = list(self.children.filter(is_active=True))
        for child in list(children):
            children.extend(child.get_all_children())
        return children


class Tag(models.Model):
    """Moslashuvchan tag tizimi - New, Sale, Trending, va h.k."""
    name = models.CharField(max_length=50, unique=True, verbose_name="Tag nomi")
    slug = models.SlugField(unique=True, blank=True)
    color = models.CharField(
        max_length=7,
        default='#000000',
        verbose_name="Rang (hex)",
        help_text="Masalan: #FF0000"
    )
    is_active = models.BooleanField(default=True, verbose_name="Faol")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Tag"
        verbose_name_plural = "Taglar"
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Product(models.Model):
    """Professional mahsulot modeli"""
    PRODUCT_TYPE_CHOICES = [
        ('new', 'Yangi'),
        ('discount', 'Chegirmadagi'),
        ('regular', 'Oddiy'),
    ]

    COLOR_CHOICES = [
        ('qora', 'Qora'),
        ('oq', 'Oq'),
        ('qizil', 'Qizil'),
        ('ko\'k', 'Ko\'k'),
        ('yashil', 'Yashil'),
        ('sariq', 'Sariq'),
        ('pushti', 'Pushti'),
        ('jigarrang', 'Jigarrang'),
        ('kulrang', 'Kulrang'),
        ('to\'q-ko\'k', 'To\'q ko\'k'),
        ('binafsha', 'Binafsha'),
        ('apelsin', 'Apelsin'),
    ]

    SIZE_CHOICES = [
        ('XS', 'XS'),
        ('S', 'S'),
        ('M', 'M'),
        ('L', 'L'),
        ('XL', 'XL'),
        ('XXL', 'XXL'),
        ('XXXL', 'XXXL'),
    ]

    # Basic Information
    name = models.CharField(max_length=200, verbose_name="Mahsulot nomi")
    slug = models.SlugField(unique=True, blank=True, db_index=True)
    sku = models.CharField(
        max_length=100,
        unique=True,
        blank=True,
        verbose_name="SKU (Stock Keeping Unit)",
        help_text="Mahsulot artikuli - avtomatik yaratiladi"
    )
    product_type = models.CharField(
        max_length=20,
        choices=PRODUCT_TYPE_CHOICES,
        default='regular',
        verbose_name="Mahsulot turi",
        db_index=True
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name='products',
        verbose_name="Kategoriya",
        db_index=True
    )
    tags = models.ManyToManyField(
        Tag,
        blank=True,
        related_name='products',
        verbose_name="Taglar"
    )
    description = models.TextField(verbose_name="Tavsif")

    # Pricing
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Narx (so'm)",
        validators=[MinValueValidator(0)]
    )
    discount_percentage = models.IntegerField(
        default=0,
        verbose_name="Chegirma foizi (0-100)",
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )

    # Stock & Variants
    colors = models.JSONField(
        default=list,
        verbose_name="Ranglar",
        help_text="Mavjud ranglar ro'yxati"
    )
    sizes = models.JSONField(
        default=list,
        verbose_name="O'lchamlar",
        help_text="Mavjud o'lchamlar ro'yxati"
    )
    stock = models.PositiveIntegerField(
        default=0,
        verbose_name="Omborda mavjud miqdor"
    )

    # Legacy images (will be replaced by ProductImage model)
    image = models.ImageField(
        upload_to='products/',
        verbose_name="Asosiy rasm"
    )
    image_2 = models.ImageField(
        upload_to='products/',
        blank=True,
        null=True,
        verbose_name="Rasm 2"
    )
    image_3 = models.ImageField(
        upload_to='products/',
        blank=True,
        null=True,
        verbose_name="Rasm 3"
    )

    # Status flags
    is_featured = models.BooleanField(
        default=False,
        verbose_name="Mashhur",
        db_index=True
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name="Faol",
        db_index=True
    )

    # SEO & Metadata
    meta_title = models.CharField(
        max_length=200,
        blank=True,
        verbose_name="SEO Title"
    )
    meta_description = models.TextField(
        blank=True,
        verbose_name="SEO Description"
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Mahsulot"
        verbose_name_plural = "Mahsulotlar"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['sku']),
            models.Index(fields=['category', 'is_active']),
            models.Index(fields=['price']),
            models.Index(fields=['created_at']),
            models.Index(fields=['is_featured', 'is_active']),
        ]

    def save(self, *args, **kwargs):
        # Auto-generate slug
        if not self.slug:
            self.slug = slugify(self.name)

        # Auto-generate SKU if not provided
        if not self.sku:
            self.sku = f"PRD-{uuid.uuid4().hex[:8].upper()}"

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.sku})"

    @property
    def discounted_price(self):
        """Chegirmali narxni hisoblash"""
        if self.discount_percentage > 0:
            discount = self.price * (self.discount_percentage / 100)
            return self.price - discount
        return self.price

    @property
    def is_in_stock(self):
        """Omborda borligini tekshirish"""
        return self.stock > 0

    @property
    def discount_amount(self):
        """Chegirma miqdorini hisoblash"""
        if self.discount_percentage > 0:
            return self.price * (self.discount_percentage / 100)
        return 0


class ProductImage(models.Model):
    """Ko'p rasmlar uchun alohida model - tartib bilan"""
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='additional_images',
        verbose_name="Mahsulot"
    )
    image = models.ImageField(
        upload_to='products/gallery/',
        verbose_name="Rasm"
    )
    alt_text = models.CharField(
        max_length=200,
        blank=True,
        verbose_name="Alt Text (SEO)"
    )
    display_order = models.IntegerField(
        default=0,
        verbose_name="Tartib raqami"
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name="Faol"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Mahsulot rasmi"
        verbose_name_plural = "Mahsulot rasmlari"
        ordering = ['display_order', 'created_at']
        indexes = [
            models.Index(fields=['product', 'display_order']),
        ]

    def __str__(self):
        return f"{self.product.name} - Rasm {self.display_order}"


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


class AdminActionLog(models.Model):
    """Admin harakatlarini log qilish - audit trail"""
    ACTION_CHOICES = [
        ('create', 'Yaratildi'),
        ('update', 'Yangilandi'),
        ('delete', 'O\'chirildi'),
        ('activate', 'Faollashtirildi'),
        ('deactivate', 'Nofaol qilindi'),
    ]

    MODEL_CHOICES = [
        ('product', 'Mahsulot'),
        ('category', 'Kategoriya'),
        ('tag', 'Tag'),
        ('order', 'Buyurtma'),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        verbose_name="Administrator",
        related_name='admin_actions'
    )
    action = models.CharField(
        max_length=20,
        choices=ACTION_CHOICES,
        verbose_name="Harakat"
    )
    model_name = models.CharField(
        max_length=50,
        choices=MODEL_CHOICES,
        verbose_name="Model"
    )
    object_id = models.PositiveIntegerField(
        verbose_name="Ob'ekt ID"
    )
    object_repr = models.CharField(
        max_length=200,
        verbose_name="Ob'ekt nomi"
    )
    changes = models.JSONField(
        blank=True,
        null=True,
        verbose_name="O'zgarishlar",
        help_text="O'zgargan maydonlar va qiymatlari"
    )
    ip_address = models.GenericIPAddressField(
        blank=True,
        null=True,
        verbose_name="IP Address"
    )
    user_agent = models.TextField(
        blank=True,
        verbose_name="User Agent"
    )
    timestamp = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Vaqt",
        db_index=True
    )

    class Meta:
        verbose_name = "Admin harakat logi"
        verbose_name_plural = "Admin harakat loglari"
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['user', 'timestamp']),
            models.Index(fields=['model_name', 'object_id']),
            models.Index(fields=['action']),
        ]

    def __str__(self):
        return f"{self.user} - {self.get_action_display()} {self.model_name} #{self.object_id}"
