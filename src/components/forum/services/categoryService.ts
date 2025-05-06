
import { supabase } from "@/integrations/supabase/client";
import { ForumCategory } from "../types";
import { toast } from "@/components/ui/use-toast";

// Forum categories
export const getCategories = async (): Promise<ForumCategory[]> => {
  try {
    const { data, error } = await supabase
      .from("forum_categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error loading categories:", error);
      throw error;
    }

    return data as ForumCategory[] || [];
  } catch (error) {
    console.error("Error in getCategories:", error);
    return [];
  }
};

export const getCategoryBySlug = async (slug: string): Promise<ForumCategory | null> => {
  try {
    const { data, error } = await supabase
      .from("forum_categories")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error("Error loading category:", error);
      throw error;
    }

    return data as ForumCategory;
  } catch (error) {
    console.error("Error in getCategoryBySlug:", error);
    return null;
  }
};
