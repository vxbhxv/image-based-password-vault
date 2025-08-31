Image-Based Password Vault
A secure, modern password manager using image-driven vault keys and a master password, built with React and Node.js/Express.

Features
Image Hash Security: Use an image as a vault key (creates a hash; image is not uploaded).

Master Password: Strong encryption using a double layer (image + password).

Full CRUD Operations: Add, update, view, and delete credentials securely.

Intuitive UI: Responsive interface styled with Tailwind and custom CSS.

MongoDB Backend: All password data stored encrypted in MongoDB.

RESTful API: Robust API for vault operations.

Technologies
Layer	Tools/Libraries
Frontend	React, Axios, Tailwind CSS, Inter UI Font
Backend	Node.js, Express, MongoDB, Mongoose, bcrypt, dotenv, cors
Testing	Jest (@testing-library/react)
Quick Start (Windows)
Prerequisites
Node.js (v18 or later)

npm or yarn

MongoDB (local or Atlas)

1. Clone the Repo
bash
git clone https://github.com/yourusername/image-password-vault.git
cd image-password-vault
2. Install Dependencies
Client (React Frontend):

bash
cd client
npm install
Server (Express Backend):

bash
cd ../server
npm install
3. Environment Setup
Set your MongoDB connection string in .env or directly within server.js:

text
MONGO_URI=mongodb://localhost:27017/vaultdb
PORT=5001
4. Running the App
Start the backend server:

bash
npm start
(Or use npx nodemon for hot reload)

Start the React frontend:

bash
cd ../client
npm start
The app should open at http://localhost:3000.

Usage
Upload an image: Used to hash and identify the vault; image stays on your device.

Enter master password: Required for vault encryption (minimum 8 characters).

Manage credentials: Add, edit, and delete within the vault interface.

Lock/Logout: Secure your session by locking the vault.

API Endpoints
Method	Route	Purpose
GET	/api/vault/:imageHash	Check if vault exists
POST	/api/vault/create	Create a new vault
POST	/api/vault/unlock	Unlock an existing vault
PUT	/api/vault/:imageHash	Update vault data

bash
git remote set-url origin https://github.com/yourusername/image-password-vault.git