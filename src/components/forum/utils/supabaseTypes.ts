
import { SupabaseClient, PostgrestResponse } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

// Type for any Supabase table not defined in the database types
export type GenericSupabaseResponse<T> = PostgrestResponse<T>;

// Type for the Supabase client that can handle any table
export type GenericSupabaseClient = SupabaseClient<Database, "public", any>;

// Helper type for casting supabase.from() to work with any table
export type AnyTable = {
  [key: string]: any;
};
