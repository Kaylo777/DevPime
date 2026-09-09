import os
import re
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
conn.autocommit = True
cur = conn.cursor()

dump_file = os.path.join(os.path.dirname(__file__), 'datos_devpime.sql')

with open(dump_file, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Filter: keep only INSERT, SELECT setval, SET, and remove comments/pg_dump commands
clean_lines = []
for line in lines:
    stripped = line.strip()
    if stripped.startswith('--'):
        continue
    if stripped.startswith('\\\\'):
        continue
    if stripped.startswith('SET '):
        clean_lines.append(stripped)
        continue
    if stripped.startswith('INSERT ') or stripped.startswith('SELECT '):
        clean_lines.append(stripped)
        continue

sql = '\n'.join(clean_lines)

# Split by semicolons (each INSERT is a statement)
statements = [s.strip() for s in sql.split(';') if s.strip()]

ok = 0
fail = 0
for stmt in statements:
    if not stmt or stmt == 'SET':
        continue
    try:
        cur.execute(stmt)
        ok += 1
    except Exception as e:
        fail += 1
        if fail <= 5:
            print(f'  WARN: {str(e)[:120]}')

print(f'Importadas: {ok} OK, {fail} ignoradas')
cur.close()
conn.close()
