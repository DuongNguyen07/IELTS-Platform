export function validateEmail(email: string): string | null {
  if (!email) return 'Email is required';

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Invalid email format';
  }
  return null;
}

export function validatePassword(password: string): string[] | null {
  const errors: string[] = [];

  if (!password) {
    errors.push('Password is required');
    return errors;
  }

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  return errors.length > 0 ? errors : null;
}

export interface PasswordStrength {
  length: boolean;
  number: boolean;
  special: boolean;
  uppercase: boolean;
  lowercase: boolean;
}

export function checkPasswordStrength(password: string): PasswordStrength {
  return {
    length: password.length >= 8,
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
  };
}

export function validateName(name: string): string | null {
  if (!name) return 'Name is required';
  if (name.length < 2) return 'Name must be at least 2 characters';
  if (name.length > 100) return 'Name is too long';
  return null;
}

export function validatePasswordMatch(password: string, confirmPassword: string): string | null {
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return null;
}

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignupFormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export function validateSignupForm({ name, email, password, confirmPassword }: SignupFormData): SignupFormErrors | null {
  const errors: SignupFormErrors = {};

  const nameError = validateName(name);
  if (nameError) errors.name = nameError;

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  const passwordErrors = validatePassword(password);
  if (passwordErrors) errors.password = passwordErrors[0];

  const matchError = validatePasswordMatch(password, confirmPassword);
  if (matchError) errors.confirmPassword = matchError;

  return Object.keys(errors).length > 0 ? errors : null;
}
