import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/prisma";

export async function PATCH(request: NextRequest) {
  const { userId, propertyId, checkInDate, checkOutDate } =
    await request.json();

  try {
    // Validate dates
    const parsedCheckInDate = new Date(checkInDate);
    const parsedCheckOutDate = new Date(checkOutDate);

    if (
      isNaN(parsedCheckInDate.getTime()) ||
      isNaN(parsedCheckOutDate.getTime()) ||
      parsedCheckInDate >= parsedCheckOutDate
    ) {
      return NextResponse.json(
        { message: "Invalid check-in or check-out date" },
        { status: 400 }
      );
    }

    let cart = await prisma.cart.findFirst({
      where: { userId },
      include: { cartItems: true },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
          totalCost: 0,
        },
        include: { cartItems: true },
      });
    }

    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        propertyId,
      },
    });

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return NextResponse.json(
        { message: "Property not found" },
        { status: 404 }
      );
    }

    let updatedCartItem;
    if (existingCartItem) {
      // Update the existing cart item
      updatedCartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          checkInDate: parsedCheckInDate,
          checkOutDate: parsedCheckOutDate,
        },
      });
    } else {
      // Create a new cart item
      updatedCartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          propertyId,
          checkInDate: parsedCheckInDate,
          checkOutDate: parsedCheckOutDate,
        },
      });
    }

    // Recalculate the total cost
    const updatedCartItems = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: { property: true },
    });

    const updatedTotalCost = updatedCartItems.reduce(
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

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        cartItems: {
          include: { property: true },
        },
      },
    });

    return NextResponse.json(
      { message: "Cart item updated", data: updatedCart },
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
