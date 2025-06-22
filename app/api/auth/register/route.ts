import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { findUserByEmail, addUser, getUserCount, User, logUserStoreState } from '@/src/lib/user-store';

export async function POST(request: NextRequest) {
  try {
    console.log("=== REGISTRATION ENDPOINT CALLED ===");
    logUserStoreState();
    
    const { name, email, password } = await request.json();
    console.log(`Registration attempt for email: ${email}`);

    // Validation
    if (!name || !email || !password) {
      console.log("Missing required fields");
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      console.log(`User already exists with email: ${email}`);
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully");

    // Create new user 
    const newUser: User = {
      id: String(getUserCount() + 1),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    // Add to user store
    addUser(newUser);
    console.log(`User registered successfully: ${email} with ID: ${newUser.id}`);
    
    logUserStoreState();

    // Return success but don't include password
    return NextResponse.json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
