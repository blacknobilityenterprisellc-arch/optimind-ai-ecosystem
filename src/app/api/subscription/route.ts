import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get session token from authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const sessionToken = authHeader.substring(7);
    
    // Validate session
    const sessionResult = await db.query(
      'SELECT * FROM sessions WHERE token = ? AND expires_at > ?',
      [sessionToken, new Date()]
    );

    if (sessionResult.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    // Get subscription
    const subscriptionResult = await db.query(
      'SELECT * FROM subscriptions ORDER BY created_at DESC LIMIT 1'
    );

    let subscription = null;
    let isPremium = false;
    let hasActiveTrial = false;
    let trialDaysRemaining = 0;

    if (subscriptionResult.length > 0) {
      subscription = subscriptionResult[0];
      const now = new Date();
      
      // Check subscription status
      if (subscription.current_period_end < now) {
        subscription.status = 'expired';
        isPremium = false;
      } else if (subscription.status === 'trial' && subscription.trial_end) {
        if (subscription.trial_end > now) {
          const trialEnd = new Date(subscription.trial_end);
          const diffTime = trialEnd.getTime() - now.getTime();
          trialDaysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          isPremium = true;
          hasActiveTrial = true;
        } else {
          subscription.status = 'expired';
          isPremium = false;
        }
      } else {
        isPremium = subscription.status === 'active';
      }
    }

    // Get usage data
    const usageResult = await db.query(
      'SELECT * FROM subscription_usage ORDER BY created_at DESC LIMIT 1'
    );

    let usage = {
      storageUsed: 150 * 1024 * 1024, // 150MB
      storageLimit: isPremium ? 1024 * 1024 * 1024 * 1024 : 500 * 1024 * 1024, // 1TB vs 500MB
      photosScanned: 45,
      scanLimit: isPremium ? 10000 : 100,
      aiTagsGenerated: 120,
      aiTagLimit: isPremium ? 50000 : 500,
      vaultAccess: isPremium,
      advancedEditing: isPremium,
    };

    if (usageResult.length > 0) {
      usage = {
        ...usageResult[0],
        storageLimit: isPremium ? 1024 * 1024 * 1024 * 1024 : 500 * 1024 * 1024,
        scanLimit: isPremium ? 10000 : 100,
        aiTagLimit: isPremium ? 50000 : 500,
        vaultAccess: isPremium,
        advancedEditing: isPremium,
      };
    }

    return NextResponse.json({
      subscription,
      isPremium,
      hasActiveTrial,
      trialDaysRemaining,
      usage
    });

  } catch (error) {
    console.error('Subscription fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const sessionToken = authHeader.substring(7);
    
    // Validate session
    const sessionResult = await db.query(
      'SELECT * FROM sessions WHERE token = ? AND expires_at > ?',
      [sessionToken, new Date()]
    );

    if (sessionResult.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    const { planId, action } = await request.json();
    
    if (!planId || !['subscribe', 'trial'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 }
      );
    }

    const now = new Date();
    let currentPeriodEnd: Date;
    let status: string;
    let trialEnd: Date | null = null;

    if (action === 'trial') {
      currentPeriodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
      trialEnd = currentPeriodEnd;
      status = 'trial';
    } else {
      switch (planId) {
        case 'monthly':
          currentPeriodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
          break;
        case 'annual':
          currentPeriodEnd = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
          break;
        case 'lifetime':
          currentPeriodEnd = new Date(now.getTime() + 50 * 365 * 24 * 60 * 60 * 1000); // 50 years
          break;
        default:
          return NextResponse.json(
            { error: 'Invalid plan ID' },
            { status: 400 }
          );
      }
      status = 'active';
    }

    // Create subscription
    const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await db.query(
      `INSERT INTO subscriptions (
        id, plan_id, status, current_period_start, current_period_end, 
        trial_end, cancel_at_period_end, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        subscriptionId,
        planId,
        status,
        now,
        currentPeriodEnd,
        trialEnd,
        false,
        now,
        now
      ]
    );

    // Create or update usage record
    const usageId = `usage_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const isPremium = true;
    
    await db.query(
      `INSERT INTO subscription_usage (
        id, subscription_id, storage_used, storage_limit, photos_scanned, 
        scan_limit, ai_tags_generated, ai_tag_limit, vault_access, 
        advanced_editing, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        usageId,
        subscriptionId,
        150 * 1024 * 1024, // 150MB
        isPremium ? 1024 * 1024 * 1024 * 1024 : 500 * 1024 * 1024, // 1TB vs 500MB
        45,
        isPremium ? 10000 : 100,
        120,
        isPremium ? 50000 : 500,
        isPremium,
        isPremium,
        now,
        now
      ]
    );

    const subscription = {
      id: subscriptionId,
      plan_id: planId,
      status,
      current_period_start: now,
      current_period_end,
      trial_end: trialEnd,
      cancel_at_period_end: false,
      created_at: now,
      updated_at: now
    };

    return NextResponse.json({
      subscription,
      isPremium: true,
      hasActiveTrial: action === 'trial',
      trialDaysRemaining: action === 'trial' ? 30 : 0
    });

  } catch (error) {
    console.error('Subscription creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}