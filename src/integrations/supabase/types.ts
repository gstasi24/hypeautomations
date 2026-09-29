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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      availability_rules: {
        Row: {
          created_at: string
          enabled: boolean
          end_time: string
          id: string
          start_time: string
          weekday: number
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          end_time: string
          id?: string
          start_time: string
          weekday: number
        }
        Update: {
          created_at?: string
          enabled?: boolean
          end_time?: string
          id?: string
          start_time?: string
          weekday?: number
        }
        Relationships: []
      }
      blocked_dates: {
        Row: {
          blocked_on: string
          created_at: string
          id: string
          reason: string | null
        }
        Insert: {
          blocked_on: string
          created_at?: string
          id?: string
          reason?: string | null
        }
        Update: {
          blocked_on?: string
          created_at?: string
          id?: string
          reason?: string | null
        }
        Relationships: []
      }
      booking_settings: {
        Row: {
          booking_horizon_days: number
          buffer_minutes: number
          id: boolean
          max_bookings_per_day: number
          meeting_type: string
          min_notice_hours: number
          slot_duration_minutes: number
          timezone: string
          updated_at: string
        }
        Insert: {
          booking_horizon_days?: number
          buffer_minutes?: number
          id?: boolean
          max_bookings_per_day?: number
          meeting_type?: string
          min_notice_hours?: number
          slot_duration_minutes?: number
          timezone?: string
          updated_at?: string
        }
        Update: {
          booking_horizon_days?: number
          buffer_minutes?: number
          id?: boolean
          max_bookings_per_day?: number
          meeting_type?: string
          min_notice_hours?: number
          slot_duration_minutes?: number
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          automation_goals: string[]
          business_type: string | null
          company: string | null
          consent: boolean
          created_at: string
          email: string
          enquiry_sources: string[]
          full_name: string
          id: string
          manage_token: string
          notes: string | null
          phone: string | null
          slot_end: string
          slot_start: string
          status: string
          timezone: string | null
          tools: string[]
          tools_other: string | null
          website: string | null
        }
        Insert: {
          automation_goals?: string[]
          business_type?: string | null
          company?: string | null
          consent?: boolean
          created_at?: string
          email: string
          enquiry_sources?: string[]
          full_name: string
          id?: string
          manage_token?: string
          notes?: string | null
          phone?: string | null
          slot_end: string
          slot_start: string
          status?: string
          timezone?: string | null
          tools?: string[]
          tools_other?: string | null
          website?: string | null
        }
        Update: {
          automation_goals?: string[]
          business_type?: string | null
          company?: string | null
          consent?: boolean
          created_at?: string
          email?: string
          enquiry_sources?: string[]
          full_name?: string
          id?: string
          manage_token?: string
          notes?: string | null
          phone?: string | null
          slot_end?: string
          slot_start?: string
          status?: string
          timezone?: string | null
          tools?: string[]
          tools_other?: string | null
          website?: string | null
        }
        Relationships: []
      }
      pai_admin_notes: {
        Row: {
          author_email: string | null
          author_id: string
          content: string
          created_at: string
          customer_user_id: string
          id: string
        }
        Insert: {
          author_email?: string | null
          author_id: string
          content: string
          created_at?: string
          customer_user_id: string
          id?: string
        }
        Update: {
          author_email?: string | null
          author_id?: string
          content?: string
          created_at?: string
          customer_user_id?: string
          id?: string
        }
        Relationships: []
      }
      pai_audit_logs: {
        Row: {
          action: string
          actor: string
          created_at: string
          detail: Json
          id: string
          user_id: string
        }
        Insert: {
          action: string
          actor: string
          created_at?: string
          detail?: Json
          id?: string
          user_id: string
        }
        Update: {
          action?: string
          actor?: string
          created_at?: string
          detail?: Json
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      pai_customers: {
        Row: {
          account_status: string
          acknowledged: boolean
          assigned_staff: string | null
          company_name: string | null
          country: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          onboarding_notes: string | null
          phone: string | null
          setup_status: string
          target_go_live: string | null
          updated_at: string
          use_case: string | null
          user_id: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          website: string | null
        }
        Insert: {
          account_status?: string
          acknowledged?: boolean
          assigned_staff?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          onboarding_notes?: string | null
          phone?: string | null
          setup_status?: string
          target_go_live?: string | null
          updated_at?: string
          use_case?: string | null
          user_id: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          website?: string | null
        }
        Update: {
          account_status?: string
          acknowledged?: boolean
          assigned_staff?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          onboarding_notes?: string | null
          phone?: string | null
          setup_status?: string
          target_go_live?: string | null
          updated_at?: string
          use_case?: string | null
          user_id?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          website?: string | null
        }
        Relationships: []
      }
      pai_orders: {
        Row: {
          amount_cents: number
          created_at: string
          currency: string
          id: string
          maintenance_cents: number | null
          maintenance_renewal_at: string | null
          next_billing_at: string | null
          payment_model: string
          payment_status: string
          provider: string | null
          provider_checkout_id: string | null
          provider_customer_id: string | null
          provider_payment_id: string | null
          provider_subscription_id: string | null
          purchased_at: string | null
          status: string
          tier: string
          updated_at: string
          user_id: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          amount_cents?: number
          created_at?: string
          currency?: string
          id?: string
          maintenance_cents?: number | null
          maintenance_renewal_at?: string | null
          next_billing_at?: string | null
          payment_model: string
          payment_status?: string
          provider?: string | null
          provider_checkout_id?: string | null
          provider_customer_id?: string | null
          provider_payment_id?: string | null
          provider_subscription_id?: string | null
          purchased_at?: string | null
          status?: string
          tier: string
          updated_at?: string
          user_id: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          amount_cents?: number
          created_at?: string
          currency?: string
          id?: string
          maintenance_cents?: number | null
          maintenance_renewal_at?: string | null
          next_billing_at?: string | null
          payment_model?: string
          payment_status?: string
          provider?: string | null
          provider_checkout_id?: string | null
          provider_customer_id?: string | null
          provider_payment_id?: string | null
          provider_subscription_id?: string | null
          purchased_at?: string | null
          status?: string
          tier?: string
          updated_at?: string
          user_id?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: []
      }
      pai_payments: {
        Row: {
          amount_cents: number
          currency: string
          id: string
          kind: string
          occurred_at: string
          order_id: string
          provider: string
          provider_event_id: string | null
          provider_reference: string | null
          status: string
          user_id: string
        }
        Insert: {
          amount_cents: number
          currency?: string
          id?: string
          kind?: string
          occurred_at?: string
          order_id: string
          provider: string
          provider_event_id?: string | null
          provider_reference?: string | null
          status: string
          user_id: string
        }
        Update: {
          amount_cents?: number
          currency?: string
          id?: string
          kind?: string
          occurred_at?: string
          order_id?: string
          provider?: string
          provider_event_id?: string | null
          provider_reference?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pai_payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "pai_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      [_ in never]: never
    }
    Enums: {
      app_role: "admin" | "user"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "user"],
    },
  },
} as const
