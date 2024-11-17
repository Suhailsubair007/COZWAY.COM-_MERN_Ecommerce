const User = require('../../model/User')
const bcrypt = require("bcrypt");
const Order = require('../../model/order')
const PdfPrinter = require("pdfmake");



const securePassword = async (password) => {
    try {
        return await bcrypt.hash(password, 10);
    } catch (error) {
        console.error(error);
    }
};


// controller for update frofile details in the profile page...
const updateProfile = async (req, res) => {
    const userId = req.params.id;
    const { fullname, phone } = req.body;

    const name = fullname;



    const updateFields = {};

    if (name) updateFields.name = name;
    if (phone) updateFields.phone = phone;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateFields,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                name: updatedUser.name,
                phone: updatedUser.phone,
            },
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};



// To get data to display in the profile page...
const getUserData = async (req, res) => {
    const userId = req.params.id;

    try {

        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
            },
        });
    } catch (error) {
        console.error('Error retrieving user data:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


const changePassword = async (req, res) => {
    const { email, currentPassword, newPassword } = req.body;

    try {

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User  not found'
            });
        }

        const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        const hashedNewPassword = await securePassword(newPassword);
        user.password = hashedNewPassword;


        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};




const fonts = {
    // Using more professional fonts with complete family
    Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique'
    },
    // Adding Times for certain elements
    Times: {
        normal: 'Times-Roman',
        bold: 'Times-Bold',
        italics: 'Times-Italic',
        bolditalics: 'Times-BoldItalic'
    }
};

