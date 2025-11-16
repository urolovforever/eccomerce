from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category, Product, Cart, CartItem, Order, OrderItem

class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'product_count']

    def get_product_count(self, obj):
        return obj.products.filter(is_active=True).count()


class ProductListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'product_type', 'category', 'category_name', 'description', 'price',
                  'colors', 'sizes', 'stock', 'image', 'image_2', 'image_3', 'uzum_link', 'yandex_market_link',
                  'discount_percentage', 'is_featured']


class ProductDetailSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    similar_products = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'product_type', 'category', 'category_name', 'description', 'price',
                  'colors', 'sizes', 'stock', 'image', 'image_2', 'image_3', 'uzum_link', 'yandex_market_link',
                  'discount_percentage', 'is_featured', 'created_at', 'similar_products']

    def get_similar_products(self, obj):
        similar = Product.objects.filter(category=obj.category, is_active=True).exclude(id=obj.id)[:4]
        return ProductListSerializer(similar, many=True, context=self.context).data


class ProductAdminSerializer(serializers.ModelSerializer):
    """Admin uchun mahsulot yaratish va tahrirlash serializer"""
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'product_type', 'category', 'category_name', 'description', 'price',
                  'colors', 'sizes', 'stock', 'image', 'image_2', 'image_3', 'uzum_link', 'yandex_market_link',
                  'discount_percentage', 'is_featured', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['slug', 'created_at', 'updated_at']

    def validate_discount_percentage(self, value):
        """Chegirma foizi 0-100 oralig'ida bo'lishi kerak"""
        if value < 0 or value > 100:
            raise serializers.ValidationError("Chegirma foizi 0 va 100 orasida bo'lishi kerak")
        return value

    def validate_price(self, value):
        """Narx musbat bo'lishi kerak"""
        if value <= 0:
            raise serializers.ValidationError("Narx musbat son bo'lishi kerak")
        return value

    def validate_stock(self, value):
        """Miqdor 0 yoki musbat bo'lishi kerak"""
        if value < 0:
            raise serializers.ValidationError("Miqdor manfiy bo'lishi mumkin emas")
        return value

    def validate_colors(self, value):
        """Ranglar ro'yxati to'g'ri formatda bo'lishi kerak"""
        if not isinstance(value, list):
            raise serializers.ValidationError("Ranglar ro'yxat formatida bo'lishi kerak")
        return value

    def validate_sizes(self, value):
        """O'lchamlar ro'yxati to'g'ri formatda bo'lishi kerak"""
        if not isinstance(value, list):
            raise serializers.ValidationError("O'lchamlar ro'yxat formatida bo'lishi kerak")
        return value


# ============== USER AUTHENTICATION SERIALIZERS ==============

class UserRegistrationSerializer(serializers.ModelSerializer):
    """Foydalanuvchi ro'yxatdan o'tish serializer"""
    password = serializers.CharField(write_only=True, min_length=6)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name']

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({"password_confirm": "Parollar mos kelmadi"})
        return data

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Bu email allaqachon ro'yxatdan o'tgan")
        return value

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    """Foydalanuvchi ma'lumotlari serializer"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']


class UserLoginSerializer(serializers.Serializer):
    """Foydalanuvchi login serializer"""
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


# ============== CART SERIALIZERS ==============

class CartItemSerializer(serializers.ModelSerializer):
    """Savat elementi serializer"""
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_image = serializers.ImageField(source='product.image', read_only=True)
    product_price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)
    product_discount = serializers.IntegerField(source='product.discount_percentage', read_only=True)
    discounted_price = serializers.DecimalField(source='product.discounted_price', max_digits=10, decimal_places=2, read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_name', 'product_image', 'product_price',
                  'product_discount', 'discounted_price', 'quantity', 'subtotal']
        read_only_fields = ['id', 'subtotal']

    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError("Miqdor kamida 1 bo'lishi kerak")
        if value > 99:
            raise serializers.ValidationError("Miqdor 99 dan oshmasligi kerak")
        return value


class CartSerializer(serializers.ModelSerializer):
    """Savat serializer"""
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    total_items = serializers.IntegerField(read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items', 'total_price', 'total_items', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class AddToCartSerializer(serializers.Serializer):
    """Savatga qo'shish serializer"""
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(default=1, min_value=1, max_value=99)

    def validate_product_id(self, value):
        if not Product.objects.filter(id=value, is_active=True).exists():
            raise serializers.ValidationError("Mahsulot topilmadi yoki faol emas")
        return value


# ============== ORDER SERIALIZERS ==============

class OrderItemSerializer(serializers.ModelSerializer):
    """Buyurtma elementi serializer"""
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_image = serializers.ImageField(source='product.image', read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'product_image', 'quantity', 'price', 'subtotal']
        read_only_fields = ['id', 'price', 'subtotal']


class OrderSerializer(serializers.ModelSerializer):
    """Buyurtma serializer"""
    items = OrderItemSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'full_name', 'phone', 'email', 'address', 'city',
                  'postal_code', 'total_price', 'status', 'status_display', 'notes',
                  'items', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'total_price', 'status', 'created_at', 'updated_at']


class CreateOrderSerializer(serializers.Serializer):
    """Buyurtma yaratish serializer"""
    full_name = serializers.CharField(max_length=200)
    phone = serializers.CharField(max_length=20)
    email = serializers.EmailField()
    address = serializers.CharField()
    city = serializers.CharField(max_length=100)
    postal_code = serializers.CharField(max_length=20, required=False, allow_blank=True)
    notes = serializers.CharField(required=False, allow_blank=True)

    def validate_phone(self, value):
        # Basic phone validation
        import re
        if not re.match(r'^\+?[0-9\s\-\(\)]+$', value):
            raise serializers.ValidationError("Telefon raqami noto'g'ri formatda")
        return value
