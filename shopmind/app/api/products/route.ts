import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined;
    const query = searchParams.get("query");

    const products = await prisma.product.findMany({
      where: {
        AND: [
          category ? { category } : {},
          minPrice !== undefined ? { price: { gte: minPrice } } : {},
          maxPrice !== undefined ? { price: { lte: maxPrice } } : {},
          query ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
            ],
          } : {},
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("[Products API Error]", error);
    return NextResponse.json({ message: "Error fetching products" }, { status: 500 });
  }
}
