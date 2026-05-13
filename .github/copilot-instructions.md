# EVM (Electronic Voting Machine) - Project Instructions

## Project Overview
This is a React-based Electronic Voting Machine web application integrated with Firebase. It provides:
- **Voter Interface**: Simple voting system for citizens
- **Admin Dashboard**: Real-time voting results for election commissioners
- **Real-time Database**: Firebase Firestore for vote storage and retrieval

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm start
```

The app will open at `http://localhost:3000`

### 3. Access the System

**Voter Interface (Landing Page)**
- URL: `http://localhost:3000/voter`
- Enter Voter ID and select a party to vote

**Admin Panel**
- URL: `http://localhost:3000/login`
- Login with demo credentials or create new account:
  - Email: `admin@evmvote.com`
  - Password: `admin123`
- View real-time voting results and voter list

## Project Structure

```
EVM/
├── public/
│   └── index.html           # Main HTML file
├── src/
│   ├── pages/
│   │   ├── Voter.js         # Voter interface component
│   │   ├── Admin.js         # Admin dashboard component
│   │   └── Login.js         # Login page component
│   ├── styles/
│   │   ├── Voter.css        # Voter interface styles
│   │   ├── Admin.css        # Admin dashboard styles
│   │   └── Login.css        # Login page styles
│   ├── firebase.js          # Firebase configuration & initialization
│   ├── App.js               # Main app component with routing
│   ├── index.js             # Entry point
│   └── App.css              # Global styles
├── package.json             # Dependencies & scripts
├── README.md                # User documentation
├── FIREBASE_SETUP.md        # Firebase configuration guide
└── .gitignore              # Git ignore file
```

## Key Features

### Voter Side
- Enter unique Voter ID
- Select party to vote for
- One vote per voter ID enforcement
- Real-time vote confirmation

### Admin Side
- Real-time vote counting
- Visual charts and progress bars
- Voter activity log with timestamps
- Leading party highlight
- Vote reset functionality (with confirmation)
- Secure admin authentication

## Technologies Used

- **React 18.2**: UI framework
- **React Router v6**: Client-side routing
- **Firebase 10.3**: Backend services
- **Firestore**: Real-time database
- **Firebase Auth**: Authentication
- **CSS3**: Modern styling with gradients and animations

## Configuration

### Firebase
- Pre-configured in `src/firebase.js`
- Project ID: `evmvote`
- Services: Firestore Database & Authentication

### Parties (Customizable)
Edit `PARTIES` array in:
- `src/pages/Voter.js` (Line 5)
- `src/pages/Admin.js` (Line 4)

Current parties: BJP, INC, TMC, CPIM

## Available Scripts

```bash
# Start development server (port 3000)
npm start

# Build production bundle
npm run build

# Run tests
npm test

# Eject configuration (not reversible)
npm run eject
```

## Important Notes

⚠️ **Security Notice**: 
- Firebase API key is public (intentionally restricted via security rules)
- Demo credentials are for testing only
- Set proper security rules in Firebase Console for production

📱 **Responsive Design**:
- Mobile optimized
- Tablet compatible
- Desktop full-featured

🔄 **Real-time Updates**:
- Uses Firestore real-time listeners
- Vote counts update instantly
- Voter list updates dynamically

## Database Collections

### votes
- Stores each vote cast
- Fields: party (string), timestamp (timestamp)

### voters
- Tracks voter participation
- Fields: voterId (string), party (string), votedAt (timestamp)

## Troubleshooting

**Problem**: Blank page on startup
- **Solution**: Check if Node.js is installed, run `npm install` again

**Problem**: Cannot vote (error message)
- **Solution**: Ensure Voter ID is unique, check browser console

**Problem**: Admin login fails
- **Solution**: Check Firebase Authentication is enabled, create new account

**Problem**: Results not updating
- **Solution**: Refresh page, check internet connection, verify Firebase rules

## Firebase Console Access

1. Go to: https://console.firebase.google.com
2. Select project: `evmvote`
3. Monitor:
   - Firestore collections (votes, voters)
   - Authentication users
   - Real-time database activity

## Deployment

### Local Testing
Already configured and ready to run with `npm start`

### Production Deployment
1. Build: `npm run build`
2. Deploy to Firebase Hosting, Vercel, Netlify, or your server

## Documentation Files

- **README.md**: Complete user guide
- **FIREBASE_SETUP.md**: Firebase configuration and security rules
- **This file**: Development instructions

## Environment Variables (Optional)

For production deployment, create `.env.local`:
```
REACT_APP_FIREBASE_API_KEY=AIzaSyBjYM_c-ofVUnas28GGwcdCgnBZYgX3eVA
REACT_APP_FIREBASE_PROJECT_ID=evmvote
```

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Performance Tips

- Use modern browser for best experience
- Clear cache if experiencing issues
- Ensure stable internet connection
- Monitor Firebase usage in console

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Start server: `npm start`
3. ✅ Test voter interface
4. ✅ Test admin panel with demo credentials
5. ✅ Review README.md for detailed usage
6. ✅ Check FIREBASE_SETUP.md for Firebase configuration

## Support Resources

- Firebase Docs: https://firebase.google.com/docs
- React Docs: https://react.dev
- React Router: https://reactrouter.com

---

**Project**: EVM (Electronic Voting Machine)
**Version**: 1.0.0
**Status**: Production Ready
**Last Updated**: May 2026
