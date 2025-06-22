import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/auth-options';
import { users, logUserStoreState } from '@/src/lib/user-store';

export async function PUT(request: NextRequest) {
  try {
    console.log("=== UPDATE PROFILE ENDPOINT CALLED ===");
    logUserStoreState();
    
    // Get authenticated session
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = (session.user as { id?: string }).id;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Invalid user session' },
        { status: 401 }
      );
    }

    // Get request data
    const { name, bio } = await request.json();
    
    // Validate input
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Find user
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user data
    users[userIndex] = {
      ...users[userIndex],
      name,
      bio: bio || users[userIndex].bio,
    };

    // Return updated user (excluding sensitive data)
    return NextResponse.json({
      id: users[userIndex].id,
      name: users[userIndex].name,
      email: users[userIndex].email,
      bio: users[userIndex].bio,
      createdAt: users[userIndex].createdAt,
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

// For testing/demo purposes only - in a real app you'd use proper authentication
export async function GET() {
  try {
    console.log("=== GET PROFILE ENDPOINT CALLED ===");
    logUserStoreState();
    
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = (session.user as { id?: string }).id;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Invalid user session' },
        { status: 401 }
      );
    }

    // Find user in shared user store
    const user = users.find(user => user.id === userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Return user data (excluding sensitive data)
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}
