# Backend

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/notetaker"
JWT_SECRET="your-secret-key"
EMAIL_USER="your-email@gmail.com"
EMAIL_APP_PASSWORD="your-gmail-app-password"
```

3. Set up database:
```bash
npx prisma migrate dev
npx prisma generate
```

4. Run the server:
```bash
npm run dev
```

Server will start on http://localhost:10000

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `EMAIL_USER`: Gmail address for sending emails
- `EMAIL_APP_PASSWORD`: Gmail app password (not regular password)

## Email Setup

To enable password reset emails, you need a Gmail app password:

1. Enable 2-Factor Authentication on your Google account
2. Go to Google Account Settings → Security
3. Find "App passwords" under "Signing in to Google"
4. Select "Mail" and generate a 16-character password
5. Use this password as `EMAIL_APP_PASSWORD`
