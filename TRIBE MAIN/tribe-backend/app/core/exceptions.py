"""Custom exception classes."""

from fastapi import status


class TribeException(Exception):
    """Base exception for all Tribe application exceptions."""

    def __init__(
        self,
        message: str,
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        error_code: str = "INTERNAL_ERROR",
    ):
        """Initialize the exception.

        Args:
            message: Error message.
            status_code: HTTP status code.
            error_code: Application error code.
        """
        self.message = message
        self.status_code = status_code
        self.error_code = error_code
        super().__init__(self.message)


class AuthenticationException(TribeException):
    """Raised when authentication fails."""

    def __init__(self, message: str = "Authentication failed"):
        """Initialize authentication exception.

        Args:
            message: Error message.
        """
        super().__init__(
            message=message,
            status_code=status.HTTP_401_UNAUTHORIZED,
            error_code="AUTHENTICATION_ERROR",
        )


class AuthorizationException(TribeException):
    """Raised when user lacks required permissions."""

    def __init__(self, message: str = "Insufficient permissions"):
        """Initialize authorization exception.

        Args:
            message: Error message.
        """
        super().__init__(
            message=message,
            status_code=status.HTTP_403_FORBIDDEN,
            error_code="AUTHORIZATION_ERROR",
        )


class ValidationException(TribeException):
    """Raised when validation fails."""

    def __init__(self, message: str = "Validation error", details: dict = None):
        """Initialize validation exception.

        Args:
            message: Error message.
            details: Additional validation details.
        """
        super().__init__(
            message=message,
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            error_code="VALIDATION_ERROR",
        )
        self.details = details or {}


class ResourceNotFoundException(TribeException):
    """Raised when a resource is not found."""

    def __init__(self, resource: str = "Resource", identifier: str = None):
        """Initialize not found exception.

        Args:
            resource: Type of resource not found.
            identifier: Identifier of the resource.
        """
        if identifier:
            message = f"{resource} with id {identifier} not found"
        else:
            message = f"{resource} not found"

        super().__init__(
            message=message,
            status_code=status.HTTP_404_NOT_FOUND,
            error_code="RESOURCE_NOT_FOUND",
        )


class ConflictException(TribeException):
    """Raised when a resource conflict occurs (e.g., duplicate email)."""

    def __init__(self, message: str = "Resource conflict"):
        """Initialize conflict exception.

        Args:
            message: Error message.
        """
        super().__init__(
            message=message,
            status_code=status.HTTP_409_CONFLICT,
            error_code="CONFLICT_ERROR",
        )


class InvalidCredentialsException(TribeException):
    """Raised when credentials are invalid."""

    def __init__(self):
        """Initialize invalid credentials exception."""
        super().__init__(
            message="Invalid email or password",
            status_code=status.HTTP_401_UNAUTHORIZED,
            error_code="INVALID_CREDENTIALS",
        )


class InvalidTokenException(TribeException):
    """Raised when token is invalid or expired."""

    def __init__(self, message: str = "Invalid or expired token"):
        """Initialize invalid token exception.

        Args:
            message: Error message.
        """
        super().__init__(
            message=message,
            status_code=status.HTTP_401_UNAUTHORIZED,
            error_code="INVALID_TOKEN",
        )


class EmailNotVerifiedException(TribeException):
    """Raised when email is not verified."""

    def __init__(self):
        """Initialize email not verified exception."""
        super().__init__(
            message="Email not verified. Please check your email to verify your account",
            status_code=status.HTTP_403_FORBIDDEN,
            error_code="EMAIL_NOT_VERIFIED",
        )


class AccountInactiveException(TribeException):
    """Raised when account is inactive."""

    def __init__(self):
        """Initialize account inactive exception."""
        super().__init__(
            message="Account is inactive",
            status_code=status.HTTP_403_FORBIDDEN,
            error_code="ACCOUNT_INACTIVE",
        )
