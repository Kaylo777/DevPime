import os
import sys

import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'DevPime.settings')
django.setup()

from django.db import connection


def probar_conexion():
    print("=" * 50)
    print("PRUEBA DE CONEXION A BASE DE DATOS")
    print("=" * 50)

    db = connection.settings_dict
    print(f"Motor:    {db['ENGINE']}")
    print(f"Host:     {db['HOST']}")
    print(f"Port:     {db['PORT']}")
    print(f"Database: {db['NAME']}")
    print(f"User:     {db['USER']}")
    print("-" * 50)

    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT version();")
            version = cursor.fetchone()
            print(f"POSTGRESQL: {version[0]}")
            print("-" * 50)

            cursor.execute("""
                SELECT table_name
                FROM information_schema.tables
                WHERE table_schema = 'public'
                ORDER BY table_name;
            """)
            tablas = cursor.fetchall()
            print(f"Tablas encontradas: {len(tablas)}")
            for tabla in tablas:
                print(f"  - {tabla[0]}")

        print("-" * 50)
        print("CONEXION EXITOSA")
        print("=" * 50)
        return True

    except Exception as e:
        print(f"ERROR: {e}")
        print("=" * 50)
        return False


if __name__ == '__main__':
    exito = probar_conexion()
    sys.exit(0 if exito else 1)
