# Padel App

## Project Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/alepalacios7player-cloud/padel-app-2.git
   cd padel-app-2
   ```

2. **Install dependencies:**
   Make sure you have [Node.js](https://nodejs.org/) installed, then run:
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

## Firebase Configuration Guide

1. **Create a Firebase Project:**
   Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.

2. **Add a Web App:**
   Within your Firebase project settings, add a new web application and register it.

3. **Install Firebase SDK:**
   If it’s not already included, install the Firebase SDK:
   ```bash
   npm install firebase
   ```

4. **Initialize Firebase:**
   Create a `firebaseConfig.js` file in your `src` directory and add the configuration details provided by Firebase:
   ```javascript
   import { initializeApp } from "firebase/app";

   const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_PROJECT_ID.appspot.com",
       messagingSenderId: "YOUR_SENDER_ID",
       appId: "YOUR_APP_ID",
   };

   const app = initializeApp(firebaseConfig);
   ```

## Available npm Scripts

- `npm start`: Runs the app in development mode.
- `npm run build`: Builds the app for production to the `build` folder.
- `npm test`: Runs the tests.
- `npm run eject`: Exposes the configuration files for customization.

## Deployment Information

Deploy your application using a suitable hosting provider. Firebase Hosting is recommended.

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase:**
   ```bash
   firebase login
   ```

3. **Initialize Firebase in your project:**
   ```bash
   firebase init
   ```

4. **Deploy your application:**
   ```bash
   firebase deploy
   ```

## Project Structure Overview

```
padel-app-2/
├── src/
│   ├── components/      # React components
│   ├── firebaseConfig.js # Firebase configuration
│   ├── App.js           # Main application component
│   └── index.js         # Entry point
├── public/
│   ├── index.html       # Main HTML file
│   └── firebase-messaging-sw.js  # Service worker for Firebase Messaging
├── package.json          # Project metadata and dependencies
└── README.md             # Project documentation
```

Feel free to modify any specific details as necessary.
