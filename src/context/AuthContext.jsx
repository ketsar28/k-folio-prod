import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { auth } from "../config/firebase";

const AuthContext = createContext();

// ALLOWED EMAILS - Hanya email ini yang bisa login
const ALLOWED_EMAILS = [
  "muhammadketsar2@gmail.com",
  "muhammadketsar1@gmail.com", 
  "jsdevprofes@gmail.com",
  "muhammadketsar45@gmail.com",
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Check if user is in allowed list
      if (currentUser && !ALLOWED_EMAILS.includes(currentUser.email)) {
        // Unauthorized user - sign them out
        signOut(auth);
        setUser(null);
        setError("Akses ditolak. Email tidak terdaftar.");
      } else {
        setUser(currentUser);
        setError(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email, password) => {
    try {
      setError(null);
      // Pre-check if email is allowed
      if (!ALLOWED_EMAILS.includes(email)) {
        throw new Error("Akses ditolak. Email tidak terdaftar.");
      }
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if Google email is allowed
      if (!ALLOWED_EMAILS.includes(result.user.email)) {
        await signOut(auth);
        throw new Error("Akses ditolak. Email tidak terdaftar.");
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      setError(err.message);
    }
  };

  const value = {
    user,
    loading,
    error,
    loginWithEmail,
    loginWithGoogle,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
