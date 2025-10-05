# BlogBee

A modern, fast, and user-friendly blogging platform built for developers and content creators.

## 🚀 Demo

Check out the live demo: [BlogBee Demo](https://blogbee.site)

## ✨ Features

- **📝 Rich Text Editor**: Write and format your blog posts with ease using a modern WYSIWYG editor
- **📱 Responsive Design**: Perfect viewing experience across all devices
- **🔍 SEO Optimised**: Built-in SEO features to help your content reach more readers
- **⚡ Fast Performance**: Lightweight and optimized for speed
- **🏷️ Categories System**: Organise your posts with categories
- **🔐 User Authentication**: Secure login and user management
- **🌙 Dark/Light Mode**: Toggle between dark and light themes
- **🔧 Easy Deployment**: Simple setup and deployment process

## 🛠️ Built With

- **Frontend**: Next JS, Tailwind CSS, Typescript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Deployment**: VPS with Docker Stack and Nginx

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- [Node.js](https://nodejs.org/) (v14.0 or later)
- [npm](https://www.npmjs.com/) (v6.0 or later)
- [MongoDB](https://www.mongodb.com/) (v4.0 or later)
- [Git](https://git-scm.com/)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/manish591/blogbee.git
   cd blogbee

2. Install dependencies
   ```bash
   pnpm install
3. Start database ( Make sure Docker is installed locally)
   ```bash
   docker run -p 27017:27017 -d --name blogbee-mongo mongo
4. Set up backend
   ```bash
   cd apps/backend
5. Setup env
   ```bash
   MONGODB_URI=mongodb://localhost:27017
6. Run backend locally
   ```bash
   pnpm run dev
7. Run frontend
   ```bash
   cd ../frontend
   pnpm run dev
8. Open Browser at [localhost:3000](http://localhost:3000)







   
