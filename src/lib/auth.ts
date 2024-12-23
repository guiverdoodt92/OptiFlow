import { supabase } from './supabase';

export async function signUp(email: string, password: string, role: 'admin' | 'team_member') {
  // First create the auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) throw authError;
  if (!authData.user) throw new Error('Failed to create user');

  try {
    // Sign in immediately after signup to get authenticated session
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) throw signInError;

    // Now create the profile with authenticated session
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{ 
        id: authData.user.id, 
        email, 
        role,
        full_name: '',
        updated_at: new Date().toISOString()
      }]);

    if (profileError) throw profileError;

    return authData;
  } catch (error) {
    // If profile creation fails, clean up by deleting the auth user
    await supabase.auth.admin.deleteUser(authData.user.id);
    throw error;
  }
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile;
}