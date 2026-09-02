from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager


class CustomUserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('Debe proporcionar un email')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('rol', 'ejecutivo')
        if extra_fields.get('is_staff') is not True:
            raise ValueError('El superusuario debe tener is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('El superusuario debe tener is_superuser=True.')
        return self._create_user(email, password, **extra_fields)


class CustomUser(AbstractUser):
    ROL_CHOICES = [
        ('ejecutivo', 'Ejecutivo'),
        ('cliente', 'Cliente'),
    ]

    username = None
    email = models.EmailField(unique=True)
    rol = models.CharField(max_length=20, choices=ROL_CHOICES)
    id_ejecutivo = models.OneToOneField(
        'Ejecutivo',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='user',
        db_column='id_ejecutivo',
    )
    id_cliente = models.OneToOneField(
        'Cliente',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='user',
        db_column='id_cliente',
    )

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        db_table = 'custom_user'
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'

    def __str__(self):
        return self.email


class Ejecutivo(models.Model):
    id_ejecutivo = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)
    apellido = models.CharField(max_length=255)
    email = models.CharField(max_length=255, unique=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    cargo = models.CharField(max_length=255, blank=True, null=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'ejecutivo'
        verbose_name = 'Ejecutivo'
        verbose_name_plural = 'Ejecutivos'

    def __str__(self):
        return f"{self.nombre} {self.apellido}"


class Cliente(models.Model):
    id_cliente = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)
    apellido = models.CharField(max_length=255)
    email = models.CharField(max_length=255, unique=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    empresa = models.CharField(max_length=255, blank=True, null=True)
    direccion = models.TextField(blank=True, null=True)
    id_ejecutivo = models.ForeignKey(
        Ejecutivo,
        on_delete=models.PROTECT,
        db_column='id_ejecutivo',
        related_name='clientes'
    )
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'cliente'
        verbose_name = 'Cliente'
        verbose_name_plural = 'Clientes'

    def __str__(self):
        return f"{self.nombre} {self.apellido}"


class Reunion(models.Model):
    id_reunion = models.AutoField(primary_key=True)
    id_cliente = models.ForeignKey(
        Cliente,
        on_delete=models.PROTECT,
        db_column='id_cliente',
        related_name='reuniones'
    )
    titulo = models.CharField(max_length=255)
    descripcion = models.TextField(blank=True, null=True)
    fecha_reunion = models.DateTimeField()
    duracion_minutos = models.IntegerField(default=60)
    lugar = models.CharField(max_length=255, blank=True, null=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'reunion'
        verbose_name = 'Reunion'
        verbose_name_plural = 'Reuniones'

    def __str__(self):
        return f"{self.titulo} - {self.fecha_reunion}"


class Propuesta(models.Model):
    ESTADO_CHOICES = [
        ('borrador', 'Borrador'),
        ('enviada', 'Enviada'),
        ('aceptada', 'Aceptada'),
        ('rechazada', 'Rechazada'),
    ]

    id_propuesta = models.AutoField(primary_key=True)
    id_cliente = models.ForeignKey(
        Cliente,
        on_delete=models.PROTECT,
        db_column='id_cliente',
        related_name='propuestas'
    )
    titulo = models.CharField(max_length=255)
    descripcion = models.TextField(blank=True, null=True)
    monto = models.DecimalField(max_digits=12, decimal_places=2)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='borrador')
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'propuesta'
        verbose_name = 'Propuesta'
        verbose_name_plural = 'Propuestas'

    def __str__(self):
        return f"{self.titulo} - {self.get_estado_display()}"


class Proyecto(models.Model):
    ESTADO_CHOICES = [
        ('planificacion', 'Planificacion'),
        ('en_curso', 'En Curso'),
        ('pausado', 'Pausado'),
        ('completado', 'Completado'),
        ('cancelado', 'Cancelado'),
    ]

    id_proyecto = models.AutoField(primary_key=True)
    id_cliente = models.ForeignKey(
        Cliente,
        on_delete=models.PROTECT,
        db_column='id_cliente',
        related_name='proyectos'
    )
    id_propuesta = models.ForeignKey(
        Propuesta,
        on_delete=models.SET_NULL,
        db_column='id_propuesta',
        related_name='proyectos',
        blank=True,
        null=True
    )
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField(blank=True, null=True)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='planificacion')
    fecha_inicio = models.DateField(blank=True, null=True)
    fecha_fin = models.DateField(blank=True, null=True)
    presupuesto = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'proyecto'
        verbose_name = 'Proyecto'
        verbose_name_plural = 'Proyectos'

    def __str__(self):
        return f"{self.nombre} - {self.get_estado_display()}"