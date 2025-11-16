from django.contrib import admin
from django.utils.html import format_html
from .models import Category, Product, Cart, CartItem, Order, OrderItem


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'product_count', 'created_at']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name', 'description']
    list_per_page = 20

    def product_count(self, obj):
        count = obj.products.count()
        return format_html('<b style="color: green;">{}</b>', count)

    product_count.short_description = 'Mahsulotlar Soni'


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['image_preview', 'name', 'product_type_badge', 'category', 'formatted_price', 'discount_badge', 'stock', 'is_featured', 'is_active', 'created_at']
    list_filter = ['product_type', 'category', 'is_featured', 'is_active', 'created_at']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['is_featured', 'is_active']
    list_per_page = 20
    date_hierarchy = 'created_at'

    fieldsets = (
        ('📦 Asosiy Ma\'lumotlar', {
            'fields': ('name', 'slug', 'product_type', 'category', 'description'),
            'classes': ('wide',)
        }),
        ('💰 Narx va Miqdor', {
            'fields': ('price', 'stock'),
            'classes': ('wide',)
        }),
        ('🏷️ Chegirma', {
            'fields': ('discount_percentage',),
            'classes': ('wide',),
            'description': 'Chegirma foizini kiriting (0-100 oralig\'ida)'
        }),
        ('🎨 Xususiyatlar', {
            'fields': ('colors', 'sizes'),
            'classes': ('wide',),
            'description': 'Ranglar va o\'lchamlar ro\'yxati (JSON formatida)'
        }),
        ('🖼️ Rasmlar', {
            'fields': ('image', 'image_2', 'image_3'),
            'classes': ('wide',)
        }),
        ('⚙️ Status', {
            'fields': ('is_featured', 'is_active'),
            'classes': ('wide',)
        }),
    )

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" width="50" height="50" style="border-radius: 5px; object-fit: cover;" />',
                obj.image.url
            )
        return '-'

    image_preview.short_description = 'Rasm'

    def formatted_price(self, obj):
        # TUZATILDI: Avval format qilib, keyin format_html'ga yuboramiz
        price_str = '{:,.0f}'.format(float(obj.price))
        return format_html(
            '<b style="color: #2e7d32;">{} so\'m</b>',
            price_str
        )

    formatted_price.short_description = 'Narx'
    formatted_price.admin_order_field = 'price'

    def discount_badge(self, obj):
        if obj.discount_percentage > 0:
            return format_html(
                '<span style="background: #ff3b3f; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;">-{}%</span>',
                obj.discount_percentage
            )
        return format_html('<span style="color: #999;">-</span>')

    discount_badge.short_description = 'Chegirma'
    discount_badge.admin_order_field = 'discount_percentage'

    def product_type_badge(self, obj):
        colors = {
            'new': '#4caf50',
            'discount': '#ff3b3f',
            'regular': '#2196f3',
        }
        labels = {
            'new': 'Yangi',
            'discount': 'Chegirmada',
            'regular': 'Oddiy',
        }
        return format_html(
            '<span style="background: {}; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;">{}</span>',
            colors.get(obj.product_type, '#999'),
            labels.get(obj.product_type, obj.product_type)
        )

    product_type_badge.short_description = 'Turi'
    product_type_badge.admin_order_field = 'product_type'

    # Rasm yuklanganda avtomatik preview
    readonly_fields = ['image_preview_large']

    def image_preview_large(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="max-width: 300px; max-height: 300px; border-radius: 10px;" />',
                obj.image.url
            )
        return 'Rasm yuklanmagan'

    image_preview_large.short_description = 'Rasm Preview'


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    readonly_fields = ['product', 'quantity', 'subtotal']
    can_delete = True

    def subtotal(self, obj):
        if obj.pk:
            return format_html('<b>{:,.0f} so\'m</b>', float(obj.subtotal))
        return '-'

    subtotal.short_description = 'Jami'


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['user', 'total_items', 'formatted_total_price', 'created_at', 'updated_at']
    list_filter = ['created_at']
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['total_items', 'formatted_total_price', 'created_at', 'updated_at']
    inlines = [CartItemInline]

    def formatted_total_price(self, obj):
        return format_html(
            '<b style="color: #2e7d32;">{:,.0f} so\'m</b>',
            float(obj.total_price)
        )

    formatted_total_price.short_description = 'Jami narx'


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product', 'quantity', 'price', 'subtotal']
    can_delete = False

    def subtotal(self, obj):
        if obj.pk:
            return format_html('<b>{:,.0f} so\'m</b>', float(obj.subtotal))
        return '-'

    subtotal.short_description = 'Jami'


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'full_name', 'phone', 'city', 'status', 'status_badge', 'formatted_total_price', 'created_at']
    list_filter = ['status', 'created_at', 'city']
    search_fields = ['full_name', 'phone', 'email', 'address', 'user__username']
    list_editable = ['status']
    readonly_fields = ['user', 'total_price', 'created_at', 'updated_at']
    date_hierarchy = 'created_at'
    inlines = [OrderItemInline]

    fieldsets = (
        ('👤 Foydalanuvchi Ma\'lumotlari', {
            'fields': ('user', 'full_name', 'phone', 'email'),
        }),
        ('📍 Yetkazib Berish Ma\'lumotlari', {
            'fields': ('address', 'city', 'postal_code'),
        }),
        ('💰 To\'lov Ma\'lumotlari', {
            'fields': ('total_price',),
        }),
        ('📋 Buyurtma Holati', {
            'fields': ('status', 'notes'),
        }),
        ('🕒 Vaqt', {
            'fields': ('created_at', 'updated_at'),
        }),
    )

    def status_badge(self, obj):
        colors = {
            'pending': '#ff9800',
            'processing': '#2196f3',
            'shipped': '#9c27b0',
            'delivered': '#4caf50',
            'cancelled': '#f44336',
        }
        return format_html(
            '<span style="background: {}; color: white; padding: 4px 12px; border-radius: 4px; font-weight: bold;">{}</span>',
            colors.get(obj.status, '#999'),
            obj.get_status_display()
        )

    status_badge.short_description = 'Holat'

    def formatted_total_price(self, obj):
        return format_html(
            '<b style="color: #2e7d32;">{:,.0f} so\'m</b>',
            float(obj.total_price)
        )

    formatted_total_price.short_description = 'Jami narx'
    formatted_total_price.admin_order_field = 'total_price'