from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser, Ejecutivo


class RegisterSerializer(serializers.Serializer):
    nombre = serializers.CharField(max_length=255)
    apellido = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True)
    rol = serializers.ChoiceField(choices=CustomUser.ROL_CHOICES)

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este email ya está registrado.")
        return value

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password2": "Las contraseñas no coinciden."})
        return data

    def create(self, validated_data):
        nombre = validated_data.pop('nombre')
        apellido = validated_data.pop('apellido')
        rol = validated_data.pop('rol')
        password = validated_data.pop('password')
        validated_data.pop('password2')

        user = CustomUser(
            email=validated_data['email'],
            first_name=nombre,
            last_name=apellido,
            rol=rol,
        )
        user.set_password(password)
        user.save()

        if rol == 'ejecutivo':
            ejecutivo = Ejecutivo.objects.create(
                nombre=nombre,
                apellido=apellido,
                email=validated_data['email'],
            )
            user.id_ejecutivo = ejecutivo
            user.save()

        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(username=data['email'], password=data['password'])
        if not user:
            raise serializers.ValidationError("Email o contraseña incorrectos.")
        if not user.is_active:
            raise serializers.ValidationError("Esta cuenta está desactivada.")
        data['user'] = user
        return data


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'first_name', 'last_name', 'rol']
