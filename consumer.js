require('dotenv').config();
const amqp = require('amqplib');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
})

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ', err)
        return
    }
    console.log('Connected to MySQL')
})

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

const receiveOrders = async () => {
    try {
        // Connect to RabbitMQ server
        const amqpConnection = await amqp.connect(process.env.RABBITMQ_URL)

        // Create a channel
        const channel = await amqpConnection.createChannel()

        // Declare a queue
        const queue = 'orders'
        await channel.assertQueue(queue, { durable: false })

        console.log('Waiting for messages in %s. To exit press CTRL+C', queue)

        channel.prefetch(1) // Process one message at a time

        // Consume messages from the queue
        channel.consume(queue, (msg) => {
            if (msg !== null) {
                const messageContent = msg.content.toString()
                const orderData = JSON.parse(messageContent)
                console.log('Received order: ', orderData)

                // Insert order data into MySQL database
                const query = 'INSERT INTO orders (orderNumber, productName, quantity) VALUES (?, ?, ?)'
                connection.query(query, [orderData.orderNumber, orderData.productName, orderData.quantity], (err, results) => {
                    if (err) {
                        console.error('Error inserting order into MySQL: ', err)
                    } else {
                        console.log('Order inserted into MySQL with ID: ', results.insertId)
                    }
                })

                // Acknowledge the message
                channel.ack(msg)
            }
        })
    } catch (error) {
        console.error('Error receiving orders from RabbitMQ: ', error)
    }
}

receiveOrders();
