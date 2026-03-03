const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, admin } = require('../middleware/authMiddleware');
const sendEmail = require('../utils/sendEmail');
const { getEmailTemplate } = require('../utils/emailTemplates');


// @route   POST api/orders
// @desc    Create new order
// @access  Private
router.post('/', protect, async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        return res.status(400).json({ message: 'No order items' });
    } else {
        const order = new Order({
            orderItems,
            user: req.user,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        try {
            const createdOrder = await order.save();

            // Send order confirmation email
            const orderItemsHtml = createdOrder.orderItems.map(item => `
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #444;">${item.name} (x${item.qty})</td>
                    <td style="padding: 10px; border-bottom: 1px solid #444; text-align: right;">$${(item.price * item.qty).toFixed(2)}</td>
                </tr>
            `).join('');

            const emailBody = `
                <p>Hi ${req.user.name},</p>
                <p>Thank you for your purchase! We've received your order and are getting it ready. We will notify you again once it has shipped.</p>
                <h3 style="color: #fff;">Order Summary (ID: #${createdOrder._id})</h3>
                <table width="100%" style="border-collapse: collapse; color: #e0e0e0;">
                    ${orderItemsHtml}
                    <tr><td style="padding: 10px; text-align: right;">Subtotal:</td><td style="padding: 10px; text-align: right;">$${createdOrder.itemsPrice.toFixed(2)}</td></tr>
                    <tr><td style="padding: 10px; text-align: right;">Shipping:</td><td style="padding: 10px; text-align: right;">$${createdOrder.shippingPrice.toFixed(2)}</td></tr>
                    <tr><td style="padding: 10px; text-align: right;">Tax:</td><td style="padding: 10px; text-align: right;">$${createdOrder.taxPrice.toFixed(2)}</td></tr>
                    <tr style="font-weight: bold;"><td style="padding: 10px; text-align: right;">Total:</td><td style="padding: 10px; text-align: right;">$${createdOrder.totalPrice.toFixed(2)}</td></tr>
                </table>
            `;
            const emailHtml = getEmailTemplate({
                title: 'Thank You For Your Order!',
                body: emailBody,
                button: { text: 'View Your Order', link: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/order/${createdOrder._id}` }
            });

            try {
                await sendEmail({
                    to: req.user.email,
                    subject: `Order Confirmation #${createdOrder._id}`,
                    html: emailHtml

                });
            } catch (emailError) {
                console.error(`Failed to send order confirmation email for order ${createdOrder._id}:`, emailError);
                // Don't fail the request, just log the error
            }
            res.status(201).json(createdOrder);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    }
});

// @route   GET api/orders
// @desc    Get all orders
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET api/orders/myorders
// @desc    Get logged in user orders
// @access  Private
router.get('/myorders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PUT api/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put('/:id/status', protect, admin, async (req, res) => {
    const { status } = req.body;
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (order) {
            const oldStatus = order.orderStatus;
            order.orderStatus = status;
            if (status === 'Delivered') {
                order.isDelivered = true;
                order.deliveredAt = Date.now();
            } else {
                // If status is changed back from 'Delivered' or to something else
                order.isDelivered = false;
                order.deliveredAt = null;
            }

            // Send status update email if status changed
            if (oldStatus !== status && order.user.email) {
                try {
                    let subject = '';
                    let message = '';

                    switch(status) {
                        case 'Shipped':
                            subject = `Your Order #${order._id} has been shipped!`;
                            message = `<p>Great news! Your order is on its way.</p>`;
                            break;
                        case 'Delivered':
                            subject = `Your Order #${order._id} has been delivered!`;
                            message = `<p>Your order has been delivered. We hope you enjoy your new artwork!</p>
                                       <p>You can now leave a review for your purchased items on the order details page.</p>`;
                            break;
                        case 'Ready to Ship':
                            subject = `Your Order #${order._id} is being prepared.`;
                            message = `<p>Your order is now being prepared for shipment.</p>`;
                            break;
                        case 'Cancelled':
                            subject = `Your Order #${order._id} has been cancelled.`;
                            message = `<p>Your order has been cancelled. Please contact us if you have any questions.</p>`;
                            break;
                    }

                    if (subject && message) {
                        const emailBody = `
                            <p>Hi ${order.user.name},</p>
                            <p>The status of your order #${order._id} has been updated to: <strong>${status}</strong></p>
                            ${message}
                        `;
                        const emailHtml = getEmailTemplate({
                            title: 'Order Status Update',
                            body: emailBody,
                            button: { text: 'View Your Order', link: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/order/${order._id}` }
                        });

                        await sendEmail({
                            to: order.user.email,
                            subject: subject,
                            html: emailHtml

                        });
                    }
                } catch (emailError) {
                    console.error(`Failed to send status update email for order ${order._id}:`, emailError);
                }
            }

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PUT api/orders/:id/cancel
// @desc    Cancel order (User)
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            if (order.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }
            if (order.orderStatus !== 'Processing') {
                return res.status(400).json({ message: 'Cannot cancel order at this stage' });
            }

            order.orderStatus = 'Cancelled';
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PUT api/orders/:id/pay
// @desc    Update order to paid
// @access  Private
router.put('/:id/pay', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.email_address,
            };

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET api/orders/can-review/:paintingId
// @desc    Check if a user can review a specific product
// @access  Private
router.get('/can-review/:paintingId', protect, async (req, res) => {
    try {
        const { paintingId } = req.params;

        // Find a delivered order by this user that contains the painting
        const order = await Order.findOne({
            user: req.user._id,
            'orderItems.painting': paintingId,
            orderStatus: 'Delivered',
        });

        res.json({ canReview: !!order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;