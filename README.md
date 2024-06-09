# Quick Chat Application 🚀

**Quick is a simple and efficient chat application designed to facilitate fast and easy communication between users. Whether you want to chat one-on-one with friends or participate in group conversations, Quick has got you covered.**

## Key Features ✨

- **PWA**: Install as a Progressive Web App on your device.
- **Instant Messaging**: Send and receive messages in real-time.
- **One-on-One Chat**: Engage in private conversations with individual users.
- **Group Chats**: Create or join group conversations with multiple users.
- **User Authentication**: Secure login system using JWT authentication.
- **Customizable Profiles**: Personalize your profile with avatars, statuses, and more.
- **Notification System**: Receive alerts for new messages and updates.
- **Lightweight and Fast**: Built for speed and efficiency, ensuring a smooth user experience.
- **Video Call**: Initiate video calls with other users 📹.
- **Audio Call**: Make voice calls to other users 📞.
- **Responsive**: Provides a user-friendly experience on various devices.
- **Search Functionality**: Quickly find users and conversations 🔍.

_All key features have been thoroughly tested using Playwright to ensure reliability and performance._

## Technologies Used 🛠️

- **Next.js**: React framework for server-side rendering and static site generation
- **Express.js**: Web application framework for Node.js
- **Prisma**: Modern database toolkit
- **Docker**: Containerization platform
- **Tailwind CSS**: Utility-first CSS framework
- **Pusher**: Real-time communication API
- **PeerJS**: Peer-to-peer communication library
- **WebRTC**: Real-time communication protocol
- **Zustand**: Lightweight state management library
- **Playwright**: Browser automation library
- **Dexie**: IndexedDB wrapper library for client-side storage
- **Nodemailer**: Email sending library

## Getting Started 🚦

### Prerequisites 🚧

- [Node.js](https://nodejs.org/) installed on your machine.
- [Git](https://git-scm.com/)
- [npm](https://www.npmjs.com/) 
- [MongoDB](https://www.mongodb.com/) for persisting data.
- [docker](https://www.docker.com)

### How To Use 🚀

From your command line:

```bash
# Clone this repository
  $git clone https://github.com/SHABIN-K/quick.git

# Go into the repository
  $cd quick
```
 Navigate to the `server` folder and create a file: `.env`. Add the following contents:

```bash
   APP_PORT='Your server port number'
   APP_LOG_LEVEL='log level'
   APP_NODE_ENV='prodcution | development mode'
   APP_WEB_URL='your frontend url'
   APP_SESSION_SECRET='secret_key'
   APP_SALT_ROUNDS = 10
   APP_LEVEL="development"
  
# for database purposes
   APP_DATABASE_URL='your_Mongodb_database_url'

# for jwt token generation
   APP_ACCESS_TOKEN_SECRET='your_access_token_secret'
   APP_REFRESH_TOKEN_SECRET='your_access_token_secret'
   APP_REFRESH_TOKEN_EXPIRY=30d
   APP_ACCESS_TOKEN_EXPIRY=7d
   APP_RESET_PASSWORD_TOKEN_SECRET=15m
   APP_RESET_PASSWORD_TOKEN_EXPIRY_MINS=15m
   
# for email config
  APP_GMAIL_USERNAME='your_email_id'
  APP_GMAIL_PASS="your_email_pass"

# https://pusher.com
  APP_PUSHER_ID=""
  APP_PUSHER_KEY=""
  APP_PUSHER_SECRET=""
  APP_PUSHER_CLUSTER="
```

 Navigate to the `client` folder and create a file: `.env`:

```bash
# https://pusher.com/
  NEXT_PUBLIC_PUSHER_APP_KEY=''
  NEXT_PUBLIC_BACKEND_URL='your backend url'
```
### Running the Application 🛫

1. Ensure Docker is installed and running on your machine.
2. From the project root directory, run the following command to build and start the application:

```bash
   docker-compose up --build
```

### Development Workflow 🛠️

_For development purposes, you can start the client and server separately to benefit from hot reloading:_

1. Navigate to the `client` directory and run:

```bash
   npm install
   npm run dev
```
2. Open a new terminal, navigate to the server directory, and run:

```bash
   npm install
   npm run dev
```

### Testing 🧪

_All key features have been thoroughly tested using Playwright to ensure reliability and performance. To run the tests, use:_

```bash
   # Run Playwright tests
   npx playwright test
```

## Support 💬

Join Our [Telegram Group](https://www.telegram.dog/codexbotzsupport) for support and assistance, and our [Channel](https://www.telegram.dog/codexbotz) for updates. Report bugs and give feature requests there.

##

  **⭐️ Star this Repo if you Liked it! ⭐️**



