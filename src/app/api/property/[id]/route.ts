import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/prisma";

export async function GET(request: Request) {
  try {
    const id = request.url.split("/").pop();

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const property = await prisma.property.findUnique({
      where: { id: id },
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(property, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
