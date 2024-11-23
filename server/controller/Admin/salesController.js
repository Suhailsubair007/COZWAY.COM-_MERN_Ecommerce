const Order = require('../../model/order')
const PdfPrinter = require('pdfmake')
const ExcelJS = require('exceljs')
const PDFDocument = require('pdfkit-table')

//Function for get the sales report based on the selacted date....
const getSalesReportDate = async (skip = 0, limit = 0, startDate, endDate, period) => {
    let dateSelection = {};
    const currentDate = new Date();

    if (period === "custom" && startDate && endDate) {
        const start = new Date(startDate).setHours(0, 0, 0, 0);
        const end = new Date(endDate).setHours(23, 59, 59, 999);
        dateSelection = {
            placed_at: { $gte: new Date(start), $lte: new Date(end) },
            "order_items.order_status": { $ne: "cancelled" }
        };
        return await Order.find(dateSelection).populate('userId').populate('order_items.product').skip(skip).limit(limit);
    }

    switch (period) {
        case "daily":
            currentDate.setHours(0, 0, 0);
            dateSelection = {
                placed_at: {
                    $gte: currentDate,
                    $lt: new Date(),
                },
                "order_items.order_status": {
                    $nin: ["cancelled", "returned"]
                }
            }
            break;
        case "weekly":
            dateSelection = {
                placed_at: {
                    $gte: new Date(currentDate.setDate(currentDate.getDate() - 7)),
                    $lt: new Date(),
                },
                "order_items.order_status": {
                    $nin: ["cancelled", "returned"]
                }
            }
            break;
        case "monthly":
            dateSelection = {
                placed_at: {
                    $gte: new Date(currentDate.setMonth(currentDate.getMonth() - 1)),
                    $lt: new Date(),
                },
                "order_items.order_status": {
                    $nin: ["cancelled", "returned"]
                }
            }
            break;
        case "yearly":
            dateSelection = {
                placed_at: {
                    $gte: new Date(currentDate.setFullYear(currentDate.getFullYear() - 1)),
                    $lt: new Date(),
                },
                "order_items.order_status": {
                    $nin: ["cancelled", "returned"]
                }
            }
            break;
        default:
            break;
    }
    return await Order.find(dateSelection).populate('userId').populate('order_items.product').skip(skip).limit(limit);
}


//GET--To get the sales report  for the admin...
const getSalesReport = async (req, res) => {
    const {
        startDate = null,
        endDate = null,
        period = "daily",
        page = 1,
        limit = 5,
    } = req.query;


    const skip = (page - 1) * limit;



    let dateSelection = {};

    const currentDate = new Date();

    if (period === "custom" && startDate && endDate) {
        const start = new Date(startDate).setHours(0, 0, 0, 0);
        const end = new Date(endDate).setHours(23, 59, 59, 999);
        dateSelection = {
            placed_at: { $gte: new Date(start), $lte: new Date(end) },
            "order_items.order_status": { $ne: "cancelled" }
        };
        return await Order.find(dateSelection).populate('userId').populate('order_items.product').skip(skip).limit(limit);
    }
    switch (period) {
        case "daily":
            currentDate.setHours(0, 0, 0);
            dateSelection = {
                placed_at: {
                    $gte: currentDate,
                    $lt: new Date(),
                },
                "order_items.order_status": {
                    $nin: ["cancelled", "returned"]
                }
            }
            break;
        case "weekly":
            dateSelection = {
                placed_at: {
                    $gte: new Date(currentDate.setDate(currentDate.getDate() - 7)),
                    $lt: new Date(),
                },
                "order_items.order_status": {
                    $nin: ["cancelled", "returned"]
                }
            }
            break;
        case "monthly":
            dateSelection = {
                placed_at: {
                    $gte: new Date(currentDate.setMonth(currentDate.getMonth() - 1)),
                    $lt: new Date(),
                },
                "order_items.order_status": {
                    $nin: ["cancelled", "returned"]
                }
            }
            break;
        case "yearly":
            dateSelection = {
                placed_at: {
                    $gte: new Date(currentDate.setFullYear(currentDate.getFullYear() - 1)),
                    $lt: new Date(),
                },
                "order_items.order_status": {
                    $nin: ["cancelled", "returned"]
                }
            }
            break;
        default:
            break;
    }


    const salesReport = await getSalesReportDate(skip, limit, startDate, endDate, period);

    const totalReportCount = await Order.countDocuments(dateSelection);
    const totalPage = Math.ceil(totalReportCount / limit);
    const report = await Order.find(dateSelection)

    const totalSalesCount = report.length;
    const totalOrderAmount = report.reduce((acc, report) => acc + report.total_price_with_discount, 0);


    const totalDiscount = report.reduce((productAcc, item) => {
        return productAcc + item.total_discount;
    }, 0);



    res.status(200).json({
        salesReport,
        totalSalesCount,
        totalOrderAmount,
        totalDiscount,
        totalPage,
        page,
    });
}


