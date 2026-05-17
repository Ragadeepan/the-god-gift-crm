import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function phoneVariants(raw: string) {
  const digits = raw.replace(/\D/g, "");
  const ten = digits.slice(-10);
  return [...new Set([raw, ten, `+91${ten}`, `91${ten}`, `0${ten}`])];
}

// GET /api/customers/:param  — lookup by phone number
export async function GET(_req: NextRequest, { params }: { params: Promise<{ param: string }> }) {
  try {
    const { param } = await params;
    const phone = decodeURIComponent(param).replace(/\s+/g, "");

    const customer = await prisma.customer.findFirst({
      where: { whatsappNumber: { in: phoneVariants(phone) } },
    });

    if (!customer)
      return NextResponse.json({ success: false, exists: false, message: "Customer not found" }, { status: 404 });

    return NextResponse.json({ success: true, exists: true, data: customer });
  } catch (e) {
    return NextResponse.json({ success: false, message: String(e) }, { status: 500 });
  }
}

// PUT /api/customers/:param  — update by id
export async function PUT(req: NextRequest, { params }: { params: Promise<{ param: string }> }) {
  try {
    const { param: id } = await params;
    const { name, instagramLink } = await req.json();

    const customer = await prisma.customer.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(instagramLink !== undefined && { instagramLink: instagramLink?.trim() || null }),
      },
    });

    return NextResponse.json({ success: true, message: "Customer updated", data: customer });
  } catch (e) {
    return NextResponse.json({ success: false, message: String(e) }, { status: 500 });
  }
}

// DELETE /api/customers/:param  — delete by id
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ param: string }> }) {
  try {
    const { param: id } = await params;
    await prisma.customer.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Customer deleted" });
  } catch (e) {
    return NextResponse.json({ success: false, message: String(e) }, { status: 500 });
  }
}
