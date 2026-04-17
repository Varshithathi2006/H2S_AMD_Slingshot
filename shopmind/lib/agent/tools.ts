import prisma from "@/lib/prisma";

/**
 * Tool definitions for the Gemini AI agent.
 */
export const tools = [
  {
    name: "search_products",
    description: "Search products by name, category, or price range from the database",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string" },
        category: { type: "string" },
        maxPrice: { type: "number" },
        minPrice: { type: "number" }
      },
      required: ["query"]
    }
  },
  {
    name: "get_product_details",
    description: "Get full details of a product by its ID",
    parameters: {
      type: "object",
      properties: { productId: { type: "string" } },
      required: ["productId"]
    }
  },
  {
    name: "manage_cart",
    description: "Add, remove, or update items in the user's cart",
    parameters: {
      type: "object",
      properties: {
        action: { type: "string", enum: ["add", "remove", "update"] },
        productId: { type: "string" },
        quantity: { type: "number" }
      },
      required: ["action", "productId", "quantity"]
    }
  },
  {
    name: "get_order_status",
    description: "Fetch the status and tracking info of a user's order",
    parameters: {
      type: "object",
      properties: {
        orderId: { type: "string" },
        fetchLatest: { type: "boolean" }
      }
    }
  },
  {
    name: "apply_coupon",
    description: "Find and apply the best valid coupon for the current cart total",
    parameters: {
      type: "object",
      properties: { cartTotal: { type: "number" } },
      required: ["cartTotal"]
    }
  },
  {
    name: "get_recommendations",
    description: "Get personalized product recommendations for the user",
    parameters: {
      type: "object",
      properties: {
        userId: { type: "string" },
        limit: { type: "number" }
      },
      required: ["userId", "limit"]
    }
  }
];

export const adminTools = [
  {
    name: "analyze_sales_trends",
    description: "Analyze sales data and return trends for a given period",
    parameters: {
      type: "object",
      properties: { days: { type: "number" } },
      required: ["days"]
    }
  },
  {
    name: "get_low_stock_alerts",
    description: "Return products with stock below threshold",
    parameters: {
      type: "object",
      properties: { threshold: { type: "number" } },
      required: ["threshold"]
    }
  }
];

/**
 * Implementation of tools
 */
export const toolImplementations = {
  search_products: async ({ query, category, maxPrice, minPrice }: any) => {
    return await prisma.product.findMany({
      where: {
        AND: [
          category ? { category } : {},
          minPrice ? { price: { gte: minPrice } } : {},
          maxPrice ? { price: { lte: maxPrice } } : {},
          {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
            ],
          },
        ],
      },
      take: 5,
    });
  },
  
  get_product_details: async ({ productId }: any) => {
    return await prisma.product.findUnique({ where: { id: productId } });
  },
  
  manage_cart: async ({ action, productId, quantity, userId }: any) => {
    if (action === "add" || action === "update") {
        const existing = await prisma.cartItem.findFirst({ where: { userId, productId } });
        if (existing) {
            return await prisma.cartItem.update({
                where: { id: existing.id },
                data: { quantity: action === "add" ? existing.quantity + quantity : quantity }
            });
        }
        return await prisma.cartItem.create({ data: { userId, productId, quantity } });
    } else if (action === "remove") {
        return await prisma.cartItem.deleteMany({ where: { userId, productId } });
    }
  },

  get_order_status: async ({ orderId }: any) => {
    return await prisma.order.findUnique({ where: { id: orderId } });
  },

  apply_coupon: async ({ cartTotal }: any) => {
    const coupons = await prisma.coupon.findMany({
      where: { isActive: true, minOrderValue: { lte: cartTotal } },
      orderBy: { discountPct: "desc" },
      take: 1
    });
    return coupons[0] || { message: "No valid coupons found" };
  },

  get_recommendations: async ({ userId, limit = 4 }: any) => {
    // Basic logic: recommend products from categories user has ordered before
    const pastOrders = await prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } }
    });
    const categories = Array.from(new Set(pastOrders.flatMap(o => o.items.map(i => i.product.category))));
    
    return await prisma.product.findMany({
        where: { category: { in: categories.length > 0 ? categories : ["Electronics"] } },
        take: limit
    });
  }
};
