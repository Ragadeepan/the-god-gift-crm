import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import ExcelJS from "exceljs";

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({ orderBy: { createdAt: "desc" } });

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "The God Gift CRM";
    workbook.created = new Date();

    const sheet = workbook.addWorksheet("Customers", { views: [{ state: "frozen", ySplit: 1 }] });

    const headerFill = { type: "pattern" as const, pattern: "solid" as const, fgColor: { argb: "FF22C55E" } };
    const headerFont = { bold: true, color: { argb: "FFFFFFFF" }, size: 12 };
    const border = { top: { style: "thin" as const }, left: { style: "thin" as const }, bottom: { style: "thin" as const }, right: { style: "thin" as const } };

    sheet.columns = [
      { header: "#", key: "index", width: 6 },
      { header: "Customer Name", key: "name", width: 28 },
      { header: "WhatsApp Number", key: "whatsappNumber", width: 22 },
      { header: "Instagram Link", key: "instagramLink", width: 40 },
      { header: "Created Date", key: "createdAt", width: 22 },
      { header: "Last Updated", key: "updatedAt", width: 22 },
    ];

    const headerRow = sheet.getRow(1);
    headerRow.height = 36;
    headerRow.eachCell((cell) => {
      cell.fill = headerFill;
      cell.font = headerFont;
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = border;
    });

    customers.forEach((c, i) => {
      const row = sheet.addRow({
        index: i + 1,
        name: c.name,
        whatsappNumber: c.whatsappNumber,
        instagramLink: c.instagramLink || "—",
        createdAt: new Date(c.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
        updatedAt: new Date(c.updatedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
      });
      row.height = 24;
      row.eachCell((cell) => {
        cell.alignment = { vertical: "middle", horizontal: "left" };
        cell.border = border;
        if (i % 2 === 0) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF8FFFE" } };
      });
    });

    sheet.addRow([]);
    const summary = sheet.addRow(["", `Total: ${customers.length}`, "", "", `Exported: ${new Date().toLocaleString("en-IN")}`]);
    summary.font = { bold: true, color: { argb: "FF22C55E" } };

    const buffer = await workbook.xlsx.writeBuffer();
    const filename = `GodGift-CRM-${new Date().toISOString().split("T")[0]}.xlsx`;

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (e) {
    return NextResponse.json({ success: false, message: String(e) }, { status: 500 });
  }
}
