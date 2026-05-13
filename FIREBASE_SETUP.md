# Firebase Setup & Configuration Guide

## Firebase Project Setup

Your EVM system is pre-configured with the following Firebase project:

### Project Details
- **Project ID**: `evmvote`
- **Project Name**: evmvote
- **Region**: Default

### Firebase Services Enabled

1. **Firestore Database**
   - Real-time database for storing votes and voter data
   - Location: Default (US multi-region)

2. **Firebase Authentication**
   - Email/Password authentication enabled
   - Used for admin login

## Database Structure

### Collections Created

#### 1. votes
```
Collection: votes
├── Document ID: (auto-generated)
├── party: (string) - Party name
└── timestamp: (timestamp) - Vote time
```

#### 2. voters
```
Collection: voters
├── Document ID: (auto-generated)
├── voterId: (string) - Unique voter identifier
├── party: (string) - Party voted for
└── votedAt: (timestamp) - Voting time
```

## Firestore Security Rules

For proper functionality, set up these security rules in Firebase Console:

1. Go to **Firebase Console** → **evmvote project**
2. Navigate to **Firestore Database** → **Rules**
3. Replace with the following rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read and write votes and voters
    match /votes/{document=**} {
      allow read, write: if request.auth != null;
    }
    
    match /voters/{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Authentication Setup

### Admin Account
The demo admin account is pre-configured:
- **Email**: `admin@evmvote.com`
- **Password**: `admin123`

### Create New Admin Accounts
1. Go to **Authentication** page in app
2. Click "Sign Up" on login page
3. Enter email and password
4. New account is automatically created in Firebase

### Enable Authentication Methods
In Firebase Console:
1. **Authentication** → **Sign-in method**
2. **Email/Password** → Enable

## Database Indexes

Firestore may automatically create indexes. If needed, create indexes for:

1. **voters collection**
   - Index on: `voterId` (Ascending)

## Firebase Console Access

### Access Your Project
1. Go to: https://console.firebase.google.com
2. Sign in with your Google account
3. Select project: `evmvote`

### Monitor Data
- **Firestore** → View collections and documents
- **Authentication** → Manage admin users
- **Realtime Database** (if using) → Monitor active connections

## API Keys & Configuration


**Note**: The Firebase API key is now stored securely in your `.env.local` file and should never be committed to the repository. For setup, copy the example from `.env.example` and add your own credentials.

## Backup & Export Data

### Export Firestore Data
```bash
firebase firestore:export ./backups/export-timestamp
```

### Import Firestore Data
```bash
firebase firestore:import ./backups/export-timestamp
```

## Deployment Considerations

### Before Deploying to Production

1. **Update Security Rules**
   - Restrict anonymous access
   - Add IP restrictions if needed
   - Implement proper permission checks

2. **Enable Authentication**
   - Consider adding email verification
   - Set password requirements
   - Enable multi-factor authentication

3. **Monitor Usage**
   - Set up billing alerts
   - Monitor Firestore reads/writes
   - Track authentication events

4. **Backups**
   - Enable automatic backups
   - Test recovery procedures
   - Document backup schedules

## Common Issues & Solutions

### Issue: Votes Not Being Saved
- **Check**: Firestore rules allow write access
- **Verify**: User is authenticated for admin operations
- **Solution**: Review security rules in Firebase Console

### Issue: Cannot Login
- **Check**: Email/Password authentication is enabled
- **Verify**: Account exists in Firebase Authentication
- **Solution**: Create new admin account or reset password

### Issue: Real-time Updates Not Working
- **Check**: Firestore listener is active
- **Verify**: Network connection is stable
- **Solution**: Refresh page and check browser console for errors

## Performance Optimization

### Firestore Best Practices
- Index commonly queried fields
- Use batch operations for multiple writes
- Implement pagination for large result sets
- Archive old voting data periodically

## Security Checklist

- [ ] Security rules are properly configured
- [ ] Admin credentials are secure
- [ ] API key restrictions are enabled
- [ ] Backups are scheduled
- [ ] Access logs are monitored
- [ ] Two-factor authentication considered for admins

## Support & Resources

- **Firebase Docs**: https://firebase.google.com/docs
- **Firestore Guide**: https://firebase.google.com/docs/firestore
- **Authentication**: https://firebase.google.com/docs/auth

---

**Project**: EVM (Electronic Voting Machine)
**Version**: 1.0.0
**Last Updated**: May 2026
