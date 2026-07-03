# Contributing to Tribe Backend

Thank you for considering contributing to Tribe! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please read our Code of Conduct before contributing.

## Getting Started

### Prerequisites

- Python 3.12+
- PostgreSQL 14+
- Git

### Setup Development Environment

1. **Fork the repository**

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/tribe-backend.git
   cd tribe-backend
   ```

3. **Create a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

4. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   pip install -r requirements-dev.txt  # For development tools
   ```

5. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

6. **Set up database**
   ```bash
   docker-compose up -d
   alembic upgrade head
   ```

## Development Workflow

### Creating a Feature Branch

```bash
git checkout -b feature/your-feature-name
git checkout -b fix/your-bug-fix-name
```

### Code Style

We follow PEP 8 and use the following tools:

- **black**: Code formatting
- **isort**: Import sorting
- **flake8**: Linting
- **mypy**: Type checking

Format your code before committing:

```bash
black app/
isort app/
flake8 app/
mypy app/
```

### Writing Tests

All new features should include tests. Place tests in the `tests/` directory matching the module structure.

Run tests:

```bash
pytest
pytest -v  # Verbose output
pytest --cov=app  # With coverage report
```

### Commit Messages

Use clear, descriptive commit messages following this format:

```
type(scope): subject

description

closes #issue_number (if applicable)
```

Types:
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation
- **style**: Code style changes (formatting)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Build, dependencies, CI/CD

Example:
```
feat(auth): add email verification endpoint

Implement email verification flow with token validation.
Sends verification email on registration.

closes #123
```

### Pull Request Process

1. **Rebase on main**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create Pull Request**
   - Provide a clear title and description
   - Reference any related issues
   - Include screenshots/videos if UI changes
   - Ensure all tests pass

4. **Code Review**
   - Address feedback promptly
   - Update the PR with changes
   - Rebase and force push if needed

## Architecture Guidelines

### Clean Architecture

We follow clean architecture principles:

1. **Config Layer** (`app/config/`)
   - External configuration and setup
   - Database, security, logging

2. **Core Layer** (`app/core/`)
   - Domain models, exceptions, responses
   - Business logic entities

3. **Models Layer** (`app/models/`)
   - SQLAlchemy ORM models
   - Database schemas

4. **Schemas Layer** (`app/schemas/`)
   - Pydantic request/response models
   - Data validation

5. **Repository Layer** (`app/repositories/`)
   - Data access abstraction
   - Query logic

6. **Service Layer** (`app/services/`)
   - Business logic
   - Orchestration

7. **API Layer** (`app/api/`)
   - FastAPI endpoints
   - Request handling

### Code Organization

```
Feature: User Management

models/user.py          # Database model
schemas/user.py         # Request/response schemas
repositories/user_repository.py    # Data access
services/user_service.py           # Business logic
api/v1/users.py         # API endpoints
api/dependencies/auth.py # Dependencies
```

## Database Migrations

### Creating Migrations

```bash
alembic revision --autogenerate -m "description"
```

### Applying Migrations

```bash
alembic upgrade head
```

### Rolling Back

```bash
alembic downgrade -1
```

Always include migration files with your feature when changing the database schema.

## Naming Conventions

### Functions
- Use snake_case
- Use descriptive names
- Use verb-based names for functions that perform actions

```python
def get_user_by_email(email: str) -> User:
    pass

def create_user(user_data: UserCreate) -> User:
    pass
```

### Classes
- Use PascalCase
- Use descriptive names
- Use noun-based names

```python
class UserRepository:
    pass

class AuthService:
    pass
```

### Constants
- Use UPPER_SNAKE_CASE
- Define at module or class level

```python
MAX_PAGE_SIZE = 100
DEFAULT_PAGE_SIZE = 20
```

### Database Models
- Use singular names
- Use descriptive column names
- Add indexes for frequently queried columns

```python
class User(Base):
    __tablename__ = "users"
    email = Column(String, unique=True, index=True)
```

## Documentation

### Docstrings

Use Google-style docstrings:

```python
def create_user(email: str, username: str) -> User:
    """Create a new user.
    
    Args:
        email: User's email address.
        username: User's username.
    
    Returns:
        User: Created user object.
    
    Raises:
        ConflictException: If email or username already exists.
    """
    pass
```

### README

Update README.md when:
- Adding new endpoints
- Changing database schema
- Updating dependencies
- Modifying setup instructions

## Performance Considerations

1. **Database Queries**
   - Use eager loading for relationships
   - Add indexes to frequently queried columns
   - Avoid N+1 queries

2. **Async Operations**
   - Use async/await for I/O operations
   - Don't block the event loop
   - Use connection pooling

3. **Pagination**
   - Implement pagination for list endpoints
   - Use limit/offset pattern
   - Add reasonable defaults

## Security Guidelines

1. **Authentication**
   - Always validate JWT tokens
   - Use strong secret keys
   - Implement token expiration

2. **Password Security**
   - Hash passwords with bcrypt
   - Enforce strong password requirements
   - Never log passwords

3. **Database**
   - Use parameterized queries (SQLAlchemy)
   - Validate all user inputs
   - Apply least privilege principle

4. **Environment Variables**
   - Never commit `.env` file
   - Use `.env.example` for template
   - Keep secrets secure

## Reporting Bugs

When reporting bugs, include:

1. **Description**: Clear description of the bug
2. **Steps to Reproduce**: Step-by-step reproduction instructions
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**: Python version, OS, etc.
6. **Screenshots/Logs**: Any relevant screenshots or error logs

## Feature Requests

For feature requests, include:

1. **Description**: Clear description of the feature
2. **Motivation**: Why is this feature needed?
3. **Proposed Solution**: How would you implement it?
4. **Alternatives**: Any alternative approaches?
5. **Examples**: Any examples or use cases

## Questions?

Feel free to open an issue or reach out to the maintainers:

- 📧 Email: team@tribe.app
- 💬 Discord: [Join our Discord](https://discord.gg/tribe)
- 📝 GitHub Discussions: [GitHub Discussions](https://github.com/tribe/tribe-backend/discussions)

Thank you for contributing to Tribe!
