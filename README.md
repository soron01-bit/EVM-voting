# Electronic Voting Machine (EVM) - Firebase Edition

A modern web-based Electronic Voting Machine (EVM) system built with React and Firebase. This system allows voters to cast their votes securely and enables election commissioners to view real-time voting results through a dedicated admin panel.

## 🎯 Features

### Voter Interface
- **Easy to Use**: Simple and intuitive voting interface
- **Party Selection**: Select from available political parties (BJP, INC, TMC, CPIM)
- **Voter ID Verification**: Unique voter ID ensures one person, one vote
- **Instant Confirmation**: Real-time feedback on vote submission
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### Admin Panel
- **Real-time Results**: View vote counts as they come in
- **Visual Analytics**: Charts and graphs showing vote distribution
- **Voter Records**: Complete list of all voters with their voting timestamps
- **Secure Authentication**: Email/password-based admin login
- **Reset Functionality**: Ability to reset all votes for new elections (with confirmation)
- **Leading Party Display**: Highlighted winner/leading party

## 🛠️ Tech Stack

- **Frontend**: React 18.2
- **Routing**: React Router v6
- **Database**: Firebase (Firestore + Authentication)
- **Styling**: Modern CSS3 with responsive design
- **Build Tool**: React Scripts

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase Account

## 🚀 Installation & Setup

### 1. Clone/Extract the Project
```bash
cd c:\Users\shara\Documents\all Programming\project\EVM
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Firebase Credentials

**Important**: Never commit your Firebase credentials to Git!

1. **Copy the example file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local` with your Firebase credentials:**
   ```
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

3. **`.env.local` is automatically ignored by Git** (see `.gitignore`)

### 4. Start the Application
```bash
npm start
```

The application will open automatically at `http://localhost:3000`

## 📱 Usage Guide

### For Voters

1. **Access Voting Interface**
   - Navigate to the voting page (default landing page)
   - URL: `http://localhost:3000/voter`

2. **Cast Your Vote**
   - Enter your unique Voter ID
   - Select your preferred party from the displayed options
   - Click "CAST VOTE" button
   - Receive confirmation message

3. **Restrictions**
   - Each Voter ID can only vote once
   - System will reject duplicate voter IDs

### For Election Commissioner (Admin)

1. **Admin Login**
   - Navigate to: `http://localhost:3000/login`
   - Use credentials:
     - **Email**: `admin@evmvote.com`
     - **Password**: `admin123`
   - Or create your own admin account through the "Sign Up" option

2. **View Results**
   - Dashboard shows real-time vote counts
   - Visual representation through progress bars and charts
   - Automatic updates as new votes come in

3. **Monitor Voters**
   - Click on "Voter List" tab to see all registered voters
   - View voter ID, party voted, and voting timestamp
   - Monitor voting activity in chronological order

4. **Reset Elections**
   - Click "Reset All Votes" button to clear all voting data
   - Requires confirmation to prevent accidental deletion
   - Clears both vote records and voter registrations

## 🔐 Security Features

- **Firebase Authentication**: Secure admin login
- **Firestore Rules**: Database access controlled through Firebase rules
- **Vote Integrity**: One vote per voter ID
- **Protected Routes**: Admin panel accessible only to authenticated users
- **Session Management**: Automatic logout on tab close (optional)

## 📊 Database Structure

### Firestore Collections

#### 1. `votes` Collection
Stores each vote cast
```
{
  party: "BJP",
  timestamp: Timestamp
}
```

#### 2. `voters` Collection
Tracks which voter IDs have voted
```
{
  voterId: "V12345",
  party: "BJP",
  votedAt: Timestamp
}
```

## 🎨 UI Components

### Voter Interface
- Clean, modern card-based design
- Party selection grid with visual feedback
- Responsive feedback messages
- Success animation after voting

### Admin Dashboard
- Tab-based interface (Results & Voters)
- Real-time statistics display
- Visual charts and progress indicators
- Responsive data table

## 📱 Responsive Design

- **Desktop**: Full feature set with optimal layout
- **Tablet**: Adjusted grid and spacing
- **Mobile**: Optimized interface with stacked layout

## 🔧 Customization

### Add More Parties
Edit `src/pages/Voter.js` and `src/pages/Admin.js`:
```javascript
const PARTIES = ['Party1', 'Party2', 'Party3', 'Party4', 'Party5'];
```

### Modify Firebase Config
Edit `src/firebase.js` with your Firebase credentials

### Change Styling
Edit CSS files in `src/styles/` folder:
- `Voter.css` - Voting interface
- `Login.css` - Login page
- `Admin.css` - Admin dashboard
- `App.css` - Global styles

## 🐛 Troubleshooting

### Issue: Cannot vote (Error message)
- **Solution**: Ensure Voter ID is unique and hasn't voted before
- Check Firebase Firestore for duplicate entries

### Issue: Admin login not working
- **Solution**: Verify Firebase Authentication is enabled in Firebase Console
- Check internet connection
- Clear browser cache

### Issue: Results not updating
- **Solution**: Refresh the page
- Check Firebase Firestore rules allow reading data
- Verify internet connectivity

## 📈 Monitoring & Analytics

- Track total votes in real-time
- View vote distribution by party
- Identify leading party instantly
- Monitor voter participation
- Generate reports through vote data

## 🚀 Deployment

### Deploy to Firebase Hosting
```bash
# Build the project
npm run build

# Install Firebase CLI
npm install -g firebase-tools

# Initialize Firebase
firebase init

# Deploy
firebase deploy
```

### Deploy to Vercel, Netlify, or Other Platforms

**Environment Variables Setup:**

1. Create `.env.local` file in your hosting platform with:
   ```
   REACT_APP_FIREBASE_API_KEY=your_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

2. **Vercel:**
   - Push code to GitHub
   - Import repository in Vercel
   - Add environment variables in Vercel Settings → Environment Variables
   - Deploy

3. **Netlify:**
   - Push code to GitHub
   - Connect repository in Netlify
   - Add environment variables in Site Settings → Build & Deploy → Environment
   - Deploy

**Security Notes:**
- Never hardcode Firebase credentials in your code
- Use `.env` files for local development
- Use platform-specific environment variable settings for production
- `.env.local` is gitignored and never pushed to GitHub

## 📝 Notes

- **Demo Account**: Email: `admin@evmvote.com`, Password: `admin123`
- **Parties**: BJP, INC, TMC, CPIM (customizable)
- **Real-time Updates**: Uses Firebase Firestore real-time listeners
- **No Backend**: Fully serverless architecture

## 🤝 Support

For issues or questions, refer to:
- Firebase Documentation: https://firebase.google.com/docs
- React Documentation: https://react.dev
- Firebase Console: https://console.firebase.google.com

## 📄 License

This project is provided as-is for educational and voting purposes.

---

**Created for**: Electronic Voting System Project
**Version**: 1.0.0
**Last Updated**: May 2026
