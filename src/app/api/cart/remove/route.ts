import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/prisma";

export async function PATCH(request: NextRequest) {
  try {
    const { userId, cartId, cartItemId } = await request.json();

    if (!userId || !cartId || !cartItemId) {
      return NextResponse.json(
        { message: "User ID, Cart ID, and Cart Item ID are required" },
        { status: 400 }
      );
    }

    const cart = await prisma.cart.findFirst({
      where: { id: cartId, userId },
      include: { cartItems: true },
    });

    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });

    if (!cartItem) {
      return NextResponse.json(
        { message: "Cart item not found" },
        { status: 404 }
      );
    }

    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    const remainingCartItems = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: { property: true },
    });

    const updatedTotalCost = remainingCartItems.reduce(
      (
        total: number,
        item: {
          checkOutDate: { getTime: () => number };
          checkInDate: { getTime: () => number };
          property: { price: number };
        }
      ) => {
        const days = Math.ceil(
          (item.checkOutDate.getTime() - item.checkInDate.getTime()) /
            (1000 * 3600 * 24)
        );
        return total + days * item.property.price;
      },
      0
    );

    // Update the cart's total cost
    await prisma.cart.update({
      where: { id: cart.id },
      data: { totalCost: updatedTotalCost },
    });

    return NextResponse.json(
      {
        message: "Cart item deleted and total cost updated",
        data: { totalCost: updatedTotalCost },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json(
      { message: "Something went wrong", error },
      { status: 500 }
    );
  }
}
