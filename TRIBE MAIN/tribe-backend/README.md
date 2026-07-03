# Tribe Backend - Phase 1

Backend API for Tribe social networking application built with FastAPI, PostgreSQL, SQLAlchemy 2.0, and Pydantic v2.

## Phase 1 Features

- ✅ User Registration with email validation
- ✅ User Login with JWT authentication
- ✅ JWT Access & Refresh Tokens
- ✅ Email Verification Flow
- ✅ Forgot Password Flow
- ✅ Password Reset Flow
- ✅ User Profile Management
- ✅ Interest Management
- ✅ Role-Based Access Control (RBAC)
- ✅ RESTful API with comprehensive error handling
- ✅ Pagination support
- ✅ Database migrations with Alembic
- ✅ API documentation with Swagger/OpenAPI

## Prerequisites

- Python 3.12+
- PostgreSQL 14+
- pip or Poetry for dependency management

## Installation

### 1. Clone the repository and navigate to the project

```bash
cd tribe-backend
```

### 2. Create a virtual environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Set up environment variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

### 5. Start PostgreSQL

Using Docker Compose:

```bash
docker-compose up -d
```

Or with a local PostgreSQL installation, ensure it's running on `localhost:5432`.

### 6. Create database tables

```bash
# Using Alembic (recommended for production)
alembic upgrade head

# Or manually create tables by running the app once
```

## Running the Application

### Development Server

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

### Production Server

```bash
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
```

## API Documentation

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## Project Structure

```
app/
├── main.py                  # FastAPI application factory
├── lifespan.py              # Application lifecycle management
│
├── config/                  # Configuration modules
│   ├── settings.py          # Environment settings
│   ├── database.py          # Database configuration
│   ├── security.py          # JWT & password hashing
│   ├── logging.py           # Logging configuration
│   └── constants.py         # Application constants
│
├── core/                    # Core application modules
│   ├── base_model.py        # SQLAlchemy base model
│   ├── exceptions.py        # Custom exceptions
│   └── responses.py         # Response models
│
├── models/                  # SQLAlchemy ORM models
│   ├── user.py
│   ├── profile.py
│   ├── interest.py
│   ├── user_interest.py
│   ├── session.py
│   ├── role.py
│   └── permission.py
│
├── schemas/                 # Pydantic request/response schemas
│   ├── auth.py
│   ├── user.py
│   ├── profile.py
│   └── interest.py
│
├── repositories/            # Data access layer
│   ├── user_repository.py
│   ├── profile_repository.py
│   └── interest_repository.py
│
├── services/                # Business logic layer
│   ├── auth_service.py
│   ├── user_service.py
│   ├── profile_service.py
│   └── interest_service.py
│
└── api/                     # API endpoints
    └── v1/
        ├── dependencies/
        │   ├── auth.py      # Authentication dependencies
        │   └── roles.py     # Role-based access control
        └── endpoints/
            ├── auth.py
            ├── users.py
            ├── profiles.py
            └── interests.py
```

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/verify-email` - Verify email
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password
- `POST /api/v1/auth/change-password` - Change password

### Users

- `GET /api/v1/users/me` - Get current user
- `GET /api/v1/users/{user_id}` - Get user by ID
- `PUT /api/v1/users/me` - Update current user
- `DELETE /api/v1/users/me` - Deactivate account
- `GET /api/v1/users` - List all users (paginated)

### Profiles

- `POST /api/v1/profiles` - Create profile
- `GET /api/v1/profiles/me` - Get current user's profile
- `GET /api/v1/profiles/{profile_id}` - Get profile by ID
- `PUT /api/v1/profiles/me` - Update current profile
- `DELETE /api/v1/profiles/me` - Delete current profile
- `GET /api/v1/profiles` - List all profiles (paginated)

### Interests

- `POST /api/v1/interests` - Create interest (admin only)
- `GET /api/v1/interests/{interest_id}` - Get interest by ID
- `GET /api/v1/interests` - List interests (with optional category filter)
- `POST /api/v1/interests/user/interests` - Add interests to user
- `GET /api/v1/interests/user/interests` - Get user's interests
- `PUT /api/v1/interests/user/interests` - Replace user's interests
- `DELETE /api/v1/interests/user/interests/{interest_id}` - Remove interest from user

## Database Migrations

### Create a new migration

```bash
alembic revision --autogenerate -m "description of changes"
```

### Apply migrations

```bash
alembic upgrade head
```

### Rollback migration

```bash
alembic downgrade -1
```

## Authentication

### Token Format

Tokens are JWT-based and include:
- Access tokens: 30 minutes expiration
- Refresh tokens: 7 days expiration

### Using Tokens

Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one digit
- At least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)

## Error Handling

All errors return a consistent format:

```json
{
  "success": false,
  "message": "Error description",
  "error_code": "ERROR_CODE",
  "details": {}
}
```

HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 422: Validation Error
- 500: Internal Server Error

## Development

### Run tests

```bash
pytest
```

### Code formatting

```bash
black app/
isort app/
```

### Linting

```bash
flake8 app/
mypy app/
```

## Next Steps (Phase 2+)

- Community management
- Event creation and management
- Matching algorithm
- Real-time chat with WebSockets
- Push notifications
- AI-powered recommendations
- Analytics dashboard

## Contributing

Please follow the established code structure and include tests for new features.

## License

MIT
