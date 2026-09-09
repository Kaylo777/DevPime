# DevPime — Diagrama de Microservicios

## 1. Arquitectura actual (Monolito)

Hoy todo el backend corre en un solo servicio Django REST que maneja autenticación,
ejecutivos, clientes, reuniones, propuestas, proyectos y el dashboard.

```mermaid
flowchart LR
    subgraph Cliente[Frontend - React / Vite]
        UI[SPA React]
    end

    subgraph Backend[MONOLITO - Django REST API]
        AUTH[Auth Service<br/>registro / login / sesión]
        CRM[Ejecutivos y Clientes]
        SCH[Citas - Reuniones]
        SAL[Ventas - Propuestas]
        PRJ[Proyectos]
        DASH[Dashboard / Agregados]
    end

    subgraph Data[Persistencia]
        DB[(Supabase<br/>PostgreSQL 17 en la nube)]
    end

    UI -->|HTTP /api| AUTH
    UI -->|HTTP /api| CRM
    UI -->|HTTP /api| SCH
    UI -->|HTTP /api| SAL
    UI -->|HTTP /api| PRJ
    UI -->|HTTP /api| DASH

    AUTH --> DB
    CRM --> DB
    SCH --> DB
    SAL --> DB
    PRJ --> DB
    DASH --> DB
```

---

## 2. Propuesta de microservicios (división práctica)

División propuesta por dominios de negocio, manteniendo un solo frontend y un API Gateway.

```mermaid
flowchart LR
    subgraph Cliente[Frontend]
        UI[React SPA<br/>localhost:5174]
    end

    Gateway[API Gateway<br/>ruteo / autenticación/JWT]

    subgraph Servicios[Microservicios]
        S_AUTH[Auth Service<br/>usuarios / roles / tokens]
        S_CRM[CRM Service<br/>ejecutivos y clientes]
        S_SCH[Scheduling Service<br/>reuniones]
        S_SAL[Sales Service<br/>propuestas]
        S_PRJ[Projects Service<br/>proyectos]
        S_DASH[Dashboard Service<br/>agregados]
    end

    subgraph Data[Persistencia]
        DB1[(Supabase<br/>esquema auth)]
        DB2[(Supabase<br/>esquema crm)]
        DB3[(Supabase<br/>esquema citas)]
        DB4[(Supabase<br/>esquema ventas)]
        DB5[(Supabase<br/>esquema proyectos)]
        RED[(Redis<br/>caché dashboard)]
    end

    UI -->|HTTP| Gateway
    Gateway --> S_AUTH
    Gateway --> S_CRM
    Gateway --> S_SCH
    Gateway --> S_SAL
    Gateway --> S_PRJ
    Gateway --> S_DASH

    S_AUTH --> DB1
    S_CRM --> DB2
    S_SCH --> DB3
    S_SAL --> DB4
    S_PRJ --> DB5
    S_DASH --> RED
    S_DASH --> DB2
    S_DASH --> DB3
    S_DASH --> DB4
    S_DASH --> DB5
```

---

## 3. ¿Qué es práctico dividir y qué no?

| Módulo | ¿Microservicio? | Razón |
|--------|:---------------:|-------|
| **Auth** | ✅ Sí | Primer candidato: se usa en todo, crece solo, puede usar Supabase Auth |
| **CRM** (ejecutivos + clientes) | ✅ Sí | Dominio de negocio independiente, datos propios |
| **Scheduling** (reuniones) | ⚠️ Eventual | Hoy es simple; dividirlo sin necesidad suma complejidad |
| **Sales** (propuestas) | ⚠️ Eventual | Depende de clientes; el acoplamiento es bajo, se puede separar |
| **Projects** | ✅ Sí | Alto acoplamiento con propuestas, buen candidato independiente |
| **Dashboard** | ❌ No | Solo agrega datos de los demás; usar caché (Redis) dentro del resto |

### Recomendación práctica

No dividas todo al inicio. Deja el monolito corriendo y extrae **por demanda** en este orden:

1. **Auth Service** → se convierte en el gateway de autenticación
2. **CRM Service** → primer dominio de negocio separado
3. **Projects Service** → cuando la lógica de proyectos crezca

> Regla: solo crea un microservicio cuando tengas un **equipo/dominio que crece solo** o una **razón técnica** (deploy independiente, escala distinta). Para un proyecto de este tamaño, un **monolito modular bien estructurado** (módulos Django con barreras claras) suele ser la mejor arquitectura.

## 4. Cómo sería el flujo de login (propuesta)

```mermaid
sequenceDiagram
    participant UI as React
    participant GW as API Gateway
    participant AUTH as Auth Service
    participant CRMS as CRM Service
    participant DB as Supabase

    UI->>GW: POST /auth/login
    GW->>AUTH: login (email, password)
    AUTH->>DB: verificar credenciales
    DB-->>AUTH: ok + rol
    AUTH-->>UI: JWT + perfil
    UI->>GW: GET /clientes (Authorization: Bearer JWT)
    GW->>CRMS: validar token + pedir clientes
    CRMS-->>UI: lista de clientes
```