from rest_framework import generics, filters, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser
from .models import Category, Product
from .serializers import CategorySerializer, ProductListSerializer, ProductDetailSerializer, ProductAdminSerializer


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ProductListView(generics.ListAPIView):
    """Mahsulotlar ro'yxati - filter, qidiruv va ordering bilan"""
    serializer_class = ProductListSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'name', 'created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True)

        # Kategoriya filter (slug bo'yicha)
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category__slug=category)

        # Narx oralig'i filter
        min_price = self.request.query_params.get('min_price', None)
        max_price = self.request.query_params.get('max_price', None)

        if min_price:
            try:
                queryset = queryset.filter(price__gte=float(min_price))
            except ValueError:
                pass  # Invalid min_price, ignore

        if max_price:
            try:
                queryset = queryset.filter(price__lte=float(max_price))
            except ValueError:
                pass  # Invalid max_price, ignore

        return queryset


class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductDetailSerializer
    lookup_field = 'slug'


class FeaturedProductsView(APIView):
    def get(self, request):
        products = Product.objects.filter(is_active=True, is_featured=True)[:4]
        serializer = ProductListSerializer(products, many=True, context={'request': request})
        return Response(serializer.data)


# ==========================================
# ADMIN VIEWS - Faqat admin uchun
# ==========================================

class AdminProductListView(generics.ListAPIView):
    """Admin uchun barcha mahsulotlar ro'yxati (faol va nofaol)"""
    permission_classes = [IsAdminUser]
    serializer_class = ProductAdminSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'name', 'created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        return Product.objects.all()


class AdminProductCreateView(generics.CreateAPIView):
    """Admin uchun yangi mahsulot qo'shish"""
    permission_classes = [IsAdminUser]
    serializer_class = ProductAdminSerializer
    queryset = Product.objects.all()


class AdminProductUpdateView(generics.UpdateAPIView):
    """Admin uchun mahsulotni tahrirlash"""
    permission_classes = [IsAdminUser]
    serializer_class = ProductAdminSerializer
    queryset = Product.objects.all()
    lookup_field = 'id'


class AdminProductDeleteView(generics.DestroyAPIView):
    """Admin uchun mahsulotni o'chirish"""
    permission_classes = [IsAdminUser]
    queryset = Product.objects.all()
    lookup_field = 'id'

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        product_name = instance.name
        self.perform_destroy(instance)
        return Response(
            {'message': f'Mahsulot "{product_name}" muvaffaqiyatli o\'chirildi'},
            status=status.HTTP_200_OK
        )