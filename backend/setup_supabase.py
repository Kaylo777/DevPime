"""
Migra la base local de PostgreSQL hacia Supabase.

Requisitos previos:
  1. Crear el proyecto en https://supabase.com
  2. Ir a Settings > Database > Connection string
  3. Copiar el archivo .env.example como .env y completarlo con los datos de Supabase
     (DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_SSLMODE=require)

Luego ejecutar:
    python setup_supabase.py

Proceso:
  1. Aplica todas las migraciones de Django (crea las tablas en Supabase)
  2. Exporta los datos de la base local y los importa en Supabase
"""
import os
import subprocess
import sys
from pathlib import Path

import django

BASE_DIR = Path(__file__).resolve().parent
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'DevPime.settings')


def run(cmd, cwd=None):
    print(f"\n>> Ejecutando: {cmd}")
    result = subprocess.run(cmd, cwd=cwd or BASE_DIR, shell=True)
    if result.returncode != 0:
        print(f"\n[ERROR] El comando falló: {cmd}")
        sys.exit(result.returncode)
    return result


def main():
    print("=" * 60)
    print("MIGRACIÓN A SUPABASE")
    print("=" * 60)

    if not (BASE_DIR / '.env').exists():
        print(
            "\n[AVISO] No encontré el archivo .env.\n"
            "Copia .env.example como .env y completa los datos de tu proyecto de "
            "Supabase antes de continuar.\n"
            "En Windows:  copy .env.example .env\n"
            "En Linux/Mac: cp .env.example .env"
        )
        sys.exit(1)

    django.setup()

    from django.conf import settings

    db = settings.DATABASES['default']
    print(f"Conectando a: {db['ENGINE']} @ {db['HOST']}:{db['PORT']}/{db['NAME']} "
          f"como {db['USER']} (ssl={db['OPTIONS'].get('sslmode')})")

    print("\n1) Aplicando migraciones en la base de destino...")
    run("python manage.py migrate")

    print("\n2) Exportando datos de la base local...")
    dump_file = BASE_DIR / 'datos_devpime.sql'
    pg_dump = "C:/Program Files/PostgreSQL/18/bin/pg_dump.exe"
    # Datos locales por defecto
    local = {
        'HOST': 'localhost',
        'PORT': '5432',
        'NAME': 'devpime_db',
        'USER': 'postgres',
        'PASSWORD': 'damian2021',
    }
    if not dump_file.exists() or os.environ.get('REEXPORTAR') == '1':
        env = os.environ.copy()
        env['PGPASSWORD'] = local['PASSWORD']
        run(f'"{pg_dump}" -U {local["USER"]} -h {local["HOST"]} -d {local["NAME"]} '
            f'--data-only --inserts -f "{dump_file}"')
    else:
        print("   (usando dump ya generado: datos_devpime.sql)")

    print("\n3) Importando datos en Supabase...")
    psql = "C:/Program Files/PostgreSQL/18/bin/psql.exe"
    env = os.environ.copy()
    env['PGPASSWORD'] = db['PASSWORD']
    cmd = (f'"{psql}" -U {db["USER"]} -h {db["HOST"]} -p {db["PORT"]} '
           f'-d {db["NAME"]} -v ON_ERROR_STOP=1 -f "{dump_file}"')
    print(f"   {cmd}")
    result = subprocess.run(cmd, env=env, cwd=BASE_DIR, shell=True)
    if result.returncode != 0:
        print("\n[AVISO] La importación de datos falló. Revisa el mensaje.\n"
              "Las tablas ya están creadas, así que la app funciona; sólo "
              "faltarían los datos históricos.")
        sys.exit(1)

    print("\n" + "=" * 60)
    print("¡LISTO! La base ahora corre en Supabase.")
    print("Inicia el backend con:  python manage.py runserver")
    print("=" * 60)


if __name__ == '__main__':
    main()
