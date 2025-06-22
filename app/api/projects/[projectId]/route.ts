import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { getProjectById, updateExistingProject, deleteExistingProject } from '@/src/lib/db/filedb';

export async function GET(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const userEmail = session.user?.email as string;
  const { projectId } = params;
  
  // Get the specific project from the file-based database
  const project = await getProjectById(projectId);
  
  // Check if project exists and belongs to the user
  if (!project || project.userId !== userEmail) {
    return NextResponse.json(
      { error: 'Project not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    project,
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const userEmail = session.user?.email as string;
    const { projectId } = params;
    const data = await request.json();
    
    // Get the existing project
    const project = await getProjectById(projectId);
    
    // Check if project exists and belongs to the user
    if (!project || project.userId !== userEmail) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    // Update the project
    const updatedProject = await updateExistingProject(projectId, data);
    
    return NextResponse.json({
      project: updatedProject,
    });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const userEmail = session.user?.email as string;
    const { projectId } = params;
    
    // Get the existing project
    const project = await getProjectById(projectId);
    
    // Check if project exists and belongs to the user
    if (!project || project.userId !== userEmail) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    // Delete the project
    const success = await deleteExistingProject(projectId);
    
    return NextResponse.json({
      success,
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
