# 🎨 Product Card Component Guide

## Overview

Professional, modern product card component for women's clothing e-commerce website.

---

## ✨ Features

### 1. **Dual Image Display**
- Main product image
- Secondary image appears on hover with smooth transition
- Image zoom effect on hover (scale 110%)
- 3:4 aspect ratio (perfect for clothing)

### 2. **Dynamic Badges**
Priority order:
1. **NEW** - Emerald green badge for `product_type === 'new'`
2. **SALE** - Red badge with discount percentage
3. **FEATURED** - Amber badge for popular items

```jsx
// Badge logic
if (product.product_type === 'new') → 'YANGI' (green)
else if (product.discount_percentage > 0) → '20% CHEGIRMA' (red)
else if (product.is_featured) → 'MASHHUR' (amber)
```

### 3. **Wishlist Functionality**
- Heart icon in top-right corner
- Filled (red) when favorited
- Outlined when not favorited
- Smooth scale animation on hover
- Requires authentication

### 4. **Smart Pricing Display**
```jsx
// With discount
<span className="text-red-600">199,000 so'm</span>
<span className="line-through text-gray-400">250,000 so'm</span>

// Without discount
<span className="text-gray-900">199,000 so'm</span>
```

### 5. **Add to Cart Button**
- Appears on hover from bottom
- Smooth slide-up animation
- Shopping bag icon
- Loading state when adding
- Disabled when out of stock

### 6. **Stock Management**
```jsx
// Out of stock
{product.stock === 0} → "TUGALLANDI" overlay

// Low stock warning
{product.stock <= 5} → "Faqat 3 dona qoldi!"
```

### 7. **Product Variants Preview**
```jsx
// Shows available colors and sizes
"3 ranglar • 5 o'lchamlar"
```

### 8. **Responsive Design**
- **Mobile** (< 640px): 1 column
- **Tablet** (640px - 1024px): 2 columns
- **Desktop** (1024px - 1280px): 3 columns
- **Large Desktop** (> 1280px): 4 columns

---

## 🎯 Component Props

### ProductCard

```jsx
<ProductCard product={product} />
```

**Required Product Fields:**
```javascript
{
  id: number,
  name: string,
  slug: string,
  image: string,         // Main image URL
  image_2: string,       // Secondary image URL (optional)
  price: number,
  discount_percentage: number,
  stock: number,
  product_type: 'new' | 'discount' | 'regular',
  is_featured: boolean,
  category_name: string,
  colors: string[],      // Array of color codes
  sizes: string[],       // Array of size codes
}
```

---

## 📐 Layout Structure

```
┌─────────────────────────────┐
│  [Badge]      [❤ Wishlist]  │  ← Top overlay
│                              │
│         Product Image        │  ← 3:4 aspect ratio
│      (with hover effect)     │
│                              │
│    [Add to Cart Button]      │  ← Bottom (on hover)
└─────────────────────────────┘
│  Product Name (2 lines max)  │
│  Category                    │
│  199,000 so'm  ~~250,000~~   │  ← Price
│  3 ranglar • 5 o'lchamlar    │  ← Variants
│  Faqat 2 dona qoldi!         │  ← Low stock (optional)
└─────────────────────────────┘
```

---

## 🎨 Color Palette

