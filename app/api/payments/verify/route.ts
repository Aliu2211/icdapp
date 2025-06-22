import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/auth-options';
import { getAllSubscriptions, saveAllSubscriptions } from '@/src/lib/db/filedb';
import { Subscription } from '@/src/types/global';

// This is a server-side endpoint to verify Paystack transactions
export async function POST(request: NextRequest) {
  try {
    const { reference } = await request.json();
    
    if (!reference) {
      return NextResponse.json({ error: "Transaction reference is required" }, { status: 400 });
    }

    // Get authenticated session
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = (session.user as { id?: string }).id;
    
    if (!userId) {
      return NextResponse.json({ error: "Invalid user session" }, { status: 401 });
    }

    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
    
    if (!PAYSTACK_SECRET_KEY) {
      console.error("PAYSTACK_SECRET_KEY is not defined in environment variables");
      return NextResponse.json({ error: "Payment configuration error" }, { status: 500 });
    }

    // Verify the transaction with Paystack API
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();    if (data.status && data.data.status === 'success') {
      // Transaction was successful
      // Update user's subscription
      const planType = data.data.metadata?.custom_fields?.find((field: { variable_name: string; value: string }) => field.variable_name === 'plan')?.value || 'monthly';
      const amount = data.data.amount / 100; // Convert from kobo back to base currency      // Get current subscriptions from file
      const subscriptions = await getAllSubscriptions();
      
      // Find existing subscription or create a new one
      const existingSubIndex = subscriptions.findIndex((sub: { userId: string }) => sub.userId === userId);
      const now = new Date();
      const nextBillingDate = new Date();
      
      if (planType === 'monthly') {
        nextBillingDate.setMonth(now.getMonth() + 1);
      } else {
        nextBillingDate.setFullYear(now.getFullYear() + 1);
      }
      
      const newSubscription: Subscription = {
        id: existingSubIndex >= 0 ? subscriptions[existingSubIndex].id : `sub_${Date.now()}`,
        userId,
        status: 'active' as const,
        plan: 'pro' as const,
        amount,
        billingCycle: planType as 'monthly' | 'yearly',
        nextBillingDate: nextBillingDate.toISOString(),
        createdAt: existingSubIndex >= 0 ? subscriptions[existingSubIndex].createdAt : now.toISOString(),
      };
      
      if (existingSubIndex >= 0) {
        subscriptions[existingSubIndex] = newSubscription;
      } else {
        subscriptions.push(newSubscription);
      }
        // Save updated subscriptions to file
      await saveAllSubscriptions(subscriptions);
      
      return NextResponse.json({
        success: true,
        message: "Payment verified successfully",
        data: {
          reference: data.data.reference,
          amount: amount,
          plan: planType,
          subscription: newSubscription
        }
      });
    } else {
      // Transaction verification failed
      return NextResponse.json({ 
        success: false, 
        message: "Payment verification failed",
        data: data
      }, { status: 400 });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 });
  }
}
