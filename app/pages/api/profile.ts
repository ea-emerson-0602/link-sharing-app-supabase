import { supabase } from '@/lib/supabaseClient';

// Define a function to get the user's profile
export const getProfile = async () => {
  // Get the user from Supabase auth
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error('Error fetching user:', error.message);
    return null;
  }

  const user = data?.user;

  if (!user) {
    console.error('No user found');
    return null;
  }

  // Fetch the user's profile from the 'profiles' table using the user's ID
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error('Error fetching profile:', profileError.message);
    return null;
  }

  return profile;
};
