import { NextResponse, type NextRequest } from 'next/server';
import {
  validateEmail,
  validatePassword,
  validateName,
} from '@/shared/validation';
import { sanitizeInput } from '@/shared/sanitize';
import { checkRateLimit } from '@/server/middleware/rateLimit';
import { logSecurityEvent } from '@/server/services/securityLog.service';
import { signup } from '@/server/services/auth.service';

export async function POST(req: NextRequest) {
  try {
    const rateLimitResult = await checkRateLimit('signup_global', 10, 60000);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many signup attempts. Please try again later.' },
        { status: 429 }
      );
    }

    // 2. Parse request
    let body: { name?: unknown; email?: unknown; password?: unknown };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    // 3. Sanitize inputs
    let name = sanitizeInput(body.name) as string;
    let email = sanitizeInput((body.email as string)?.toLowerCase()) as string;
    const password = body.password as string;

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

    // 5. Check if user already exists and create account
    const user = await signup(name, email, password);

    // 6. Log success
    await logSecurityEvent('SIGNUP_SUCCESS', user.id, { email });

    // 7. Return success
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
    if (error instanceof Error && error.message === "EMAIL_EXISTS") {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    console.error("Signup error:", error);

    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}
