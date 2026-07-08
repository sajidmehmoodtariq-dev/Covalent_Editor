# Use a lightweight Node Alpine image
FROM node:20-alpine

# 1. Create and set the working directory inside the container
WORKDIR /app

# 2. Copy ONLY the package files first to leverage Docker's layer caching
COPY ./backend/package*.json ./

# 3. Install dependencies natively inside the Alpine Linux container
RUN npm install

# 4. Copy the rest of your backend code (including the 'public' folder)
COPY ./backend .

# 5. Document the port the container will use
EXPOSE 3000

# 6. Start the server
CMD ["node", "server.js"]