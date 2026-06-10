# TalentFlow AI - Job Portal Platform

## Project Overview

TalentFlow AI is a full-stack job portal web application built with React on the frontend and Node.js with Express on the backend, connected to a MongoDB Atlas cloud database. The platform supports three types of users: candidates (job seekers), recruiters, and administrators. Each role has a dedicated dashboard with a distinct set of features.

The application is deployed with the frontend on Vercel and the backend on Render. A CI/CD pipeline using GitHub Actions automatically builds and deploys the application on every push to the main branch.

---

## Live URLs

- Frontend: https://talent-flow-beige-pi.vercel.app
- Backend API: https://talentflow-n849.onrender.com

---

## Test Credentials

Use the following credentials to log in and explore each role.

### Candidate Account

| Field    | Value                |
|----------|----------------------|
| Email    | akhila@gmail.com     |
| Password | 123456            |
| Role     | user                 |

### Recruiter Account

| Field    | Value            |
|----------|------------------|
| Email    | ramya@gmail.com  |
| Password | 123456           |
| Role     | recruiter        |

### Admin Account

| Field    | Value                  |
|----------|------------------------|
| Email    | hr@company.com   |
| Password | 123456              |
| Role     | admin                  |

> Note: If any of the above accounts do not exist in the database, register a new account as user or recruiter if admin needed manually change in DB role - "user" to "admin"

---

## Tech Stack

### Frontend

- React 18 with Vite
- Redux Toolkit for global state management
- React Router DOM for client-side routing
- Axios for API communication
- React Hot Toast for notifications
- Tailwind CSS for styling

### Backend

- Node.js with Express 5
- MongoDB with Mongoose ODM
- JSON Web Tokens (JWT) for authentication
- bcryptjs for password hashing
- Multer for resume file uploads
- dotenv for environment variable management
- CORS configured for cross-origin access

### Database

- MongoDB Atlas (cloud-hosted)
- Collections: Users, Jobs, Applications

### Deployment

- Frontend: Vercel
- Backend: Render (free tier)
- File storage: Local uploads directory served as static files

---

## What Has Been Built

### Authentication System

- User registration with name, email, password, and role selection
- Login with JWT token generation and 7-day expiry
- Protected routes based on role (user, recruiter, admin)
- Token stored in localStorage and sent via Authorization header on every request
- Auto-redirect to the correct dashboard based on role after login
- Passwords hashed using bcrypt with 10 salt rounds

### Candidate Dashboard

- Browse all active job listings posted by recruiters
- Search jobs by title, company, location, or skills
- Filter jobs by type: Full Time, Part Time, Internship, Remote
- Recommended Jobs tab that matches available jobs against the candidate profile skills
- Job application modal with the following form fields:
  - Full name
  - Resume upload (PDF, DOC, DOCX, max 10MB)
  - Candidate type toggle: Student or Experienced
  - Student fields: college name, degree
  - Experienced fields: current company, years of experience, current CTC
  - Expected CTC (required for both types)
- Applied Jobs tab showing all submitted applications with current status
- Profile widget on the right sidebar showing profile completion strength
- Profile Edit Modal to update name, title, skills, education, experience, and salary details
- Real-time notification bell that alerts when new jobs are posted (polls every 15 seconds)
- Meta AI Assistant tab with chat interface (see limitations section below)

### Recruiter Dashboard

- Manage Listings tab showing all jobs posted by the logged-in recruiter
- Search and filter job listings by title, company, location, or type
- Each job card displays:
  - Title, company, location, job type, salary, domain, required skills
  - Application funnel with count of shortlisted, new, and rejected applications
  - Button to view all candidates for that specific job
  - Delete button with confirmation
- Post New Job tab with full job creation form including title, company, domain, location, type, salary, description, and skills
- Candidates ATS (Applicant Tracking System) tab:
  - Filter applications by job
  - Filter by status: All, Applied, Shortlisted, Rejected
  - Search by applicant name, email, college, company, or skills
  - Each candidate card shows full application details, skill match highlights, resume link, and Shortlist and Reject action buttons
  - Real-time notification bell that alerts when a new application is received

### Admin Dashboard

- Overview tab with four stat cards: total candidates, total recruiters, total active jobs, total applications
- Recent users and recent jobs lists on the overview page
- Application status breakdown by category
- Manage Users tab: searchable and filterable table of all users with delete capability
- All Jobs tab: searchable table of every job on the platform with delete capability
- Applications tab: full application log searchable by applicant name or job title and filterable by status

### Backend API

#### Auth Routes (/api/auth)
- POST /register
- POST /login

#### Job Routes (/api/jobs)
- GET / - fetch all jobs
- POST / - create a job (recruiter only)
- DELETE /:id - delete a job

#### Application Routes (/api/applications)
- POST /apply/:jobId - submit an application
- GET /my - get the candidate's own applications
- GET /recruiter - get applications for the recruiter's jobs
- PUT /:id/status - update application status

#### Profile Routes (/api/profile)
- GET / - fetch profile
- PUT / - update profile
- POST /upload-resume - upload resume file

#### Admin Routes (/api/admin)
- GET /stats
- GET /users
- DELETE /users/:id
- GET /jobs
- DELETE /jobs/:id
- GET /applications

