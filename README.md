# Round-Robin Coupon Distribution System

A Next.js application that distributes coupons to guest users in a round-robin manner while preventing abuse through IP tracking and cookies.

## Features

- **Coupon Distribution:** Distributes coupons in a round-robin fashion from a predefined list
- **Guest Access:** Users can claim coupons without login or account creation
- **Abuse Prevention:**
  - IP Tracking: Records user IP addresses and restricts claims from the same IP within a set timeframe
  - Cookie Tracking: Uses browser cookies to prevent multiple claims from the same browser session
- **User Feedback:** Clear messages indicating successful claims or remaining cooldown time

## Tech Stack

- Next.js with App Router
- TypeScript
- Tailwind CSS
- Redis for state management and tracking
- Cookies for browser session tracking

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- pnpm (v9 or higher)
- Redis server (optional for development, required for production)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Amank-root/ticketing-system.git
   cd ticketing-system
   ```

2. Install dependencies
   ```bash
   pnpm install
   ```

3. Create a `.env.local` file with the following variables:
   ```
   REDIS_URL=redis://localhost:6379
   ```

4. Start the development server
   ```bash
   pnpm dev
   ```

5. Access the application at http://localhost:3000

### Production Deployment

1. Build the application
   ```bash
   pnpm build
   ```

2. Start the production server
   ```bash
   pnpm start
   ```

## Abuse Prevention Strategies

This application implements the following strategies to prevent users from claiming multiple coupons:

1. **IP-based Tracking**
   - Each user's IP address is recorded when claiming a coupon
   - Users from the same IP cannot claim another coupon within the cooldown period (1 hour)
   - This prevents users from refreshing the page to get multiple coupons

2. **Cookie-based Tracking**
   - A unique identifier is stored in the user's browser via cookies
   - This identifier is tracked alongside their coupon claims
   - Prevents users from using different browsers on the same device to claim multiple coupons

3. **Rate Limiting**
   - The system enforces a cooldown period (1 hour) between coupon claims
   - Users are informed of the remaining time before they can claim another coupon

These combined strategies create multiple layers of protection against common abuse patterns while maintaining a good user experience for legitimate users.

## Deployment on Vercel

This application can be easily deployed on Vercel:

### Prerequisites for Vercel Deployment

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. A production Redis instance (we recommend [Upstash Redis](https://upstash.com) for Vercel integration)

### Deployment Steps

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. **Using Vercel Dashboard (recommended):**
   - Login to your Vercel dashboard
   - Click "Add New" → "Project"
   - Import your repository
   - Configure your project:
     - Root Directory: (leave as default)
     - Framework Preset: Next.js
   - In "Environment Variables" section:
     - Add `REDIS_URL` with your production Redis URL
   - Click "Deploy"

3. **Using Vercel CLI:**
   - Install Vercel CLI: `pnpm install -g vercel`
   - Navigate to your project directory
   - Run `vercel login` and follow authentication steps
   - Run `vercel` to deploy
   - Follow the prompts to configure your project

### Post-Deployment

After deployment, Vercel will provide you with a URL to access your application. You may want to:

1. Configure a custom domain in the Vercel dashboard
2. Set up monitoring and analytics
3. Configure Redis connection pooling for better performance

### Troubleshooting

If you encounter issues with Redis connections in production:

1. Verify your Redis URL is correctly set in the Vercel environment variables
2. Check the Vercel logs for any connection errors
3. Ensure your Redis provider allows connections from Vercel's IP ranges
