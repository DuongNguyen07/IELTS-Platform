import { getServerSession } from "next-auth";
import { authOptions } from "@/server/config/auth";
import prisma from "@/server/lib/prisma";

export async function requireAuth() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    throw new Error("UNAUTHORIZED");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  return { session, user };
}