#### AI Routes (/api/ai)
- POST /chat - send a message to the Meta AI assistant

---



### Meta AI Assistant

The Meta AI chat interface and the backend API route are fully built and connected. The backend sends the user profile and all available job listings to the Google Gemini API and expects a structured JSON response containing a reply message and recommended job IDs.

The AI assistant requires a valid Gemini API key set in the backend environment file. Without a valid key or when the free tier quota is exceeded, the system automatically falls back to a local skill-matching algorithm that scores jobs by how well they match the candidate's skills and title.

For full AI-powered conversational responses, the module would ideally be trained or fine-tuned on job-matching data using NLP or ML techniques. That level of AI training is outside the scope of what has been built here.

---

## Folder Structure

```
TalentFlow/
  backend/
    config/
      db.js
    controllers/
      authController.js
      jobController.js
      applicationController.js
      profileController.js
      adminController.js
      aiController.js
    middleware/
      authMiddleware.js
      adminMiddleware.js
    models/
      User.js
      Job.js
      Application.js
    routes/
      authRoutes.js
      jobRoutes.js
      applicationRoutes.js
      profileRoutes.js
      adminRoutes.js
      aiRoutes.js
    uploads/
    server.js
    .env

  frontend/
    src/
      api/
        axios.js
        aiApi.js
        profileApi.js
      components/
        admin/
          AdminSidebar.jsx
        recruiter/
          RecruiterSidebar.jsx
          RecruiterJobCard.jsx
          PostJobForm.jsx
          CandidatesManager.jsx
        user/
          UserSidebar.jsx
          JobCard.jsx
          JobList.jsx
          AppliedJobs.jsx
          ProfileWidget.jsx
          ProfileEditModal.jsx
          MetaAIChat.jsx
        common/
          GoogleInput.jsx
      pages/
        Login.jsx
        Register.jsx
        UserDashboard.jsx
        RecruiterDashboard.jsx
        AdminDashboard.jsx
      redux/
        store.js
        slices/
          authSlice.js
          jobSlice.js
          applicationSlice.js
          profileSlice.js
          adminSlice.js
        actions/
          authActions.js
          adminActions.js
      routes/
        ProtectedRoute.jsx
      utils/
        validation.js
      App.jsx
      main.jsx
    vite.config.js
```

---

## Environment Variables

### Backend (.env)

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/talentflow?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
```

### Frontend

In local development no frontend .env file is needed. The Vite proxy in vite.config.js forwards all /api requests to localhost:5000 automatically, which avoids CORS issues.

For production (Vercel), set the following environment variable in the Vercel dashboard:

```
VITE_API_URL=https://your-render-backend.onrender.com
```

---

## How to Run Locally

### Backend

```
cd backend
npm install
npm run dev
```

Runs at http://localhost:5000

### Frontend

```
cd frontend
npm install
npm run dev
```

Runs at http://localhost:5174

---

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration and continuous deployment. The pipeline is defined in [.github/workflows/deploy.yml](file:///c:/Users/SPSOFT/TalentFlow/.github/workflows/deploy.yml).

### How it works

The pipeline is triggered automatically on every push or pull request to the main or master branch. It runs two sequential jobs:

**Job 1: Build and Test** (runs on every push and pull request)

- Checks out the repository code
- Sets up Node.js 18 on an Ubuntu virtual machine
- Caches npm dependencies for faster future runs
- Runs npm ci in the backend directory to install all backend dependencies
- Runs npm ci in the frontend directory to install all frontend dependencies
- Runs npm run build in the frontend directory to verify the production build compiles without errors

If the build fails at any step, the pipeline stops. The second job does not run, which prevents broken code from being deployed to production.

**Job 2: Deploy to Vercel** (runs only on push to main or master, after Job 1 passes)

- Checks out the repository code
- Uses the amondnet/vercel-action to trigger a production deployment on Vercel automatically

### Required GitHub Secrets

These three secrets must be set in GitHub repository Settings > Secrets and variables > Actions:

| Secret Name       | Where to Find It                              |
|-------------------|-----------------------------------------------|
| VERCEL_TOKEN      | Vercel dashboard > Account Settings > Tokens  |
| VERCEL_ORG_ID     | Vercel project settings page                  |
| VERCEL_PROJECT_ID | Vercel project settings page                  |

### Benefits

- Code is automatically verified to build before any deployment
- Deployment to production requires no manual steps after pushing to GitHub
- Pull requests are checked for build errors before they can be merged
- Every deployment is logged in the GitHub Actions tab with full run history

---

## Key Design Decisions

- Role-based access control is enforced on both frontend protected routes and backend middleware
- JWT tokens expire after 7 days
- The Vite proxy handles local development API calls to avoid CORS
- The backend CORS configuration explicitly whitelists the Vercel frontend URL and localhost ports 5173 and 5174
- MongoDB Atlas Network Access is set to allow all IPs to support Render's dynamic outbound addresses
- The backend retries the MongoDB connection every 5 seconds on failure instead of calling process.exit(1), which would cause Render to show a 502 error
- CI/CD is handled by GitHub Actions which ensures no broken build ever reaches the Vercel production environment
