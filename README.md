# Image-Based Password Vault
A secure, modern password manager using **image-driven vault keys** and a **master password**, built with **React, Node.js/Express, and MongoDB**.  

---

## Features
- **Image Hash Security** – Use an image as a vault key (hashed locally, never uploaded).  
- **Master Password** – Strong AES encryption (image hash + password).  
- **Full CRUD Operations** – Add, update, view, and delete credentials securely.  
- **Intuitive UI** – Responsive interface styled with **Tailwind CSS**.  
- **MongoDB Backend** – All password data is stored **encrypted** in MongoDB.  
- **RESTful API** – Robust API for vault operations.  

---

## Technologies
| Layer       | Tools & Libraries |
|-------------|-------------------|
| Frontend    | React, Axios, Tailwind CSS |
| Backend     | Node.js, Express, MongoDB, Mongoose, bcrypt, dotenv, cors |
| Testing     | Jest (@testing-library/react) |
| DevOps      | Docker, Docker Compose |

---

## Quick Start (Docker Recommended)

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) & Docker Compose installed  

### Run with Docker
```bash
docker-compose up -d --build
```

- Frontend → [http://localhost:3000](http://localhost:3000)  
- Backend API → [http://localhost:5001/api/vault](http://localhost:5001/api/vault)  
- MongoDB → `localhost:27017`  

### Stop containers
```bash
docker-compose down
```

---

## Quick Start (Local Development)

### Prerequisites
- Node.js (v18 or later)  
- npm or yarn  
- MongoDB (local or Atlas)  

### 1. Clone the Repo
```bash
git clone https://github.com/yourusername/image-password-vault.git
cd image-password-vault
```

### 2. Install Dependencies
Frontend:
```bash
cd client
npm install
```

Backend:
```bash
cd ../server
npm install
```

### 3. Environment Setup
Create `.env` files:

**server/.env**
```env
MONGO_URI=mongodb://localhost:27017/imgpass
PORT=5001
```

### 4. Run the App
Start backend:
```bash
cd server
npm start   # or: npx nodemon
```

Start frontend:
```bash
cd ../client
npm start
```

App will be available at: **http://localhost:3000**  

---

## Usage
1. **Upload an image** → used to hash and identify the vault (image never leaves your device).  
2. **Enter a master password** → used for vault encryption (minimum 8 characters).  
3. **Manage credentials** → Add, edit, and delete securely in the vault UI.  
4. **Lock vault** → Clear sensitive data from session anytime.  

---

## API Endpoints
| Method | Route                  | Purpose              |
|--------|------------------------|----------------------|
| GET    | `/api/vault/:imageHash` | Check if vault exists |
| POST   | `/api/vault/create`     | Create a new vault    |
| POST   | `/api/vault/unlock`     | Unlock an existing vault |
| PUT    | `/api/vault/:imageHash` | Update vault data     |

---