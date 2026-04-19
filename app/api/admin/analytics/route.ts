import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const totalRevenue = await prisma.order.aggregate({
      _sum: { total: true },
    });

    const totalOrders = await prisma.order.count();
    
    const lowStockCount = await prisma.product.count({
      where: { stock: { lt: 10 } },
    });

    // Mock conversion rate
    const conversionRate = 3.5;

    // Sales over time (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const salesHistory = await prisma.order.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { total: true, createdAt: true },
    });

    return NextResponse.json({
      totalRevenue: totalRevenue._sum.total || 0,
      totalOrders,
      lowStockCount,
      conversionRate,
      salesHistory
    });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching analytics" }, { status: 500 });
  }
}
