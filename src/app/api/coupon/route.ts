import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToRedis, redis } from '@/lib/redis';
import { coupons } from '@/data/coupons';

const COOLDOWN_PERIOD = 60 * 60; // 1 hour in seconds

export async function GET(request: NextRequest) {
  try {
    await connectToRedis();
    
    // Get IP address from x-forwarded-for header (set by middleware)
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    
    // Get existing cookie for tracking
    const cookieStore = await cookies();
    const userCookieId = cookieStore.get('coupon_user_id')?.value;
    
    // Check if this IP has claimed a coupon recently
    const ipKey = `ip:${ip}:lastClaim`;
    const ipLastClaim = await redis.get(ipKey);
    
    if (ipLastClaim) {
      const timeRemaining = COOLDOWN_PERIOD - (Math.floor(Date.now() / 1000) - parseInt(ipLastClaim));
      if (timeRemaining > 0) {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        return NextResponse.json({
          error: 'Rate limit exceeded',
          message: `Please wait ${minutes} minutes and ${seconds} seconds before claiming another coupon`,
          timeRemaining
        }, { status: 429 });
      }
    }
    
    // Check if this browser session has claimed a coupon recently
    if (userCookieId) {
      const cookieKey = `cookie:${userCookieId}:lastClaim`;
      const cookieLastClaim = await redis.get(cookieKey);
      
      if (cookieLastClaim) {
        const timeRemaining = COOLDOWN_PERIOD - (Math.floor(Date.now() / 1000) - parseInt(cookieLastClaim));
        if (timeRemaining > 0) {
          const minutes = Math.floor(timeRemaining / 60);
          const seconds = timeRemaining % 60;
          return NextResponse.json({
            error: 'Rate limit exceeded',
            message: `Please wait ${minutes} minutes and ${seconds} seconds before claiming another coupon`,
            timeRemaining
          }, { status: 429 });
        }
      }
    }
    
    // Get current coupon index
    const currentIndex = parseInt(await redis.get('currentCouponIndex') || '0');
    
    // Get the coupon in round-robin fashion
    const coupon = coupons[currentIndex % coupons.length];
    
    // Update the index for the next user
    await redis.set('currentCouponIndex', (currentIndex + 1) % coupons.length);
    
    // Record this claim
    const now = Math.floor(Date.now() / 1000);
    await redis.set(ipKey, now.toString());
    
    // Set or update cookie for browser tracking
    const cookieId = userCookieId || crypto.randomUUID();
    const cookieKey = `cookie:${cookieId}:lastClaim`;
    await redis.set(cookieKey, now.toString());
    
    // Set cookie if it doesn't exist
    if (!userCookieId) {
      const response = NextResponse.json({ success: true, coupon });
      response.cookies.set('coupon_user_id', cookieId, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
        secure: process.env.NODE_ENV === 'production', // Only in production
        httpOnly: true, // Not accessible via JavaScript
        sameSite: 'strict' // Prevent CSRF attacks
      });
      return response;
    }
    
    return NextResponse.json({ success: true, coupon });
  } catch (error) {
    console.error('Error claiming coupon:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 