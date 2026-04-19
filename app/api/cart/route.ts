import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const items = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: { product: true },
    });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching cart" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { productId, quantity } = await req.json();

    const existingItem = await prisma.cartItem.findFirst({
      where: { userId: session.user.id, productId },
    });

    if (existingItem) {
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
      return NextResponse.json(updatedItem);
    }

    const newItem = await prisma.cartItem.create({
      data: {
        userId: session.user.id,
        productId,
        quantity,
      },
    });
    return NextResponse.json(newItem);
  } catch (error) {
    return NextResponse.json({ message: "Error adding to cart" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { productId } = await req.json();
    await prisma.cartItem.deleteMany({
      where: { userId: session.user.id, productId },
    });
    return NextResponse.json({ message: "Removed from cart" });
  } catch (error) {
    return NextResponse.json({ message: "Error removing from cart" }, { status: 500 });
  }
}
