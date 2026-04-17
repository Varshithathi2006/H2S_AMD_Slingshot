import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching orders" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    const total = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total,
        status: "PENDING",
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
    });

    // Clear cart
    await prisma.cartItem.deleteMany({
      where: { userId: session.user.id },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error creating order" }, { status: 500 });
  }
}
