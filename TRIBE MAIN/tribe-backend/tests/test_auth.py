"""Tests for authentication endpoints."""

import pytest
from fastapi.testclient import TestClient


class TestAuthentication:
    """Authentication endpoint tests."""

    def test_register_success(self, client: TestClient):
        """Test successful user registration."""
        response = client.post(
            "/api/v1/auth/register",
            json={
                "email": "testuser@example.com",
                "username": "testuser",
                "password": "SecurePass123!@#",
                "confirm_password": "SecurePass123!@#",
            },
        )
        assert response.status_code == 201
        data = response.json()
        assert data["success"] is True
        assert data["data"]["email"] == "testuser@example.com"
        assert data["data"]["username"] == "testuser"

    def test_register_duplicate_email(self, client: TestClient):
        """Test registration with duplicate email."""
        # Register first user
        client.post(
            "/api/v1/auth/register",
            json={
                "email": "testuser@example.com",
                "username": "testuser1",
                "password": "SecurePass123!@#",
                "confirm_password": "SecurePass123!@#",
            },
        )

        # Try to register with same email
        response = client.post(
            "/api/v1/auth/register",
            json={
                "email": "testuser@example.com",
                "username": "testuser2",
                "password": "SecurePass123!@#",
                "confirm_password": "SecurePass123!@#",
            },
        )
        assert response.status_code == 409

    def test_register_weak_password(self, client: TestClient):
        """Test registration with weak password."""
        response = client.post(
            "/api/v1/auth/register",
            json={
                "email": "testuser@example.com",
                "username": "testuser",
                "password": "weakpass",
                "confirm_password": "weakpass",
            },
        )
        assert response.status_code == 422

    def test_register_password_mismatch(self, client: TestClient):
        """Test registration with mismatched passwords."""
        response = client.post(
            "/api/v1/auth/register",
            json={
                "email": "testuser@example.com",
                "username": "testuser",
                "password": "SecurePass123!@#",
                "confirm_password": "DifferentPass123!@#",
            },
        )
        assert response.status_code == 422

    def test_login_success(self, client: TestClient):
        """Test successful login."""
        # Register user first
        client.post(
            "/api/v1/auth/register",
            json={
                "email": "testuser@example.com",
                "username": "testuser",
                "password": "SecurePass123!@#",
                "confirm_password": "SecurePass123!@#",
            },
        )

        # Login
        response = client.post(
            "/api/v1/auth/login",
            json={
                "username": "testuser",
                "password": "SecurePass123!@#",
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "access_token" in data["data"]
        assert "refresh_token" in data["data"]
        assert data["data"]["token_type"] == "bearer"

    def test_login_invalid_credentials(self, client: TestClient):
        """Test login with invalid credentials."""
        response = client.post(
            "/api/v1/auth/login",
            json={
                "username": "nonexistent",
                "password": "WrongPass123!@#",
            },
        )
        assert response.status_code == 401

    def test_refresh_token_success(self, client: TestClient):
        """Test successful token refresh."""
        # Register and login first
        client.post(
            "/api/v1/auth/register",
            json={
                "email": "testuser@example.com",
                "username": "testuser",
                "password": "SecurePass123!@#",
                "confirm_password": "SecurePass123!@#",
            },
        )

        login_response = client.post(
            "/api/v1/auth/login",
            json={
                "username": "testuser",
                "password": "SecurePass123!@#",
            },
        )
        refresh_token = login_response.json()["data"]["refresh_token"]

        # Refresh token
        response = client.post(
            "/api/v1/auth/refresh",
            json={"refresh_token": refresh_token},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "access_token" in data["data"]
        assert data["data"]["token_type"] == "bearer"

    def test_refresh_invalid_token(self, client: TestClient):
        """Test refresh with invalid token."""
        response = client.post(
            "/api/v1/auth/refresh",
            json={"refresh_token": "invalid_token"},
        )
        assert response.status_code == 401


class TestProtectedEndpoints:
    """Protected endpoint tests."""

    def test_get_current_user(self, client: TestClient):
        """Test getting current user profile."""
        # Register and login
        client.post(
            "/api/v1/auth/register",
            json={
                "email": "testuser@example.com",
                "username": "testuser",
                "password": "SecurePass123!@#",
                "confirm_password": "SecurePass123!@#",
            },
        )

        login_response = client.post(
            "/api/v1/auth/login",
            json={
                "username": "testuser",
                "password": "SecurePass123!@#",
            },
        )
        access_token = login_response.json()["data"]["access_token"]

        # Get current user
        response = client.get(
            "/api/v1/users/me",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["email"] == "testuser@example.com"

    def test_get_current_user_without_token(self, client: TestClient):
        """Test accessing protected endpoint without token."""
        response = client.get("/api/v1/users/me")
        assert response.status_code == 403
