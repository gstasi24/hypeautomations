export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      availability_rules: {
        Row: {
          created_at: string;
          enabled: boolean;
          end_time: string;
          id: string;
          start_time: string;
          weekday: number;
        };
        Insert: {
          created_at?: string;
          enabled?: boolean;
          end_time: string;
          id?: string;
          start_time: string;
          weekday: number;
        };
        Update: {
          created_at?: string;
          enabled?: boolean;
          end_time?: string;
          id?: string;
          start_time?: string;
          weekday?: number;
        };
        Relationships: [];
      };
      blocked_dates: {
        Row: {
          blocked_on: string;
          created_at: string;
          id: string;
          reason: string | null;
        };
        Insert: {
          blocked_on: string;
          created_at?: string;
          id?: string;
          reason?: string | null;
        };
        Update: {
          blocked_on?: string;
          created_at?: string;
          id?: string;
          reason?: string | null;
        };
        Relationships: [];
      };
      booking_settings: {
        Row: {
          booking_horizon_days: number;
          buffer_minutes: number;
          id: boolean;
          max_bookings_per_day: number;
          meeting_type: string;
          min_notice_hours: number;
          slot_duration_minutes: number;
          timezone: string;
          updated_at: string;
        };
        Insert: {
          booking_horizon_days?: number;
          buffer_minutes?: number;
          id?: boolean;
          max_bookings_per_day?: number;
          meeting_type?: string;
          min_notice_hours?: number;
          slot_duration_minutes?: number;
          timezone?: string;
          updated_at?: string;
        };
        Update: {
          booking_horizon_days?: number;
          buffer_minutes?: number;
          id?: boolean;
          max_bookings_per_day?: number;
          meeting_type?: string;
          min_notice_hours?: number;
          slot_duration_minutes?: number;
          timezone?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      bookings: {
        Row: {
          automation_goals: string[];
          business_type: string | null;
          company: string | null;
          consent: boolean;
          created_at: string;
          email: string;
          enquiry_sources: string[];
          full_name: string;
          id: string;
          manage_token: string;
          notes: string | null;
          phone: string | null;
          slot_end: string;
          slot_start: string;
          status: string;
          timezone: string | null;
          tools: string[];
          tools_other: string | null;
          website: string | null;
        };
        Insert: {
          automation_goals?: string[];
          business_type?: string | null;
          company?: string | null;
          consent?: boolean;
          created_at?: string;
          email: string;
          enquiry_sources?: string[];
          full_name: string;
          id?: string;
          manage_token?: string;
          notes?: string | null;
          phone?: string | null;
          slot_end: string;
          slot_start: string;
          status?: string;
          timezone?: string | null;
          tools?: string[];
          tools_other?: string | null;
          website?: string | null;
        };
        Update: {
          automation_goals?: string[];
          business_type?: string | null;
          company?: string | null;
          consent?: boolean;
          created_at?: string;
          email?: string;
          enquiry_sources?: string[];
          full_name?: string;
          id?: string;
          manage_token?: string;
          notes?: string | null;
          phone?: string | null;
          slot_end?: string;
          slot_start?: string;
          status?: string;
          timezone?: string | null;
          tools?: string[];
          tools_other?: string | null;
          website?: string | null;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      app_role: "admin" | "user";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const;
