'use client';

import React, { useState } from 'react';
import { Coupon } from '@/data/coupons';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  const claimCoupon = async () => {
    setLoading(true);
    setError(null);
    setCoupon(null);
    
    try {
      const response = await fetch('/api/coupon');
      const data = await response.json();
      
      if (response.ok) {
        setCoupon(data.coupon);
        setCountdown(null);
      } else {
        setError(data.message || 'Failed to claim coupon');
        if (data.timeRemaining) {
          setCountdown(data.timeRemaining);
          const timer = setInterval(() => {
            setCountdown((prev) => {
              if (prev === null || prev <= 1) {
                clearInterval(timer);
                return null;
              }
              return prev - 1;
            });
          }, 1000);
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">Coupon Giveaway</h1>
        
        <p className="text-gray-600 mb-8 text-center">
          Claim your exclusive discount coupon. Each user can claim one coupon per hour.
        </p>
        
        {coupon ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h2 className="text-xl font-semibold text-green-700 mb-2">Your Coupon</h2>
            <div className="bg-white p-3 rounded border border-green-200 text-center mb-3">
              <span className="text-xl font-mono font-bold">{coupon.code}</span>
            </div>
            <p className="text-green-800 font-medium">{coupon.description}</p>
            <p className="text-sm text-green-600 mt-2">Save {coupon.discount} on your purchase</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-red-700 mb-2">Unable to Claim</h2>
            <p className="text-red-600">{error}</p>
            {countdown !== null && (
              <p className="text-sm text-red-500 mt-2">
                Time remaining: {formatTime(countdown)}
              </p>
            )}
          </div>
        ) : null}
        
        <button
          onClick={claimCoupon}
          disabled={loading || countdown !== null}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
            loading || countdown !== null
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
        >
          {loading ? 'Processing...' : countdown !== null ? `Try Again Later (${formatTime(countdown)})` : 'Claim Your Coupon'}
        </button>
        
        <p className="text-xs text-gray-500 mt-6 text-center">
          This system uses cookies and IP tracking to prevent abuse.
          One coupon per user per hour.
        </p>
      </div>
    </main>
  );
}
