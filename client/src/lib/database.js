import { supabase } from './supabase';

// User management functions
export const createUser = async (clerkUser) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          clerk_id: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress,
          first_name: clerkUser.firstName,
          last_name: clerkUser.lastName,
          profile_image_url: clerkUser.profileImageUrl,
          created_at: new Date().toISOString(),
        }
      ])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getUser = async (clerkId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', clerkId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

export const updateUser = async (clerkId, updates) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('clerk_id', clerkId)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Sprint plans management
export const saveSprintPlan = async (clerkId, prdText, sprintPlan) => {
  try {
    const { data, error } = await supabase
      .from('sprint_plans')
      .insert([
        {
          user_id: clerkId,
          prd_text: prdText,
          sprint_data: sprintPlan,
          created_at: new Date().toISOString(),
        }
      ])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error saving sprint plan:', error);
    throw error;
  }
};

export const getUserSprintPlans = async (clerkId) => {
  try {
    const { data, error } = await supabase
      .from('sprint_plans')
      .select('*')
      .eq('user_id', clerkId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting sprint plans:', error);
    throw error;
  }
};

export const deleteSprintPlan = async (planId, clerkId) => {
  try {
    const { error } = await supabase
      .from('sprint_plans')
      .delete()
      .eq('id', planId)
      .eq('user_id', clerkId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting sprint plan:', error);
    throw error;
  }
};
