// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.4'
  }
  public: {
    Tables: {
      acessos: {
        Row: {
          created_at: string
          id: string
          instructions: string | null
          login: string
          pass: string
          platform: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          instructions?: string | null
          login: string
          pass: string
          platform: string
          url?: string
        }
        Update: {
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
          is_completed: boolean | null
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
          is_completed?: boolean | null
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
          is_completed?: boolean | null
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
      bonus_settings: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          room_id: string | null
          sender_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          room_id?: string | null
          sender_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          room_id?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'chat_messages_room_id_fkey'
            columns: ['room_id']
            isOneToOne: false
            referencedRelation: 'chat_rooms'
            referencedColumns: ['id']
          },
        ]
      }
      chat_participants: {
        Row: {
          created_at: string
          id: string
          last_read_at: string | null
          room_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          last_read_at?: string | null
          room_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          last_read_at?: string | null
          room_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'chat_participants_room_id_fkey'
            columns: ['room_id']
            isOneToOne: false
            referencedRelation: 'chat_rooms'
            referencedColumns: ['id']
          },
        ]
      }
      chat_rooms: {
        Row: {
          created_at: string
          department: string | null
          id: string
          name: string | null
          type: string | null
        }
        Insert: {
          created_at?: string
          department?: string | null
          id?: string
          name?: string | null
          type?: string | null
        }
        Update: {
          created_at?: string
          department?: string | null
          id?: string
          name?: string | null
          type?: string | null
        }
        Relationships: []
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
      employee_documents: {
        Row: {
          created_at: string
          employee_id: string
          file_name: string
          file_path: string
          id: string
        }
        Insert: {
          created_at?: string
          employee_id: string
          file_name: string
          file_path: string
          id?: string
        }
        Update: {
          created_at?: string
          employee_id?: string
          file_name?: string
          file_path?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'employee_documents_employee_id_fkey'
            columns: ['employee_id']
            isOneToOne: false
            referencedRelation: 'employees'
            referencedColumns: ['id']
          },
        ]
      }
      employees: {
        Row: {
          address: string | null
          address_complement: string | null
          address_number: string | null
          birth_date: string | null
          bonus_due_date: string | null
          bonus_rules: string | null
          bonus_type: string | null
          cep: string | null
          city: string | null
          contract_details: string | null
          cpf: string | null
          created_at: string
          department: string
          email: string | null
          hire_date: string | null
          id: string
          last_access: string | null
          name: string
          phone: string | null
          rg: string | null
          role: string
          salary: string | null
          state: string | null
          status: string | null
          team_category: string[] | null
          user_id: string | null
          username: string | null
          vacation_days_taken: number | null
          vacation_days_total: number | null
          vacation_due_date: string | null
        }
        Insert: {
          address?: string | null
          address_complement?: string | null
          address_number?: string | null
          birth_date?: string | null
          bonus_due_date?: string | null
          bonus_rules?: string | null
          bonus_type?: string | null
          cep?: string | null
          city?: string | null
          contract_details?: string | null
          cpf?: string | null
          created_at?: string
          department: string
          email?: string | null
          hire_date?: string | null
          id?: string
          last_access?: string | null
          name: string
          phone?: string | null
          rg?: string | null
          role: string
          salary?: string | null
          state?: string | null
          status?: string | null
          team_category?: string[] | null
          user_id?: string | null
          username?: string | null
          vacation_days_taken?: number | null
          vacation_days_total?: number | null
          vacation_due_date?: string | null
        }
        Update: {
          address?: string | null
          address_complement?: string | null
          address_number?: string | null
          birth_date?: string | null
          bonus_due_date?: string | null
          bonus_rules?: string | null
          bonus_type?: string | null
          cep?: string | null
          city?: string | null
          contract_details?: string | null
          cpf?: string | null
          created_at?: string
          department?: string
          email?: string | null
          hire_date?: string | null
          id?: string
          last_access?: string | null
          name?: string
          phone?: string | null
          rg?: string | null
          role?: string
          salary?: string | null
          state?: string | null
          status?: string | null
          team_category?: string[] | null
          user_id?: string | null
          username?: string | null
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
      get_auth_user_rooms: { Args: never; Returns: string[] }
      get_or_create_group_room: {
        Args: { creator_id: string; dept_name: string }
        Returns: string
      }
      get_or_create_individual_room: {
        Args: { user1: string; user2: string }
        Returns: string
      }
      get_unread_counts: {
        Args: { user_id_param: string }
        Returns: {
          room_id: string
          unread_count: number
        }[]
      }
      is_master_user: { Args: { user_uuid: string }; Returns: boolean }
      mark_room_read: {
        Args: { p_room_id: string; p_user_id: string }
        Returns: undefined
      }
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

// ====== DATABASE EXTENDED CONTEXT (auto-generated) ======
// This section contains actual PostgreSQL column types, constraints, RLS policies,
// functions, triggers, indexes and materialized views not present in the type definitions above.
// IMPORTANT: The TypeScript types above map UUID, TEXT, VARCHAR all to "string".
// Use the COLUMN TYPES section below to know the real PostgreSQL type for each column.
// Always use the correct PostgreSQL type when writing SQL migrations.

// --- COLUMN TYPES (actual PostgreSQL types) ---
// Use this to know the real database type when writing migrations.
// "string" in TypeScript types above may be uuid, text, varchar, timestamptz, etc.
// Table: acessos
//   id: uuid (not null, default: gen_random_uuid())
//   platform: text (not null)
//   url: text (not null, default: ''::text)
//   login: text (not null)
//   pass: text (not null)
//   instructions: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: agenda
//   id: uuid (not null, default: gen_random_uuid())
//   title: text (not null)
//   date: text (not null)
//   time: text (not null)
//   location: text (not null)
//   type: text (not null)
//   assigned_to: text (nullable)
//   involves_third_party: boolean (nullable, default: false)
//   third_party_details: text (nullable)
//   created_by: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   is_completed: boolean (nullable, default: false)
// Table: audit_logs
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (nullable)
//   action: text (not null)
//   created_at: timestamp with time zone (not null, default: now())
// Table: bonus_settings
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   created_at: timestamp with time zone (not null, default: now())
// Table: chat_messages
//   id: uuid (not null, default: gen_random_uuid())
//   room_id: uuid (nullable)
//   sender_id: uuid (nullable)
//   content: text (not null)
//   created_at: timestamp with time zone (not null, default: now())
// Table: chat_participants
//   id: uuid (not null, default: gen_random_uuid())
//   room_id: uuid (nullable)
//   user_id: uuid (nullable)
//   last_read_at: timestamp with time zone (nullable, default: now())
//   created_at: timestamp with time zone (not null, default: now())
// Table: chat_rooms
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (nullable)
//   type: text (nullable)
//   department: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: documents
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   date: text (not null)
//   created_at: timestamp with time zone (not null, default: now())
// Table: employee_documents
//   id: uuid (not null, default: gen_random_uuid())
//   employee_id: uuid (not null)
//   file_name: text (not null)
//   file_path: text (not null)
//   created_at: timestamp with time zone (not null, default: now())
// Table: employees
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (nullable)
//   name: text (not null)
//   role: text (not null)
//   department: text (not null)
//   status: text (nullable, default: 'Ativo'::text)
//   hire_date: timestamp with time zone (nullable)
//   salary: text (nullable)
//   vacation_days_taken: integer (nullable, default: 0)
//   vacation_days_total: integer (nullable, default: 30)
//   vacation_due_date: timestamp with time zone (nullable)
//   email: text (nullable)
//   phone: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   username: text (nullable)
//   rg: text (nullable)
//   cpf: text (nullable)
//   birth_date: text (nullable)
//   cep: text (nullable)
//   address: text (nullable)
//   address_number: text (nullable)
//   address_complement: text (nullable)
//   city: text (nullable)
//   state: text (nullable)
//   last_access: timestamp with time zone (nullable)
//   team_category: _text (nullable, default: ARRAY['COLABORADOR'::text])
//   contract_details: text (nullable, default: ''::text)
//   bonus_type: text (nullable)
//   bonus_rules: text (nullable)
//   bonus_due_date: text (nullable)
// Table: inventory
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   package_cost: numeric (nullable, default: 0)
//   storage_location: text (nullable)
//   package_type: text (nullable)
//   items_per_box: integer (nullable, default: 1)
//   min_stock: integer (nullable, default: 0)
//   quantity: integer (nullable, default: 0)
//   specialty: text (nullable)
//   entry_date: timestamp with time zone (nullable)
//   expiration_date: timestamp with time zone (nullable)
//   brand: text (nullable)
//   last_brand: text (nullable)
//   last_value: numeric (nullable, default: 0)
//   notes: text (nullable)
//   barcode: text (nullable)
//   purchase_history: jsonb (nullable, default: '[]'::jsonb)
//   created_at: timestamp with time zone (not null, default: now())
// Table: onboarding
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   role: text (not null)
//   department: text (not null)
//   tasks: jsonb (nullable, default: '[]'::jsonb)
//   created_at: timestamp with time zone (not null, default: now())
// Table: profiles
//   id: uuid (not null)
//   email: text (not null, default: ''::text)
//   name: text (not null, default: ''::text)
//   created_at: timestamp with time zone (not null, default: now())
// Table: suppliers
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   contact: text (not null, default: ''::text)
//   phone: text (not null, default: ''::text)
//   email: text (not null, default: ''::text)
//   cnpj: text (not null, default: ''::text)
//   website: text (nullable)
//   has_special_negotiation: boolean (nullable, default: false)
//   negotiation_notes: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())

// --- CONSTRAINTS ---
// Table: acessos
//   PRIMARY KEY acessos_pkey: PRIMARY KEY (id)
// Table: agenda
//   PRIMARY KEY agenda_pkey: PRIMARY KEY (id)
// Table: audit_logs
//   PRIMARY KEY audit_logs_pkey: PRIMARY KEY (id)
//   FOREIGN KEY audit_logs_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL
//   FOREIGN KEY audit_logs_user_id_profiles_fkey: FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE SET NULL
// Table: bonus_settings
//   PRIMARY KEY bonus_settings_pkey: PRIMARY KEY (id)
// Table: chat_messages
//   PRIMARY KEY chat_messages_pkey: PRIMARY KEY (id)
//   FOREIGN KEY chat_messages_room_id_fkey: FOREIGN KEY (room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE
//   FOREIGN KEY chat_messages_sender_id_fkey: FOREIGN KEY (sender_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: chat_participants
//   PRIMARY KEY chat_participants_pkey: PRIMARY KEY (id)
//   FOREIGN KEY chat_participants_room_id_fkey: FOREIGN KEY (room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE
//   UNIQUE chat_participants_room_id_user_id_key: UNIQUE (room_id, user_id)
//   FOREIGN KEY chat_participants_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: chat_rooms
//   PRIMARY KEY chat_rooms_pkey: PRIMARY KEY (id)
//   CHECK chat_rooms_type_check: CHECK ((type = ANY (ARRAY['individual'::text, 'group'::text])))
// Table: documents
//   PRIMARY KEY documents_pkey: PRIMARY KEY (id)
// Table: employee_documents
//   FOREIGN KEY employee_documents_employee_id_fkey: FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
//   PRIMARY KEY employee_documents_pkey: PRIMARY KEY (id)
// Table: employees
//   PRIMARY KEY employees_pkey: PRIMARY KEY (id)
//   FOREIGN KEY employees_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL
// Table: inventory
//   PRIMARY KEY inventory_pkey: PRIMARY KEY (id)
// Table: onboarding
//   PRIMARY KEY onboarding_pkey: PRIMARY KEY (id)
// Table: profiles
//   FOREIGN KEY profiles_id_fkey: FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
//   PRIMARY KEY profiles_pkey: PRIMARY KEY (id)
// Table: suppliers
//   PRIMARY KEY suppliers_pkey: PRIMARY KEY (id)

// --- ROW LEVEL SECURITY POLICIES ---
// Table: acessos
//   Policy "Allow all authenticated users" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: agenda
//   Policy "Allow all authenticated users" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: audit_logs
//   Policy "Allow all authenticated users" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: bonus_settings
//   Policy "Allow all authenticated users" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: chat_messages
//   Policy "Users can insert messages in their rooms" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: ((EXISTS ( SELECT 1    FROM chat_participants cp   WHERE ((cp.room_id = cp.room_id) AND (cp.user_id = auth.uid())))) AND (sender_id = auth.uid()))
//   Policy "Users can view messages in their rooms" (SELECT, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM chat_participants cp   WHERE ((cp.room_id = chat_messages.room_id) AND (cp.user_id = auth.uid()))))
// Table: chat_participants
//   Policy "Users can delete participants" (DELETE, PERMISSIVE) roles={public}
//     USING: (is_master_user(auth.uid()) OR (user_id = auth.uid()))
//   Policy "Users can insert themselves or others into rooms" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (auth.role() = 'authenticated'::text)
//   Policy "Users can update their own participant record" (UPDATE, PERMISSIVE) roles={public}
//     USING: (user_id = auth.uid())
//   Policy "Users can view participants in their rooms" (SELECT, PERMISSIVE) roles={public}
//     USING: (room_id IN ( SELECT get_auth_user_rooms() AS get_auth_user_rooms))
// Table: chat_rooms
//   Policy "Users can create rooms" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: ((auth.role() = 'authenticated'::text) AND ((type = 'individual'::text) OR ((type = 'group'::text) AND is_master_user(auth.uid()))))
//   Policy "Users can view rooms they are in" (SELECT, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM chat_participants cp   WHERE ((cp.room_id = cp.id) AND (cp.user_id = auth.uid()))))
// Table: documents
//   Policy "Allow all authenticated users" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: employee_documents
//   Policy "Allow all authenticated users" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: employees
//   Policy "Allow all authenticated users" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: inventory
//   Policy "Allow all authenticated users" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: onboarding
//   Policy "Allow all authenticated users" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: profiles
//   Policy "Allow all authenticated users" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: suppliers
//   Policy "Allow all authenticated users" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true

// --- DATABASE FUNCTIONS ---
// FUNCTION get_auth_user_rooms()
//   CREATE OR REPLACE FUNCTION public.get_auth_user_rooms()
//    RETURNS SETOF uuid
//    LANGUAGE sql
//    SECURITY DEFINER
//    SET search_path TO ''
//   AS $function$
//     SELECT room_id FROM public.chat_participants WHERE user_id = auth.uid();
//   $function$
//
// FUNCTION get_or_create_group_room(text, uuid)
//   CREATE OR REPLACE FUNCTION public.get_or_create_group_room(dept_name text, creator_id uuid)
//    RETURNS uuid
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//     v_room_id UUID;
//   BEGIN
//     SELECT id INTO v_room_id FROM public.chat_rooms WHERE type = 'group' AND department = dept_name LIMIT 1;
//     IF v_room_id IS NULL THEN
//       INSERT INTO public.chat_rooms (name, type, department) VALUES (dept_name, 'group', dept_name) RETURNING id INTO v_room_id;
//       INSERT INTO public.chat_participants (room_id, user_id)
//       SELECT v_room_id, user_id FROM public.employees WHERE department = dept_name AND user_id IS NOT NULL
//       ON CONFLICT DO NOTHING;
//     ELSE
//       INSERT INTO public.chat_participants (room_id, user_id) VALUES (v_room_id, creator_id) ON CONFLICT DO NOTHING;
//     END IF;
//     RETURN v_room_id;
//   END;
//   $function$
//
// FUNCTION get_or_create_individual_room(uuid, uuid)
//   CREATE OR REPLACE FUNCTION public.get_or_create_individual_room(user1 uuid, user2 uuid)
//    RETURNS uuid
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//     v_room_id UUID;
//   BEGIN
//     SELECT r.id INTO v_room_id
//     FROM public.chat_rooms r
//     JOIN public.chat_participants p1 ON p1.room_id = r.id AND p1.user_id = user1
//     JOIN public.chat_participants p2 ON p2.room_id = r.id AND p2.user_id = user2
//     WHERE r.type = 'individual'
//     LIMIT 1;
//
//     IF v_room_id IS NULL THEN
//       INSERT INTO public.chat_rooms (type) VALUES ('individual') RETURNING id INTO v_room_id;
//       INSERT INTO public.chat_participants (room_id, user_id) VALUES (v_room_id, user1), (v_room_id, user2);
//     END IF;
//     RETURN v_room_id;
//   END;
//   $function$
//
// FUNCTION get_unread_counts(uuid)
//   CREATE OR REPLACE FUNCTION public.get_unread_counts(user_id_param uuid)
//    RETURNS TABLE(room_id uuid, unread_count bigint)
//    LANGUAGE sql
//    SECURITY DEFINER
//   AS $function$
//     SELECT
//       cp.room_id,
//       COUNT(m.id) as unread_count
//     FROM public.chat_participants cp
//     JOIN public.chat_messages m ON m.room_id = cp.room_id
//     WHERE cp.user_id = user_id_param
//       AND m.sender_id != user_id_param
//       AND m.created_at > COALESCE(cp.last_read_at, '1970-01-01'::timestamptz)
//     GROUP BY cp.room_id;
//   $function$
//
// FUNCTION handle_new_user()
//   CREATE OR REPLACE FUNCTION public.handle_new_user()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     INSERT INTO public.profiles (id, email, name)
//     VALUES (NEW.id, COALESCE(NEW.email, ''), COALESCE(NEW.raw_user_meta_data->>'name', 'Colaborador'));
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION is_master_user(uuid)
//   CREATE OR REPLACE FUNCTION public.is_master_user(user_uuid uuid)
//    RETURNS boolean
//    LANGUAGE sql
//    SECURITY DEFINER
//   AS $function$
//     SELECT EXISTS (
//       SELECT 1 FROM public.employees
//       WHERE user_id = user_uuid AND 'MASTER' = ANY(team_category)
//     );
//   $function$
//
// FUNCTION mark_room_read(uuid, uuid)
//   CREATE OR REPLACE FUNCTION public.mark_room_read(p_room_id uuid, p_user_id uuid)
//    RETURNS void
//    LANGUAGE sql
//    SECURITY DEFINER
//   AS $function$
//     UPDATE public.chat_participants
//     SET last_read_at = NOW()
//     WHERE room_id = p_room_id AND user_id = p_user_id;
//   $function$
//

// --- INDEXES ---
// Table: chat_participants
//   CREATE UNIQUE INDEX chat_participants_room_id_user_id_key ON public.chat_participants USING btree (room_id, user_id)
