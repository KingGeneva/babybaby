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
      article_comments: {
        Row: {
          article_id: string
          content: string
          created_at: string
          id: string
          is_deleted: boolean
          parent_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          article_id: string
          content: string
          created_at?: string
          id?: string
          is_deleted?: boolean
          parent_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          article_id?: string
          content?: string
          created_at?: string
          id?: string
          is_deleted?: boolean
          parent_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "article_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      article_favorites: {
        Row: {
          article_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          article_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          article_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      baby_events: {
        Row: {
          body: string | null
          child_id: string
          created_at: string
          created_by: string
          id: string
          media_type: string | null
          media_url: string | null
          metadata: Json | null
          occurred_at: string
          title: string | null
          type: Database["public"]["Enums"]["baby_event_type"]
          updated_at: string
        }
        Insert: {
          body?: string | null
          child_id: string
          created_at?: string
          created_by: string
          id?: string
          media_type?: string | null
          media_url?: string | null
          metadata?: Json | null
          occurred_at?: string
          title?: string | null
          type: Database["public"]["Enums"]["baby_event_type"]
          updated_at?: string
        }
        Update: {
          body?: string | null
          child_id?: string
          created_at?: string
          created_by?: string
          id?: string
          media_type?: string | null
          media_url?: string | null
          metadata?: Json | null
          occurred_at?: string
          title?: string | null
          type?: Database["public"]["Enums"]["baby_event_type"]
          updated_at?: string
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
      contact_rate_limits: {
        Row: {
          created_at: string
          id: string
          ip_address: string
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address: string
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: string
        }
        Relationships: []
      }
      diapers: {
        Row: {
          child_id: string
          created_at: string
          id: string
          logged_by: string
          notes: string | null
          occurred_at: string
          type: Database["public"]["Enums"]["diaper_type"]
        }
        Insert: {
          child_id: string
          created_at?: string
          id?: string
          logged_by: string
          notes?: string | null
          occurred_at?: string
          type: Database["public"]["Enums"]["diaper_type"]
        }
        Update: {
          child_id?: string
          created_at?: string
          id?: string
          logged_by?: string
          notes?: string | null
          occurred_at?: string
          type?: Database["public"]["Enums"]["diaper_type"]
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
      ebooks: {
        Row: {
          author: string | null
          category: string
          cover_image: string
          created_at: string | null
          description: string
          file_size: string
          file_type: string
          file_url: string
          id: string
          publish_date: string | null
          tags: string[] | null
          title: string
        }
        Insert: {
          author?: string | null
          category: string
          cover_image: string
          created_at?: string | null
          description: string
          file_size: string
          file_type?: string
          file_url: string
          id: string
          publish_date?: string | null
          tags?: string[] | null
          title: string
        }
        Update: {
          author?: string | null
          category?: string
          cover_image?: string
          created_at?: string | null
          description?: string
          file_size?: string
          file_type?: string
          file_url?: string
          id?: string
          publish_date?: string | null
          tags?: string[] | null
          title?: string
        }
        Relationships: []
      }
      family_members: {
        Row: {
          accepted_at: string | null
          child_id: string
          created_at: string
          id: string
          invited_by: string | null
          role: Database["public"]["Enums"]["family_role"]
          user_id: string
        }
        Insert: {
          accepted_at?: string | null
          child_id: string
          created_at?: string
          id?: string
          invited_by?: string | null
          role?: Database["public"]["Enums"]["family_role"]
          user_id: string
        }
        Update: {
          accepted_at?: string | null
          child_id?: string
          created_at?: string
          id?: string
          invited_by?: string | null
          role?: Database["public"]["Enums"]["family_role"]
          user_id?: string
        }
        Relationships: []
      }
      feedings: {
        Row: {
          amount_ml: number | null
          child_id: string
          created_at: string
          ended_at: string | null
          id: string
          logged_by: string
          notes: string | null
          started_at: string
          type: Database["public"]["Enums"]["feeding_type"]
          updated_at: string
        }
        Insert: {
          amount_ml?: number | null
          child_id: string
          created_at?: string
          ended_at?: string | null
          id?: string
          logged_by: string
          notes?: string | null
          started_at?: string
          type: Database["public"]["Enums"]["feeding_type"]
          updated_at?: string
        }
        Update: {
          amount_ml?: number | null
          child_id?: string
          created_at?: string
          ended_at?: string | null
          id?: string
          logged_by?: string
          notes?: string | null
          started_at?: string
          type?: Database["public"]["Enums"]["feeding_type"]
          updated_at?: string
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
      memory_capsules: {
        Row: {
          body: string
          child_id: string
          created_at: string
          created_by: string
          id: string
          media_url: string | null
          title: string
          unlock_at: string
        }
        Insert: {
          body: string
          child_id: string
          created_at?: string
          created_by: string
          id?: string
          media_url?: string | null
          title: string
          unlock_at: string
        }
        Update: {
          body?: string
          child_id?: string
          created_at?: string
          created_by?: string
          id?: string
          media_url?: string | null
          title?: string
          unlock_at?: string
        }
        Relationships: []
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
      newsletter_rate_limits: {
        Row: {
          created_at: string
          id: string
          ip_address: string
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address: string
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          age_segment: string | null
          baby_birth_date: string | null
          email: string
          expected_due_date: string | null
          id: string
          is_active: boolean | null
          subscribed_at: string | null
        }
        Insert: {
          age_segment?: string | null
          baby_birth_date?: string | null
          email: string
          expected_due_date?: string | null
          id?: string
          is_active?: boolean | null
          subscribed_at?: string | null
        }
        Update: {
          age_segment?: string | null
          baby_birth_date?: string | null
          email?: string
          expected_due_date?: string | null
          id?: string
          is_active?: boolean | null
          subscribed_at?: string | null
        }
        Relationships: []
      }
      parent_turns: {
        Row: {
          child_id: string
          created_at: string
          duration_minutes: number | null
          id: string
          notes: string | null
          occurred_at: string
          parent_id: string
          task: Database["public"]["Enums"]["parent_turn_task"]
        }
        Insert: {
          child_id: string
          created_at?: string
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          occurred_at?: string
          parent_id: string
          task: Database["public"]["Enums"]["parent_turn_task"]
        }
        Update: {
          child_id?: string
          created_at?: string
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          occurred_at?: string
          parent_id?: string
          task?: Database["public"]["Enums"]["parent_turn_task"]
        }
        Relationships: []
      }
      parent_wellness: {
        Row: {
          created_at: string
          hydration_glasses: number | null
          id: string
          logged_at: string
          mood: Database["public"]["Enums"]["parent_mood"] | null
          notes: string | null
          sleep_hours: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          hydration_glasses?: number | null
          id?: string
          logged_at?: string
          mood?: Database["public"]["Enums"]["parent_mood"] | null
          notes?: string | null
          sleep_hours?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          hydration_glasses?: number | null
          id?: string
          logged_at?: string
          mood?: Database["public"]["Enums"]["parent_mood"] | null
          notes?: string | null
          sleep_hours?: number | null
          user_id?: string
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
      quiz_results: {
        Row: {
          answers: Json
          created_at: string
          email: string | null
          id: string
          quiz_slug: string
          result_key: string
          user_id: string | null
        }
        Insert: {
          answers?: Json
          created_at?: string
          email?: string | null
          id?: string
          quiz_slug: string
          result_key: string
          user_id?: string | null
        }
        Update: {
          answers?: Json
          created_at?: string
          email?: string | null
          id?: string
          quiz_slug?: string
          result_key?: string
          user_id?: string | null
        }
        Relationships: []
      }
      sleeps: {
        Row: {
          child_id: string
          created_at: string
          ended_at: string | null
          id: string
          location: string | null
          logged_by: string
          notes: string | null
          quality: Database["public"]["Enums"]["sleep_quality"] | null
          started_at: string
          updated_at: string
        }
        Insert: {
          child_id: string
          created_at?: string
          ended_at?: string | null
          id?: string
          location?: string | null
          logged_by: string
          notes?: string | null
          quality?: Database["public"]["Enums"]["sleep_quality"] | null
          started_at?: string
          updated_at?: string
        }
        Update: {
          child_id?: string
          created_at?: string
          ended_at?: string | null
          id?: string
          location?: string | null
          logged_by?: string
          notes?: string | null
          quality?: Database["public"]["Enums"]["sleep_quality"] | null
          started_at?: string
          updated_at?: string
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
      cleanup_old_rate_limits: { Args: never; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_family_member: {
        Args: { _child_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      baby_event_type:
        | "milestone"
        | "photo"
        | "note"
        | "voice"
        | "measurement"
        | "first"
        | "memory"
      diaper_type: "wet" | "dirty" | "mixed" | "dry"
      family_role: "parent" | "caregiver" | "grandparent"
      feeding_type:
        | "breast_left"
        | "breast_right"
        | "bottle_formula"
        | "bottle_breastmilk"
        | "solid"
      parent_mood: "great" | "ok" | "tired" | "stressed" | "overwhelmed"
      parent_turn_task:
        | "night_wake"
        | "feeding"
        | "diaper"
        | "bath"
        | "bedtime"
        | "other"
      sleep_quality: "great" | "ok" | "restless" | "bad"
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
      baby_event_type: [
        "milestone",
        "photo",
        "note",
        "voice",
        "measurement",
        "first",
        "memory",
      ],
      diaper_type: ["wet", "dirty", "mixed", "dry"],
      family_role: ["parent", "caregiver", "grandparent"],
      feeding_type: [
        "breast_left",
        "breast_right",
        "bottle_formula",
        "bottle_breastmilk",
        "solid",
      ],
      parent_mood: ["great", "ok", "tired", "stressed", "overwhelmed"],
      parent_turn_task: [
        "night_wake",
        "feeding",
        "diaper",
        "bath",
        "bedtime",
        "other",
      ],
      sleep_quality: ["great", "ok", "restless", "bad"],
    },
  },
} as const
