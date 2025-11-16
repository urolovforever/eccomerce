from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token
from .serializers import UserRegistrationSerializer, UserSerializer


# ============== ADMIN AUTH VIEWS ==============

class AdminLoginView(APIView):
    """Admin login"""
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response(
                {'error': 'Username va password talab qilinadi'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(request, username=username, password=password)

        if user is not None:
            if user.is_staff:  # Faqat admin foydalanuvchilar
                login(request, user)
                return Response({
                    'message': 'Muvaffaqiyatli login qilindi',
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'is_staff': user.is_staff,
                        'is_superuser': user.is_superuser,
                    }
                }, status=status.HTTP_200_OK)
            else:
                return Response(
                    {'error': 'Sizda admin huquqlari yo\'q'},
                    status=status.HTTP_403_FORBIDDEN
                )
        else:
            return Response(
                {'error': 'Noto\'g\'ri username yoki password'},
                status=status.HTTP_401_UNAUTHORIZED
            )


class AdminCheckAuthView(APIView):
    """Admin autentifikatsiya holatini tekshirish"""
    permission_classes = [AllowAny]

    def get(self, request):
        if request.user.is_authenticated and request.user.is_staff:
            return Response({
                'authenticated': True,
                'user': {
                    'id': request.user.id,
                    'username': request.user.username,
                    'email': request.user.email,
                    'is_staff': request.user.is_staff,
                    'is_superuser': request.user.is_superuser,
                }
            }, status=status.HTTP_200_OK)
        else:
            return Response(
                {'authenticated': False},
                status=status.HTTP_200_OK
            )


# ============== USER AUTH VIEWS ==============

class UserRegisterView(APIView):
    """Foydalanuvchi ro'yxatdan o'tish"""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            login(request, user)  # Avtomatik login qilish
            return Response({
                'message': 'Muvaffaqiyatli ro\'yxatdan o\'tdingiz',
                'user': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(APIView):
    """Foydalanuvchi login"""
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response(
                {'error': 'Username va password talab qilinadi'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return Response({
                'message': 'Muvaffaqiyatli login qilindi',
                'user': UserSerializer(user).data
            }, status=status.HTTP_200_OK)
        else:
            return Response(
                {'error': 'Noto\'g\'ri username yoki password'},
                status=status.HTTP_401_UNAUTHORIZED
            )


class UserLogoutView(APIView):
    """Foydalanuvchi logout"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response(
            {'message': 'Muvaffaqiyatli logout qilindi'},
            status=status.HTTP_200_OK
        )


class UserCheckAuthView(APIView):
    """Foydalanuvchi autentifikatsiya holatini tekshirish"""
    permission_classes = [AllowAny]

    def get(self, request):
        if request.user.is_authenticated:
            return Response({
                'authenticated': True,
                'user': UserSerializer(request.user).data
            }, status=status.HTTP_200_OK)
        else:
            return Response(
                {'authenticated': False},
                status=status.HTTP_200_OK
            )


class UserProfileView(APIView):
    """Foydalanuvchi profili"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Profil muvaffaqiyatli yangilandi',
                'user': serializer.data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CSRFTokenView(APIView):
    """CSRF token olish"""
    permission_classes = [AllowAny]

    def get(self, request):
        csrf_token = get_token(request)
        return Response({'csrfToken': csrf_token}, status=status.HTTP_200_OK)
