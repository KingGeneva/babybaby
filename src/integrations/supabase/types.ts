export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      article_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      auto_generated_articles: {
        Row: {
          author: string
          category: string
          content: string
          created_at: string
          excerpt: string
          id: string
          image_url: string | null
          published_at: string | null
          published_id: number | null
          reading_time: number
          reviewed_at: string | null
          reviewed_by: string | null
          source_trend: string | null
          status: string
          summary: string
          tags: string[]
          title: string
        }
        Insert: {
          author?: string
          category: string
          content: string
          created_at?: string
          excerpt: string
          id?: string
          image_url?: string | null
          published_at?: string | null
          published_id?: number | null
          reading_time?: number
          reviewed_at?: string | null
          reviewed_by?: string | null
          source_trend?: string | null
          status?: string
          summary: string
          tags?: string[]
          title: string
        }
        Update: {
          author?: string
          category?: string
          content?: string
          created_at?: string
          excerpt?: string
          id?: string
          image_url?: string | null
          published_at?: string | null
          published_id?: number | null
          reading_time?: number
          reviewed_at?: string | null
          reviewed_by?: string | null
          source_trend?: string | null
          status?: string
          summary?: string
          tags?: string[]
          title?: string
        }
        Relationships: []
      }
      child_profiles: {
        Row: {
          birth_date: string
          created_at: string | null
          gender: string | null
          id: string
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          birth_date: string
          created_at?: string | null
          gender?: string | null
          id?: string
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          birth_date?: string
          created_at?: string | null
          gender?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      cms_articles: {
        Row: {
          author: string
          author_id: string | null
          category: string
          content: string
          created_at: string | null
          date: string | null
          excerpt: string
          featured: boolean | null
          id: number
          image: string
          published: boolean | null
          reading_time: number
          summary: string
          tags: string[]
          title: string
          updated_at: string | null
          views: number | null
        }
        Insert: {
          author: string
          author_id?: string | null
          category: string
          content: string
          created_at?: string | null
          date?: string | null
          excerpt: string
          featured?: boolean | null
          id?: number
          image: string
          published?: boolean | null
          reading_time?: number
          summary: string
          tags?: string[]
          title: string
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          author?: string
          author_id?: string | null
          category?: string
          content?: string
          created_at?: string | null
          date?: string | null
          excerpt?: string
          featured?: boolean | null
          id?: number
          image?: string
          published?: boolean | null
          reading_time?: number
          summary?: string
          tags?: string[]
          title?: string
          updated_at?: string | null
          views?: number | null
        }
        Relationships: []
      }
      ebook_downloads: {
        Row: {
          downloaded_at: string | null
          ebook_title: string
          email: string
          id: string
        }
        Insert: {
          downloaded_at?: string | null
          ebook_title: string
          email: string
          id?: string
        }
        Update: {
          downloaded_at?: string | null
          ebook_title?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      growth_measurements: {
        Row: {
          child_id: string
          created_at: string | null
          head_cm: number | null
          height_cm: number | null
          id: string
          measurement_date: string
          notes: string | null
          weight_kg: number | null
        }
        Insert: {
          child_id: string
          created_at?: string | null
          head_cm?: number | null
          height_cm?: number | null
          id?: string
          measurement_date: string
          notes?: string | null
          weight_kg?: number | null
        }
        Update: {
          child_id?: string
          created_at?: string | null
          head_cm?: number | null
          height_cm?: number | null
          id?: string
          measurement_date?: string
          notes?: string | null
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "growth_measurements_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "child_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      milestones: {
        Row: {
          achieved: boolean | null
          achieved_date: string | null
          age_months: number
          category: string
          child_id: string
          created_at: string | null
          description: string | null
          id: string
          notes: string | null
          title: string
        }
        Insert: {
          achieved?: boolean | null
          achieved_date?: string | null
          age_months: number
          category: string
          child_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          notes?: string | null
          title: string
        }
        Update: {
          achieved?: boolean | null
          achieved_date?: string | null
          age_months?: number
          category?: string
          child_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          notes?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "milestones_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "child_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          is_active: boolean | null
          subscribed_at: string | null
        }
        Insert: {
          email: string
          id?: string
          is_active?: boolean | null
          subscribed_at?: string | null
        }
        Update: {
          email?: string
          id?: string
          is_active?: boolean | null
          subscribed_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      quiz_questions: {
        Row: {
          correct_answer: string | null
          created_at: string | null
          explanation: string | null
          id: string
          options: Json
          order_index: number
          question: string
          quiz_type: Database["public"]["Enums"]["quiz_type"]
        }
        Insert: {
          correct_answer?: string | null
          created_at?: string | null
          explanation?: string | null
          id?: string
          options: Json
          order_index: number
          question: string
          quiz_type: Database["public"]["Enums"]["quiz_type"]
        }
        Update: {
          correct_answer?: string | null
          created_at?: string | null
          explanation?: string | null
          id?: string
          options?: Json
          order_index?: number
          question?: string
          quiz_type?: Database["public"]["Enums"]["quiz_type"]
        }
        Relationships: []
      }
      quiz_responses: {
        Row: {
          answers: Json
          completed_at: string | null
          detailed_results: Json | null
          id: string
          quiz_type: Database["public"]["Enums"]["quiz_type"]
          recommendations: Json | null
          score: number | null
          user_id: string
        }
        Insert: {
          answers: Json
          completed_at?: string | null
          detailed_results?: Json | null
          id?: string
          quiz_type: Database["public"]["Enums"]["quiz_type"]
          recommendations?: Json | null
          score?: number | null
          user_id: string
        }
        Update: {
          answers?: Json
          completed_at?: string | null
          detailed_results?: Json | null
          id?: string
          quiz_type?: Database["public"]["Enums"]["quiz_type"]
          recommendations?: Json | null
          score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      quiz_type:
        | "personnalite"
        | "connaissance"
        | "developpement"
        | "nutrition"
        | "sommeil"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      quiz_type: [
        "personnalite",
        "connaissance",
        "developpement",
        "nutrition",
        "sommeil",
      ],
    },
  },
} as const
