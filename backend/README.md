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
EMAIL_USER="email@gmail.com"
EMAIL_APP_PASSWORD="your google app password "
PORT=5000
EMAIL_SERVICE=gmail
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
- `JWT_SECRET`: Secret key for JWT tokens , you can make this a random string or use some online generator
- `EMAIL_USER`: Gmail address for sending emails
- `EMAIL_APP_PASSWORD`: Gmail app password (not regular password)

## Email Setup

To enable password reset emails, you need a Gmail app password:

1. Go to Google Account Settings → Security
2. Find "App passwords" under "Signing in to Google"
3. Select "Mail" and generate a 16-character password
4. Use this password as `EMAIL_APP_PASSWORD`
