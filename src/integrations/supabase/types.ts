export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      child_profiles: {
        Row: {
          birth_date: string
          created_at: string
          gender: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          birth_date: string
          created_at?: string
          gender: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          birth_date?: string
          created_at?: string
          gender?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ebook_downloads: {
        Row: {
          download_timestamp: string | null
          ebook_title: string
          email: string
          id: number
        }
        Insert: {
          download_timestamp?: string | null
          ebook_title: string
          email: string
          id?: never
        }
        Update: {
          download_timestamp?: string | null
          ebook_title?: string
          email?: string
          id?: never
        }
        Relationships: []
      }
      ebooks: {
        Row: {
          description: string | null
          file_size_mb: number | null
          file_url: string
          genre: string | null
          id: number
          publication_date: string | null
          title: string
        }
        Insert: {
          description?: string | null
          file_size_mb?: number | null
          file_url: string
          genre?: string | null
          id?: number
          publication_date?: string | null
          title: string
        }
        Update: {
          description?: string | null
          file_size_mb?: number | null
          file_url?: string
          genre?: string | null
          id?: number
          publication_date?: string | null
          title?: string
        }
        Relationships: []
      }
      growth_measurements: {
        Row: {
          child_id: string
          created_at: string
          head_cm: number | null
          height_cm: number | null
          id: string
          measurement_date: string
          notes: string | null
          weight_kg: number | null
        }
        Insert: {
          child_id: string
          created_at?: string
          head_cm?: number | null
          height_cm?: number | null
          id?: string
          measurement_date: string
          notes?: string | null
          weight_kg?: number | null
        }
        Update: {
          child_id?: string
          created_at?: string
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
          achieved_date: string | null
          child_id: string
          created_at: string
          expected_age_months: number | null
          id: string
          name: string
          notes: string | null
        }
        Insert: {
          achieved_date?: string | null
          child_id: string
          created_at?: string
          expected_age_months?: number | null
          id?: string
          name: string
          notes?: string | null
        }
        Update: {
          achieved_date?: string | null
          child_id?: string
          created_at?: string
          expected_age_months?: number | null
          id?: string
          name?: string
          notes?: string | null
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
          consent_given: boolean
          created_at: string
          email: string
          id: string
          name: string | null
          subscribed_at: string
          unsubscribed_at: string | null
        }
        Insert: {
          consent_given?: boolean
          created_at?: string
          email: string
          id?: string
          name?: string | null
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Update: {
          consent_given?: boolean
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      quiz_questions: {
        Row: {
          created_at: string
          id: string
          options: Json
          question: string
          quiz_type: Database["public"]["Enums"]["quiz_type"]
        }
        Insert: {
          created_at?: string
          id?: string
          options: Json
          question: string
          quiz_type: Database["public"]["Enums"]["quiz_type"]
        }
        Update: {
          created_at?: string
          id?: string
          options?: Json
          question?: string
          quiz_type?: Database["public"]["Enums"]["quiz_type"]
        }
        Relationships: []
      }
      quiz_responses: {
        Row: {
          answers: Json
          completed_at: string
          detailed_results: Json | null
          id: string
          quiz_type: Database["public"]["Enums"]["quiz_type"]
          recommendations: string[] | null
          score: number | null
          user_id: string
        }
        Insert: {
          answers: Json
          completed_at?: string
          detailed_results?: Json | null
          id?: string
          quiz_type: Database["public"]["Enums"]["quiz_type"]
          recommendations?: string[] | null
          score?: number | null
          user_id: string
        }
        Update: {
          answers?: Json
          completed_at?: string
          detailed_results?: Json | null
          id?: string
          quiz_type?: Database["public"]["Enums"]["quiz_type"]
          recommendations?: string[] | null
          score?: number | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_topic_views: {
        Args: { topic_id: string }
        Returns: undefined
      }
    }
    Enums: {
      quiz_type: "parenting_style" | "child_development" | "parental_burnout"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      quiz_type: ["parenting_style", "child_development", "parental_burnout"],
    },
  },
} as const
