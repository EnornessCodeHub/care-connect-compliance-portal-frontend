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
      client_funding_allocations: {
        Row: {
          allocated_amount: number
          allocated_hours: number
          budget_category: string
          calculated_total: number
          client_id: string
          created_at: string
          funding_period: string
          id: string
          notes: string | null
          priority: string | null
          support_item_name: string
          support_item_number: string
          unit: string
          unit_price: number
          updated_at: string
        }
        Insert: {
          allocated_amount: number
          allocated_hours: number
          budget_category: string
          calculated_total: number
          client_id: string
          created_at?: string
          funding_period: string
          id?: string
          notes?: string | null
          priority?: string | null
          support_item_name: string
          support_item_number: string
          unit: string
          unit_price: number
          updated_at?: string
        }
        Update: {
          allocated_amount?: number
          allocated_hours?: number
          budget_category?: string
          calculated_total?: number
          client_id?: string
          created_at?: string
          funding_period?: string
          id?: string
          notes?: string | null
          priority?: string | null
          support_item_name?: string
          support_item_number?: string
          unit?: string
          unit_price?: number
          updated_at?: string
        }
        Relationships: []
      }
      custom_fields: {
        Row: {
          created_at: string
          default_value: string | null
          display_order: number | null
          field_label: string
          field_name: string
          field_type: string
          help_text: string | null
          id: string
          is_active: boolean
          is_required: boolean
          options: Json | null
          placeholder_text: string | null
          updated_at: string
          validation_rules: Json | null
        }
        Insert: {
          created_at?: string
          default_value?: string | null
          display_order?: number | null
          field_label: string
          field_name: string
          field_type: string
          help_text?: string | null
          id?: string
          is_active?: boolean
          is_required?: boolean
          options?: Json | null
          placeholder_text?: string | null
          updated_at?: string
          validation_rules?: Json | null
        }
        Update: {
          created_at?: string
          default_value?: string | null
          display_order?: number | null
          field_label?: string
          field_name?: string
          field_type?: string
          help_text?: string | null
          id?: string
          is_active?: boolean
          is_required?: boolean
          options?: Json | null
          placeholder_text?: string | null
          updated_at?: string
          validation_rules?: Json | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          client_id: string
          cost_entry_id: string | null
          created_at: string
          document_type: string
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          is_active: boolean
          mime_type: string | null
          notes: string | null
          title: string
          updated_at: string
          upload_date: string
          uploaded_by: string | null
        }
        Insert: {
          client_id: string
          cost_entry_id?: string | null
          created_at?: string
          document_type: string
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          is_active?: boolean
          mime_type?: string | null
          notes?: string | null
          title: string
          updated_at?: string
          upload_date?: string
          uploaded_by?: string | null
        }
        Update: {
          client_id?: string
          cost_entry_id?: string | null
          created_at?: string
          document_type?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          is_active?: boolean
          mime_type?: string | null
          notes?: string | null
          title?: string
          updated_at?: string
          upload_date?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      field_screen_mappings: {
        Row: {
          created_at: string
          display_order: number | null
          field_id: string
          id: string
          is_active: boolean
          screen_name: string
          screen_section: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          field_id: string
          id?: string
          is_active?: boolean
          screen_name: string
          screen_section?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          field_id?: string
          id?: string
          is_active?: boolean
          screen_name?: string
          screen_section?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "field_screen_mappings_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "custom_fields"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_items: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          price_act: number | null
          price_nsw: number | null
          price_nt: number | null
          price_qld: number | null
          price_remote: number | null
          price_sa: number | null
          price_tas: number | null
          price_very_remote: number | null
          price_vic: number | null
          price_wa: number | null
          pricing_schedule_id: string
          quote_required: boolean | null
          registration_group_name: string | null
          registration_group_number: string | null
          support_category_name: string | null
          support_category_number: string | null
          support_item_name: string
          support_item_number: string
          unit: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          price_act?: number | null
          price_nsw?: number | null
          price_nt?: number | null
          price_qld?: number | null
          price_remote?: number | null
          price_sa?: number | null
          price_tas?: number | null
          price_very_remote?: number | null
          price_vic?: number | null
          price_wa?: number | null
          pricing_schedule_id: string
          quote_required?: boolean | null
          registration_group_name?: string | null
          registration_group_number?: string | null
          support_category_name?: string | null
          support_category_number?: string | null
          support_item_name: string
          support_item_number: string
          unit: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          price_act?: number | null
          price_nsw?: number | null
          price_nt?: number | null
          price_qld?: number | null
          price_remote?: number | null
          price_sa?: number | null
          price_tas?: number | null
          price_very_remote?: number | null
          price_vic?: number | null
          price_wa?: number | null
          pricing_schedule_id?: string
          quote_required?: boolean | null
          registration_group_name?: string | null
          registration_group_number?: string | null
          support_category_name?: string | null
          support_category_number?: string | null
          support_item_name?: string
          support_item_number?: string
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pricing_items_pricing_schedule_id_fkey"
            columns: ["pricing_schedule_id"]
            isOneToOne: false
            referencedRelation: "pricing_schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_schedules: {
        Row: {
          applies_to_all_periods: boolean | null
          created_at: string
          end_date: string
          funding_period_type: string | null
          id: string
          is_active: boolean
          schedule_name: string
          start_date: string
          updated_at: string
          year_period: string
        }
        Insert: {
          applies_to_all_periods?: boolean | null
          created_at?: string
          end_date: string
          funding_period_type?: string | null
          id?: string
          is_active?: boolean
          schedule_name: string
          start_date: string
          updated_at?: string
          year_period: string
        }
        Update: {
          applies_to_all_periods?: boolean | null
          created_at?: string
          end_date?: string
          funding_period_type?: string | null
          id?: string
          is_active?: boolean
          schedule_name?: string
          start_date?: string
          updated_at?: string
          year_period?: string
        }
        Relationships: []
      }
      staff_appointments: {
        Row: {
          actual_end_time: string | null
          actual_start_time: string | null
          appointment_date: string
          client_id: string
          created_at: string | null
          end_time: string
          id: string
          location: string | null
          notes: string | null
          service_type: string | null
          staff_id: string
          start_time: string
          status: Database["public"]["Enums"]["appointment_status"] | null
          updated_at: string | null
        }
        Insert: {
          actual_end_time?: string | null
          actual_start_time?: string | null
          appointment_date: string
          client_id: string
          created_at?: string | null
          end_time: string
          id?: string
          location?: string | null
          notes?: string | null
          service_type?: string | null
          staff_id: string
          start_time: string
          status?: Database["public"]["Enums"]["appointment_status"] | null
          updated_at?: string | null
        }
        Update: {
          actual_end_time?: string | null
          actual_start_time?: string | null
          appointment_date?: string
          client_id?: string
          created_at?: string | null
          end_time?: string
          id?: string
          location?: string | null
          notes?: string | null
          service_type?: string | null
          staff_id?: string
          start_time?: string
          status?: Database["public"]["Enums"]["appointment_status"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      staff_checkins: {
        Row: {
          action: string
          address: string | null
          checkin_type: Database["public"]["Enums"]["checkin_type"]
          created_at: string | null
          id: string
          latitude: number | null
          location_accuracy: number | null
          longitude: number | null
          notes: string | null
          reference_id: string
          staff_id: string
          timestamp: string | null
        }
        Insert: {
          action: string
          address?: string | null
          checkin_type: Database["public"]["Enums"]["checkin_type"]
          created_at?: string | null
          id?: string
          latitude?: number | null
          location_accuracy?: number | null
          longitude?: number | null
          notes?: string | null
          reference_id: string
          staff_id: string
          timestamp?: string | null
        }
        Update: {
          action?: string
          address?: string | null
          checkin_type?: Database["public"]["Enums"]["checkin_type"]
          created_at?: string | null
          id?: string
          latitude?: number | null
          location_accuracy?: number | null
          longitude?: number | null
          notes?: string | null
          reference_id?: string
          staff_id?: string
          timestamp?: string | null
        }
        Relationships: []
      }
      staff_locations: {
        Row: {
          accuracy: number | null
          address: string | null
          altitude: number | null
          created_at: string | null
          heading: number | null
          id: string
          is_active: boolean | null
          last_updated: string | null
          latitude: number
          longitude: number
          speed: number | null
          staff_id: string
        }
        Insert: {
          accuracy?: number | null
          address?: string | null
          altitude?: number | null
          created_at?: string | null
          heading?: number | null
          id?: string
          is_active?: boolean | null
          last_updated?: string | null
          latitude: number
          longitude: number
          speed?: number | null
          staff_id: string
        }
        Update: {
          accuracy?: number | null
          address?: string | null
          altitude?: number | null
          created_at?: string | null
          heading?: number | null
          id?: string
          is_active?: boolean | null
          last_updated?: string | null
          latitude?: number
          longitude?: number
          speed?: number | null
          staff_id?: string
        }
        Relationships: []
      }
      staff_shifts: {
        Row: {
          created_at: string | null
          end_time: string
          id: string
          location: string | null
          notes: string | null
          outlet_id: string | null
          shift_date: string
          staff_id: string
          start_time: string
          status: Database["public"]["Enums"]["shift_status"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          end_time: string
          id?: string
          location?: string | null
          notes?: string | null
          outlet_id?: string | null
          shift_date: string
          staff_id: string
          start_time: string
          status?: Database["public"]["Enums"]["shift_status"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          end_time?: string
          id?: string
          location?: string | null
          notes?: string | null
          outlet_id?: string | null
          shift_date?: string
          staff_id?: string
          start_time?: string
          status?: Database["public"]["Enums"]["shift_status"] | null
          updated_at?: string | null
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
      appointment_status:
        | "scheduled"
        | "checked_in"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "no_show"
      checkin_type: "shift" | "appointment"
      shift_status:
        | "scheduled"
        | "checked_in"
        | "checked_out"
        | "missed"
        | "cancelled"
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
      appointment_status: [
        "scheduled",
        "checked_in",
        "in_progress",
        "completed",
        "cancelled",
        "no_show",
      ],
      checkin_type: ["shift", "appointment"],
      shift_status: [
        "scheduled",
        "checked_in",
        "checked_out",
        "missed",
        "cancelled",
      ],
    },
  },
} as const