const OrderInvoice = async (req, res) => {
    try {
        const { userId, orderId } = req.body;

        const order = await Order.findOne({ _id: orderId, userId: userId })
            .populate("userId", "name email")
            .populate("order_items.product", "name");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const printer = new PdfPrinter(fonts);

        const docDefinition = {
            pageMargins: [40, 60, 40, 60],
            content: [
                // Logo and Header
                {
                    columns: [
                        {
                            width: '*',
                            stack: [
                                {
                                    // COZWAY.COM Logo Text
                                    text: 'COZWAY.COM',
                                    style: 'logo',
                                    color: '#000000',
                                },
                                {
                                    text: 'Premium Fashion Marketplace',
                                    style: 'logoSubtext',
                                    color: '#666666',
                                }
                            ]
                        },
                        {
                            width: 'auto',
                            stack: [
                                {
                                    text: 'INVOICE',
                                    style: 'invoiceTitle',
                                    alignment: 'right'
                                },
                                {
                                    text: order.order_id,
                                    style: 'invoiceSubtitle',
                                    alignment: 'right'
                                }
                            ]
                        }
                    ]
                },
                // Separator
                {
                    canvas: [
                        {
                            type: 'line',
                            x1: 0, y1: 5,
                            x2: 515, y2: 5,
                            lineWidth: 1,
                            lineColor: '#000000'
                        }
                    ],
                    margin: [0, 20, 0, 20]
                },
                // Order Details
                {
                    columns: [
                        {
                            width: '*',
                            stack: [
                                { text: 'Order Date:', style: 'labelText' },
                                { text: order.placed_at.toLocaleDateString(), style: 'valueText', margin: [0, 0, 0, 10] },
                                { text: 'Delivery By:', style: 'labelText' },
                                { text: order.delivery_by.toLocaleDateString(), style: 'valueText' }
                            ]
                        },
                        {
                            width: '*',
                            stack: [
                                { text: 'Payment Method:', style: 'labelText' },
                                { text: order.payment_method, style: 'valueText', margin: [0, 0, 0, 10] },
                                { text: 'Payment Status:', style: 'labelText' },
                                { text: order.payment_status, style: 'valueText' }
                            ]
                        }
                    ],
                    margin: [0, 0, 0, 20]
                },
                // Billing and Shipping
                {
                    columns: [
                        {
                            width: '*',
                            stack: [
                                { text: 'Bill To', style: 'sectionHeader' },
                                { text: order.userId.name, style: 'boldText' },
                                { text: order.userId.email, style: 'normalText' }
                            ]
                        },
                        {
                            width: '*',
                            stack: [
                                { text: 'Ship To', style: 'sectionHeader' },
                                {
                                    stack: [
                                        { text: order.shipping_address.address, style: 'normalText' },
                                        { text: `${order.shipping_address.district}, ${order.shipping_address.state}`, style: 'normalText' },
                                        { text: `Pincode: ${order.shipping_address.pincode}`, style: 'normalText' },
                                        { text: `Phone: ${order.shipping_address.phone}`, style: 'normalText' }
                                    ]
                                }
                            ]
                        }
                    ],
                    margin: [0, 0, 0, 20]
                },
                // Order Items Table
                {
                    text: 'Order Details',
                    style: 'sectionHeader',
                    margin: [0, 0, 0, 10]
                },
                {
                    table: {
                        headerRows: 2,
                        widths: ['*', 'auto', 'auto', 30, 30, 'auto', 'auto'],
                        body: [
                            [
                                { text: 'Product', style: 'tableHeader' },
                                { text: 'Size', style: 'tableHeader' },
                                { text: 'Qty', style: 'tableHeader' },
                                { text: 'Price', style: 'tableHeader' },
                                { text: 'Total', style: 'tableHeader' },
                                { text: 'Status', style: 'tableHeader' },
                                { text: 'Return Status', style: 'tableHeader' }
                            ],
                            ...order.order_items.map((item) => [
                                { text: item.product.name, style: 'tableCell' },
                                { text: item.selectedSize, style: 'tableCell' },
                                { text: item.quantity.toString(), style: 'tableCell' },
                                { text: `₹${Number(item.price.toString())}`, style: 'tableCell' },
                                { text: `₹${item.totalProductPrice.toString()}`, style: 'tableCell' },
                                { text: item.order_status, style: 'tableCellBold' },
                                {
                                    text: item.return_request.is_requested
                                        ? `Requested${item.return_request.is_approved ? ' - Approved' : ''}`
                                        : 'No Request',
                                    style: 'tableCellBold'
                                }
                            ])
                        ]
                    }
                },
                // Order Summary
                {
                    columns: [
                        { width: '*', text: '' },
                        {
                            width: 'auto',
                            style: 'summary',
                            table: {
                                widths: ['auto', 100],
                                body: [
                                    [
                                        { text: 'Subtotal:', style: 'summaryLabel' },
                                        { text: `₹${order.total_amount.toString()}`, style: 'summaryValue' }
                                    ],
                                    [
                                        { text: 'Shipping Fee:', style: 'summaryLabel' },
                                        { text: `₹${order.shipping_fee.toString()}`, style: 'summaryValue' }
                                    ],
                                    [
                                        { text: 'Total Discount:', style: 'summaryLabel' },
                                        { text: `₹${order.total_discount.toString()}`, style: 'summaryValue' }
                                    ],
                                    [
                                        { text: 'Coupon Discount:', style: 'summaryLabel' },
                                        { text: `₹${order.coupon_discount.toString()}`, style: 'summaryValue' }
                                    ],
                                    [
                                        { text: 'Final Total:', style: 'summaryLabelBold' },
                                        { text: `₹${order.total_price_with_discount.toString()}`, style: 'summaryValueBold' }
                                    ]
                                ]
                            },
                            layout: {
                                hLineWidth: (i, node) => (i === 0 || i === node.table.body.length) ? 1 : 0.5,
                                vLineWidth: () => 0,
                                hLineColor: (i, node) => (i === 0 || i === node.table.body.length) ? '#000000' : '#CCCCCC',
                                paddingLeft: () => 15,
                                paddingRight: () => 15,
                                paddingTop: () => 8,
                                paddingBottom: () => 8
                            }
                        }
                    ],
                    margin: [0, 20, 0, 20]
                }
            ],
            styles: {
                logo: {
                    font: 'Helvetica',
                    fontSize: 24,
                    bold: true,
                    margin: [0, 0, 0, 5]
                },
                logoSubtext: {
                    font: 'Helvetica',
                    fontSize: 10,
                    margin: [0, 0, 0, 20]
                },
                invoiceTitle: {
                    font: 'Helvetica',
                    fontSize: 28,
                    bold: true,
                    margin: [0, 0, 0, 5]
                },
                invoiceSubtitle: {
                    font: 'Helvetica',
                    fontSize: 12,
                    color: '#666666'
                },
                sectionHeader: {
                    font: 'Helvetica',
                    fontSize: 14,
                    bold: true,
                    margin: [0, 0, 0, 10]
                },
                labelText: {
                    font: 'Helvetica',
                    fontSize: 10,
                    color: '#666666'
                },
                valueText: {
                    font: 'Helvetica',
                    fontSize: 11,
                    bold: true
                },
                boldText: {
                    font: 'Helvetica',
                    fontSize: 11,
                    bold: true,
                    margin: [0, 5, 0, 3]
                },
                normalText: {
                    font: 'Helvetica',
                    fontSize: 10,
                    margin: [0, 0, 0, 3]
                },
                tableHeader: {
                    font: 'Helvetica',
                    fontSize: 11,
                    bold: true,
                    fillColor: '#F8F9FA',
                    color: '#000000',
                    margin: [0, 5, 0, 5]
                },
                tableCell: {
                    font: 'Helvetica',
                    fontSize: 10,
                    margin: [0, 5, 0, 5]
                },
                tableCellBold: {
                    font: 'Helvetica',
                    fontSize: 10,
                    bold: true,
                    margin: [0, 5, 0, 5]
                },
                summary: {
                    margin: [0, 20, 0, 0]
                },
                summaryLabel: {
                    font: 'Helvetica',
                    fontSize: 10,
                    margin: [0, 5, 0, 5]
                },
                summaryValue: {
                    font: 'Helvetica',
                    fontSize: 10,
                    alignment: 'right',
                    margin: [0, 5, 0, 5]
                },
                summaryLabelBold: {
                    font: 'Helvetica',
                    fontSize: 11,
                    bold: true,
                    margin: [0, 5, 0, 5]
                },
                summaryValueBold: {
                    font: 'Helvetica',
                    fontSize: 11,
                    bold: true,
                    alignment: 'right',
                    margin: [0, 5, 0, 5]
                }
            },
            defaultStyle: {
                font: 'Helvetica',
                fontSize: 10
            }
        };

        const pdfDoc = printer.createPdfKitDocument(docDefinition);

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=COZWAY-invoice-${order.order_id}.pdf`
        );

        pdfDoc.pipe(res);
        pdfDoc.end();
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};



module.exports = {
    updateProfile,
    getUserData,
    changePassword,
    OrderInvoice
};