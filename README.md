# CareerGist

## Project Overview
CareerGist is a **job board aggregator** that searches for jobs using the **JSearch API**, enhances job descriptions using **OpenAI's API**, and displays job listings through a **React-based frontend**. The system is designed to be **highly modular**, scalable, and optimized for **performance and reliability**.

## Key Features

### **Backend**
- **Built with TypeScript and Express.js** for a strongly-typed and modular backend.
- **PostgreSQL with Sequelize ORM** for structured and efficient data storage.
- **Redis caching** to temporarily store job listings (raw and enhanced) for **20 minutes** before moving them to permanent storage.
- **JWT-based authentication** for secure user login and session management.
- **Bcrypt password hashing** to ensure robust security.
- **Role-based access control (RBAC)** to manage permissions.
- **Error handling and logging mechanisms** for API failures, caching issues, and database errors.
- **Rate limiting** for API calls to JSearch and OpenAI to ensure efficient resource usage.

### **Frontend**
- **Built with React and Vite** for a fast and responsive user interface.
- **Strictly uses TypeScript** for improved maintainability and scalability.
- **Unauthenticated users** see raw job listings from JSearch.
- **Authenticated users** see enhanced job descriptions refined by OpenAI.
- **Saved Jobs Page** for users to save job listings of interest.
- **Favorites Page** for users to mark preferred job listings.
- **Pagination and Filtering** for better user experience and job search optimization.

### **Caching and Storage**
- Jobs are **cached in Redis** for 20 minutes to improve response time and handle API outages.
- Cached data is then **persisted in PostgreSQL** for long-term storage and retrieval.

### **Security and Performance**
- **Environment variables** are used for managing sensitive data.
- **Rate limiting** is implemented to prevent abuse of API endpoints.
- **No CORS or Axios** will be used in this project.
- **Robust error handling and logging** ensure system stability and maintainability.

### **Deployment**
- The project will be **deployed on Render.com**, with detailed deployment documentation.
- Includes **logging and monitoring tools** for tracking API usage and system errors.

## Goals
- Ensure **high scalability and performance** to handle a large number of job postings.
- Optimize **data normalization** for a consistent job data format before enhancement.
- Maintain **modularity** for seamless updates and future expansion.
- Provide a **smooth and efficient user experience** with job search, filtering, and pagination.

## Tech Stack
- **Frontend:** React (Vite) + TypeScript
- **Backend:** Express.js + TypeScript
- **Database:** PostgreSQL + Sequelize ORM
- **Cache:** Redis
- **Authentication:** JWT + Bcrypt
- **APIs:** JSearch API + OpenAI API
- **Hosting:** Render.com
- **Monitoring & Logging:** TBD (to be explored during implementation)

This document serves as the foundation for the README file and will be updated as the project progresses.

# License
**CareerGist is not licensed and therefore falls under Copyright Law as stipulated by the Berne Convention, which grants the author exclusive rights to their work upon creation, without the need for formal registration. Unauthorized use, reproduction, or distribution of this software without explicit permission is prohibited.** 
