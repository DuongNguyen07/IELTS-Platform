import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from '@/server/lib/prisma';
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter email and password');
        }

        // Find user
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          throw new Error('No user found with this email');
        }

        // Check password
        const isValid = await bcrypt.compare(credentials.password, user.password as string);

        if (!isValid) {
          throw new Error('Invalid password');
        }

        // Return user object (stored in JWT)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: (user as { role?: string }).role ?? 'user',
        };
      }
    })
  ],

  session: {
    strategy: 'jwt',
    maxAge: 2 * 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = (user as { role?: string }).role ?? 'user';
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.role = token.role ?? 'user';
      }
      return session;
    }
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  secret: process.env.NEXTAUTH_SECRET,
};
