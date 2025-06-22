import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { Subscription } from '@/src/types/global';

// In a real application, this would interact with a database and payment processor
// For this demo, we'll simulate subscription data in memory
export const subscriptions: Subscription[] = [
  {
    id: '1',
    userId: '1',
    status: 'active',
    plan: 'pro',
    amount: 10.00,
    billingCycle: 'monthly',
    nextBillingDate: new Date('2025-07-15').toISOString(),
    createdAt: new Date('2025-06-15').toISOString(),
  },
];

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

    // Find subscription for user
    const subscription = subscriptions.find(sub => sub.userId === userId);
    
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
    }    // Calculate amount based on plan and billing cycle (in GHS)
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

    // Find existing subscription or create new one
    const existingSubIndex = subscriptions.findIndex(sub => sub.userId === userId);
    
    if (existingSubIndex !== -1) {    // Update existing subscription
      subscriptions[existingSubIndex] = {
        ...subscriptions[existingSubIndex],
        plan: plan as 'free' | 'pro' | 'business', // Type assertion to match the enum
        billingCycle: billingCycle as 'monthly' | 'yearly', // Type assertion to match the enum
        amount,
        status: 'active',
        nextBillingDate: nextBillingDate.toISOString(),
      };
      
      return NextResponse.json({
        subscription: subscriptions[existingSubIndex],
        success: true,
        message: 'Subscription updated successfully',
      });
    } else {      // Create new subscription
      const newSubscription: Subscription = {
        id: String(subscriptions.length + 1),
        userId,
        status: 'active', // 'active' is explicitly a valid value for the status enum
        plan: plan as 'free' | 'pro' | 'business', // Type assertion to match the enum
        amount,
        billingCycle: billingCycle as 'monthly' | 'yearly', // Type assertion to match the enum
        nextBillingDate: nextBillingDate.toISOString(),
        createdAt: new Date().toISOString(),
      };
      
      subscriptions.push(newSubscription);
      
      return NextResponse.json({
        subscription: newSubscription,
        success: true,
        message: 'Subscription created successfully',
      });
    }
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

    // Find subscription for user
    const subIndex = subscriptions.findIndex(sub => sub.userId === userId);
    
    if (subIndex === -1) {
      return NextResponse.json(
        { error: 'No subscription found' },
        { status: 404 }
      );
    }

    // Update subscription status
    subscriptions[subIndex] = {
      ...subscriptions[subIndex],
      status: 'canceled',
    };

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
