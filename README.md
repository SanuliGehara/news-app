# News Web Application

A full-stack news web application built with **Next.js** (React) for the frontend and **NestJS** (Node.js with TypeScript) for the backend API. The application uses a persistent PostgreSQL database (via Supabase) and is designed with clean code, security best practices, and a modern, responsive UI.

---

## Features

- **User Authentication**: Register and login with email/username and password. Google reCAPTCHA integrated for security.
- **Role-based Access Control**: Admins and editors can create, edit, and delete articles. All authenticated users can view and like articles.
- **News Article Management**: Full CRUD for articles, including title, content, category, and optional image URL.
- **Sorting & Filtering**: Sort articles by date or popularity. Filter by category. Pagination included.
- **Responsive UI**: Clean, mobile-friendly design with accessible modal dialogs and consistent theming.
- **Environment Variables**: All API URLs and secrets are managed via environment variables for security and flexibility.

---

## Tech Stack

- **Frontend**: Next.js (React), Tailwind CSS, react-icons, lucide-react
- **Backend**: NestJS, Prisma ORM, PostgreSQL (Supabase)
- **Authentication**: JWT, reCAPTCHA
- **Deployment**: Vercel (frontend & backend), Supabase (database)

---

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/news-app.git
cd news-app
```

### 2. Setup Environment Variables

#### Frontend (`/frontend/.env`):
```
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
```

#### Backend (`/backend/.env`):
```
DATABASE_URL=your-supabase-database-url
JWT_SECRET=your-jwt-secret
```

### 3. Install Dependencies
```bash
cd frontend && npm install
cd ../backend && npm install
```

### 4. Run Locally
- **Frontend**:
  ```bash
  cd frontend
  npm run dev
  ```
- **Backend**:
  ```bash
  cd backend
  npx prisma migrate dev # Run migrations
  npm run start:dev
  ```

### 5. Deploy
- **Frontend**: Deploy `/frontend` to Vercel. Set environment variables in the Vercel dashboard.
- **Backend**: Deploy `/backend` to Vercel. Make sure environment variables are set and Prisma Client is generated in the build step.
- **Database**: Use Supabase or any managed PostgreSQL service.

---


## Known Issues & Limitations
- Backend serverless deployment (Vercel) may require additional configuration for database pooling and CORS.
- Image upload is via URL only (no file uploads).
- Automated testing and OAuth login are not implemented.

---

## Future Enhancements
- Add OAuth (Google, GitHub) authentication
- Implement image file uploads
- Add User Management (Profile, Edit Profile, Change Password)
- Add search functionality
- Set up CI/CD and error monitoring

---

## Acknowledgements
- [Next.js](https://nextjs.org/)
- [NestJS](https://nestjs.com/)
- [Prisma](https://www.prisma.io/)
- [Supabase](https://supabase.com/)
- [Vercel](https://vercel.com/)
