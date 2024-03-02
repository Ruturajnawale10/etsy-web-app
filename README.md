# Etsy Web App Clone Project

This repository contains the source code for the Etsy web app clone project, which replicates the functionality of the popular e-commerce platform Etsy. The project utilizes a 3-tier architecture to facilitate user-friendly e-commerce interactions.

## Project Overview

- **Project Name:** Etsy Web App Clone
- **Technologies:** Node.js, React.js, Express.js, MongoDB, MySQL, GraphQL, Redis, Kafka, Docker, AWS

## Project Features

- Implemented a 3-tier architecture to enhance user-friendly e-commerce interactions.
- Utilized Kafka, Redis, Database Pooling, and load balancers to improve application scalability and fault tolerance.
- Introduced UI and API pagination to efficiently manage extensive content by dividing it into separate, manageable pages.
- Deployed the application on AWS more conveniently by creating its Docker container.

## Repository Structure

- `backend/`: Contains the backend code for the project built with Node.js and Express.js.
- `frontend/etsy/`: Contains the frontend code for the project built with React.js.
- `tests/`: Includes Mocha tests for the backend.

## Installation and Setup

To set up the project locally, follow these steps:

1. Clone this repository.
2. Navigate to the `backend/` directory and run `npm install` to install backend dependencies.
3. Navigate to the `frontend/etsy/` directory and run `npm install` to install frontend dependencies.
4. Start the backend Node server:
    - Navigate to the `backend/` directory and run `node index.js`.
5. Start the Kafka server:
    - Navigate to the `backend/` directory and run `node server.js`.
6. Start the React frontend app:
    - Navigate to the `frontend/etsy/` directory and run `npm start`.
7. Run Mocha tests:
    - Navigate to the `backend/` directory and run `npm test`.

## Additional Information

- The project leverages technologies like MongoDB, MySQL, Redis, and Kafka to handle various aspects of the application, ensuring scalability and fault tolerance.
- Docker containers are used for more convenient deployment of the application on AWS.
- UI and API pagination are implemented to enhance user experience and manage extensive content effectively.
