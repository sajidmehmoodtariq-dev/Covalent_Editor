# Covalent ⚛️

## A Real-Time Collaborative Code Editor

Covalent is a high-performance, real-time collaborative coding environment. Built with a focus on containerization and low-latency synchronization, it allows multiple developers to edit code simultaneously in a shared workspace.

## 🚀 Features

* **Real-Time Synchronization:** Powered by Yjs and WebSockets, ensuring conflict-free, sub-millisecond document merging.
* **Presence & Awareness:** Live tracking of connected users, displaying exactly who is currently active in the session.
* **Monaco Editor Integration:** Utilizes the engine behind VS Code for a familiar, feature-rich coding experience.
* **Unified Docker Architecture:** Implements a highly optimized, multi-stage Docker build combining the Vite frontend and Express backend into a single lightweight Alpine Linux container.
* **Automated CI/CD Pipeline:** Fully integrated GitHub Actions workflow for zero-downtime automated deployments to AWS EC2.

## 🛠️ Tech Stack

**Frontend:**

* React 19
* Vite
* Tailwind CSS 4
* Monaco Editor (`@monaco-editor/react`)

**Backend & Collaboration:**

* Node.js (Express)
* Socket.io
* Yjs (CRDT for real-time state resolution)
* `y-monaco` & `y-socket.io`

**Infrastructure & DevOps:**

* Docker (Multi-stage builds)
* AWS EC2 (Ubuntu 24.04 LTS)
* GitHub Actions

---

## 🏗️ Architecture & Deployment Flow

Covalent is designed with a modern, automated DevOps pipeline.

1. **Development:** Code is developed locally and pushed to the `main` branch.
2. **Continuous Integration (CI):** GitHub Actions automatically triggers upon the push.
3. **Artifact Transfer:** The CI pipeline securely copies the necessary application files (`frontend`, `backend`, `Dockerfile`, `.dockerignore`) to the AWS EC2 instance via SCP.
4. **Continuous Deployment (CD):** The pipeline executes a remote SSH script on the EC2 server to:
   * Execute a multi-stage Docker build.
   * Gracefully terminate the old container.
   * Boot the new container on Port 80, instantly serving the updated application.

---

## 💻 Local Development

To run this project locally, you will need [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed on your machine.

### 1. Clone the Repository

```bash
git clone [https://github.com/sajidmehmoodtariq-dev/covalent.git](https://github.com/sajidmehmoodtariq-dev/covalent.git)
cd covalent
```

### 2. Build the Docker Image

This command utilizes the multi-stage Dockerfile to compile the Vite frontend and bundle it with the Express backend.

```bash
docker build -t covalent-app .
```

### 3. Run the Container

Boot the container and map the internal port to your local machine.

```bash
docker run -d -p 3000:3000 covalent-app
```

### 4. Access the Application

Open your web browser and navigate to:

``` bash
http://localhost:3000
```

📂 Project Structure
Plaintext

covalent/
├── .github/
│   └── workflows/
│       └── deploy.yml      # CI/CD Pipeline Configuration
├── backend/
│   ├── package.json
│   └── server.js           # Express & Socket.io server
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── CodeEditor.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── .dockerignore           # Prevents local node_modules from copying
├── .gitignore
└── Dockerfile              # Multi-stage build configuration

📜 License

This project is open-source and available under the MIT License.
