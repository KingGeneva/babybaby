
import { supabase } from "@/integrations/supabase/client";
import { GenericSupabaseResponse, AnyTable } from "../utils/supabaseTypes";

// Function to get user profile
export const getUserProfile = async (userId: string) => {
  try {
    // Cast supabase to allow any table name
    const supabaseAny = supabase as unknown as { from: (table: string) => AnyTable };
    
    const { data, error } = await supabaseAny
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle() as GenericSupabaseResponse<any>;

    if (error) {
      console.error("Error loading profile:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    return null;
  }
};
