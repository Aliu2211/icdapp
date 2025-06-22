
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/auth-options';
// import { getUserSubscription, upsertUserSubscription, getAllSubscriptions, saveAllSubscriptions } from '@/src/lib/db/filedb';
import { getUserSubscription, upsertUserSubscription } from '@/src/lib/db/filedb';
import { Subscription } from '@/src/types/global';

// Get user's subscription
export async function GET() {
  try {
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

    // Get subscription for user
    const subscription = await getUserSubscription(userId);
    
    if (!subscription) {
      return NextResponse.json(
        { subscription: null, hasSubscription: false },
        { status: 200 }
      );
    }

    return NextResponse.json({
      subscription,
      hasSubscription: true,
    });
  } catch (error) {
    console.error('Subscription fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription data' },
      { status: 500 }
    );
  }
}

// Create or update subscription
export async function POST(request: NextRequest) {
  try {
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
    const { plan, billingCycle } = await request.json();
    
    // Validate input
    if (!plan || !billingCycle) {
      return NextResponse.json(
        { error: 'Plan and billing cycle are required' },
        { status: 400 }
      );
    }

    // Calculate amount based on plan and billing cycle (in GHS)
    let amount = 0;
    if (plan === 'pro') {
      amount = billingCycle === 'monthly' ? 120.00 : 1200.00;
    } else if (plan === 'business') {
      amount = billingCycle === 'monthly' ? 240.00 : 2400.00;
    } else {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      );
    }

    // Calculate next billing date (1 month or 1 year from now)
    const nextBillingDate = new Date();
    if (billingCycle === 'monthly') {
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
    } else {
      nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
    }

    // Create or update subscription
    const subscription: Subscription = {
      id: `sub_${Date.now()}`,
      userId,
      status: 'active',
      plan: plan as 'free' | 'pro' | 'business',
      amount,
      billingCycle: billingCycle as 'monthly' | 'yearly',
      nextBillingDate: nextBillingDate.toISOString(),
      createdAt: new Date().toISOString(),
    };

    const savedSubscription = await upsertUserSubscription(subscription);
    
    return NextResponse.json({
      subscription: savedSubscription,
      success: true,
      message: 'Subscription updated successfully',
    });
  } catch (error) {
    console.error('Subscription update error:', error);
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    );
  }
}

// Cancel subscription
export async function DELETE() {
  try {
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

    // Get existing subscription
    const subscription = await getUserSubscription(userId);
    
    if (!subscription) {
      return NextResponse.json(
        { error: 'No subscription found' },
        { status: 404 }
      );
    }

    // Update subscription status to canceled
    const canceledSubscription = {
      ...subscription,
      status: 'canceled' as const,
    };

    await upsertUserSubscription(canceledSubscription);

    return NextResponse.json({
      success: true,
      message: 'Subscription canceled successfully',
    });
  } catch (error) {
    console.error('Subscription cancellation error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}
