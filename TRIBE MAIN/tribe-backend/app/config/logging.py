"""Logging configuration."""

import logging
from logging.handlers import RotatingFileHandler
from app.config.settings import settings
from pathlib import Path

# Create logs directory
LOG_DIR = Path("logs")
LOG_DIR.mkdir(exist_ok=True)


def setup_logging() -> None:
    """Set up logging configuration for the application."""
    # Create logger
    logger = logging.getLogger()
    logger.setLevel(logging.DEBUG if settings.DEBUG else logging.INFO)

    # Remove existing handlers
    for handler in logger.handlers[:]:
        logger.removeHandler(handler)

    # Console handler
    console_handler = logging.StreamHandler()
    console_level = logging.DEBUG if settings.DEBUG else logging.INFO
    console_handler.setLevel(console_level)

    # File handler with rotation
    file_handler = RotatingFileHandler(
        LOG_DIR / "tribe_backend.log",
        maxBytes=10485760,  # 10MB
        backupCount=10,
    )
    file_handler.setLevel(logging.DEBUG)

    # Formatter
    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    console_handler.setFormatter(formatter)
    file_handler.setFormatter(formatter)

    # Add handlers
    logger.addHandler(console_handler)
    logger.addHandler(file_handler)

    # Set specific loggers
    logging.getLogger("sqlalchemy.engine").setLevel(
        logging.DEBUG if settings.DEBUG else logging.WARNING
    )
    logging.getLogger("sqlalchemy.pool").setLevel(
        logging.DEBUG if settings.DEBUG else logging.WARNING
    )


def get_logger(name: str) -> logging.Logger:
    """Get a logger instance.

    Args:
        name: Logger name, typically __name__.

    Returns:
        logging.Logger: Configured logger instance.
    """
    return logging.getLogger(name)
