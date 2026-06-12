# WorkHubMTY — Frontend

Aplicación web para la plataforma WorkHubMTY, construida con Next.js y TypeScript.

---

## Tecnologías

| Tecnología           | Uso                                          |
|----------------------|----------------------------------------------|
| Next.js (App Router) | Framework React con rutas por carpetas       |
| TypeScript           | Tipado estático                              |
| TailwindCSS          | Estilos utilitarios                          |
| React Context API    | Estado global de autenticación               |

---

## Estructura del proyecto

```
src/app/
├── (auth)/
│   └── login/                ← Página de inicio de sesión
├── (private)/
│   ├── layout.tsx            ← Layout con navbar (rutas protegidas)
│   ├── home/                 ← Página principal con agenda rápida
│   ├── tablero/              ← Dashboard: compañeros, amigos, resumen
│   ├── calendario/           ← Calendario mensual con reservas propias
│   ├── reservaciones/
│   │   ├── page.tsx          ← Selección de tipo de reservación
│   │   └── cubiculo/         ← Flujo completo de reserva de cubículo/sala
│   ├── chatbot/              ← Asistente IA para reservar en lenguaje natural
│   └── perfil/               ← Perfil del usuario, amigos y logros
├── components/               ← Componentes globales reutilizables
│   ├── Agenda/               ← Vista de agenda diaria completa
│   ├── AgendaRapida/         ← Widget compacto con reservas del día
│   ├── DailyEventCard/       ← Tarjeta de un evento individual en la agenda
│   ├── HourSelect/           ← Selector de hora para reservas
│   ├── Navbar/               ← Barra de navegación principal
│   ├── PageTransition/       ← Animaciones de transición entre páginas
│   └── ScrollInvitados/      ← Lista scrollable de participantes invitados
├── features/
│   └── reservaciones/        ← Toda la lógica y UI del flujo de reservas
│       ├── components/
│       │   ├── Calendar/     ← Calendario mensual de selección de fecha
│       │   ├── Timeline/     ← Línea de tiempo interactiva con disponibilidad
│       │   │   ├── ConflictOverlay.tsx
│       │   │   ├── SelectionBlock.tsx
│       │   │   ├── TimelineAxis.tsx
│       │   │   └── TimelineBlock.tsx
│       │   ├── Card.tsx
│       │   ├── EventsAndConflictCard.tsx
│       │   ├── ProposedSchedulesCard.tsx
│       │   ├── ReservationFooter.tsx
│       │   ├── ReservationTimelineCard.tsx
│       │   └── StickyAside.tsx
│       ├── constants/        ← Constantes del flujo (horas, tipos, etc.)
│       ├── lib/              ← Utilidades: conflicts.ts, dates.ts, time.ts
│       └── types/            ← Tipos TypeScript del dominio de reservas
├── modules/
│   └── auth/                 ← Servicio, contexto y hook de autenticación
└── types/
    └── Agenda.ts             ← Tipos para la agenda
```

---

## Páginas y rutas

### Rutas públicas

| Ruta     | Descripción          |
|----------|----------------------|
| `/login` | Inicio de sesión     |

### Rutas privadas (requieren sesión activa)

| Ruta                      | Descripción                                                        |
|---------------------------|--------------------------------------------------------------------|
| `/home`                   | Página principal: agenda rápida del día y accesos directos         |
| `/tablero`                | Dashboard: compañeros, solicitudes de amistad, actividad reciente  |
| `/calendario`             | Calendario mensual con todas las reservas del usuario              |
| `/reservaciones`          | Selección del tipo de reservación (cubículo, estacionamiento)      |
| `/reservaciones/cubiculo` | Flujo completo de reserva de cubículo o sala de reuniones          |
| `/chatbot`                | Chat con el asistente IA para reservar en lenguaje natural         |
| `/perfil`                 | Perfil del usuario, lista de amigos, logros obtenidos              |

---

## Funcionalidades clave

### Sistema de reservaciones (`/reservaciones/cubiculo`)

Flujo interactivo completo para reservar cubículos o salas:

- **Calendario mensual** (`MonthCalendar`) para seleccionar la fecha
- **Línea de tiempo interactiva** (`ReservationTimelineCard`) que muestra bloques de ocupación y permite seleccionar el rango horario deseado
- **Detección de conflictos en tiempo real** (`ConflictOverlay`, `conflicts.ts`): resalta solapamientos mientras el usuario selecciona
- **Horarios sugeridos** (`ProposedSchedulesCard`): cuando hay conflicto propone rangos alternativos disponibles
- **Panel de invitados** (`ScrollInvitados`): buscar y agregar compañeros como participantes de la reserva
- **Footer de confirmación** (`ReservationFooter`): resumen del espacio, hora y participantes antes de confirmar

### Agenda de reservas

- **`/calendario`**: vista mensual de todas las reservas propias
- **`AgendaRapida`** (widget en `/home`): muestra las reservas del día actual
- **`DailyEventCard`**: representa cada reserva con espacio, horario y estado

### Asistente IA — Chatbot (`/chatbot`)

Interfaz de chat que se comunica con el módulo `chat` del backend (Google Gemini + tool use). El usuario puede:

- Pedir espacios en lenguaje natural: *"reserva una sala para 4 personas mañana a las 10"*
- Ver un carrusel de espacios disponibles sugeridos por el modelo
- Confirmar y crear la reserva directamente desde la conversación

### Amistades y red social

- Ver y gestionar lista de amigos desde `/tablero` y `/perfil`
- Enviar y responder solicitudes de amistad
- Ver el perfil completo de un compañero

### Autenticación

- Login con JWT; token manejado en el servidor (cookie HTTP-only)
- El layout de rutas privadas valida la sesión antes de renderizar
- Hook `useAuth()` para acceder al usuario autenticado en cualquier componente

---

## Flujo mínimo de reserva (UI)

```
1. Usuario navega a /reservaciones/cubiculo
        ↓
2. Selecciona fecha en MonthCalendar
        ↓
3. Visualiza disponibilidad en ReservationTimelineCard
   → Bloques ocupados muestran ConflictOverlay
        ↓
4. Selecciona rango horario
   → Si hay conflicto, ProposedSchedulesCard sugiere alternativas
        ↓
5. (Opcional) Agrega participantes con ScrollInvitados
        ↓
6. Confirma en ReservationFooter
   → POST al backend → reserva creada
        ↓
7. La agenda se actualiza (AgendaRapida / /calendario)
```

---

## Módulo de autenticación

```
src/app/modules/auth/
├── auth.context.tsx   ← Provider global con el usuario autenticado
├── useAuth.ts         ← Hook: expone user, login(), logout()
├── auth.service.ts    ← Llamadas a la API de login/refresh
├── auth.types.ts      ← Tipos: User, LoginPayload, AuthState
└── api.ts             ← Cliente HTTP base con headers de autorización
```

---

## Instalación y ejecución local

```bash
npm install

# Desarrollo
npm run dev
# → http://localhost:3000

# Build de producción
npm run build
npm start

# Linting
npm run lint
```

### Variables de entorno

Crea `.env.local` para desarrollo local:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

En producción las variables se pasan como `build args` al construir la imagen Docker (ver `compose.prod.yml` en el directorio raíz).

---

## Scripts disponibles

| Script          | Descripción                          |
|-----------------|--------------------------------------|
| `npm run dev`   | Servidor de desarrollo con hot reload |
| `npm run build` | Build optimizado para producción     |
| `npm start`     | Inicia el build de producción        |
| `npm run lint`  | Verifica el código con ESLint        |
