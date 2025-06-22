import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/auth-options';
import { getProjectById, updateExistingProject, deleteExistingProject } from '@/src/lib/db/filedb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userEmail = session.user?.email as string;
  const { projectId } = await params;
  const project = await getProjectById(projectId);
  if (!project || project.userId !== userEmail) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }
  return NextResponse.json({ project });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const userEmail = session.user?.email as string;
    const { projectId } = await params;
    const data = await request.json();
    const project = await getProjectById(projectId);
    if (!project || project.userId !== userEmail) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    const updatedProject = await updateExistingProject(projectId, data);
    return NextResponse.json({ project: updatedProject });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const userEmail = session.user?.email as string;
    const { projectId } = await params;
    const project = await getProjectById(projectId);
    if (!project || project.userId !== userEmail) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    const success = await deleteExistingProject(projectId);
    return NextResponse.json({ success });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