// GET--To download  the sals report in pdf format.....
const download_sales_report_pdf = async (req, res) => {
    const { startDate, endDate, period } = req.query;

    try {
        const reports = await getSalesReportDate(0, 0, startDate, endDate, period);

        const pdfDoc = new PDFDocument({ margin: 50, size: "A4" });
        res.setHeader("Content-Disposition", "attachment; filename=sales_report.pdf");
        pdfDoc.pipe(res);

        pdfDoc.fontSize(20).text("Sales Report", { align: "center" }).moveDown(2);


        let consolidatedTotal = 0;

        for (let index = 0; index < reports.length; index++) {
            const report = reports[index];

            consolidatedTotal += report.total_price_with_discount;


            if (pdfDoc.y > 700) {
                pdfDoc.addPage();
                pdfDoc.moveDown(1);
            }

            pdfDoc.fontSize(12).font("Helvetica-Bold");
            pdfDoc.text(`Report ${index + 1}`, { continued: false }).moveDown(0.6);

            pdfDoc.fontSize(10).font("Helvetica");
            pdfDoc.text(`Order Date: ${new Date(report.placed_at).toLocaleDateString()}`);
            pdfDoc.text(`Customer Name: ${report.userId.name}`);
            pdfDoc.text(`Payment Method: ${report.payment_method}`);
    
            const table = {
                title: "Product Details",
                headers: ["Product Name", "Order Status", "Quantity", "Unit Price (RS)", "Total Price (RS)"],
                rows: report.order_items.map((p) => [
                    p.product.name,
                    p.order_status,
                    p.quantity.toString(),
                    p.price.toFixed(2),
                    p.totalProductPrice.toFixed(2),
                ]),
            };

            try {
                await pdfDoc.table(table, {
                    prepareHeader: () => pdfDoc.font("Helvetica-Bold").fontSize(8),
                    prepareRow: (row, i) => pdfDoc.font("Helvetica").fontSize(8),
                    width: 400,
                    columnsSize: [200, 70, 70, 70, 70],
                    padding: 5,
                    align: 'center',
                    borderWidth: 0.5,
                    rowOptions: { borderColor: '#cccccc' },
                    header: { fillColor: '#f2f2f2', textColor: '#333333' }
                });
            } catch (error) {
                console.error("Error generating table:", error);
            }

            pdfDoc.moveDown(0.2);
            pdfDoc.font("Helvetica-Bold").fontSize(10)
                .text(`Final Coupon Discount: RS. ${(report.coupon_discount).toFixed(2)}`)
                .text(`Final Product Discount: RS. ${(report.total_discount).toFixed(2)}`)
                .text(`Final Amount: RS. ${(report.total_price_with_discount).toFixed(2)}`);

            pdfDoc.moveDown(1);
            if (index < reports.length - 1 && pdfDoc.y > 650) {
                pdfDoc.addPage();
            }
        }

        pdfDoc.moveDown(2);
        pdfDoc.fontSize(12).font("Helvetica-Bold").text("Total Order amount:", { align: "left" }).moveDown(0.2);
        pdfDoc.moveDown(0.2);
        pdfDoc.lineWidth(1).strokeColor("#333333").moveTo(50, pdfDoc.y).lineTo(200, pdfDoc.y).stroke().moveDown(0.5);
        pdfDoc.fontSize(10).font("Helvetica")
            .text(`RS. ${consolidatedTotal.toFixed(2)}`, { align: "left" });


        pdfDoc.end();
    } catch (error) {
        console.error("Error generating sales report PDF:", error);
        res.status(500).send("Error generating sales report PDF");
    }
};


