const ExcelJS = require("exceljs");
const prisma = require("../services/prismaClient");

const exportToExcel = async (req, res, next) => {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: "desc" },
    });

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "The God Gift CRM";
    workbook.created = new Date();

    const sheet = workbook.addWorksheet("Customers", {
      views: [{ state: "frozen", ySplit: 1 }],
    });

    // Header styling
    const headerFill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF22C55E" },
    };
    const headerFont = { bold: true, color: { argb: "FFFFFFFF" }, size: 12 };
    const headerAlignment = { vertical: "middle", horizontal: "center" };
    const borderStyle = {
      top: { style: "thin", color: { argb: "FFE2E8F0" } },
      left: { style: "thin", color: { argb: "FFE2E8F0" } },
      bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
      right: { style: "thin", color: { argb: "FFE2E8F0" } },
    };

    // Define columns
    sheet.columns = [
      { header: "#", key: "index", width: 6 },
      { header: "Customer Name", key: "name", width: 28 },
      { header: "WhatsApp Number", key: "whatsappNumber", width: 22 },
      { header: "Instagram Link", key: "instagramLink", width: 40 },
      { header: "Created Date", key: "createdAt", width: 22 },
      { header: "Last Updated", key: "updatedAt", width: 22 },
    ];

    // Style header row
    const headerRow = sheet.getRow(1);
    headerRow.height = 36;
    headerRow.eachCell((cell) => {
      cell.fill = headerFill;
      cell.font = headerFont;
      cell.alignment = headerAlignment;
      cell.border = borderStyle;
    });

    // Add data rows
    customers.forEach((customer, index) => {
      const row = sheet.addRow({
        index: index + 1,
        name: customer.name,
        whatsappNumber: customer.whatsappNumber,
        instagramLink: customer.instagramLink || "—",
        createdAt: new Date(customer.createdAt).toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
        updatedAt: new Date(customer.updatedAt).toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
      });

      row.height = 24;
      row.eachCell((cell) => {
        cell.alignment = { vertical: "middle", horizontal: "left" };
        cell.border = borderStyle;
        if (index % 2 === 0) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFF8FFFE" },
          };
        }
      });
    });

    // Summary row at the bottom
    sheet.addRow([]);
    const summaryRow = sheet.addRow([
      "",
      `Total Customers: ${customers.length}`,
      "",
      "",
      `Exported: ${new Date().toLocaleString("en-IN")}`,
    ]);
    summaryRow.font = { bold: true, color: { argb: "FF22C55E" } };

    // Set response headers
    const filename = `GodGift-CRM-Customers-${new Date().toISOString().split("T")[0]}.xlsx`;
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    next(error);
  }
};

module.exports = { exportToExcel };
