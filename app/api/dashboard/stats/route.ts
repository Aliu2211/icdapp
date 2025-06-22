import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/auth-options';
import { getUserDashboardStats } from '@/src/lib/db/filedb';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const userEmail = session.user?.email as string;
  
  // Get dashboard statistics for the user from the file-based database
  const dashboardData = await getUserDashboardStats(userEmail);
  
  return NextResponse.json(dashboardData);
}
