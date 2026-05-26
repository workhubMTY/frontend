# WorkHubMTY-FRONTEND

```
├── public
│   ├── accenture_logo_purple1.png
│   ├── add_friend.png
│   ├── icons8-equipo-50.png
│   ├── left_arrow.png
│   ├── mockup_acc.png
│   ├── notification_bell.png
│   └── right_arrow.png
├── src
│   └── app
│       ├── (auth)
│       │   └── login
│       │       └── page.tsx
│       ├── (private)
│       │   ├── calendario
│       │   │   └── page.tsx
│       │   ├── chatbot
│       │   │   └── page.tsx
│       │   ├── home
│       │   │   └── page.tsx
│       │   ├── perfil
│       │   │   └── page.tsx
│       │   ├── reservaciones
│       │   │   ├── cubiculo
│       │   │   │   └── page.tsx
│       │   │   └── page.tsx
│       │   ├── tablero
│       │   │   └── page.tsx
│       │   └── layout.tsx
│       ├── components
│       │   ├── Agenda
│       │   │   └── Agenda.tsx
│       │   ├── AgendaRapida
│       │   │   └── AgendaRapida.tsx
│       │   ├── DailyEventCard
│       │   │   └── DailyEventCard.tsx
│       │   ├── HourSelect
│       │   │   └── HourSelect.tsx
│       │   ├── Navbar
│       │   │   ├── Navbar.tsx
│       │   │   ├── NavbarWrappe.tsx
│       │   │   └── navbar.css
│       │   ├── PageTransition
│       │   │   ├── DownTransition.tsx
│       │   │   └── PageTransition.tsx
│       │   └── ScrollInivitados
│       │       └── ListaInvitados.tsx
│       ├── features
│       │   └── reservaciones
│       │       ├── components
│       │       │   ├── Calendar
│       │       │   │   └── MonthCalendar.tsx
│       │       │   ├── Timeline
│       │       │   │   ├── ConflictOverlay.tsx
│       │       │   │   ├── SelectionBlock.tsx
│       │       │   │   ├── TimelineAxis.tsx
│       │       │   │   └── TimelineBlock.tsx
│       │       │   ├── Card.tsx
│       │       │   ├── EventsAndConflictCard.tsx
│       │       │   ├── ProposedSchedulesCard.tsx
│       │       │   ├── ReservationFooter.tsx
│       │       │   ├── ReservationTimelineCard.tsx
│       │       │   └── StickyAside.tsx
│       │       ├── constants
│       │       │   └── reservaciones.ts
│       │       ├── data
│       │       │   ├── mockApisss.ts
│       │       │   └── mockReservations.ts
│       │       ├── lib
│       │       │   ├── cn.ts
│       │       │   ├── conflicts.ts
│       │       │   ├── dates.ts
│       │       │   ├── formatting.ts
│       │       │   └── time.ts
│       │       └── types
│       │           └── reservaciones.ts
│       ├── modules
│       │   └── auth
│       │       ├── api.ts
│       │       ├── auth.context.tsx
│       │       ├── auth.service.ts
│       │       ├── auth.types.ts
│       │       └── useAuth.ts
│       ├── types
│       │   └── Agenda.ts
│       ├── favicon.ico
│       ├── globals.css
│       ├── layout.tsx
│       ├── not-found.tsx
│       └── page.tsx
├── .gitignore
├── AGENTS.md
├── CLAUDE.md
├── README.md
├── eslint.config.mjs
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```
# WorkHubMTY Frontend

## Descripción General

WorkHubMTY Frontend es una aplicación desarrollada con Next.js y TypeScript enfocada en la gestión colaborativa de espacios de trabajo, reservaciones, agenda, calendario, comunicación y administración de usuarios.

La aplicación implementa:

* Autenticación de usuarios.
* Gestión de reservaciones.
* Calendario y agenda.
* Dashboard interactivo.
* Chatbot.
* Perfil de usuario.
* Navegación privada/autenticada.
* Componentes reutilizables.
* Arquitectura modular escalable.

---

# Tecnologías Utilizadas

## Frontend

* Next.js (App Router)
* React
* TypeScript
* TailwindCSS
* Lucide React

## Arquitectura

* Feature-based structure
* Component Driven Development
* Context API para autenticación
* Modular services

---

# Estructura del Proyecto

```bash
src/
 ├── app/
 │   ├── (auth)/
 │   ├── (private)/
 │   ├── components/
 │   ├── features/
 │   ├── modules/
 │   ├── types/
 │   └── globals.css
```

