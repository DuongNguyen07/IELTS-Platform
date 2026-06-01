export function validateEmail(email) {
  if (!email) return 'Email is required';
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Invalid email format';
  }
  return null; 
}

export function validatePassword(password) {
  const errors = [];
  
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

export function checkPasswordStrength(password) {
  return {
    length: password.length >= 8,
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
  };
}

export function validateName(name) {
  if (!name) return 'Name is required';
  if (name.length < 2) return 'Name must be at least 2 characters';
  if (name.length > 100) return 'Name is too long';
  return null;
}

export function validatePasswordMatch(password, confirmPassword) {
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return null;
}

export function validateSignupForm({ name, email, password, confirmPassword }) {
  const errors = {};
  
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