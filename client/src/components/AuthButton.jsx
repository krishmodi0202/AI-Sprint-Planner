import React from 'react';
import { SignInButton, SignOutButton, useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';

const AuthButton = () => {
  const { isSignedIn, user } = useUser();

  if (isSignedIn) {
    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <img 
            src={user.profileImageUrl} 
            alt={user.fullName}
            className="w-8 h-8 rounded-full border-2 border-white/20"
          />
          <span className="text-sm text-gray-700 font-medium">
            {user.firstName}
          </span>
        </div>
        <SignOutButton>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          >
            Sign Out
          </motion.button>
        </SignOutButton>
      </div>
    );
  }

  return (
    <SignInButton mode="modal">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-shadow"
      >
        Sign In
      </motion.button>
    </SignInButton>
  );
};

export default AuthButton;