//GET---Download the sales report in the XL formt....
const download_sales_report_xl = async (req, res) => {
    try {
        const { startDate, endDate, period } = req.query;
        const reports = await getSalesReportDate(0, 0, startDate, endDate, period);

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sales Report");

        worksheet.columns = [
            { header: "Product Name", key: "productName", width: 25 },
            { header: "Quantity", key: "quantity", width: 10 },
            { header: "Unit Price", key: "unitPrice", width: 15 },
            { header: "Total Price", key: "totalPrice", width: 15 },
            { header: "Discount", key: "discount", width: 15 },
            { header: "Coupon Deduction", key: "couponDeduction", width: 15 },
            { header: "Final Amount", key: "finalAmount", width: 15 },
            { header: "Order Date", key: "orderDate", width: 20 },
            { header: "Customer Name", key: "customer_name", width: 20 },
            { header: "Payment Method", key: "paymentMethod", width: 20 },
            { header: "Delivery Status", key: "deliveryStatus", width: 15 },
        ];
        reports.forEach((report) => {
            const orderDate = new Date(report.placed_at).toLocaleDateString();

            const products = report.order_items.map((item) => ({
                productName: item.product.name,
                quantity: item.quantity,
                OrginaalUnitPrice: item.price,
                totalPrice: item.totalProductPrice,
                discount: report.total_discount,
                couponDeduction: report.coupon_discount,
                finalAmount: report.total_price_with_discount,
                orderDate: orderDate,
                customer_name: report.userId.name,
                paymentMethod: report.payment_method,
                deliveryStatus: report.order_status,
            }));

            products.forEach((product) => {
                worksheet.addRow(product);
            });
        });

        res.setHeader(
            "Content-Disposition",
            "attachment; filename=sales_report.xlsx"
        );
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        res.status(500).json({ message: "Failed to generate sales report", error });
    }
};

//GET- Top selling product and categoriers..
const getTopSelling = async (req, res) => {
    try {
        const topProducts = await Order.aggregate([
            { $unwind: '$order_items' },
            {
                $group: {
                    _id: '$order_items.product',
                    totalQuantity: { $sum: '$order_items.quantity' },
                },
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productDetails',
                },
            },
            { $unwind: '$productDetails' },
            {
                $project: {
                    _id: 0,
                    productId: '$_id',
                    name: '$productDetails.name',
                    totalQuantity: 1,
                },
            },
        ]);

        const topCategories = await Order.aggregate([
            { $unwind: '$order_items' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'order_items.product',
                    foreignField: '_id',
                    as: 'productDetails',
                },
            },
            { $unwind: '$productDetails' },
            {
                $group: {
                    _id: '$productDetails.category',
                    totalQuantity: { $sum: '$order_items.quantity' },
                },
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'categories',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'categoryDetails',
                },
            },
            { $unwind: '$categoryDetails' },
            {
                $project: {
                    _id: 0,
                    categoryId: '$_id',
                    categoryName: '$categoryDetails.name',
                    totalQuantity: 1,
                },
            },
        ]);

        res.status(200).json({
            success: true,
            topProducts,
            topCategories,
        });
    } catch (error) {
        console.error('Error fetching top-selling products and categories:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch data',
        });
    }
};


module.exports = {
    getSalesReport,
    download_sales_report_pdf,
    download_sales_report_xl,
    getTopSelling
}