# 🏡 StayNest

🔗 Live Link: stay-nest-alpha-five.vercel.app

StayNest is a premium, full-stack student accommodation portal built using the MERN/PERN stack. It enables students to find, bookmark, review, and book properties, while allowing property owners to list, manage, and track bookings dynamically.

---

## 🚀 Features

### For Students (Tenants)
- **Advanced Search & Filter**: Search properties by keywords, filter by city (e.g., Mumbai, Delhi, Bangalore, Pune, Hyderabad, Chennai), rent range, and room types (e.g., Single, Shared, Double).
- **Interactive Leaflet Maps**: View the exact geographical location of properties with integrated map views.
- **Booking Management**: Book accommodation for specific move-in dates and track the booking status (Pending, Accepted, Rejected, Completed).
- **Favorites & Bookmarks**: Save properties to a personalized "Favorites" list for quick access.
- **Reviews & Ratings**: Read reviews left by other students and post ratings and reviews on listed properties.
- **User Authentication**: Secure signup and login with profile customization.

### For Property Owners (Hosts)
- **Property Listing & Management**: Add new properties with details like title, rent, deposit, address, city, latitude, longitude, room type, available rooms, and amenities.
- **Multiple Image Uploads**: Show visual details of properties by uploading multiple images.
- **Interactive Booking Dashboard**: View booking requests from students and action them by accepting, rejecting, or completing them.
- **Manage Listed Properties**: Edit or delete property details as needed.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Forms**: [React Hook Form](https://react-hook-form.com/)
- **Maps**: [Leaflet](https://leafletjs.com/) & [React Leaflet](https://react-leaflet.js.org/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database ORM**: [Prisma Client](https://www.prisma.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (Hosted via Supabase or Local)
- **Authentication**: JWT (JSON Web Tokens) with HTTP-only cookies
- **Password Hashing**: `bcryptjs`
- **Development Tool**: `nodemon`

---

## 📂 Project Structure

```text
StayNest/
├── client/                 # React Frontend
│   ├── public/             # Static Assets
│   ├── src/
│   │   ├── assets/         # Images, fonts, styles
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Global Auth State (AuthContext.jsx)
│   │   ├── layouts/        # Layout wrappers
│   │   ├── pages/          # Page views (Home, Login, Bookings, etc.)
│   │   ├── services/       # Axios instance & API config (api.js)
│   │   ├── App.jsx         # App router and entry layout
│   │   ├── index.css       # Tailwind entry styles
│   │   └── main.jsx        # React DOM mounting
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Express Backend
│   ├── prisma/
│   │   ├── schema.prisma   # PostgreSQL DB schema models
│   │   ├── seed.js         # Database seed script for dummy data
│   │   └── migrations/     # Prisma migration history
│   ├── src/
│   │   ├── config/         # Database/Prisma client configs
│   │   ├── controllers/    # API controllers (auth, properties, bookings)
│   │   ├── middleware/     # Auth/Validation middlewares
│   │   ├── routes/         # Express routers
│   │   ├── utils/          # Help/Utility functions
│   │   └── app.js          # Express app server entry point
│   ├── .env                # Local backend environment variables
│   ├── prisma.config.ts
│   └── package.json
└── README.md               # Main Documentation
```

---

## 🗄️ Database Schema & Models

StayNest uses **Prisma** to manage relationships in **PostgreSQL**. Below are the core tables and relationships:

| Model | Description | Relationships |
| :--- | :--- | :--- |
| **`User`** | Stores registration info and roles (`STUDENT`, `OWNER`, `ADMIN`). | Has many `Property`, `Booking`, `Review`, `Favorite`. |
| **`Property`** | Represents accommodation listed by owners. Contains location, rent, room type, and details. | Belong to a `User` (owner). Has many `Image`, `Booking`, `Review`, `Favorite`, `Amenity`. |
| **`Amenity`** | Catalog of utilities (e.g., WiFi, AC, Gym, Parking). | Many-to-many relationship with `Property` via `PropertyAmenity`. |
| **`Image`** | Holds multiple image URLs for each property listing. | Belongs to a `Property`. |
| **`Booking`** | Tracks student bookings and statuses (`PENDING`, `ACCEPTED`, `REJECTED`, `CANCELLED`, `COMPLETED`). | Joins a `User` (student) and a `Property`. |
| **`Review`** | Stores rating (1-5 stars) and feedback text left by students. | Joins a `User` (student) and a `Property`. |
| **`Favorite`** | Handles property bookmarking for quick reference. | Unique composite index of `[property_id, student_id]`. |

---

## ⚙️ Setup & Installation

Follow these steps to run StayNest locally on your machine.

### Prerequisites
- Node.js installed (v18 or higher recommended)
- PostgreSQL database (Local or cloud-hosted database e.g., Supabase, Neon)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/StayNest.git
cd StayNest
```

### 2. Configure Environment Variables

#### Backend (`/server/.env`)
Create a `.env` file in the `server` directory and configure the following variables:
```env
PORT=5000
CLIENT_URL=http://localhost:5173

# Database Connection URI (PostgreSQL)
DATABASE_URL="postgresql://username:password@localhost:5432/staynest?schema=public"

# JWT Token Configuration
JWT_SECRET="your_fallback_super_secret_jwt_key_here"
JWT_EXPIRES_IN="30d"
```

#### Frontend (`/client/.env`)
Vite automatically falls back to `http://localhost:5000/api`. If you want to specify a custom API path, create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

---

### 3. Database Migration & Seeding
In the `server` directory, execute Prisma commands to set up database tables and populate it with sample properties:

```bash
cd server

# Install backend dependencies
npm install

# Run database migrations
npx prisma migrate dev --name init

# Seed the database with sample data
node prisma/seed.js
```

---

### 4. Running the Application

#### Start Backend Server
```bash
# From the server folder
npm run dev
```
The backend will run at `http://localhost:5000`.

#### Start Frontend Client
Open a new terminal tab/window:
```bash
cd client

# Install frontend dependencies
npm install

# Run Vite dev server
npm run dev
```
The frontend will run at `http://localhost:5173`. Open this URL in your web browser.

---

## 📡 API Documentation Reference

All API calls are prefixed with `/api`. Cookies are used for credentials (`withCredentials: true`).

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Registers a new user (`STUDENT` or `OWNER`).
- `POST /api/auth/login` — Log in user and set secure HTTP-only cookies.
- `POST /api/auth/logout` — Log out user and clear session cookies.

### Properties (`/api/properties`)
- `GET /api/properties` — Get list of properties with search queries (`search`, `city`, `room_type`, `minRent`, `maxRent`, `sort`).
- `GET /api/properties/:id` — Get details of a single property (including amenities, reviews, and owner details).
- `POST /api/properties` — Create a new property listing (Owner role required).
- `PUT /api/properties/:id` — Update property details (Owner only).
- `DELETE /api/properties/:id` — Remove a property (Owner/Admin only).

### Bookings (`/api/bookings`)
- `GET /api/bookings` — Fetch bookings for the logged-in user (shows requests for owners; submitted bookings for students).
- `POST /api/bookings` — Create a new booking request (Student only).
- `PATCH /api/bookings/:id` — Update status of a booking (e.g. Accept/Reject/Cancel).

### Favorites (`/api/favorites`)
- `GET /api/favorites` — Fetch all bookmarked properties for the logged-in student.
- `POST /api/favorites` — Add a property to favorites.
- `DELETE /api/favorites/:id` — Remove a property from favorites.

### Reviews (`/api/reviews`)
- `POST /api/reviews` — Post a new review and rating on a property (Student only).

---

## 🤝 Contributing
Contributions are what make the open source community such an amazing place to learn, inspire, and create.
1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License
Distributed under the ISC License. See `LICENSE` for more information.

Enjoy your stay with **StayNest**! 🏡
