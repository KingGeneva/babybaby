
import { SupabaseClient, PostgrestResponse } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

// Type générique pour les réponses Supabase
export type GenericSupabaseResponse<T> = PostgrestResponse<T>;

// Type pour le client Supabase qui peut gérer n'importe quelle table
export type GenericSupabaseClient = SupabaseClient<Database, "public", any>;

// Type d'aide pour convertir supabase.from() pour fonctionner avec n'importe quelle table
export type AnyTable = {
  [key: string]: any;
};

// Type d'aide pour les réponses avec décompte
export type CountResponse<T> = PostgrestResponse<T> & {
  count: number | null;
};
