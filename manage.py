#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
    try:
        from django.core.management import execute_from_command_line

        # 🔥 IMPORTANTE: importar después de cargar Django
        from django.contrib.auth import get_user_model

        User = get_user_model()

        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                'admin',
                'admin@example.com',
                '12345678'
            )

    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django..."
        ) from exc

    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()