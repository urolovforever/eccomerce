from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem, Product
from .serializers import CartSerializer, AddToCartSerializer


class CartView(APIView):
    """Foydalanuvchi savati"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Savatni ko'rish"""
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)


class AddToCartView(APIView):
    """Savatga mahsulot qo'shish"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = AddToCartSerializer(data=request.data)
        if serializer.is_valid():
            product_id = serializer.validated_data['product_id']
            quantity = serializer.validated_data['quantity']

            product = get_object_or_404(Product, id=product_id, is_active=True)
            cart, created = Cart.objects.get_or_create(user=request.user)

            # Agar mahsulot allaqachon savatda bo'lsa, miqdorni yangilash
            cart_item, created = CartItem.objects.get_or_create(
                cart=cart,
                product=product,
                defaults={'quantity': quantity}
            )

            if not created:
                # Mahsulot allaqachon savatda bo'lsa, miqdorni qo'shish
                cart_item.quantity += quantity
                if cart_item.quantity > 99:
                    cart_item.quantity = 99
                cart_item.save()

            cart_serializer = CartSerializer(cart)
            return Response({
                'message': 'Mahsulot savatga qo\'shildi',
                'cart': cart_serializer.data
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdateCartItemView(APIView):
    """Savat elementini yangilash"""
    permission_classes = [IsAuthenticated]

    def put(self, request, item_id):
        cart = get_object_or_404(Cart, user=request.user)
        cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)

        quantity = request.data.get('quantity')
        if quantity is None:
            return Response(
                {'error': 'Miqdor talab qilinadi'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            quantity = int(quantity)
            if quantity < 1 or quantity > 99:
                raise ValueError
        except ValueError:
            return Response(
                {'error': 'Miqdor 1 dan 99 gacha bo\'lishi kerak'},
                status=status.HTTP_400_BAD_REQUEST
            )

        cart_item.quantity = quantity
        cart_item.save()

        cart_serializer = CartSerializer(cart)
        return Response({
            'message': 'Savat yangilandi',
            'cart': cart_serializer.data
        })


class RemoveFromCartView(APIView):
    """Savatdan mahsulotni o'chirish"""
    permission_classes = [IsAuthenticated]

    def delete(self, request, item_id):
        cart = get_object_or_404(Cart, user=request.user)
        cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)
        cart_item.delete()

        cart_serializer = CartSerializer(cart)
        return Response({
            'message': 'Mahsulot savatdan o\'chirildi',
            'cart': cart_serializer.data
        })


class ClearCartView(APIView):
    """Savatni tozalash"""
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        cart = get_object_or_404(Cart, user=request.user)
        cart.items.all().delete()

        cart_serializer = CartSerializer(cart)
        return Response({
            'message': 'Savat tozalandi',
            'cart': cart_serializer.data
        })
