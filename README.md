# TalentFlow AI - Minimalist Navy & White Job Portal

TalentFlow AI is a modern, full-stack recruitment and job-seeking platform built using **Node.js, Express, React, Redux (Toolkit), and Tailwind CSS**. The system is styled with a sleek, minimalist **Navy Blue & White** high-contrast theme, incorporating outlined material-style input fields, strict recruiter data ownership guards, and custom form validation.

---

## 🚀 Key Features

### 1. User Roles & Workflows
*   **Applicants (Job Seekers)**:
    *   Browse active job listings with text and type filters.
    *   Submit detailed applications via a dynamic profile modal.
    *   **Conditional Inputs**:
        *   **Students**: Prompts for College / University and Degree / Major.
        *   **Experienced Professionals**: Prompts for Current/Last Company, Years of Experience, and Current CTC.
        *   **Shared**: Prompts for Resume Link (URL validation) and Expected CTC.
    *   Track application status (Applied, Shortlisted, Rejected) on the "Applied Jobs" tab.
*   **Recruiters (Employers)**:
    *   Post new job opportunities via a detailed form.
    *   **Strict Security Guard**: Recruiters can only view and manage applicants for jobs they personally created.
    *   Review candidate profiles, download/view resume URLs, and instantly update statuses via **Shortlist** and **Reject** buttons.
*   **Administrators (HR)**:
    *   Access the **Admin Control Center** overview showing live metrics:
        *   Total Candidates
        *   Total Recruiters
        *   Active Jobs
        *   Applications Submitted

### 2. High-Contrast Navy & White Theme
*   Designed using custom CSS & Tailwind.
*   Deep Navy Blue background (`#0a1128`) for authentication views, sidebar headers, and primary UI elements.
*   Polished white cards and clean outlines for optimal readability.

### 3. Centralized Custom Validation & Inputs
*   All forms reject native HTML5 tooltip bubbles in favor of custom-styled error labels.
*   Dynamic red asterisks (`*`) render next to required labels only (optional fields, like salary range or skills, display no asterisk).
*   Centralized validation module (`frontend/src/utils/validation.js`) ensures strict validation of emails, password lengths, URLs, and numbers.

---

## 🛠️ Architecture & Stack

### Backend (`/backend`)
*   **Runtime & Server**: Node.js & Express
*   **Database**: MongoDB Atlas (Mongoose Object Modeling)
*   **Authentication**: JWT (JSON Web Tokens) with custom headers.
*   **Endpoints**:
    *   `/api/auth` - Register & Login operations.
    *   `/api/jobs` - Job creation and queries.
    *   `/api/admin` - Administrative statistics lookup (Admin role check).
    *   `/api/applications` - Submit applications, update candidate statuses (ownership-protected).

### Frontend (`/frontend`)
*   **Bundler & Library**: Vite & React
*   **State Management**: Redux Toolkit (using slices, selectors, and API thunks)
*   **Styling**: Tailwind CSS & custom styled Outlined Components
*   **Notifications**: React Hot Toast

---

## 💻 Local Setup Instructions

### Prerequisites
*   Node.js (v18 or higher recommended)
*   Git
*   MongoDB connection URI

### 1. Clone & Initialize
```bash
git clone https://github.com/<your-username>/TalentFlow-AI.git
cd TalentFlow-AI
```

### 2. Configure Backend
Navigate to the backend directory and create a `.env` file:
```bash
cd backend
npm install
```
Add the following keys in your `backend/.env` file:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/talentflow
JWT_SECRET=your_jwt_signing_secret_key
NODE_ENV=development
```

### 3. Run Backend Server
```bash
npm run dev
```
The server will start on port `5000` and output:
`Server running on port 5000` & `MongoDB Connected: ...`

### 4. Configure & Run Frontend
Navigate to the frontend directory:
```bash
cd ../frontend
npm install
npm run dev
```
The Vite dev server will spin up (e.g., `http://localhost:5173/` or `5174`). Vite is configured with a dev server proxy forwarding all `/api` requests to the backend on port `5000` to prevent CORS issues.

---

## 🧪 Testing Credentials

Use the following pre-loaded accounts to test user roles (Passwords are encrypted in DB):

1.  **Candidate (Applicant)**:
    *   **Email**: `akhila@test.com`
    *   **Password**: `123456`
2.  **Recruiter (Employer)**:
    *   **Email**: `ramya@gmail.com`
    *   **Password**: `123456`
3.  **Admin (HR)**:
    *   **Email**: `hr@company.com`
    *   **Password**: `123456`

*(Alternatively, register a new account on the `/register` view. Once registration is complete, you will be automatically redirected to `/login` with your email pre-filled).*

---

## 🛡️ CI/CD & Vercel Deployment

A GitHub Actions pipeline (`.github/workflows/deploy.yml`) is included in the project:
1.  **Build Phase**: Staging environment verification that installs dependencies and builds the Vite frontend.
2.  **Deploy Phase**: Automatically triggers on pushes to the `main` or `master` branches, deploying to Vercel.

### Required Secrets for GitHub Actions
Add these secrets in your GitHub Repository Settings (`Settings > Secrets and variables > Actions`):
*   `VERCEL_TOKEN`: Vercel Personal Access Token.
*   `VERCEL_ORG_ID`: Vercel account or team organization ID.
*   `VERCEL_PROJECT_ID`: Vercel project ID.

A unified `vercel.json` configuration in the root directory manages routing, allowing serverless Node execution of `/api/*` requests while serving the static Vite client under `/`.
