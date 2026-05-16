const prisma = require("../services/prismaClient");

// GET /api/customers — list all with optional search
const getAllCustomers = async (req, res, next) => {
  try {
    const { search = "", page = 1, limit = 50 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { whatsappNumber: { contains: search, mode: "insensitive" } },
            { instagramLink: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: Number(limit),
      }),
      prisma.customer.count({ where }),
    ]);

    res.json({
      success: true,
      data: customers,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/customers/:phone — find by WhatsApp number
const getCustomerByPhone = async (req, res, next) => {
  try {
    const { phone } = req.params;
    const normalizedPhone = phone.replace(/\s+/g, "").trim();

    const customer = await prisma.customer.findUnique({
      where: { whatsappNumber: normalizedPhone },
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        exists: false,
        message: "Customer not found — new customer",
      });
    }

    res.json({
      success: true,
      exists: true,
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/customers — create customer
const createCustomer = async (req, res, next) => {
  try {
    const { whatsappNumber, name, instagramLink } = req.body;

    const customer = await prisma.customer.create({
      data: {
        whatsappNumber: whatsappNumber.replace(/\s+/g, "").trim(),
        name: name.trim(),
        instagramLink: instagramLink?.trim() || null,
      },
    });

    res.status(201).json({
      success: true,
      message: "Customer saved successfully",
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/customers/:id — update customer
const updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, instagramLink } = req.body;

    const customer = await prisma.customer.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(instagramLink !== undefined && {
          instagramLink: instagramLink?.trim() || null,
        }),
      },
    });

    res.json({
      success: true,
      message: "Customer updated successfully",
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/customers/:id — delete customer
const deleteCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.customer.delete({ where: { id } });

    res.json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/customers/stats — dashboard stats
const getStats = async (req, res, next) => {
  try {
    const [total, recentCustomers, todayCount] = await Promise.all([
      prisma.customer.count(),
      prisma.customer.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.customer.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
    ]);

    const thisWeekStart = new Date();
    thisWeekStart.setDate(thisWeekStart.getDate() - 7);
    const weekCount = await prisma.customer.count({
      where: { createdAt: { gte: thisWeekStart } },
    });

    res.json({
      success: true,
      data: {
        total,
        todayCount,
        weekCount,
        recentCustomers,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCustomers,
  getCustomerByPhone,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getStats,
};
