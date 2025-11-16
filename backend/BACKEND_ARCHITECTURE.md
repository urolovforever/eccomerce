# 🏗️ Professional E-Commerce Backend Architecture

## Umumiy ma'lumot

Bu professional ayollar kiyimi do'koni uchun robust, scalable va secure backend tizimi.

---

## 📊 Database Models

### 1. **Category Model** (Nested Structure)
Ichma-ich kategoriyalar tizimi:

**Fields:**
- `name` - Kategoriya nomi
- `slug` - URL uchun SEO-friendly slug (auto-generated)
- `description` - Kategoriya tavsifi
- `parent` - Asosiy kategoriya (self-referencing FK)
- `image` - Kategoriya rasmi
- `is_active` - Faol/Nofaol
- `display_order` - Tartib raqami
- `created_at`, `updated_at` - Timestamps

**Features:**
- ✅ Nested categories (e.g., Kiyimlar → Ko'ylaklar → Rasmiy ko'ylaklar)
- ✅ Category images/icons
- ✅ `full_path` property - to'liq yo'lni ko'rsatadi
- ✅ `get_all_children()` method - barcha ichki kategoriyalarni oladi
- ✅ Database indexes for performance

**Example:**
```
Kiyimlar
├── Ko'ylaklar
│   ├── Rasmiy ko'ylaklar
│   └── Kundalik ko'ylaklar
└── Shim
    ├── Jinsi
    └── Klassik
```

---

### 2. **Tag Model** (Flexible Tagging System)
Moslashuvchan tag tizimi:

