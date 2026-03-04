require('dotenv').config();
const amqp = require('amqplib');
const { v4: uuidv4 } = require('uuid');

const sendOrders = async (orderData) => {
	console.log('orderData: ', orderData);

	try {
		// Connect to RabbitMQ server
		const connection = await amqp.connect(process.env.RABBITMQ_URL);

		// Create a channel
		const channel = await connection.createChannel();
		// Declare a queue
		const queue = 'orders';

		// Ensure the queue exists before sending messages
		await channel.assertQueue(queue, { durable: false });

		// Send the order data to the queue
		channel.sendToQueue(queue, Buffer.from(JSON.stringify(orderData)), {
			persistent: true,
		});

		console.log('Order sent to RabbitMQ', orderData);

		// Close the connection after a short delay to ensure the message is sent
		setTimeout(() => {
			connection.close();
			process.exit(0);
		}, 500);
	} catch (error) {
		console.error('Error sending order to RabbitMQ: ', error);
	}
};

for (let i = 0; i < 100; i++) {
	const orderData = {
		orderNumber: uuidv4(),
		productName: 'Apple',
		quantity: 4,
	};
	sendOrders(orderData);
}
