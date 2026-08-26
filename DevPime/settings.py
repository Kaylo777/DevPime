For the full list of settings and their values, see
https://docs.djangoproject.com/en/6.1/ref/settings/
"""

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-e3um07_mmgy7b0st7gpog#gl@mr!@i^!rcqk6xwp6q8joqr^79'
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'django-insecure-e3um07_mmgy7b0st7gpog#gl@mr!@i^!rcqk6xwp6q8joqr^79')

DEBUG = True

ALLOWED_HOSTS = ['*']