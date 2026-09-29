# GPanel Environment Setup

## Required Environment Variables

Create a `.env` file in the GPanel client_side directory with the following variables:

```env
# API URLs
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_LANDING_URL=http://localhost:3001
NEXT_PUBLIC_LANDING_API_URL=http://localhost:8080
```

## GPanel Backend Environment Variables

Add these to your GPanel backend `.env`:

```env
SSO_SHARED_SECRET=your-sso-secret-key-here
GPANEL_CLIENT_URL=http://localhost:3002
JWT_SECRET=your-jwt-secret-here
PORT=5000
```

## Landing Page Frontend Environment Variables

Add these to your landing page frontend `.env`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_GPANEL_URL=http://localhost:3002
NEXT_PUBLIC_GLIVE_URL=http://localhost:3000
NEXT_PUBLIC_LANDING_URL=http://localhost:3001
```

## Landing Page Backend Environment Variables

Add these to your landing page backend `.env`:

```env
SSO_SHARED_SECRET=your-sso-secret-key-here
JWT_SECRET=SUPER_SECRET_KEY_GEREJA_PINTAR
FRONTEND_URL=http://localhost:3001
PORT=8080
```

## GLive Environment Variables

### GLive Frontend
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_LANDING_URL=http://localhost:3001
NEXT_PUBLIC_LANDING_API_URL=http://localhost:8080
```

### GLive Backend
```env
SSO_SHARED_SECRET=your-sso-secret-key-here
GLIVE_CLIENT_URL=http://localhost:3000
JWT_SECRET=your-jwt-secret-here
PORT=4000
```

## Domain Configuration

Your current domain setup:
- **3000**: GLive Frontend
- **3001**: Landing Page Frontend
- **3002**: GPanel Frontend
- **4000**: GLive Backend
- **5000**: GPanel Backend
- **8080**: Landing Page Backend

## SSO Shared Secret

Generate a secure SSO shared secret:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32
```

**IMPORTANT**: Use the SAME `SSO_SHARED_SECRET` in ALL three applications:
- Landing Page Backend
- GPanel Backend
- GLive Backend

This is required for proper HMAC signature verification across the SSO flow.
