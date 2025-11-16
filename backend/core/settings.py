from pathlib import Path
from decouple import config
import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = config('SECRET_KEY', default='django-insecure-dev-key')
DEBUG = config('DEBUG', default=True, cast=bool)
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost,127.0.0.1', cast=lambda v: [s.strip() for s in v.split(',')])

INSTALLED_APPS = [
    'jazzmin',  # Admin panel dizayni (django.contrib.admin dan oldin!)
    
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    'rest_framework',
    'corsheaders',
    
    'products',
    'contact',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'core.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

# Database configuration
# Production: PostgreSQL via DATABASE_URL (Render avtomatik beradi)
# Development: SQLite3
DATABASE_URL = config('DATABASE_URL', default=None)

if DATABASE_URL:
    # Production - PostgreSQL
    DATABASES = {
        'default': dj_database_url.config(
            default=DATABASE_URL,
            conn_max_age=600,
            conn_health_checks=True,
        )
    }
else:
    # Development - SQLite3
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'uz'
TIME_ZONE = 'Asia/Tashkent'
USE_I18N = True
USE_TZ = True

# Static files
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# WhiteNoise configuration
WHITENOISE_USE_FINDERS = True
WHITENOISE_AUTOREFRESH = True
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Telegram Storage Configuration
TELEGRAM_BOT_TOKEN = config('TELEGRAM_BOT_TOKEN', default='')
TELEGRAM_CHAT_ID = config('TELEGRAM_CHAT_ID', default='')

# Default file storage
if TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID:
    DEFAULT_FILE_STORAGE = 'products.telegram_storage.TelegramStorage'
else:
    # Fallback to local storage
    MEDIA_URL = '/media/'
    MEDIA_ROOT = BASE_DIR / 'media'

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# WhiteNoise uchun media papkani qo'shish
WHITENOISE_ROOT = MEDIA_ROOT

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


CORS_ALLOWED_ORIGINS = [
    "https://moongift-frontend.onrender.com",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = False  # Production uchun False

# Media fayllar uchun
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnu',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

CORS_EXPOSE_HEADERS = [
    'Content-Type',
    'X-CSRFToken',
]

# CSRF Trusted Origins
CSRF_TRUSTED_ORIGINS = [
    "https://moongift-frontend.onrender.com",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# Security headers
SECURE_CROSS_ORIGIN_OPENER_POLICY = None


REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 12,
    'DEFAULT_RENDERER_CLASSES': ['rest_framework.renderers.JSONRenderer'],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
    ],
}

# ==========================================
# JAZZMIN SOZLAMALARI
# ==========================================
JAZZMIN_SETTINGS = {
    # Title
    "site_title": "MoonGift Admin",
    "site_header": "MoonGift Boshqaruv Paneli",
    "site_brand": "🌙 MoonGift",
    "welcome_sign": "MoonGift Admin Paneliga Xush Kelibsiz",
    "copyright": "MoonGift 2025",
    
    # Logo
    "site_logo": None,  # Yoki "/static/logo.png"
    "login_logo": None,
    "site_logo_classes": "img-circle",
    
    # Icons (Font Awesome 5)
    "site_icon": None,
    
    # Top Menu
    "topmenu_links": [
        {"name": "Bosh Sahifa", "url": "admin:index", "permissions": ["auth.view_user"]},
        {"name": "Saytni Ko'rish", "url": "http://localhost:5173", "new_window": True},
        {"model": "products.Product"},
        {"model": "products.Category"},
    ],
    
    # User Menu
    "usermenu_links": [
        {"model": "auth.user"}
    ],
    
    # Side Menu
    "show_sidebar": True,
    "navigation_expanded": True,
    "hide_apps": [],
    "hide_models": [],
    
    # Order
    "order_with_respect_to": ["products", "contact", "auth"],
    
    # Icons (Font Awesome 5)
    "icons": {
        "auth": "fas fa-users-cog",
        "auth.user": "fas fa-user",
        "auth.Group": "fas fa-users",
        "products.Category": "fas fa-th-large",
        "products.Product": "fas fa-box",
        "contact.ContactMessage": "fas fa-envelope",
    },
    
    # Default Icons
    "default_icon_parents": "fas fa-chevron-circle-right",
    "default_icon_children": "fas fa-circle",
    
    # UI Tweaks
    "show_ui_builder": False,
    "changeform_format": "horizontal_tabs",
    "changeform_format_overrides": {
        "auth.user": "collapsible",
        "auth.group": "vertical_tabs"
    },
    
    # Theme
    "theme": "flatly",  # bootstrap themes: cerulean, cosmo, flatly, journal, litera, lumen, lux, materia, minty, pulse, sandstone, simplex, slate, solar, spacelab, superhero, united, yeti
}

JAZZMIN_UI_TWEAKS = {
    "navbar_small_text": False,
    "footer_small_text": False,
    "body_small_text": False,
    "brand_small_text": False,
    "brand_colour": "navbar-success",
    "accent": "accent-teal",
    "navbar": "navbar-dark",
    "no_navbar_border": False,
    "navbar_fixed": True,
    "layout_boxed": False,
    "footer_fixed": False,
    "sidebar_fixed": True,
    "sidebar": "sidebar-dark-warning",
    "sidebar_nav_small_text": False,
    "sidebar_disable_expand": False,
    "sidebar_nav_child_indent": False,
    "sidebar_nav_compact_style": False,
    "sidebar_nav_legacy_style": False,
    "sidebar_nav_flat_style": False,
    "theme": "flatly",
    "dark_mode_theme": "darkly",
    "button_classes": {
        "primary": "btn-primary",
        "secondary": "btn-secondary",
        "info": "btn-info",
        "warning": "btn-warning",
        "danger": "btn-danger",
        "success": "btn-success"
    }
}

# ==========================================
# LOGGING SOZLAMALARI
# ==========================================
# Faqat errorlarni ko'rsatish, HTTP request loglarni butunlay o'chirish
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
            'level': 'ERROR',  # Console'ga faqat ERROR yuboriladi
        },
        'null': {
            'class': 'logging.NullHandler',  # Hech narsa chiqarmaydi
        },
    },
    'loggers': {
        # Django server HTTP loglarni butunlay o'chirish
        'django.server': {
            'handlers': ['null'],  # Null handler - hech narsa chiqarmaydi
            'level': 'CRITICAL',
            'propagate': False,
        },
        # Django umumiy loglar - faqat errorlar
        'django': {
            'handlers': ['console'],
            'level': 'ERROR',
            'propagate': False,
        },
        # Django request loglarni o'chirish
        'django.request': {
            'handlers': ['null'],
            'level': 'CRITICAL',
            'propagate': False,
        },
        # App loglar - faqat errorlar
        'products': {
            'handlers': ['console'],
            'level': 'ERROR',
            'propagate': False,
        },
        'contact': {
            'handlers': ['console'],
            'level': 'ERROR',
            'propagate': False,
        },
    },
    # Root logger
    'root': {
        'handlers': ['console'],
        'level': 'ERROR',  # Faqat errorlar
    },
}
