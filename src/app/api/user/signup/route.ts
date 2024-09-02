import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, password } = body;

  try {
    // checking if the user filled all the required fields
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "All input fields are required" },
        { status: 400 }
      );
    }

    // checking if the user already exists in the database
    const existingUser = await prisma.rentalUser.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // creating new user with hashed password
    const newUser = await prisma.rentalUser.create({
      data: { email, name, password: hashedPassword },
    });

    return NextResponse.json(
      { message: "User registered successfully", data: newUser },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
