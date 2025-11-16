from django.urls import path
from .views import (
    CategoryListView, ProductListView, ProductDetailView, FeaturedProductsView,
    AdminProductListView, AdminProductCreateView, AdminProductUpdateView, AdminProductDeleteView
)
from .auth_views import (
    AdminLoginView, AdminCheckAuthView, CSRFTokenView,
    UserRegisterView, UserLoginView, UserLogoutView, UserCheckAuthView, UserProfileView
)
from .cart_views import (
    CartView, AddToCartView, UpdateCartItemView, RemoveFromCartView, ClearCartView
)
from .order_views import (
    OrderListView, OrderDetailView, CreateOrderView, CancelOrderView
)

urlpatterns = [
    # Public endpoints
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('', ProductListView.as_view(), name='product-list'),
    path('featured/', FeaturedProductsView.as_view(), name='featured-products'),

    # CSRF Token
    path('auth/csrf/', CSRFTokenView.as_view(), name='csrf-token'),

    # Admin auth endpoints
    path('auth/admin/login/', AdminLoginView.as_view(), name='admin-login'),
    path('auth/admin/check/', AdminCheckAuthView.as_view(), name='admin-check-auth'),

    # User auth endpoints
    path('auth/register/', UserRegisterView.as_view(), name='user-register'),
    path('auth/login/', UserLoginView.as_view(), name='user-login'),
    path('auth/logout/', UserLogoutView.as_view(), name='user-logout'),
    path('auth/check/', UserCheckAuthView.as_view(), name='user-check-auth'),
    path('auth/profile/', UserProfileView.as_view(), name='user-profile'),

    # Cart endpoints
    path('cart/', CartView.as_view(), name='cart'),
    path('cart/add/', AddToCartView.as_view(), name='add-to-cart'),
    path('cart/items/<int:item_id>/update/', UpdateCartItemView.as_view(), name='update-cart-item'),
    path('cart/items/<int:item_id>/remove/', RemoveFromCartView.as_view(), name='remove-from-cart'),
    path('cart/clear/', ClearCartView.as_view(), name='clear-cart'),

    # Order endpoints
    path('orders/', OrderListView.as_view(), name='order-list'),
    path('orders/create/', CreateOrderView.as_view(), name='create-order'),
    path('orders/<int:order_id>/', OrderDetailView.as_view(), name='order-detail'),
    path('orders/<int:order_id>/cancel/', CancelOrderView.as_view(), name='cancel-order'),

    # Admin endpoints
    path('admin/products/', AdminProductListView.as_view(), name='admin-product-list'),
    path('admin/products/create/', AdminProductCreateView.as_view(), name='admin-product-create'),
    path('admin/products/<int:id>/update/', AdminProductUpdateView.as_view(), name='admin-product-update'),
    path('admin/products/<int:id>/delete/', AdminProductDeleteView.as_view(), name='admin-product-delete'),

    # Product detail (slug bo'yicha, oxirida turishi kerak)
    path('<slug:slug>/', ProductDetailView.as_view(), name='product-detail'),
]
