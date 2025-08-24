import { useUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { createUser, getUser } from '../lib/database';

export const useAuth = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncUser = async () => {
      if (isLoaded && isSignedIn && user) {
        try {
          // Check if user exists in Supabase
          let existingUser = await getUser(user.id);
          
          if (!existingUser) {
            // Create user in Supabase if doesn't exist
            existingUser = await createUser(user);
          }
          
          setDbUser(existingUser);
        } catch (error) {
          console.error('Error syncing user:', error);
        }
      }
      setLoading(false);
    };

    syncUser();
  }, [isLoaded, isSignedIn, user]);

  return {
    isLoaded,
    isSignedIn,
    user,
    dbUser,
    loading: loading || !isLoaded
  };
};
