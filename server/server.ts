import http from 'http';
import app from './src/app';

// config env;
import 'dotenv/config';

const port = process.env.APP_PORT || 5000;
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
