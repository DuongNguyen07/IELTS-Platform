import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { validateEmail, validatePassword, validateName, sanitizeInput } from '@/lib/validation'; // ← SHARED
import { logSecurityEvent, checkRateLimit } from '@/lib/apiAuth';

export async function POST(req) {
  try {
    // 1. Rate limiting
    const rateLimitError = checkRateLimit('signup_global', 10, 60000);
    if (rateLimitError) return rateLimitError;

    // 2. Parse request
    const body = await req.json();
    let { name, email, password } = body;

    // 3. Sanitize inputs
    name = sanitizeInput(name);
    email = sanitizeInput(email?.toLowerCase());

    // 4. Validate using SHARED validation functions
    const nameError = validateName(name);
    if (nameError) {
      return NextResponse.json({ error: nameError }, { status: 400 });
    }

    const emailError = validateEmail(email);
    if (emailError) {
      return NextResponse.json({ error: emailError }, { status: 400 });
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors) {
      return NextResponse.json(
        { error: passwordErrors.join(', ') },
        { status: 400 }
      );
    }

    // 5. Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      await logSecurityEvent('SIGNUP_DUPLICATE', null, { email });
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // 6. Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 7. Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // 8. Log success
    await logSecurityEvent('SIGNUP_SUCCESS', user.id, { email });

    // 9. Return success
    return NextResponse.json(
      { 
        success: true,
        message: 'Account created successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Signup error:', error);
    await logSecurityEvent('SIGNUP_ERROR', null, { error: error.message });
    
    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    );
  }
}