import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/customers
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 50);
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { whatsappNumber: { contains: search, mode: "insensitive" as const } },
            { instagramLink: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit }),
      prisma.customer.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: customers,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (e) {
    return NextResponse.json({ success: false, message: String(e) }, { status: 500 });
  }
}

// POST /api/customers
export async function POST(req: NextRequest) {
  try {
    const { whatsappNumber, name, instagramLink } = await req.json();
    if (!whatsappNumber || !name)
      return NextResponse.json({ success: false, message: "whatsappNumber and name are required" }, { status: 400 });

    const customer = await prisma.customer.create({
      data: {
        whatsappNumber: whatsappNumber.replace(/\s+/g, "").trim(),
        name: name.trim(),
        instagramLink: instagramLink?.trim() || null,
      },
    });

    return NextResponse.json({ success: true, message: "Customer saved successfully", data: customer }, { status: 201 });
  } catch (e: unknown) {
    const err = e as { code?: string };
    if (err.code === "P2002")
      return NextResponse.json({ success: false, message: "This WhatsApp number is already registered" }, { status: 409 });
    return NextResponse.json({ success: false, message: String(e) }, { status: 500 });
  }
}
