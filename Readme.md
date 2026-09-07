# 🚀 DevTinder

**DevTinder** is a full-stack developer networking platform that helps developers discover, connect, and chat with other developers based on their interests and skills.

🌐 **Live Demo:** https://tinderfordev.online/

## ✨ Features

* 🔐 Secure user authentication with JWT and cookies
* 👤 Create and update developer profiles
* 🔍 Discover and explore developers
* 🤝 Send, accept, and reject connection requests
* 💬 Real-time chat using Socket.IO
* 🖼️ Profile image upload with Cloudinary
* 📱 Responsive and modern UI
* 🔒 Protected routes and authentication middleware

## 🛠️ Tech Stack

**Frontend**

* React
* Redux Toolkit
* React Router
* Tailwind CSS
* Axios
* Socket.IO Client
* Vite

**Backend**

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Socket.IO
* Cloudinary

## 📁 Project Structure

```text
devtinder-fullstack/
├── backend/
│   └── src/
│       ├── config/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── utils/
│       └── app.js
│
└── frontend/
    └── src/
        ├── components/
        ├── utils/
        ├── App.jsx
        └── main.jsx
```

## ⚙️ Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/charansaigompa/devtinder-fullstack.git
cd devtinder-fullstack
```

### 2. Start the backend

```bash
cd backend
npm install
npm run dev
```

### 3. Start the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

### 4. Environment Variables

Configure the required environment variables for the backend, including:

```env
MONGODB_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Configure the frontend API URL according to your local backend setup.

## 📌 Highlights

* RESTful API architecture
* JWT-based authentication
* MongoDB data modeling with Mongoose
* Real-time communication with Socket.IO
* Cloudinary-based image management
* Modular backend routing and middleware

## 👨‍💻 Author

**Charan Sai Gompa**

[GitHub](https://github.com/charansaigompa)
