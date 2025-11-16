# 🛍️ Product Detail Page Guide

## Overview

Professional, modern product detail page for women's clothing e-commerce website. Provides comprehensive product information and encourages purchase through elegant design and smooth interactions.

---

## ✨ Features

### 1. **Breadcrumb Navigation**
- Shows user's path: Home > Products > Category > Product Name
- Clickable links for easy navigation
- Responsive text truncation on mobile

### 2. **Image Gallery**
```javascript
// Main image with hover zoom effect
<img className="transition-transform duration-500 group-hover:scale-105" />

// Thumbnail gallery (up to 3 images)
- Click to switch main image
- Active thumbnail highlighted with primary ring
- 3:4 aspect ratio for consistency
```

### 3. **Image Zoom Modal**
- Full-screen overlay with zoomed image
- Click anywhere to close
- Escape key support
- Dark background (90% opacity black)

### 4. **Product Information**
- **Title**: Large, bold, readable (3xl-4xl)
- **Category**: Small, uppercase, tracking-wider
- **Rating**: 5-star display with review count
- **SKU**: Auto-generated product code

### 5. **Dynamic Badges**
Priority order (same as ProductCard):
1. **YANGI** (New) - `bg-primary-600`
2. **CHEGIRMA** (Discount) - `bg-accent-600`
3. **MASHHUR** (Featured) - `bg-gold-600`

### 6. **Price Display**
```javascript
// With discount
<div className="space-y-2">
  <span className="text-4xl font-bold text-accent-600">199,000 so'm</span>
  <span className="text-xl line-through text-gray-400">250,000 so'm</span>
  <div className="bg-accent-50 text-accent-600">Tejaysiz: 51,000 so'm</div>
</div>

// Without discount
<span className="text-4xl font-bold text-text-primary">199,000 so'm</span>
```

### 7. **Color Selection**
```javascript
// Auto-selects first color on load
// Shows selected color name in header
<button className={`px-4 py-2 border-2 rounded-button ${
  selected ? 'border-primary-600 bg-primary-50 text-primary-600' : 'border-border-light'
}`}>
  {colorName}
</button>
```

### 8. **Size Selection**
```javascript
// Auto-selects first size on load
// Square buttons (14×14) for sizes
<button className={`w-14 h-14 border-2 rounded-button ${
  selected ? 'border-primary-600 bg-primary-600 text-white' : 'border-border-light'
}`}>
  {size}
</button>
```

### 9. **Quantity Selector**
```javascript
// +/- buttons with stock validation
<div className="flex items-center border-2 rounded-button">
  <button onClick={decrement} disabled={quantity <= 1}>-</button>
  <span className="px-6 min-w-[60px]">{quantity}</span>
  <button onClick={increment} disabled={quantity >= stock}>+</button>
</div>

// Low stock warning (≤10 items)
{stock <= 10 && <span>Faqat {stock} dona qoldi!</span>}
```

### 10. **Add to Cart**
```javascript
// Validates size/color selection
if (!selectedSize && product.sizes.length > 0) {
  alert('Iltimos, o\'lchamni tanlang');
  return;
}

// Requires authentication
if (!isAuthenticated) {
  navigate('/login', { state: { from: pathname } });
  return;
}

// Loading state
<button disabled={addingToCart}>
  {addingToCart ? 'QO\'SHILMOQDA...' : 'SAVATGA QO\'SHISH'}
</button>
```

### 11. **Wishlist**
- Heart icon (top-right near title)
- Filled/outlined states
- Requires authentication
- TODO: Backend API integration

### 12. **Product Features**
```javascript
// 3 key features with icons
- Bepul yetkazib berish (TruckIcon)
- Kafolat (ShieldCheckIcon)
- 14 kun ichida qaytarish (ArrowsRightLeftIcon)
```

### 13. **Information Tabs**

#### Tab 1: Ma'lumotlar (Details)
```
- Product description
- SKU
- Category
- Available colors
- Available sizes
```

#### Tab 2: Yetkazib berish (Shipping)
```
Yetkazib berish:
• Bepul yetkazib berish 500,000 so'mdan yuqori buyurtmalar uchun
• Standart yetkazib berish: 3-5 ish kuni
• Tezkor yetkazib berish: 1-2 ish kuni

Qaytarish:
• 14 kun ichida bepul qaytarish
• Mahsulot yangi va foydalanilmagan bo'lishi kerak
• Asl qadoqda qaytarilishi shart
```

