# Full Stack Web App

Simple full‑stack project with authentication, OTP login, and a product management dashboard.

## Tech Stack

* **Frontend:** React.js
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Auth:** OTP based login

## Features

* Login using email or phone number
* OTP shown for a few seconds and validated
* Protected home page after login
* Sidebar with **Home** and **Products**
* Products page with **Publish / Unpublish** options
* Create and manage products

## Project Structure

```
root
 ├─ frontend/   # React app
 ├─ backend/    # Express API
 └─ README.md
```

## Getting Started

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd <repo-name>
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key
```

Run backend:

```bash
npm run dev
# or
npm start
```

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:

```
VITE_BACKEND_URL=http://localhost:5000
```

Run frontend:

```bash
npm run dev
```

## API Overview (Backend)

* Auth routes for OTP login & verification
* Product routes for create, list, publish/unpublish

## Deployment

* Frontend can be deployed on **Vercel**
* Backend can be deployed on **Render**
* Update environment variables accordingly

## Notes

* `eslint.config.js` is part of the frontend setup and can be committed.
* Make sure backend URL is correct in frontend env.

## Author

Built by abhishek
