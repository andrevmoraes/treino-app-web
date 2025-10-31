import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const supabaseUrl = 'https://liefsocnyrnreqcdmnhs.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpZWZzb2NueXJucmVxY2RtbmhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4Nzg0MjYsImV4cCI6MjA3NzQ1NDQyNn0.QhpoBvaaATIFRq8Si4UoK5jueJsYMxuX4-98fRcGD08';

let supabaseInstance: SupabaseClient | null = null;

export const supabase = new Proxy({} as SupabaseClient, {
  get: (target, prop) => {
    if (!supabaseInstance) {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          storage: AsyncStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      });
    }
    return (supabaseInstance as any)[prop];
  },
});
