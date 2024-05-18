const mongoose = require('mongoose');

const Order = require('../models/Orders');
const Product = require('../models/Product');
const nodemailer = require('nodemailer');

// Retrieve all orders
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Retrieve a single order by ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.searchOrders = async (req, res) => {
    try {
        const { term } = req.query;
        const orders = await Order.find({
            "shipTo.fullName": new RegExp(term, 'i')
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Update an order
exports.updateOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        if (order.status && ['Cancelled', 'Delivering', 'Finished'].includes(order.status) && order.shipTo.email) {
            sendStatusUpdateEmail(order);
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
async function sendStatusUpdateEmail(order) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: "safjvgecdyhbmmyd"
        }
    });
    console.log('Preparing to send status update email...');
    let emailSubject = '';
    let emailHtml = '';

    switch (order.status) {
        case 'Cancelled':
            emailSubject = 'Order Cancellation From Plantique';
            emailHtml = `<h1>Order Cancellation</h1>
            <p>We're sorry to inform you that your order ${order._id} has been cancelled.</p>
            <p>We apologize for any inconvenience this may have caused and hope you'll continue to support us in the future.</p>
            <p>If you have any questions or need further assistance, please feel free to contact us via email at plantiqueshop01@gmail.com.</p>`;
            break;
        case 'Delivering':
            emailSubject = 'Your Order is On the Way';
            emailHtml = `<h1>Your Order is On the Way</h1>
            <p>We're excited to let you know that your order ${order._id} is on its way to your address.</p>
            <p>You should receive your order soonest. Thank you for shopping with us!</p>
            <p>If you have any questions or need further assistance, please feel free to contact us via email at plantiqueshop01@gmail.com.</p>
            `;
            break;
        case 'Finished':
            emailSubject = 'Your Order is Completed';
            emailHtml = `<h1>Order Complete</h1>
            <p>Congratulations! Your order ${order._id} has been successfully delivered.</p>
            <p>We hope you enjoy your products and we're always here to serve you for your next orders.</p>
            <p>Thank you for shopping with us!</p>
            <p>If you have any questions or need further assistance, please feel free to contact us via email at plantiqueshop01@gmail.com.</p>
            `;
            break;
        default:
            console.log(`No email sent for status: ${order.status}`);
            return; // If the status is not one of the above, do not send an email
    }

    const mailOptions = {
        from: "plantiqueshop01@gmail.com",
        to: order.shipTo.email,
        subject: emailSubject,
        html: emailHtml
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Status update email sent successfully.');
    } catch (error) {
        console.error('Failed to send status update email:', error);
    }
}
// POST handler to create a new order
// POST handler to create a new order
exports.createOrder = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { userName, products, shipTo, shippingFee,subTotal,discountPrice, totalPrice, paymentMethod, staffNote } = req.body;

        // Validate and update stock levels
        for (const item of products) {
            const product = await Product.findById(item.productId).session(session);
            if (!product) {
                throw new Error(`Product with ID ${item.productId} not found`);
            }
            if (product.stock < item.quantity) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ error: "out_of_stock", message: `Not enough stock for product ${product.name}` });
            }
            product.stock -= item.quantity;
            await product.save({ session });
        }

        // Generate _id if not provided
        const _id = new Date().getTime().toString();
        // Set orderDate to current date
        const orderDate = new Date();

        const newOrder = new Order({
            _id,
            userName,// Include the userId in the order
            products: products.map(product => ({
                productId: product.productId,
                productName: product.productName,
                productImage: product.productImage,
                quantity: product.quantity,
                price: product.price
            })),
            shipTo: {
                fullName: shipTo.fullName,
                city: shipTo.city,
                district: shipTo.district,
                ward: shipTo.ward,
                address: shipTo.address,
                email: shipTo.email,
                phone: shipTo.phone,
                note: shipTo.note
            },
            shippingFee,
            totalPrice,
            orderDate: new Date(),
            subTotal,
            discountPrice: discountPrice, 
            paymentMethod,
            status: "Processing", // Default status
            staffNote
        });

        // Save the new order within the same session
        const savedOrder = await newOrder.save({ session });
        if (shipTo.email && shipTo.email.trim() !== '') {
            await sendOrderConfirmationEmail(savedOrder); // Only send email if address is provided
        }

        // Commit transaction
        await session.commitTransaction();
        session.endSession();
        res.status(201).json(savedOrder);
    } catch (error) {
        // If any error, abort the transaction
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: error.message });
    }
};
async function sendOrderConfirmationEmail(order) {
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: "safjvgecdyhbmmyd"
    }
});

const mailOptions = {
    from: "plantiqueshop01@gmail.com",
    to: order.shipTo.email,
    subject: 'Order Confirmation From Plantique',
    html: `<h1>Thank you for your order, ${order.shipTo.fullName}!</h1>
           <p>Your order ID is ${order._id}.</p>
           <h2>Order Details:</h2>
           ${order.products.map(item => 
               `<p>${item.productName} - Quantity: ${item.quantity} - Price: ${item.price}đ</p>`
           ).join('')}
           <p>Shipping Address:${order.shipTo.address}, ${order.shipTo.ward}, ${order.shipTo.district}, ${order.shipTo.city}</p>
           <p>Phone Number: ${order.shipTo.phone}</p>
           <p>Total: ${order.totalPrice}đ</p>
           <p>We are currently processing your order and will inform you when it ships.</p>
           <p>If you have any questions or need further assistance, please feel free to contact us via email at plantiqueshop01@gmail.com.</p>`

};

try {
    await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent successfully.');
} catch (error) {
    console.error('Failed to send order confirmation email:', error);
}
}
exports.getOrdersByUsername = async (req, res) => {
    try {
        const { username } = req.params; // Lấy username từ request params
        const orders = await Order.find({ userName: username }); // Tìm các đơn hàng với username tương ứng
        res.json(orders); // Trả về các đơn hàng tìm thấy dưới dạng phản hồi JSON
    } catch (error) {
        res.status(500).json({ message: error.message }); // Xử lý lỗi nếu có
    }
};
