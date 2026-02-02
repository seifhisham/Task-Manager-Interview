from rest_framework.authentication import SessionAuthentication


class CsrfExemptSessionAuthentication(SessionAuthentication):
    """
    SessionAuthentication that skips CSRF checks.

    This is acceptable here because the API is only used by our own
    React frontend on http://localhost:3000 and we already restrict
    CORS/CSRF trusted origins in settings.py.
    """

    def enforce_csrf(self, request):
        # Simply do not perform CSRF validation
        return

