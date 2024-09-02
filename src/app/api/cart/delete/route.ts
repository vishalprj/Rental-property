import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/prisma";

export async function PATCH(request: NextRequest) {
  try {
    const { cartId } = await request.json();

    if (!cartId) {
      return NextResponse.json(
        { error: "Cart ID is required" },
        { status: 400 }
      );
    }

    const updatedCart = await prisma.$transaction([
      prisma.cartItem.deleteMany({
        where: { cartId: cartId },
      }),
      prisma.cart.update({
        where: { id: cartId },
        data: { totalCost: 0 },
      }),
    ]);

    return NextResponse.json(
      { message: "All cart items deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
