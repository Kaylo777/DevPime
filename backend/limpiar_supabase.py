import os
import psycopg2

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'DevPime.settings')

import django
django.setup()

from django.conf import settings

db = settings.DATABASES['default']
conn = psycopg2.connect(
    host=db['HOST'],
    port=db['PORT'],
    dbname=db['NAME'],
    user=db['USER'],
    password=db['PASSWORD'],
    sslmode=db['OPTIONS'].get('sslmode', 'require'),
    options='-c search_path=public',
)
conn.autocommit = False
cur = conn.cursor()

tables = [
    'reunion', 'proyecto', 'propuesta', 'cliente', 'ejecutivo',
    'django_session', 'django_admin_log', 'custom_user_user_permissions',
    'custom_user_groups', 'custom_user', 'auth_permission', 'auth_group',
    'auth_group_permissions', 'django_content_type',
]

for t in tables:
    cur.execute(f'DELETE FROM public.{t};')
    print(f'  DELETE {t}')

conn.commit()
print('Tablas limpiadas OK')

cur.close()
conn.close()
