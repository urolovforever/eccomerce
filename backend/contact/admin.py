from django.contrib import admin
from django.utils.html import format_html
from .models import ContactMessage

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['status_icon', 'name', 'email', 'phone', 'short_message', 'created_at', 'is_read']
    list_filter = ['is_read', 'created_at']
    search_fields = ['name', 'email', 'phone', 'message']
    list_editable = ['is_read']
    readonly_fields = ['created_at', 'full_message']
    list_per_page = 30
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('👤 Murojat Ma\'lumotlari', {
            'fields': ('name', 'email', 'phone'),
            'classes': ('wide',)
        }),
        ('💬 Xabar', {
            'fields': ('full_message',),
            'classes': ('wide',)
        }),
        ('📊 Status', {
            'fields': ('is_read', 'created_at'),
            'classes': ('wide',)
        }),
    )
    
    def status_icon(self, obj):
        if obj.is_read:
            return format_html('<span style="color: green; font-size: 20px;">✓</span>')
        return format_html('<span style="color: orange; font-size: 20px;">●</span>')
    status_icon.short_description = ''
    
    def short_message(self, obj):
        return obj.message[:50] + '...' if len(obj.message) > 50 else obj.message
    short_message.short_description = 'Xabar'
    
    def full_message(self, obj):
        return format_html('<div style="padding: 15px; background: #f5f5f5; border-radius: 5px; white-space: pre-wrap;">{}</div>', obj.message)
    full_message.short_description = 'To\'liq Xabar'
    
    actions = ['mark_as_read', 'mark_as_unread']
    
    def mark_as_read(self, request, queryset):
        updated = queryset.update(is_read=True)
        self.message_user(request, f'{updated} ta xabar o\'qilgan deb belgilandi.')
    mark_as_read.short_description = "Tanlangan xabarlarni o'qilgan deb belgilash"
    
    def mark_as_unread(self, request, queryset):
        updated = queryset.update(is_read=False)
        self.message_user(request, f'{updated} ta xabar o\'qilmagan deb belgilandi.')
    mark_as_unread.short_description = "Tanlangan xabarlarni o'qilmagan deb belgilash"