### Badges
- **NEW**: `bg-emerald-500` (#10b981)
- **SALE**: `bg-red-500` (#ef4444)
- **FEATURED**: `bg-amber-500` (#f59e0b)

### Buttons
- **Primary (Add to Cart)**: `bg-gray-900` / `hover:bg-gray-800`
- **Wishlist**: `bg-white/90` with backdrop blur

### Text
- **Product Name**: `text-gray-900`
- **Category**: `text-gray-500`
- **Price**: `text-gray-900` (regular) / `text-red-600` (discounted)
- **Stock Warning**: `text-orange-600`

---

## 🎭 Animations

### Hover Effects

```css
/* Image zoom */
transition: scale 700ms
scale: 100% → 110%

/* Image swap */
opacity transition: 700ms
image1: opacity 100% → 0%
image2: opacity 0% → 100%

/* Shadow expansion */
shadow: none → shadow-2xl (500ms)

/* Button slide-up */
transform: translateY(100%) → translateY(0)
opacity: 0 → 100%
```

### Loading State

```jsx
// Skeleton loader animation
<div className="animate-pulse">
  <div className="aspect-[3/4] bg-gray-200 rounded-lg"></div>
  <div className="h-4 bg-gray-200 rounded"></div>
</div>
```

### Fade In (Grid items)

```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Staggered delay */
style={{ animationDelay: `${index * 50}ms` }}
```

---

## 💡 Usage Examples

### Basic Grid

```jsx
import ProductGrid from './components/ProductGrid';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  return (
    <ProductGrid
      products={products}
      loading={loading}
      emptyMessage="Mahsulotlar topilmadi"
    />
  );
}
```

### With Filtering

```jsx
function FilteredProducts() {
  const filteredProducts = products.filter(p =>
    p.category_name === 'Ko\'ylaklar'
  );

  return (
    <ProductGrid
      products={filteredProducts}
      emptyMessage="Bu kategoriyada mahsulotlar yo'q"
    />
  );
}
```

---

## 🔧 Customization

### Change Grid Columns

```jsx
// In ProductGrid.jsx, modify:
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"

// Example: 5 columns on XL screens
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
```

### Change Card Border Radius

```jsx
// In ProductCard.jsx
className="rounded-lg"  // 8px
className="rounded-xl"  // 12px
className="rounded-2xl" // 16px
className="rounded-none" // No rounding
```

### Disable Hover Effects

```jsx
// Remove hover scaling
className="group-hover:scale-110" → className=""

// Remove button slide-up
className={`... ${isHovered ? 'translate-y-0' : 'translate-y-full'}`}
→ className="translate-y-0"  // Always visible
```

---

## 📱 Responsive Behavior

### Mobile (< 640px)
- 1 column
- Larger touch targets (min 44x44px)
- Wishlist button slightly larger
- Full-width "Add to Cart"

### Tablet (640px - 1024px)
- 2 columns
- 16px gap between cards
- Optimized for portrait and landscape

### Desktop (> 1024px)
- 3-4 columns
- 24px gap between cards
- Full hover effects enabled

---

## ⚡ Performance Tips

### Image Optimization
```jsx
// Use Next.js Image component (recommended)
import Image from 'next/image';

<Image
  src={product.image}
  alt={product.name}
  width={400}
  height={533}
  loading="lazy"
  placeholder="blur"
/>
```

### Lazy Loading
```jsx
// Native lazy loading
<img
  loading="lazy"
  src={product.image}
  alt={product.name}
/>
```

### Memoization
```jsx
import { memo } from 'react';

const ProductCard = memo(({ product }) => {
  // Component code...
});
```

---

## 🎨 Design Inspiration

This design is inspired by:
- **Zara** - Clean, minimalist aesthetic
- **H&M** - Badge system and hover effects
- **Shein** - Price display and urgency indicators
- **ASOS** - Wishlist functionality

---

## 🔮 Future Enhancements

### 1. Quick View Modal
```jsx
// Add quick view button
<button className="absolute bottom-20">
  Quick View
</button>
```

### 2. Color Swatches
```jsx
// Show actual color dots
<div className="flex gap-1">
  {product.colors.map(color => (
    <div
      key={color}
      className="w-4 h-4 rounded-full border"
      style={{ backgroundColor: color }}
    />
  ))}
</div>
```

### 3. Size Selector
```jsx
// Quick size selection
<div className="flex gap-2">
  {product.sizes.map(size => (
    <button
      key={size}
      className="px-3 py-1 border rounded hover:bg-gray-900 hover:text-white"
    >
      {size}
    </button>
  ))}
</div>
```

### 4. Star Ratings
```jsx
// Already prepared (commented out in code)
<div className="flex items-center gap-1.5">
  <StarIcon className="w-4 h-4 text-amber-400 fill-amber-400" />
  <span className="text-xs">(24 reviews)</span>
</div>
```

### 5. Compare Feature
```jsx
// Checkbox for product comparison
<input
  type="checkbox"
  className="absolute top-3 left-3"
  onChange={handleCompare}
/>
```

---

## 🐛 Troubleshooting

### Images not loading
```jsx
// Check image URL format
console.log(product.image); // Should be full URL

// Add error handling
<img
  src={product.image}
  onError={(e) => {
    e.target.src = '/placeholder-image.jpg';
  }}
/>
```

### Hover effects not working
```css
/* Make sure parent has 'group' class */
<div className="group">
  <div className="group-hover:scale-110">...</div>
</div>
```

### Animations choppy
```css
/* Add GPU acceleration */
className="transform-gpu will-change-transform"

/* Reduce animation complexity */
transition-all → transition-opacity transition-transform
```

---

## 📦 Dependencies

- React 18+
- React Router DOM (for navigation)
- Heroicons (for icons)
- Tailwind CSS 3+
- Context API (for cart and auth)

---

## 🎯 Best Practices

1. **Always provide alt text** for images (SEO + Accessibility)
2. **Use semantic HTML** (`<button>` for buttons, not `<div>`)
3. **Prevent click propagation** on nested interactive elements
4. **Show loading states** for better UX
5. **Handle empty states** gracefully
6. **Optimize images** (WebP format, lazy loading)
7. **Test on mobile devices** (real devices, not just browser DevTools)
8. **Use consistent spacing** (Tailwind's spacing scale)

---

## 📞 Support

For questions or issues:
- Check backend `BACKEND_ARCHITECTURE.md`
- Review Tailwind CSS documentation
- Test with real product data

---

**Last Updated:** 2025-11-16
**Version:** 2.0.0
**Author:** Professional E-Commerce Team
