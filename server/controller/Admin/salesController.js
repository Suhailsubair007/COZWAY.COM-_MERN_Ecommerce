const Order = require('../../model/order')
const PdfPrinter = require('pdfmake')
const ExcelJS = require('exceljs')
const PDFDocument = require('pdfkit-table')

const getSalesReportDate = async (skip = 0, limit = 0, startDate, endDate, period) => {
    let dateSelection = {};
    const currentDate = new Date();

    if (period === "custom" && startDate && endDate) {
        const start = new Date(startDate).setHours(0, 0, 0, 0);
        const end = new Date(endDate).setHours(23, 59, 59, 999);
        dateSelection = { placed_at: { $gte: new Date(start), $lte: new Date(end) } };
        console.log("Custom date range ---->:", dateSelection);
        return await Order.find(dateSelection).populate('userId').populate('order_items.product').skip(skip).limit(limit);
    }

    switch (period) {
        case "daily":
            currentDate.setHours(0, 0, 0);
            dateSelection = {
                placed_at: {
                    $gte: currentDate,
                    $lt: new Date(),
                }
            }
            break;
        case "weekly":
            dateSelection = {
                placed_at: {
                    $gte: new Date(currentDate.setDate(currentDate.getDate() - 7)),
                    $lt: new Date(),
                }
            }
            break;
        case "monthly":
            dateSelection = {
                placed_at: {
                    $gte: new Date(currentDate.setMonth(currentDate.getMonth() - 1)),
                    $lt: new Date(),
                },
            }
        case "yearly":
            dateSelection = {
                placed_at: {
                    $gte: new Date(currentDate.setFullYear(currentDate.getFullYear() - 1)),
                    $lt: new Date(),
                }
            }
            break;
        default:
            break
    }
    return await Order.find(dateSelection).populate('userId').populate('order_items.product').skip(skip).limit(limit);
}

const getSalesReport = async (req, res) => {
    console.log("in the get reports---->")
    const {
        startDate = null,
        endDate = null,
        period = "daily",
        page = 1,
        limit = 5,
    } = req.query;

    const skip = (page - 1) * limit;

    let dateSelection = {};


    const salesReport = await getSalesReportDate(skip, limit, startDate, endDate, period);

    const totalReportCount = await Order.countDocuments(dateSelection);
    const totalPage = Math.ceil(totalReportCount / limit);
    const report = await Order.find(dateSelection)

    const totalSalesCount = report.length;
    const totalOrderAmount = report.reduce((acc, report) => acc + report.total_price_with_discount, 0);


    const totalDiscount = report.reduce((productAcc, item) => {
        return productAcc + item.coupon_discount;
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


const download_sales_report_pdf = async (req, res) => {
    const { startDate, endDate, period } = req.query;

    try {
        const reports = await getSalesReportDate(0, 0, startDate, endDate, period);

        const pdfDoc = new PDFDocument({ margin: 50, size: "A4" });
        res.setHeader("Content-Disposition", "attachment; filename=sales_report.pdf");
        pdfDoc.pipe(res);

        pdfDoc.fontSize(20).text("Sales Report", { align: "center" }).moveDown(2);

        for (let index = 0; index < reports.length; index++) {
            const report = reports[index];

            if (pdfDoc.y > 700) {
                pdfDoc.addPage();
            }

            pdfDoc.fontSize(14).font("Helvetica-Bold");
            pdfDoc.text(`Report ${index + 1}:`).moveDown(0.5);

            pdfDoc.fontSize(10).font("Helvetica");
            pdfDoc.text(
                `Order Date: ${new Date(report.placed_at).toLocaleDateString()}`
            );
            pdfDoc.text(`Customer Name: ${report.userId.name}`);
            pdfDoc.text(`Payment Method: ${report.payment_method}`);
            pdfDoc.text(`Delivery Status: ${report.order_status}`).moveDown(0.5);

            const table = {
                title: "Product Details",
                headers: [
                    "Product Name",
                    "Quantity",
                    "Unit Price (RS)",
                    "Total Price (RS)",
                    "Discount (RS)",
                    "Coupon (RS)",
                ],
                rows: report.order_items.map((p) => [
                    p.product.name,
                    p.quantity.toString(),
                    p.price.toFixed(2),
                    p.totalProductPrice.toFixed(2),
                    report.coupon_discount.toFixed(2),
                    report.total_discount.toFixed(2),
                ]),
            };

            try {
                await pdfDoc.table(table, {
                    prepareHeader: () => pdfDoc.font("Helvetica-Bold").fontSize(8),
                    prepareRow: (row, i) => pdfDoc.font("Helvetica").fontSize(8),
                    width: 500,
                    columnsSize: [140, 50, 70, 70, 70, 70],
                });
            } catch (error) {
                console.error("Error generating table:", error);
            }

            pdfDoc.moveDown(0.5);
            pdfDoc
                .font("Helvetica-Bold")
                .fontSize(10)
                .text(`Final Amount: RS. ${report.total_price_with_discount.toFixed(2)}`);
            pdfDoc.moveDown();
        }

        pdfDoc.end();
    } catch (error) {
        console.error("Error generating sales report PDF:", error);
        res.status(500).send("Error generating sales report PDF");
    }
};


const download_sales_report_xl = async (req, res) => {
    try {
        const { startDate, endDate, period } = req.query;
        const reports = await getSalesReportDate(0, 0, startDate, endDate, period);
        console.log("exel reporst--->", reports)

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
                unitPrice: item.price,
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

module.exports = { getSalesReport, download_sales_report_pdf, download_sales_report_xl }