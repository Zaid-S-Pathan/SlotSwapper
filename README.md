# 🔄 SlotSwapper

A web application that helps users manage and swap time slots for events. Built with React (frontend) and Django REST Framework (backend).

## Table of Contents

1. General Information
2. Requirements
3. Installation
4. Usage
5. API Endpoints
6. Project Structure
7. Deployment
8. Contact

## 1. General Information

SlotSwapper is a web-based platform that enables users to:
- Create and manage time slots for events
- List slots available for swapping
- Request and respond to slot swap requests
- Manage a personal dashboard of events

### Features
- User authentication with JWT tokens
- Create and manage personal events
- Browse available slots in the marketplace
- Request and accept slot swaps
- Real-time status updates for swap requests
- Responsive design for desktop and mobile

[Screenshot: Homepage/Dashboard overview]

## 2. Requirements

### Frontend
- Node.js (v18+)
- React 19.x
- React Router DOM 7.x
- Axios for API requests
- Vite as build tool

### Backend
- Python 3.13
- Django 5.2
- Django REST Framework
- SimpleJWT for authentication
- PostgreSQL (production)
- SQLite (development)

## 3. Installation

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Zaid-S-Pathan/SlotSwapper.git
   cd SlotSwapper/Backend
   ```

2. **Set up Python environment**
   ```bash
   python -m venv env
   source env/bin/activate  # On Windows: .\env\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Configure environment**
   - Copy `.env.example` to `.env`
   - Update settings (database, secret key, etc.)

4. **Run migrations**
   ```bash
   python manage.py migrate
   ```

5. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

[Screenshot: Successful backend setup/running]

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   - Set up `.env` with your backend API URL
   ```
   VITE_API_URL=http://localhost:8000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

[Screenshot: Frontend running in development]

## 4. Usage

### User Registration & Login
1. Visit the signup page to create an account
2. Log in with your credentials
3. You'll be redirected to your dashboard

[Screenshot: Signup/Login process]

### Creating Events
1. Click "Add Event" in your dashboard
2. Fill in event details (title, time, etc.)
3. Choose if the slot is available for swapping

[Screenshot: Event creation form]

### Requesting Swaps
1. Browse available slots in the Marketplace
2. Select a slot you want
3. Choose your slot to offer in exchange
4. Submit swap request

[Screenshot: Swap request flow]

## 5. API Endpoints

### Authentication Endpoints

| Method | URL | Description | Request Body |
|--------|-----|-------------|--------------|
| POST | `/api/register/` | Register new user | `{ "username": "user", "email": "user@example.com", "password": "pass" }` |
| POST | `/api/token/` | Get JWT tokens | `{ "username": "user", "password": "pass" }` |

### Event Endpoints

| Method | URL | Description | Request Body |
|--------|-----|-------------|--------------|
| GET | `/api/events/` | List user's events | - |
| POST | `/api/events/` | Create new event | `{ "title": "Event", "start_time": "...", "end_time": "...", "status": "BUSY" }` |
| PATCH | `/api/events/<id>/` | Update event | `{ "status": "SWAPPABLE" }` |

### Swap Request Endpoints

| Method | URL | Description | Request Body |
|--------|-----|-------------|--------------|
| POST | `/api/swap-request/` | Create swap request | `{ "my_slot_id": 1, "their_slot_id": 2 }` |
| POST | `/api/swap-response/<id>/` | Respond to request | `{ "accept": true }` |

[Screenshot: API response example]

## 6. Project Structure

```
SlotSwapper/
├── Backend/
│   ├── api/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── serializers.py
│   ├── core/
│   │   └── settings.py
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   └── App.jsx
    ├── package.json
    └── vite.config.js
```

## 7. Deployment

### Backend (Render)
1. Create a new Web Service
2. Connect your GitHub repository
3. Configure environment variables:
   - ALLOWED_HOSTS
   - DATABASE_URL
   - SECRET_KEY
   - DEBUG=False

### Frontend (Vercel)
1. Import your repository
2. Configure environment variables:
   - VITE_API_URL (production backend URL)
3. Deploy and verify rewrite rules work

[Screenshot: Deployed application]

## 8. Contact

- **Email:** mohammedzaid.s.pathan@gmail.com
- **GitHub:** [Zaid-S-Pathan](https://github.com/Zaid-S-Pathan)
- **Project Link:** [SlotSwapper](https://github.com/Zaid-S-Pathan/SlotSwapper)

---

Screenshots needed:
1. Homepage/Dashboard overview
2. Backend setup success
3. Frontend development server
4. Signup/Login interface
5. Event creation form
6. Swap request workflow
7. API response example
8. Deployed application view