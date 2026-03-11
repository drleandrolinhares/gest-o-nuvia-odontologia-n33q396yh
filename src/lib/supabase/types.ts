// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '14.4'
  }
  public: {
    Tables: {
      acessos: {
        Row: {
          access_level: string | null
          created_at: string
          id: string
          instructions: string | null
          login: string
          pass: string
          platform: string
          url: string
        }
        Insert: {
          access_level?: string | null
          created_at?: string
          id?: string
          instructions?: string | null
          login: string
          pass: string
          platform: string
          url?: string
        }
        Update: {
          access_level?: string | null
          created_at?: string
          id?: string
          instructions?: string | null
          login?: string
          pass?: string
          platform?: string
          url?: string
        }
        Relationships: []
      }
      agenda: {
        Row: {
          assigned_to: string | null
          created_at: string
          created_by: string | null
          date: string
          id: string
          involves_third_party: boolean | null
          location: string
          third_party_details: string | null
          time: string
          title: string
          type: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          created_by?: string | null
          date: string
          id?: string
          involves_third_party?: boolean | null
          location: string
          third_party_details?: string | null
          time: string
          title: string
          type: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          created_by?: string | null
          date?: string
          id?: string
          involves_third_party?: boolean | null
          location?: string
          third_party_details?: string | null
          time?: string
          title?: string
          type?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'audit_logs_user_id_profiles_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      documents: {
        Row: {
          created_at: string
          date: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      employees: {
        Row: {
          access_level: string | null
          agenda_access: string | null
          created_at: string
          department: string
          email: string | null
          hire_date: string | null
          id: string
          name: string
          username: string | null
          rg: string | null
          cpf: string | null
          birth_date: string | null
          cep: string | null
          address: string | null
          address_number: string | null
          address_complement: string | null
          city: string | null
          state: string | null
          access_schedule: boolean | null
          system_profiles: Json | null
          last_access: string | null
          permissions: Json | null
          phone: string | null
          role: string
          salary: string | null
          status: string | null
          user_id: string | null
          vacation_days_taken: number | null
          vacation_days_total: number | null
          vacation_due_date: string | null
        }
        Insert: {
          access_level?: string | null
          agenda_access?: string | null
          created_at?: string
          department: string
          email?: string | null
          hire_date?: string | null
          id?: string
          name: string
          username?: string | null
          rg?: string | null
          cpf?: string | null
          birth_date?: string | null
          cep?: string | null
          address?: string | null
          address_number?: string | null
          address_complement?: string | null
          city?: string | null
          state?: string | null
          access_schedule?: boolean | null
          system_profiles?: Json | null
          last_access?: string | null
          permissions?: Json | null
          phone?: string | null
          role: string
          salary?: string | null
          status?: string | null
          user_id?: string | null
          vacation_days_taken?: number | null
          vacation_days_total?: number | null
          vacation_due_date?: string | null
        }
        Update: {
          access_level?: string | null
          agenda_access?: string | null
          created_at?: string
          department?: string
          email?: string | null
          hire_date?: string | null
          id?: string
          name?: string
          username?: string | null
          rg?: string | null
          cpf?: string | null
          birth_date?: string | null
          cep?: string | null
          address?: string | null
          address_number?: string | null
          address_complement?: string | null
          city?: string | null
          state?: string | null
          access_schedule?: boolean | null
          system_profiles?: Json | null
          last_access?: string | null
          permissions?: Json | null
          phone?: string | null
          role?: string
          salary?: string | null
          status?: string | null
          user_id?: string | null
          vacation_days_taken?: number | null
          vacation_days_total?: number | null
          vacation_due_date?: string | null
        }
        Relationships: []
      }
      inventory: {
        Row: {
          barcode: string | null
          brand: string | null
          created_at: string
          entry_date: string | null
          expiration_date: string | null
          id: string
          items_per_box: number | null
          last_brand: string | null
          last_value: number | null
          min_stock: number | null
          name: string
          notes: string | null
          package_cost: number | null
          package_type: string | null
          purchase_history: Json | null
          quantity: number | null
          specialty: string | null
          storage_location: string | null
        }
        Insert: {
          barcode?: string | null
          brand?: string | null
          created_at?: string
          entry_date?: string | null
          expiration_date?: string | null
          id?: string
          items_per_box?: number | null
          last_brand?: string | null
          last_value?: number | null
          min_stock?: number | null
          name: string
          notes?: string | null
          package_cost?: number | null
          package_type?: string | null
          purchase_history?: Json | null
          quantity?: number | null
          specialty?: string | null
          storage_location?: string | null
        }
        Update: {
          barcode?: string | null
          brand?: string | null
          created_at?: string
          entry_date?: string | null
          expiration_date?: string | null
          id?: string
          items_per_box?: number | null
          last_brand?: string | null
          last_value?: number | null
          min_stock?: number | null
          name?: string
          notes?: string | null
          package_cost?: number | null
          package_type?: string | null
          purchase_history?: Json | null
          quantity?: number | null
          specialty?: string | null
          storage_location?: string | null
        }
        Relationships: []
      }
      onboarding: {
        Row: {
          created_at: string
          department: string
          id: string
          name: string
          role: string
          tasks: Json | null
        }
        Insert: {
          created_at?: string
          department: string
          id?: string
          name: string
          role: string
          tasks?: Json | null
        }
        Update: {
          created_at?: string
          department?: string
          id?: string
          name?: string
          role?: string
          tasks?: Json | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          email?: string
          id: string
          name?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          cnpj: string
          contact: string
          created_at: string
          email: string
          has_special_negotiation: boolean | null
          id: string
          name: string
          negotiation_notes: string | null
          phone: string
          website: string | null
        }
        Insert: {
          cnpj?: string
          contact?: string
          created_at?: string
          email?: string
          has_special_negotiation?: boolean | null
          id?: string
          name: string
          negotiation_notes?: string | null
          phone?: string
          website?: string | null
        }
        Update: {
          cnpj?: string
          contact?: string
          created_at?: string
          email?: string
          has_special_negotiation?: boolean | null
          id?: string
          name?: string
          negotiation_notes?: string | null
          phone?: string
          website?: string | null
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
