import http from 'http';
import app from './src/app';

// config env;
import 'dotenv/config';

const port = process.env.APP_PORT || 5000;
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`, process.env.APP_LEVEL);
  console.log(` 
________  ___  ___  ________  ___  ___  __       
|\\   __  \\|\\  \\|\\  \\|\\   ____\\|\\  \\|\\  \\|\\  \\     
\\ \\  \\|\\  \\ \\  \\\\\\  \\ \\  \\___|\\ \\  \\ \\  \\/  /|_   
 \\ \\  \\\\\\  \\ \\  \\\\\\  \\ \\  \\    \\ \\  \\ \\   ___  \\  
  \\ \\  \\\\\\  \\ \\  \\\\\\  \\ \\  \\____\\ \\  \\ \\  \\\\ \\  \\ 
   \\ \\_____  \\ \\_______\\ \\_______\\ \\__\\ \\__\\\\ \\__\\
    \\|___| \\__\\|_______|\\|_______|\\|__|\\|__| \\|__|
          \\|__|                                   
          
          Ditch the delays, connect in a heartbeat. It's chat lightning speed.
                                                  
`);
});
