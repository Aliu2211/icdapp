import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { getUserProjects, createNewProject } from '@/src/lib/db/filedb';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Access user email from session (as id might not be directly available)
  const userEmail = session.user?.email as string;
  
  // Get the user's projects from the file-based database
  // Note: In a real app, you'd have a proper user ID system
  const userProjects = await getUserProjects(userEmail);

  return NextResponse.json({
    projects: userProjects,
  });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    // Use email as the user identifier
    const userEmail = session.user?.email as string;
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.description || !data.type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
      // Create a new project using the file-based database
    const project = await createNewProject({
      userId: userEmail, // Using email as userId
      name: data.name,
      description: data.description,
      type: data.type,
      status: 'draft',
      progress: 0, // Add the progress field
      tags: data.tags || [],
      deploymentTarget: data.deploymentTarget || null,
      collaborators: data.collaborators || 0,
      image: data.image || null,
    });
    
    return NextResponse.json({
      project,
    });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
