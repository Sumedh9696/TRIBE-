"""Application constants."""

from enum import Enum


class UserRoleEnum(str, Enum):
    """User role enumeration."""

    USER = "user"
    ADMIN = "admin"
    MODERATOR = "moderator"


class InterestCategoryEnum(str, Enum):
    """Interest category enumeration."""

    SPORTS = "sports"
    ARTS = "arts"
    TECHNOLOGY = "technology"
    EDUCATION = "education"
    ENTERTAINMENT = "entertainment"
    MUSIC = "music"
    TRAVEL = "travel"
    FOOD = "food"
    FITNESS = "fitness"
    GAMING = "gaming"
    BOOKS = "books"
    MOVIES = "movies"
    OTHER = "other"


class AgeRangeEnum(str, Enum):
    """Age range enumeration."""

    RANGE_18_25 = "18-25"
    RANGE_26_35 = "26-35"
    RANGE_36_45 = "36-45"
    RANGE_46_55 = "46-55"
    RANGE_56_PLUS = "56+"


# Email verification states
EMAIL_VERIFICATION_PENDING = "pending"
EMAIL_VERIFICATION_SENT = "sent"
EMAIL_VERIFICATION_VERIFIED = "verified"

# Token types
TOKEN_TYPE_ACCESS = "access"
TOKEN_TYPE_REFRESH = "refresh"
TOKEN_TYPE_EMAIL_VERIFICATION = "email_verification"
TOKEN_TYPE_PASSWORD_RESET = "password_reset"

# API response messages
SUCCESS_MESSAGE = "Success"
ERROR_MESSAGE = "Error"
VALIDATION_ERROR_MESSAGE = "Validation Error"

# Pagination defaults
DEFAULT_PAGE = 1
DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100

# Password requirements
MIN_PASSWORD_LENGTH = 8
PASSWORD_REQUIRES_UPPERCASE = True
PASSWORD_REQUIRES_LOWERCASE = True
PASSWORD_REQUIRES_DIGITS = True
PASSWORD_REQUIRES_SPECIAL_CHARS = True

SPECIAL_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?"
