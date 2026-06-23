# AW-Pitahaya

Biodiversity management system for pitahaya (dragon fruit) germplasm in Ecuador. A full-stack application for cataloging, monitoring, and conserving pitahaya accessions, diseases, and derived products.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript 6, Vite 8 |
| **UI Library** | Material UI 9 (MUI) |
| **Backend** | PHP 8.3+ |
| **Database** | PostgreSQL 17 |
| **Auth** | JWT (firebase/php-jwt, HMAC-SHA256) |
| **Testing** | Vitest 4, Testing Library |
| **Static Analysis** | ESLint, Prettier, TypeScript |

## Prerequisites

- **Node.js** 22+ (with npm)
- **PHP** 8.3+
- **PostgreSQL** 17
- **Composer** (PHP dependency manager)

## Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/<your-org>/aw-pitahaya.git
cd aw-pitahaya

# 2. Install frontend dependencies
npm install

# 3. Install backend dependencies
composer install

# 4. Create the PostgreSQL database
psql -U postgres -c "CREATE DATABASE bd_pitahaya;"

# 5. Copy and configure environment variables
cp .env.example .env
# Edit .env with your database credentials and a secure JWT secret

# 6. Import database schema (if provided)
# psql -U postgres -d bd_pitahaya -f database/schema.sql

# 7. Start the frontend dev server
npm run dev

# 8. Start the PHP backend (separate terminal)
php -S localhost:8000 -t api/
```

The Vite dev server proxies `/api` requests to `http://localhost:8000`.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check and bundle for production |
| `npm run lint` | Run ESLint across the project |
| `npm run format` | Check formatting with Prettier |
| `npm run format:fix` | Auto-format all source files |
| `npm test` | Run Vitest test suite |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run preview` | Preview the production build locally |

## Project Structure

```
aw-pitahaya/
├── api/                    # PHP backend (REST API)
│   ├── admin/              # Admin-only endpoints (auth required)
│   ├── config.php          # Database connection (PDO + PostgreSQL)
│   ├── jwt.php             # JWT generation and verification
│   ├── login.php           # Authentication
│   ├── registro.php        # User registration
│   ├── accesiones.php      # Public accession listing
│   ├── accesion.php        # Accession detail
│   ├── buscar.php          # Full-text search
│   ├── detecciones.php     # Disease detections
│   ├── enfermedades.php    # Disease catalog
│   ├── fotos.php           # Photo listing
│   ├── mis-solicitudes.php # User seed requests
│   ├── noticias.php        # News listing
│   ├── productos.php       # Product listing
│   ├── solicitar.php       # Seed request submission
│   ├── stats.php           # Public statistics
│   ├── subir-foto.php      # Photo upload
│   ├── actualizar-foto.php # Photo update
│   ├── eliminar-foto.php   # Photo deletion
│   └── exportar.php        # Data export
├── src/                    # React frontend
│   ├── components/         # Reusable UI components
│   ├── Pages/              # Route pages
│   │   ├── Admin/          # Admin dashboard and CRUD pages
│   │   ├── Catalogos/      # Accession catalogs
│   │   ├── Home/           # Landing page
│   │   ├── Investigacion/  # Research/disease tracking
│   │   └── Noticias/       # News section
│   ├── config/             # App configuration (constants)
│   ├── contexts/           # React contexts (auth)
│   ├── services/           # API client and error handling
│   ├── test/               # Test utilities and setup
│   └── types/              # TypeScript type definitions
├── public/                 # Static assets
└── dist/                   # Production build output
```

## API Overview

### Public Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/accesiones.php` | GET | List all pitahaya accessions |
| `/api/accesion.php?codigo=` | GET | Get full accession details |
| `/api/buscar.php?q=` | GET | Search accessions by term |
| `/api/enfermedades.php` | GET | List diseases with treatments |
| `/api/detecciones.php` | GET | List disease detections |
| `/api/noticias.php` | GET | List published news |
| `/api/productos.php` | GET | List derived products |
| `/api/fotos.php?tipo=&id=` | GET | List photos by entity |
| `/api/stats.php` | GET | Public dashboard statistics |
| `/api/login.php` | POST | Authenticate user |
| `/api/registro.php` | POST | Register new user |
| `/api/solicitar.php` | POST | Submit seed request |
| `/api/subir-foto.php` | POST | Upload photo (multipart) |
| `/api/actualizar-foto.php` | POST | Update photo description |
| `/api/eliminar-foto.php` | POST | Delete photo |

### Admin Endpoints (JWT required)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/crear-accesion.php` | POST | Create accession |
| `/api/admin/actualizar-accesion.php` | POST | Update accession |
| `/api/admin/eliminar-accesion.php` | POST | Delete accession |
| `/api/admin/crear-noticia.php` | POST | Publish news article |
| `/api/admin/actualizar-noticia.php` | POST | Update news article |
| `/api/admin/eliminar-noticia.php` | POST | Delete news article |
| `/api/admin/crear-enfermedad.php` | POST | Register disease |
| `/api/admin/actualizar-enfermedad.php` | POST | Update disease |
| `/api/admin/eliminar-enfermedad.php` | POST | Delete disease |
| `/api/admin/crear-producto.php` | POST | Register product |
| `/api/admin/actualizar-producto.php` | POST | Update product |
| `/api/admin/eliminar-producto.php` | POST | Delete product |
| `/api/admin/crear-inventario.php` | POST | Add inventory entry |
| `/api/admin/actualizar-inventario.php` | POST | Update inventory |
| `/api/admin/eliminar-inventario.php` | POST | Delete inventory |
| `/api/admin/solicitud.php` | POST | Update request status |
| `/api/admin/eliminar-solicitud.php` | POST | Delete seed request |
| `/api/admin/solicitudes.php` | GET | List all seed requests |
| `/api/admin/noticias.php` | GET | List all news (admin) |
| `/api/admin/enfermedades.php` | GET | List diseases (admin) |
| `/api/admin/tecnicos.php` | GET | List registered technicians |
| `/api/admin/propietarios.php` | GET | List accession owners |
| `/api/admin/donantes.php` | GET | list germplasm donors |
| `/api/admin/listar-inventario.php` | GET | List inventory items |
| `/api/admin/resumen.php` | GET | Admin dashboard summary |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | Database name | `bd_pitahaya` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | — |
| `JWT_SECRET` | Secret key for JWT signing | — |
| `VITE_API_BASE` | API base path for Vite proxy | `/api` |

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feat/my-feature`).
3. Make your changes and ensure tests pass (`npm test`).
4. Run the linter (`npm run lint`) and format check (`npm run format`).
5. Commit using conventional commits.
6. Open a pull request against `main`.