**Fields:**
- `name` - Tag nomi (e.g., "Yangi", "Sale", "Trending")
- `slug` - URL-friendly slug
- `color` - Hex rang kodi (e.g., #FF0000)
- `is_active` - Faol/Nofaol
- `created_at` - Yaratilgan vaqt

**Features:**
- ✅ Custom color for each tag
- ✅ Many-to-many relationship with products
- ✅ Active/inactive status

**Example Tags:**
- 🆕 **New** (#4caf50)
- 🔥 **Sale** (#ff3b3f)
- ⭐ **Trending** (#ff9800)
- 💎 **Premium** (#9c27b0)

---

### 3. **Product Model** (Enhanced)
Professional mahsulot modeli:

**Fields:**

#### Basic Information
- `name` - Mahsulot nomi
- `slug` - SEO-friendly URL (auto-generated)
- `sku` - Stock Keeping Unit (auto-generated: PRD-XXXXXXXX)
- `product_type` - Turi (new, discount, regular)
- `category` - Kategoriya (FK to Category)
- `tags` - Taglar (M2M with Tag)
- `description` - To'liq tavsif

#### Pricing
- `price` - Asosiy narx (validatsiya: > 0)
- `discount_percentage` - Chegirma foizi (0-100)

#### Stock & Variants
- `colors` - Mavjud ranglar (JSON array)
- `sizes` - Mavjud o'lchamlar (JSON array)
- `stock` - Omborda mavjud miqdor

#### Images (Legacy - 3 images)
- `image` - Asosiy rasm
- `image_2`, `image_3` - Qo'shimcha rasmlar

#### Status Flags
- `is_featured` - Mashhur mahsulot
- `is_active` - Faol/Nofaol

#### SEO & Metadata
- `meta_title` - SEO title
- `meta_description` - SEO description

#### Timestamps
- `created_at`, `updated_at`

**Features:**
- ✅ Auto-generated SKU (unique identifier)
- ✅ Auto-generated slug from name
- ✅ Database indexes for fast queries
- ✅ Validation (price > 0, discount 0-100)
- ✅ Properties: `discounted_price`, `is_in_stock`, `discount_amount`
- ✅ PROTECT on_delete for category (prevents accidental deletion)

**Database Indexes:**
- SKU
- Category + is_active
- Price
- Created_at
- is_featured + is_active

---

### 4. **ProductImage Model** (Multiple Images with Ordering)
Ko'p rasmlar uchun alohida model:

**Fields:**
- `product` - Mahsulot (FK to Product)
- `image` - Rasm fayli
- `alt_text` - SEO uchun alt text
- `display_order` - Tartib raqami
- `is_active` - Faol/Nofaol
- `created_at` - Yaratilgan vaqt

**Features:**
- ✅ Unlimited images per product
- ✅ Custom ordering
- ✅ SEO-friendly alt text
- ✅ Active/inactive status per image

**Usage:**
```python
# Get all active images for a product, ordered
product.additional_images.filter(is_active=True).order_by('display_order')
```

---

### 5. **AdminActionLog Model** (Audit Trail)
Admin harakatlarini log qilish:

**Fields:**
- `user` - Administrator (FK to User)
- `action` - Harakat turi (create, update, delete, activate, deactivate)
- `model_name` - Model nomi (product, category, tag, order)
- `object_id` - Ob'ekt ID
- `object_repr` - Ob'ekt nomi (string representation)
- `changes` - O'zgarishlar (JSON)
- `ip_address` - IP address
- `user_agent` - Browser/device info
- `timestamp` - Harakat vaqti

**Features:**
- ✅ Complete audit trail of admin actions
- ✅ Track what changed (JSON field)
- ✅ IP address and user agent logging
- ✅ Database indexes for fast queries

**Use Cases:**
- Xavfsizlik auditi
- Qaysi admin nima qilganini kuzatish
- O'zgarishlar tarixini ko'rish
- Muammolarni hal qilish

---

## 🔐 Security Features

### Validation
- ✅ Price validation (must be > 0)
- ✅ Discount validation (0-100)
- ✅ Stock validation (≥ 0)
- ✅ Unique SKU per product
- ✅ Unique slug per category and product

### Data Protection
- ✅ PROTECT on_delete for category (prevents accidental data loss)
- ✅ Audit logging for all admin actions
- ✅ Soft delete capability (is_active flag)

### Database Indexes
- ✅ 15+ strategic indexes for fast queries
- ✅ Composite indexes for common query patterns
- ✅ Unique constraints on critical fields

---

## 🚀 Performance Optimizations

### Database Indexes
```python
# Category
- slug
- parent
- is_active

# Product
- sku
- slug
- category + is_active
- price
- created_at
- is_featured + is_active

# ProductImage
- product + display_order

# AdminActionLog
- user + timestamp
- model_name + object_id
- action
```

### Query Optimization
- Indexed foreign keys
- Composite indexes for common filters
- `select_related` and `prefetch_related` ready

---

## 📋 Model Properties & Methods

### Category
```python
@property
def full_path(self):
    """Returns: Kiyimlar → Ko'ylaklar → Rasmiy ko'ylaklar"""

def get_all_children(self):
    """Returns all nested children recursively"""
```

### Product
```python
@property
def discounted_price(self):
    """Calculates price after discount"""

@property
def is_in_stock(self):
    """Returns True if stock > 0"""

@property
def discount_amount(self):
    """Returns discount amount in currency"""
```

---

## 🎯 Next Steps (Recommendations)

### 1. **API Endpoints** (To be implemented)
```python
# Category Endpoints
GET    /api/categories/              # List all categories
GET    /api/categories/{id}/         # Category detail
POST   /api/categories/              # Create category (admin only)
PUT    /api/categories/{id}/         # Update category (admin only)
DELETE /api/categories/{id}/         # Delete category (admin only)
GET    /api/categories/{id}/children/ # Get child categories

# Product Endpoints
GET    /api/products/                # List products (with filters)
GET    /api/products/{slug}/         # Product detail
POST   /api/products/                # Create product (admin only)
PUT    /api/products/{id}/           # Update product (admin only)
DELETE /api/products/{id}/           # Delete product (admin only)

# Tag Endpoints
GET    /api/tags/                    # List all tags
GET    /api/tags/{slug}/products/    # Products by tag

# Filtering & Search
GET /api/products/?category={id}
GET /api/products/?tags={slug}
GET /api/products/?price_min={min}&price_max={max}
GET /api/products/?search={query}
GET /api/products/?product_type=new
GET /api/products/?is_featured=true
GET /api/products/?ordering=-created_at
```

### 2. **Custom Permissions**
```python
class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Allow GET for all users,
    POST/PUT/DELETE only for admins
    """
```

### 3. **Serializers** (To be updated)
- CategorySerializer (with nested children)
- TagSerializer
- ProductImageSerializer
- ProductSerializer (with tags and images)
- AdminActionLogSerializer

### 4. **Filtering**
```python
# django-filter integration
class ProductFilter(django_filters.FilterSet):
    class Meta:
        model = Product
        fields = {
            'price': ['gte', 'lte'],
            'category': ['exact', 'in'],
            'product_type': ['exact'],
            'is_featured': ['exact'],
            'tags': ['exact'],
        }
```

### 5. **Search**
```python
# Full-text search
search_fields = ['name', 'description', 'sku']
```

---

## 📊 Database Schema Summary

```
Category
  ├── products (many)
  └── children (many, self-referencing)

Tag
  └── products (many-to-many)

Product
  ├── category (one)
  ├── tags (many)
  ├── additional_images (many)
  ├── cart_items (many)
  └── order_items (many)

ProductImage
  └── product (one)

AdminActionLog
  └── user (one)
```

---

## 🎨 Professional Features Implemented

✅ **SKU System** - Auto-generated unique identifiers
✅ **Nested Categories** - Unlimited depth hierarchy
✅ **Flexible Tagging** - Custom tags with colors
✅ **Multiple Images** - Ordered image gallery
✅ **SEO Optimization** - Meta fields and slugs
✅ **Audit Logging** - Complete action history
✅ **Data Validation** - Input validation and constraints
✅ **Performance** - Strategic database indexes
✅ **Soft Delete** - is_active flags
✅ **Timestamps** - created_at and updated_at

---

## 🔧 Migration Notes

**Migration File:** `0008_adminactionlog_productimage_tag_and_more.py`

**Changes:**
- Added Tag model
- Added ProductImage model
- Added AdminActionLog model
- Enhanced Category with parent, image, is_active, display_order
- Enhanced Product with SKU, tags, meta fields
- Added 15+ database indexes

**To apply:**
```bash
python manage.py migrate
```

---

## 📝 Usage Examples

### Create Nested Category
```python
# Parent category
kiyimlar = Category.objects.create(name="Kiyimlar")

# Child category
koylaklar = Category.objects.create(
    name="Ko'ylaklar",
    parent=kiyimlar
)

# Grandchild category
rasmiy = Category.objects.create(
    name="Rasmiy ko'ylaklar",
    parent=koylaklar
)

# Get full path
print(rasmiy.full_path)  # "Kiyimlar → Ko'ylaklar → Rasmiy ko'ylaklar"
```

### Create Product with Tags
```python
# Create tags
sale_tag = Tag.objects.create(name="Sale", color="#ff3b3f")
new_tag = Tag.objects.create(name="Yangi", color="#4caf50")

# Create product
product = Product.objects.create(
    name="Rasmiy ko'ylak",
    category=rasmiy,
    price=250000,
    discount_percentage=20,
    stock=10,
    colors=["qora", "oq", "ko'k"],
    sizes=["S", "M", "L", "XL"]
)

# Add tags
product.tags.add(sale_tag, new_tag)

# Add additional images
ProductImage.objects.create(
    product=product,
    image="path/to/image1.jpg",
    display_order=1
)
```

### Query Products
```python
# Get featured products in a category
Product.objects.filter(
    category=kiyimlar,
    is_featured=True,
    is_active=True
).select_related('category')

# Get products with specific tag
Product.objects.filter(
    tags__slug='sale',
    is_active=True
)

# Get products with discounts
Product.objects.filter(
    discount_percentage__gt=0,
    is_active=True
).order_by('-discount_percentage')
```

---

## 🎯 Conclusion

Bu backend tizimi professional e-commerce loyiha uchun barcha zarur funksiyalarni taqdim etadi:

- ✅ Scalable database structure
- ✅ Comprehensive product management
- ✅ Flexible categorization
- ✅ Security and audit trail
- ✅ Performance optimized
- ✅ SEO-friendly
- ✅ Easy to extend

Keyingi qadamlar: API endpoints, serializers, filtering, va frontend integration.