#### Tab 3: Sharhlar (Reviews)
```
- Rating summary (4.5/5)
- Star distribution bar chart
- Individual reviews with:
  - User avatar (initials)
  - Name
  - Star rating
  - Review date
  - Review text
```

### 14. **Related Products**
```javascript
// Loads 4 products from same category
// Filters out current product
// Uses ProductGrid component
<ProductGrid products={relatedProducts} />
```

### 15. **Loading State**
```javascript
// Skeleton loader
<div className="animate-pulse">
  <div className="aspect-[3/4] bg-gray-200 rounded-lg"></div>
  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
  <div className="h-12 bg-gray-200 rounded w-1/2"></div>
</div>
```

### 16. **Empty State**
```javascript
// Product not found
<div className="text-center py-20">
  <h2>Mahsulot topilmadi</h2>
  <Link to="/products">Mahsulotlar sahifasiga qaytish</Link>
</div>
```

---

## 🎨 Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  Home > Products > Category > Product Name  [Breadcrumb]    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────────┐  ┌────────────────────────────────┐ │
│  │                    │  │  Product Title          [❤]    │ │
│  │                    │  │  Category                       │ │
│  │   Main Image       │  │  ⭐⭐⭐⭐⭐ (24 reviews)         │ │
│  │   [Badge] [🔍]     │  │                                 │ │
│  │                    │  │  ┌─────────────────────────┐   │ │
│  │                    │  │  │  199,000 so'm           │   │ │
│  └────────────────────┘  │  │  ~~250,000~~ Tejaysiz   │   │ │
│  [🖼️] [🖼️] [🖼️] [🖼️]    │  └─────────────────────────┘   │ │
│                          │                                 │ │
│                          │  Rang: Qora                     │ │
│                          │  [Qora] [Oq] [Qizil]            │ │
│                          │                                 │ │
│                          │  O'lcham: M                     │ │
│                          │  [XS] [S] [M] [L] [XL]          │ │
│                          │                                 │ │
│                          │  Miqdor: [-] 1 [+]              │ │
│                          │                                 │ │
│                          │  [🛍️ SAVATGA QO'SHISH]          │ │
│                          │                                 │ │
│                          │  🚚 Bepul  🛡️ Kafolat  🔄 14 kun │ │
│  └────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  [Ma'lumotlar] [Yetkazib berish] [Sharhlar]     [Tabs]     │
├─────────────────────────────────────────────────────────────┤
│  Tab content...                                             │
├─────────────────────────────────────────────────────────────┤
│  O'xshash mahsulotlar                                       │
│  [Card] [Card] [Card] [Card]                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Color Palette

### Using Custom Theme Colors

- **Badges**:
  - YANGI: `bg-primary-600` (#2C5BA5)
  - CHEGIRMA: `bg-accent-600` (#DC3545)
  - MASHHUR: `bg-gold-600` (#DAA520)

- **Text**:
  - Title: `text-text-primary` (#2C3E50)
  - Category: `text-text-secondary` (#6C757D)
  - Price: `text-accent-600` (discounted) / `text-text-primary` (regular)

- **Buttons**:
  - Primary: `bg-gray-900` → `hover:bg-gray-800`
  - Selected color: `border-primary-600 bg-primary-50 text-primary-600`
  - Selected size: `border-primary-600 bg-primary-600 text-white`

- **Backgrounds**:
  - Page: `bg-surface-light` (#F8F9FA)
  - Cards: `bg-surface-white` (#FFFFFF)
  - Borders: `border-border-light` (#DEE2E6)

- **Tab Active**: `text-primary-600 border-b-2 border-primary-600`

- **Star Rating**: `text-gold-600` (#DAA520)

---

## 📱 Responsive Design

### Desktop (> 1024px)
```css
- 2-column grid (50/50): Image | Product Info
- Gap: 16 (4rem)
- Title: text-4xl
- Button: py-4 text-lg
- Tabs: Full width, equal distribution
```

### Tablet (640px - 1024px)
```css
- 1-column layout (stacked)
- Gap: 8 (2rem)
- Title: text-3xl
- Button: py-3 text-base
```

### Mobile (< 640px)
```css
- 1-column layout
- Padding: px-4
- Title: text-2xl
- Thumbnails: 4 columns
- Tabs: Scrollable if needed
- Breadcrumb: Truncate long names
```

---

## 🎭 Animations & Interactions

### Image Hover
```css
transition: transform 500ms
transform: scale(1.05)
```

### Thumbnail Selection
```css
Active: ring-2 ring-primary-600 shadow-soft-md
Inactive: ring-1 ring-border-light hover:ring-primary-600
transition: all 200ms
```

### Button Hover
```css
Add to Cart: shadow-soft-lg → shadow-soft-hover
Quantity +/-: bg-transparent → bg-surface-light
```

### Tab Switching
```css
Active tab: text-primary-600 border-b-2
Hover: hover:text-primary-600
transition: colors
```

### Zoom Icon
```css
hover: scale-110
transition: all 200ms
```

---

## 🔧 Component Props & API

### Required API Response
```javascript
{
  id: number,
  name: string,
  slug: string,
  sku: string,
  category: number,
  category_name: string,
  description: string,
  price: number,
  discount_percentage: number,
  stock: number,
  product_type: 'new' | 'discount' | 'regular',
  is_featured: boolean,
  image: string,           // Main image URL
  image_2: string,         // Secondary (optional)
  image_3: string,         // Tertiary (optional)
  colors: string[],        // ["Qora", "Oq", "Qizil"]
  sizes: string[],         // ["S", "M", "L", "XL"]
}
```

### API Calls
```javascript
// Load product
GET /api/products/{slug}/

// Load related products
GET /api/products/?category={categoryId}&limit=4

// Add to cart (from CartContext)
POST /api/cart/add/
{
  product_id: number,
  quantity: number,
  // Optional: color, size selections
}
```

---

## 💡 Usage Examples

### Basic Usage
```javascript
import ProductDetail from './pages/ProductDetail';

// In App.jsx
<Route path="/products/:slug" element={<ProductDetail />} />
```

### Navigation
```javascript
// From product card
<Link to={`/products/${product.slug}`}>View Details</Link>

// Programmatic navigation
navigate(`/products/${slug}`);
```

---

## 🎯 User Flow

### Happy Path
```
1. User clicks product card → Navigate to /products/{slug}
2. Page loads → Shows skeleton loader
3. Product fetched → Display full details
4. User selects color → Updates selection state
5. User selects size → Updates selection state
6. User adjusts quantity → +/- buttons (validated against stock)
7. User clicks "SAVATGA QO'SHISH" → Add to cart
8. Success → Product added to cart
```

### Validation Flow
```
1. User clicks "SAVATGA QO'SHISH"
2. Check authentication → Redirect to /login if not authenticated
3. Check color selection → Alert if product has colors but none selected
4. Check size selection → Alert if product has sizes but none selected
5. All valid → Call addToCart API
6. Show loading state → Button disabled, text changes
7. Success/Error → Re-enable button, show result
```

---

## 🐛 Error Handling

### Product Not Found
```javascript
if (!product) {
  return (
    <div className="text-center py-20">
      <h2>Mahsulot topilmadi</h2>
      <Link to="/products">Mahsulotlar sahifasiga qaytish</Link>
    </div>
  );
}
```

### API Errors
```javascript
try {
  const response = await getProductBySlug(slug);
  setProduct(response.data);
} catch (error) {
  console.error('Error loading product:', error);
  // Product remains null, shows "not found" message
}
```

### Out of Stock
```javascript
{product.stock === 0 && (
  <div className="absolute inset-0 bg-black/60">
    <span className="bg-white text-gray-900">TUGALLANDI</span>
  </div>
)}

// Button disabled
<div className="bg-gray-200 text-gray-600">TUGALLANDI</div>
```

---

## 🔮 Future Enhancements

### 1. Image Zoom with Magnifier
```javascript
// Hover magnifier effect (like Zara)
<div className="magnifier" onMouseMove={handleMouseMove}>
  <img style={{ transform: `scale(2) translate(${x}%, ${y}%)` }} />
</div>
```

### 2. 360° Product View
```javascript
// Drag to rotate product
<ProductViewer360 images={rotationImages} />
```

### 3. Size Guide Modal
```javascript
<button onClick={() => setShowSizeGuide(true)}>
  Size Guide
</button>
<SizeGuideModal category={product.category} />
```

### 4. Share Buttons
```javascript
<div className="flex gap-2">
  <button onClick={shareToFacebook}>📘 Facebook</button>
  <button onClick={shareToTelegram}>✈️ Telegram</button>
  <button onClick={copyLink}>🔗 Copy Link</button>
</div>
```

### 5. Recently Viewed
```javascript
// Store in localStorage
useEffect(() => {
  const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
  recentlyViewed.unshift(product.id);
  localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed.slice(0, 10)));
}, [product]);
```

### 6. Live Chat Widget
```javascript
// Add to cart support
<button className="fixed bottom-4 right-4">
  💬 Yordam kerakmi?
</button>
```

### 7. Product Videos
```javascript
{product.video_url && (
  <video controls className="w-full rounded-lg">
    <source src={product.video_url} type="video/mp4" />
  </video>
)}
```

### 8. Real Reviews System
```javascript
// Backend integration
GET /api/products/{id}/reviews/
POST /api/products/{id}/reviews/
{
  rating: number,
  comment: string,
  images: File[]
}
```

---

## ⚡ Performance Optimizations

### 1. Lazy Load Images
```javascript
<img loading="lazy" src={product.image} />
```

### 2. Memoize Calculations
```javascript
import { useMemo } from 'react';

const discountedPrice = useMemo(() =>
  product.discount_percentage > 0
    ? product.price * (1 - product.discount_percentage / 100)
    : product.price,
  [product.price, product.discount_percentage]
);
```

### 3. Debounce Related Products
```javascript
import { debounce } from 'lodash';

const loadRelatedProducts = debounce(async (categoryId) => {
  // API call
}, 300);
```

### 4. Code Splitting
```javascript
// Lazy load tabs content
const ReviewsTab = lazy(() => import('./components/ReviewsTab'));

<Suspense fallback={<div>Yuklanmoqda...</div>}>
  <ReviewsTab />
</Suspense>
```

---

## 📞 Troubleshooting

### Images Not Loading
```javascript
// Add fallback image
<img
  src={selectedImage}
  onError={(e) => {
    e.target.src = '/placeholder-product.jpg';
  }}
/>
```

### Color/Size Not Selecting
```javascript
// Check that colors/sizes exist and are arrays
{product.colors?.length > 0 && (
  // Color selection UI
)}
```

### Add to Cart Not Working
```javascript
// Check CartContext is available
const { addToCart } = useCart();
if (!addToCart) {
  console.error('CartContext not available');
}

// Check authentication
const { isAuthenticated } = useAuth();
```

### Related Products Not Loading
```javascript
// Check API response structure
const response = await getProducts({ category: categoryId });
console.log('API Response:', response.data);

// Ensure response.data.results exists
const filtered = response.data?.results || [];
```

---

## 🎯 Best Practices

1. **Always validate selections** before adding to cart
2. **Show loading states** for better UX
3. **Handle errors gracefully** with user-friendly messages
4. **Use semantic HTML** (`<button>`, `<nav>`, `<main>`)
5. **Optimize images** (WebP, lazy loading)
6. **Test on real devices** (not just browser DevTools)
7. **Ensure accessibility** (alt text, ARIA labels, keyboard navigation)
8. **Keep API calls efficient** (debounce, cache where possible)

---

## 🆚 Comparison with Similar Sites

### Zara
- ✅ Clean minimalist design
- ✅ Large product images
- ✅ Simple color selection
- ➕ We added: Discount badges, low stock warnings

### H&M
- ✅ Size guide integration
- ✅ Product details tabs
- ✅ Related products
- ➕ We added: Quantity selector, wishlist

### Shein
- ✅ Urgency indicators (low stock)
- ✅ Reviews with ratings
- ✅ Multiple product images
- ➕ We added: Breadcrumb navigation, features section

---

**Last Updated:** 2025-11-16
**Version:** 1.0.0
**Author:** Professional E-Commerce Team
