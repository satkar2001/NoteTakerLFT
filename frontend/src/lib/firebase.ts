import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  type User as FirebaseUser,
  signOut as firebaseSignOut
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBpHqyCuC49B_zch_cckov7-zAsoSVzJYs",
  authDomain: "notetakerlft-455a1.firebaseapp.com",
  projectId: "notetakerlft-455a1",
  storageBucket: "notetakerlft-455a1.firebasestorage.app",
  messagingSenderId: "797702635878",
  appId: "1:797702635878:web:76a7ce98c853085393c8a7",
  measurementId: "G-DTL4KLSL9X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export interface FirebaseAuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
  };
}

// Sign in with Google
export const signInWithGoogle = async (): Promise<FirebaseAuthResponse> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Get the ID token
    const token = await user.getIdToken();
    
    return {
      token,
      user: {
        id: user.uid,
        email: user.email || '',
        name: user.displayName || undefined,
        avatar: user.photoURL || undefined
      }
    };
  } catch (error: any) {
    console.error('Firebase Google sign-in error:', error);
    throw new Error(error.message || 'Google authentication failed');
  }
};

// Sign out
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Firebase sign-out error:', error);
    throw error;
  }
};

// Get current user
export const getCurrentUser = (): FirebaseUser | null => {
  return auth.currentUser;
};

// Listen to auth state changes
export const onAuthStateChanged = (callback: (user: FirebaseUser | null) => void) => {
  return auth.onAuthStateChanged(callback);
};

export { auth };
