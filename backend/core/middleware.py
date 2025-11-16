class CorsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        # Media fayllar uchun CORS headerlari
        if request.path.startswith('/media/'):
            response['Access-Control-Allow-Origin'] = '*'
            response['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
            response['Access-Control-Allow-Headers'] = 'Content-Type'
            response['Cross-Origin-Resource-Policy'] = 'cross-origin'

        return response