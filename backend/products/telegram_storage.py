import requests
from django.core.files.storage import Storage
from django.conf import settings


class TelegramStorage(Storage):
    def __init__(self):
        self.bot_token = settings.TELEGRAM_BOT_TOKEN
        self.chat_id = settings.TELEGRAM_CHAT_ID
        self.base_url = f"https://api.telegram.org/bot{self.bot_token}"

        # DEBUG: Settings tekshirish
        print(f"[TELEGRAM STORAGE] Token: {self.bot_token[:20]}...")
        print(f"[TELEGRAM STORAGE] Chat ID: {self.chat_id}")

    def _save(self, name, content):
        """Rasmni Telegram'ga yuklash"""
        print(f"[TELEGRAM STORAGE] Uploading: {name}")

        url = f"{self.base_url}/sendPhoto"

        # Fayl content'ini o'qish
        content.seek(0)
        file_data = content.read()
        print(f"[TELEGRAM STORAGE] File size: {len(file_data)} bytes")

        files = {
            'photo': (name, file_data, 'image/jpeg')
        }
        data = {
            'chat_id': self.chat_id,
            'caption': f"MoonGift Product: {name}"
        }

        try:
            print(f"[TELEGRAM STORAGE] Sending to: {url}")
            response = requests.post(url, files=files, data=data, timeout=60)
            result = response.json()

            print(f"[TELEGRAM STORAGE] Response: {result}")

            if result.get('ok'):
                # Eng katta rasmning file_id'sini olish
                photos = result['result']['photo']
                file_id = photos[-1]['file_id']

                print(f"[TELEGRAM STORAGE] File ID: {file_id}")

                # File path olish
                file_url = f"{self.base_url}/getFile"
                file_response = requests.get(file_url, params={'file_id': file_id}, timeout=30)
                file_result = file_response.json()

                if file_result.get('ok'):
                    file_path = file_result['result']['file_path']
                    # Public URL qaytarish
                    public_url = f"https://api.telegram.org/file/bot{self.bot_token}/{file_path}"

                    print(f"[TELEGRAM STORAGE] SUCCESS! URL: {public_url}")
                    return public_url
                else:
                    print(f"[TELEGRAM STORAGE] getFile failed: {file_result}")
            else:
                print(f"[TELEGRAM STORAGE] Upload failed: {result}")

            return None

        except Exception as e:
            print(f"[TELEGRAM STORAGE] Exception: {e}")
            import traceback
            traceback.print_exc()
            return None

    def url(self, name):
        """URL qaytarish"""
        return name

    def exists(self, name):
        """Har doim False qaytarish"""
        return False

    def delete(self, name):
        """Delete operatsiyasi"""
        pass

    def size(self, name):
        """Fayl hajmi"""
        return 0