---

# Arquitectura del Proyecto

La aplicación sigue una arquitectura híbrida basada en:

## 1. App Router (Next.js)

Se utiliza el sistema App Router de Next.js para:

* Layouts anidados.
* Segmentación pública y privada.
* Navegación basada en carpetas.
* Server/Client Components.

---

## 2. Organización por Features

Cada módulo complejo se encapsula dentro de `features/`.

Ejemplo:

```bash
features/
 └── reservaciones/
```

Esto permite:

* Escalabilidad.
* Separación de responsabilidades.
* Reutilización.
* Mantenimiento sencillo.

---

## 3. Componentes Reutilizables

Los componentes globales viven en:

```bash
src/app/components/
```

Ejemplos:

* Navbar
* Agenda
* Transiciones
* Selectores de hora
* Cards

---

## 4. Módulos de Negocio

La lógica desacoplada se organiza en:

```bash
src/app/modules/
```

Ejemplo:

```bash
modules/auth/
```

Contiene:

* Servicios.
* Hooks.
* Tipos.
* Context.
* Lógica de autenticación.

---

# Flujo General de la Aplicación

```text
Usuario
   ↓
Pantallas Next.js
   ↓
Componentes UI
   ↓
Features / Modules
   ↓
Servicios API
   ↓
Backend
```

---

# Instalación del Proyecto

## Requisitos

* Node.js >= 18
* npm >= 9

---

## Clonar el repositorio

```bash
git clone <repository-url>
```

---

## Instalar dependencias

```bash
npm install
```

---

## Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación se ejecutará en:

```bash
http://localhost:3000
```

---

# Scripts Disponibles

| Script        | Descripción                       |
| ------------- | --------------------------------- |
| npm run dev   | Ejecuta el servidor de desarrollo |
| npm run build | Genera build de producción        |
| npm run start | Inicia el proyecto en producción  |
| npm run lint  | Ejecuta ESLint                    |

---

# Variables de Entorno

Crear un archivo:

```bash
.env.local
```

Ejemplo:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

# Navegación del Sistema

## Rutas Públicas

| Ruta   | Descripción      |
| ------ | ---------------- |
| /login | Inicio de sesión |

---

## Rutas Privadas

| Ruta                    | Descripción              |
| ----------------------- | ------------------------ |
| /home                   | Página principal         |
| /tablero                | Dashboard                |
| /calendario             | Calendario               |
| /reservaciones          | Reservaciones            |
| /reservaciones/cubiculo | Reservación de cubículos |
| /chatbot                | Chatbot                  |
| /perfil                 | Perfil de usuario        |

---

# Sistema de Autenticación

## Ubicación

```bash
src/app/modules/auth/
```

---

## Componentes Principales

| Archivo          | Función                               |
| ---------------- | ------------------------------------- |
| auth.context.tsx | Manejo global del usuario autenticado |
| useAuth.ts       | Hook personalizado de autenticación   |
| auth.service.ts  | Comunicación con API                  |
| auth.types.ts    | Interfaces y tipos                    |
| api.ts           | Configuración de requests             |

---

## Flujo de Login

```text
Login Form
   ↓
useAuth()
   ↓
auth.service.ts
   ↓
Backend API
   ↓
Token / Usuario
   ↓
Context Provider
```

---

# Sistema de Reservaciones

## Ubicación

```bash
src/app/features/reservaciones/
```

---

## Estructura Interna

```bash
reservaciones/
 ├── components/
 ├── constants/
 ├── data/
 ├── lib/
 └── types/
```

---

## Componentes Importantes

| Componente              | Función                          |
| ----------------------- | -------------------------------- |
| MonthCalendar           | Calendario mensual               |
| ReservationTimelineCard | Línea de tiempo de reservaciones |
| ConflictOverlay         | Visualización de conflictos      |
| ProposedSchedulesCard   | Horarios sugeridos               |
| StickyAside             | Panel lateral fijo               |
| ReservationFooter       | Acciones finales                 |

---

## Librerías Internas

### conflicts.ts

Manejo de conflictos de horarios.

### dates.ts

Utilidades de fechas.

### formatting.ts

Formateo de horas y fechas.

### time.ts

Operaciones temporales.

### cn.ts

Helper para clases CSS.

---

# Componentes Compartidos

## Navbar

Ubicación:

```bash
src/app/components/Navbar/
```

