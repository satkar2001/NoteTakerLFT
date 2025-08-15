import app from './app.js';
import { testEmailService } from './utils/emailService.js';

const PORT = process.env.PORT || 10000;

testEmailService().then(isConfigured => {
  if (isConfigured) {
    console.log('Email service ready');
  } else {
    console.log('Email service not working proper G');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
