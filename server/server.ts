import http from 'http';
import app from './src/app';

// config env;
import 'dotenv/config';

const port = process.env.APP_PORT || 5000;
app.set('port', port);

const server = http.createServer(app);

// default url
app.get('/api', (_req, res) => {
  res.status(200).json({ success: true, message: 'The API is up and running.' });
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