Responsabilidades:

* Navegación.
* Accesos rápidos.
* Responsive behavior.
* Indicadores visuales.

---

## Agenda

Ubicación:

```bash
src/app/components/Agenda/
```

Permite:

* Visualizar eventos.
* Gestionar horarios.
* Mostrar agenda rápida.

---

## PageTransition

Responsable de:

* Animaciones entre páginas.
* Mejor experiencia de usuario.

---

# Convenciones del Proyecto

## Naming

### Componentes

```bash
PascalCase
```

Ejemplo:

```bash
ReservationTimelineCard.tsx
```

---

### Hooks

```bash
camelCase iniciando con use
```

Ejemplo:

```bash
useAuth.ts
```

---

### Tipos

```bash
PascalCase
```

---

# Buenas Prácticas Implementadas

## Separación de responsabilidades

Cada carpeta contiene una responsabilidad específica.

---

## Componentización

Los componentes son reutilizables y desacoplados.

---

## Tipado estricto

Se utiliza TypeScript para:

* Evitar errores.
* Mejor autocompletado.
* Mejor mantenibilidad.

---

## Modularidad

Las funcionalidades complejas están encapsuladas.

---

# Diseño Responsive

La aplicación está diseñada para:

* Desktop.
* Tablet.
* Mobile.

Mediante:

* Flexbox.
* Grid.
* TailwindCSS.

---

# Manejo de Estado

Actualmente se utiliza:

* React Context API.
* useState.
* useEffect.
* Custom Hooks.

---

# Posibles Mejoras Futuras

## Técnicas

* Implementar Zustand o Redux Toolkit.
* Testing con Jest y React Testing Library.
* Storybook.
* Internacionalización (i18n).
* Server Actions.
* Suspense y streaming.

---

## Funcionales

* Notificaciones en tiempo real.
* Chat en vivo.
* Integración con Google Calendar.
* Reservaciones inteligentes.
* IA para recomendaciones.

---

# Propuesta de Arquitectura Escalable

```text
app/
 ├── components/
 ├── features/
 ├── modules/
 ├── services/
 ├── hooks/
 ├── lib/
 ├── utils/
 └── types/
```

---

# Integración con Backend

La comunicación se realiza mediante APIs REST.

## Flujo esperado

```text
Frontend
   ↓
Fetch / Axios
   ↓
Express Backend
   ↓
Base de Datos
```

---

# Recomendaciones de Producción

## Variables de entorno

Nunca subir:

```bash
.env.local
```

---

## Build

```bash
npm run build
```

---

## Deployment sugerido

* Vercel
* Docker
* AWS
* Azure

---

# Dockerización Recomendada

## Dockerfile sugerido

```dockerfile
FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
```

---

# Seguridad

## Recomendaciones

* Validar tokens JWT.
* Middleware de autenticación.
* Sanitización de inputs.
* Protección de rutas privadas.
* Manejo seguro de variables de entorno.

---

# Flujo de Desarrollo Recomendado

```text
Nueva feature
   ↓
Crear carpeta feature
   ↓
Crear componentes
   ↓
Crear tipos
   ↓
Crear lógica
   ↓
Conectar API
   ↓
Testing
```

---

# Guía para Nuevos Desarrolladores

## 1. Instalar dependencias

```bash
npm install
```

---

## 2. Crear variables de entorno

```bash
.env.local
```

---

## 3. Ejecutar proyecto

```bash
npm run dev
```

---

## 4. Revisar estructura

Comenzar por:

```bash
src/app
```

---

# Roadmap Propuesto

| Etapa | Objetivo                      |
| ----- | ----------------------------- |
| 1     | Integrar backend real         |
| 2     | Persistencia de reservaciones |
| 3     | Notificaciones                |
| 4     | Roles y permisos              |
| 5     | IA y automatización           |
| 6     | Deploy productivo             |

---

# Estado Actual del Proyecto

## Implementado

* Estructura modular.
* Navegación.
* Layout privado.
* Sistema de reservaciones.
* Calendario.
* Agenda.
* Componentes reutilizables.
* Tipado TypeScript.

---

## Pendiente

* Persistencia completa.
* Integración backend final.
* Testing.
* Optimización.
* Seguridad avanzada.

---

# Créditos

Proyecto desarrollado como plataforma de colaboración y gestión de espacios de trabajo.

Tecnologías principales:

* Next.js
* React
* TypeScript
* TailwindCSS

---
