
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

// Type for any Supabase query to handle tables not defined in the database types
export type GenericSupabaseResponse<T> = {
  data: T | null;
  error: {
    message: string;
    code?: string;
  } | null;
  count?: number | null;
};

// Type for the Supabase client that can handle any table
export type GenericSupabaseClient = SupabaseClient<Database, "public", any>;
