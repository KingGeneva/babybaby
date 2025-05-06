
import { supabase } from "@/integrations/supabase/client";
import { ForumCategory } from "../types";
import { toast } from "@/components/ui/use-toast";
import { GenericSupabaseResponse, AnyTable } from "../utils/supabaseTypes";

// Forum categories
export const getCategories = async (): Promise<ForumCategory[]> => {
  try {
    // Cast supabase to allow any table name
    const supabaseAny = supabase as unknown as { from: (table: string) => AnyTable };
    
    const { data, error } = await supabaseAny
      .from("forum_categories")
      .select("*")
      .order("name", { ascending: true }) as GenericSupabaseResponse<ForumCategory[]>;

    if (error) {
      console.error("Error loading categories:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error in getCategories:", error);
    return [];
  }
};

export const getCategoryBySlug = async (slug: string): Promise<ForumCategory | null> => {
  try {
    // Cast supabase to allow any table name
    const supabaseAny = supabase as unknown as { from: (table: string) => AnyTable };
    
    const { data, error } = await supabaseAny
      .from("forum_categories")
      .select("*")
      .eq("slug", slug)
      .single() as GenericSupabaseResponse<ForumCategory>;

    if (error) {
      if (error.code !== 'PGRST116') { // PGRST116 is the "no rows returned" error
        console.error("Error loading category:", error);
      }
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in getCategoryBySlug:", error);
    return null;
  }
};
