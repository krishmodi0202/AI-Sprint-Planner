import { supabase } from './supabase';

/**
 * Create a new user profile in Supabase
 * @param {Object} profileData - User profile data from onboarding
 * @returns {Object} Result object with success status and data/error
 */
export const createUserProfile = async (profileData) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([profileData])
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating profile:', error);
      return { success: false, error: error.message };
    }

    return { success: true, profile: data };
  } catch (error) {
    console.error('Error creating user profile:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get user profile by Clerk user ID
 * @param {string} clerkUserId - Clerk user ID
 * @returns {Object} Result object with success status and data/error
 */
export const getUserProfileByClerkId = async (clerkUserId) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('clerk_user_id', clerkUserId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found
        return { success: false, error: 'Profile not found' };
      }
      console.error('Supabase error fetching profile:', error);
      return { success: false, error: error.message };
    }

    return { success: true, profile: data };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update user profile
 * @param {string} clerkUserId - Clerk user ID
 * @param {Object} updateData - Data to update
 * @returns {Object} Result object with success status and data/error
 */
export const updateUserProfile = async (clerkUserId, updateData) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updateData)
      .eq('clerk_user_id', clerkUserId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error updating profile:', error);
      return { success: false, error: error.message };
    }

    return { success: true, profile: data };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error: error.message };
  }
};
