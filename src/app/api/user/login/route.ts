import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json("Email and password are required", {
      status: 400,
    });
  }
  try {
    const user = await prisma.rentalUser.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      return NextResponse.json("User not found", { status: 404 });
    }
    // checking password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return NextResponse.json(
        { error: "Check your credentials" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "User login successfully", data: user },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
