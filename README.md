# RabbitMQ Basic

A basic demonstration of message queuing using RabbitMQ with Node.js. A producer sends order messages to a queue, and a consumer reads them and stores them in a MySQL database.

## Architecture

```
Producer → RabbitMQ (orders queue) → Consumer → MySQL
```

## Services (Docker)

| Service     | Port  | Description                        |
|-------------|-------|------------------------------------|
| RabbitMQ    | 5672  | Message broker                     |
| RabbitMQ UI | 15672 | Management dashboard               |
| MySQL       | 3306  | Database for storing orders        |
| phpMyAdmin  | 8080  | MySQL web UI                       |

## Prerequisites

- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/) v20+

## Getting Started

### 1. Start infrastructure

```bash
cd docker-compose
docker-compose up -d
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Copy `.env.example` to `.env` and adjust values if needed:

```bash
cp .env.example .env
```

### 4. Run the consumer

```bash
node consumer.js
```

### 5. Run the producer (in a separate terminal)

```bash
node producer.js
```

The producer sends 100 orders to the `orders` queue. The consumer picks them up one at a time and inserts them into MySQL.

## Environment Variables

| Variable         | Description              | Default                                    |
|------------------|--------------------------|--------------------------------------------|
| `RABBITMQ_URL`   | RabbitMQ connection URL  | `amqp://mikelopster:password@localhost:5672`|
| `MYSQL_HOST`     | MySQL host               | `localhost`                                |
| `MYSQL_USER`     | MySQL user               | `root`                                     |
| `MYSQL_PASSWORD` | MySQL password           | `rootpassword`                             |
| `MYSQL_DATABASE` | MySQL database name      | `orders`                                   |
