# Broncos Pizza API

## Project Overview

The Broncos Pizza API is a RESTful API built with **Node.js, Express, and PostgreSQL** to manage pizza orders.  
The API allows users to **create, retrieve, update, and delete pizzas**, with predefined **sizes, sauces, and toppings** stored in a PostgreSQL database running inside **Docker**.

This project includes **end-to-end testing** to validate functionality.

---

## 1. Prerequisites

Before running this project, ensure you have the following installed:

- **[Node.js](https://nodejs.org/)** (`>= 18.x`)
- **[Docker & Docker Compose](https://docs.docker.com/get-docker/)**
- **Git** (to clone the repository)
- **cURL** or **Postman** (for testing API requests)

---

## 2. Installation & Setup

### 1. Clone the Repository

```sh
git clone https://github.com/your-username/broncos-pizza-api.git
cd broncos-pizza-api
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Configure Environment Variables

```sh
cp .env.example .env
```

### 4. Start the Database Using Docker

```sh
npm run db:up
```

This will start a **PostgreSQL container** with a database named `broncos_pizza_db`.

### 5. Initialize the Database

```sh
npm run db:init
```

This will create the necessary tables and insert predefined sizes, sauces, and toppings.

### 6. Start the Server

```sh
npm start
```

The API will be available at **`http://localhost:3000`**.

---

## 3. API Endpoints

**Base URL:** `http://localhost:3000/pizzas`

### Fetch predefined pizza options:

- `GET /pizzas/sizes` → Returns a list of available pizza sizes
- `GET /pizzas/sauces` → Returns a list of available sauces
- `GET /pizzas/toppings` → Returns a list of available toppings

### CRUD operations for pizzas:

- `POST /pizzas` → Creates a new pizza
- `GET /pizzas/:id` → Retrieves details of a specific pizza by ID
- `PUT /pizzas/:id` → Updates an existing pizza’s size, sauce, or toppings
- `DELETE /pizzas/:id` → Deletes a pizza from the database

---

## 4. Example API Usage

### Get All Pizza Sizes

```sh
curl -X GET http://localhost:3000/pizzas/sizes
```

### Get All Pizza Sauces

```sh
curl -X GET http://localhost:3000/pizzas/sauces
```

### Get All Pizza Toppings

```sh
curl -X GET http://localhost:3000/pizzas/toppings
```

### Create a Pizza

```sh
curl -X POST http://localhost:3000/pizzas \
     -H "Content-Type: application/json" \
     -d '{
           "size": "Large",
           "sauce": "Tomato",
           "toppings": ["Cheese", "Pepperoni"]
         }'
```

### Fetch a Specific Pizza

```sh
curl -X GET http://localhost:3000/pizzas/1
```

### Update created Pizza

```sh
curl -X PUT http://localhost:3000/pizzas/1 \
     -H "Content-Type: application/json" \
     -d '{
           "size": "Medium",
           "sauce": "BBQ",
           "toppings": ["Cheese", "Bacon"]
         }'
```

### Delete a Specific Pizza

```sh
curl -X DELETE http://localhost:3000/pizzas/1
```

---

## 5. Running Tests

To run **end-to-end tests**, use the following command:

```sh
npm test
```

The test suite will **start a test server, create sample pizzas, validate CRUD operations, and tear down the test data**.

---

## 6. How to Stop and Clean Up

To stop the database container:

```sh
npm run db:down
```

To reset the database:

```sh
npm run db:init
```
