from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db import transaction
from .models import Cart, Order, OrderItem
from .serializers import OrderSerializer, CreateOrderSerializer


class OrderListView(APIView):
    """Foydalanuvchi buyurtmalari ro'yxati"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user).order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)


class OrderDetailView(APIView):
    """Buyurtma tafsilotlari"""
    permission_classes = [IsAuthenticated]

    def get(self, request, order_id):
        order = get_object_or_404(Order, id=order_id, user=request.user)
        serializer = OrderSerializer(order)
        return Response(serializer.data)


class CreateOrderView(APIView):
    """Buyurtma yaratish"""
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        # Validate order data
        serializer = CreateOrderSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Get user's cart
        try:
            cart = Cart.objects.get(user=request.user)
        except Cart.DoesNotExist:
            return Response(
                {'error': 'Savatingiz bo\'sh'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if cart has items
        cart_items = cart.items.all()
        if not cart_items.exists():
            return Response(
                {'error': 'Savatingiz bo\'sh'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Calculate total price
        total_price = cart.total_price

        # Create order
        order = Order.objects.create(
            user=request.user,
            full_name=serializer.validated_data['full_name'],
            phone=serializer.validated_data['phone'],
            email=serializer.validated_data['email'],
            address=serializer.validated_data['address'],
            city=serializer.validated_data['city'],
            postal_code=serializer.validated_data.get('postal_code', ''),
            notes=serializer.validated_data.get('notes', ''),
            total_price=total_price,
            status='pending'
        )

        # Create order items from cart items
        for cart_item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                quantity=cart_item.quantity,
                price=cart_item.product.discounted_price
            )

        # Clear cart
        cart_items.delete()

        # Return order details
        order_serializer = OrderSerializer(order)
        return Response({
            'message': 'Buyurtma muvaffaqiyatli yaratildi',
            'order': order_serializer.data
        }, status=status.HTTP_201_CREATED)


class CancelOrderView(APIView):
    """Buyurtmani bekor qilish"""
    permission_classes = [IsAuthenticated]

    def post(self, request, order_id):
        order = get_object_or_404(Order, id=order_id, user=request.user)

        # Faqat 'pending' holatdagi buyurtmalarni bekor qilish mumkin
        if order.status != 'pending':
            return Response(
                {'error': 'Faqat kutilayotgan buyurtmalarni bekor qilish mumkin'},
                status=status.HTTP_400_BAD_REQUEST
            )

        order.status = 'cancelled'
        order.save()

        serializer = OrderSerializer(order)
        return Response({
            'message': 'Buyurtma bekor qilindi',
            'order': serializer.data
        })
