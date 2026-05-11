import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";
import type { User } from "@prisma/client";

export async function signup(name: string, email: string, password: string): Promise<User> {
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new Error("EMAIL_EXISTS");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  return prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
}
