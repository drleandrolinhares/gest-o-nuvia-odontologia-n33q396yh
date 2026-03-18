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
          access_level: string | null
          created_at: string
          description: string | null
          frequency: string | null
          id: string
          instructions: string | null
          login: string
          logo_url: string | null
          manual_steps: Json | null
          pass: string
          platform: string
          sector: string | null
          security_note: string | null
          target_users: string | null
          troubleshooting: Json | null
          url: string
          video_url: string | null
        }
        Insert: {
          access_level?: string | null
          created_at?: string
          description?: string | null
          frequency?: string | null
          id?: string
          instructions?: string | null
          login: string
          logo_url?: string | null
          manual_steps?: Json | null
          pass: string
          platform: string
          sector?: string | null
          security_note?: string | null
          target_users?: string | null
          troubleshooting?: Json | null
          url?: string
          video_url?: string | null
        }
        Update: {
          access_level?: string | null
          created_at?: string
          description?: string | null
          frequency?: string | null
          id?: string
          instructions?: string | null
          login?: string
          logo_url?: string | null
          manual_steps?: Json | null
          pass?: string
          platform?: string
          sector?: string | null
          security_note?: string | null
          target_users?: string | null
          troubleshooting?: Json | null
          url?: string
          video_url?: string | null
        }
        Relationships: []
      }
      agenda: {
        Row: {
          assigned_to: string | null
          completed_at: string | null
          created_at: string
          created_by: string | null
          date: string
          end_date: string | null
          id: string
          involves_third_party: boolean | null
          is_completed: boolean | null
          location: string
          periodicity: string | null
          received_at: string | null
          requester_id: string | null
          sac_record_id: string | null
          third_party_details: string | null
          time: string
          title: string
          type: string
        }
        Insert: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          date: string
          end_date?: string | null
          id?: string
          involves_third_party?: boolean | null
          is_completed?: boolean | null
          location: string
          periodicity?: string | null
          received_at?: string | null
          requester_id?: string | null
          sac_record_id?: string | null
          third_party_details?: string | null
          time: string
          title: string
          type: string
        }
        Update: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          date?: string
          end_date?: string | null
          id?: string
          involves_third_party?: boolean | null
          is_completed?: boolean | null
          location?: string
          periodicity?: string | null
          received_at?: string | null
          requester_id?: string | null
          sac_record_id?: string | null
          third_party_details?: string | null
          time?: string
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: 'agenda_requester_id_fkey'
            columns: ['requester_id']
            isOneToOne: false
            referencedRelation: 'employees'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'agenda_sac_record_id_fkey'
            columns: ['sac_record_id']
            isOneToOne: false
            referencedRelation: 'sac_records'
            referencedColumns: ['id']
          },
        ]
      }
      agenda_segmentation: {
        Row: {
          consultorio_id: string
          created_at: string
          day_of_week: number
          dentist_id: string | null
          id: string
          shift: string
          specialty_id: string | null
        }
        Insert: {
          consultorio_id: string
          created_at?: string
          day_of_week: number
          dentist_id?: string | null
          id?: string
          shift: string
          specialty_id?: string | null
        }
        Update: {
          consultorio_id?: string
          created_at?: string
          day_of_week?: number
          dentist_id?: string | null
          id?: string
          shift?: string
          specialty_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'agenda_segmentation_consultorio_id_fkey'
            columns: ['consultorio_id']
            isOneToOne: false
            referencedRelation: 'clinica_consultorios'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'agenda_segmentation_dentist_id_fkey'
            columns: ['dentist_id']
            isOneToOne: false
            referencedRelation: 'employees'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'agenda_segmentation_specialty_id_fkey'
            columns: ['specialty_id']
            isOneToOne: false
            referencedRelation: 'specialty_configs'
            referencedColumns: ['id']
          },
        ]
      }
      app_settings: {
        Row: {
          created_at: string
          evaluation_factor_percentage: number | null
          global_card_fee: number | null
          global_commission: number | null
          global_inadimplency: number | null
          global_taxes: number | null
          hourly_cost_fixed_items: Json | null
          hourly_cost_monthly_hours: number | null
          id: string
          negotiation_settings: Json | null
          predicted_loss_percentage: number | null
        }
        Insert: {
          created_at?: string
          evaluation_factor_percentage?: number | null
          global_card_fee?: number | null
          global_commission?: number | null
          global_inadimplency?: number | null
          global_taxes?: number | null
          hourly_cost_fixed_items?: Json | null
          hourly_cost_monthly_hours?: number | null
          id?: string
          negotiation_settings?: Json | null
          predicted_loss_percentage?: number | null
        }
        Update: {
          created_at?: string
          evaluation_factor_percentage?: number | null
          global_card_fee?: number | null
          global_commission?: number | null
          global_inadimplency?: number | null
          global_taxes?: number | null
          hourly_cost_fixed_items?: Json | null
          hourly_cost_monthly_hours?: number | null
          id?: string
          negotiation_settings?: Json | null
          predicted_loss_percentage?: number | null
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
          last_message_at: string | null
          name: string | null
          type: string | null
        }
        Insert: {
          created_at?: string
          department?: string | null
          id?: string
          last_message_at?: string | null
          name?: string | null
          type?: string | null
        }
        Update: {
          created_at?: string
          department?: string | null
          id?: string
          last_message_at?: string | null
          name?: string | null
          type?: string | null
        }
        Relationships: []
      }
      clinica_consultorios: {
        Row: {
          afternoon_end: string | null
          afternoon_start: string | null
          created_at: string
          id: string
          morning_end: string | null
          morning_start: string | null
          name: string
        }
        Insert: {
          afternoon_end?: string | null
          afternoon_start?: string | null
          created_at?: string
          id?: string
          morning_end?: string | null
          morning_start?: string | null
          name: string
        }
        Update: {
          afternoon_end?: string | null
          afternoon_start?: string | null
          created_at?: string
          id?: string
          morning_end?: string | null
          morning_start?: string | null
          name?: string
        }
        Relationships: []
      }
      consultorio_weekly_schedules: {
        Row: {
          afternoon_end: string | null
          afternoon_start: string | null
          consultorio_id: string
          created_at: string
          day_of_week: number
          id: string
          is_closed: boolean
          morning_end: string | null
          morning_start: string | null
        }
        Insert: {
          afternoon_end?: string | null
          afternoon_start?: string | null
          consultorio_id: string
          created_at?: string
          day_of_week: number
          id?: string
          is_closed?: boolean
          morning_end?: string | null
          morning_start?: string | null
        }
        Update: {
          afternoon_end?: string | null
          afternoon_start?: string | null
          consultorio_id?: string
          created_at?: string
          day_of_week?: number
          id?: string
          is_closed?: boolean
          morning_end?: string | null
          morning_start?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'consultorio_weekly_schedules_consultorio_id_fkey'
            columns: ['consultorio_id']
            isOneToOne: false
            referencedRelation: 'clinica_consultorios'
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
          bank_name: string | null
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
          no_system_access: boolean | null
          phone: string | null
          pix_key: string | null
          pix_number: string | null
          pix_type: string | null
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
          bank_name?: string | null
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
          no_system_access?: boolean | null
          phone?: string | null
          pix_key?: string | null
          pix_number?: string | null
          pix_type?: string | null
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
          bank_name?: string | null
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
          no_system_access?: boolean | null
          phone?: string | null
          pix_key?: string | null
          pix_number?: string | null
          pix_type?: string | null
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
        Relationships: [
          {
            foreignKeyName: 'fk_employees_role'
            columns: ['role']
            isOneToOne: false
            referencedRelation: 'roles'
            referencedColumns: ['name']
          },
        ]
      }
      inventory: {
        Row: {
          barcode: string | null
          brand: string | null
          cabinet_number: string | null
          consumption_mode: string | null
          consumption_reference: string | null
          created_at: string
          critical_observations: string | null
          entry_date: string | null
          expiration_date: string | null
          id: string
          items_per_box: number | null
          last_brand: string | null
          last_value: number | null
          min_stock: number | null
          name: string
          nfe_number: string | null
          notes: string | null
          package_cost: number | null
          package_type: string | null
          purchase_history: Json | null
          quantity: number | null
          specialty: string | null
          specialty_details: Json | null
          storage_location: string | null
          storage_room: string | null
        }
        Insert: {
          barcode?: string | null
          brand?: string | null
          cabinet_number?: string | null
          consumption_mode?: string | null
          consumption_reference?: string | null
          created_at?: string
          critical_observations?: string | null
          entry_date?: string | null
          expiration_date?: string | null
          id?: string
          items_per_box?: number | null
          last_brand?: string | null
          last_value?: number | null
          min_stock?: number | null
          name: string
          nfe_number?: string | null
          notes?: string | null
          package_cost?: number | null
          package_type?: string | null
          purchase_history?: Json | null
          quantity?: number | null
          specialty?: string | null
          specialty_details?: Json | null
          storage_location?: string | null
          storage_room?: string | null
        }
        Update: {
          barcode?: string | null
          brand?: string | null
          cabinet_number?: string | null
          consumption_mode?: string | null
          consumption_reference?: string | null
          created_at?: string
          critical_observations?: string | null
          entry_date?: string | null
          expiration_date?: string | null
          id?: string
          items_per_box?: number | null
          last_brand?: string | null
          last_value?: number | null
          min_stock?: number | null
          name?: string
          nfe_number?: string | null
          notes?: string | null
          package_cost?: number | null
          package_type?: string | null
          purchase_history?: Json | null
          quantity?: number | null
          specialty?: string | null
          specialty_details?: Json | null
          storage_location?: string | null
          storage_room?: string | null
        }
        Relationships: []
      }
      inventory_movements: {
        Row: {
          created_at: string
          id: string
          inventory_id: string
          quantity: number
          recipient: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          inventory_id: string
          quantity: number
          recipient?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          inventory_id?: string
          quantity?: number
          recipient?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'inventory_movements_inventory_id_fkey'
            columns: ['inventory_id']
            isOneToOne: false
            referencedRelation: 'inventory'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'inventory_movements_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      inventory_settings: {
        Row: {
          category: string
          created_at: string
          id: string
          label: string | null
          value: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          label?: string | null
          value: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          label?: string | null
          value?: string
        }
        Relationships: []
      }
      inventory_temporary_outflows: {
        Row: {
          created_at: string
          employee_id: string
          id: string
          inventory_id: string
          quantity: number
          status: string
        }
        Insert: {
          created_at?: string
          employee_id: string
          id?: string
          inventory_id: string
          quantity: number
          status?: string
        }
        Update: {
          created_at?: string
          employee_id?: string
          id?: string
          inventory_id?: string
          quantity?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: 'inventory_temporary_outflows_employee_id_fkey'
            columns: ['employee_id']
            isOneToOne: false
            referencedRelation: 'employees'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'inventory_temporary_outflows_inventory_id_fkey'
            columns: ['inventory_id']
            isOneToOne: false
            referencedRelation: 'inventory'
            referencedColumns: ['id']
          },
        ]
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
      price_list: {
        Row: {
          cadista_cost: number | null
          category: string
          created_at: string
          execution_time: number | null
          fixed_cost: number | null
          id: string
          material: string | null
          material_cost: number | null
          price: number | null
          sector: string | null
          work_type: string
        }
        Insert: {
          cadista_cost?: number | null
          category: string
          created_at?: string
          execution_time?: number | null
          fixed_cost?: number | null
          id?: string
          material?: string | null
          material_cost?: number | null
          price?: number | null
          sector?: string | null
          work_type: string
        }
        Update: {
          cadista_cost?: number | null
          category?: string
          created_at?: string
          execution_time?: number | null
          fixed_cost?: number | null
          id?: string
          material?: string | null
          material_cost?: number | null
          price?: number | null
          sector?: string | null
          work_type?: string
        }
        Relationships: []
      }
      price_stages: {
        Row: {
          created_at: string
          id: string
          name: string
          percentage: number | null
          price_list_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          percentage?: number | null
          price_list_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          percentage?: number | null
          price_list_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'price_stages_price_list_id_fkey'
            columns: ['price_list_id']
            isOneToOne: false
            referencedRelation: 'price_list'
            referencedColumns: ['id']
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          must_change_password: boolean | null
          name: string
        }
        Insert: {
          created_at?: string
          email?: string
          id: string
          must_change_password?: boolean | null
          name?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          must_change_password?: boolean | null
          name?: string
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          can_create: boolean
          can_delete: boolean
          can_edit: boolean
          can_view: boolean
          id: string
          module: string
          role: string
          updated_at: string
        }
        Insert: {
          can_create?: boolean
          can_delete?: boolean
          can_edit?: boolean
          can_view?: boolean
          id?: string
          module: string
          role: string
          updated_at?: string
        }
        Update: {
          can_create?: boolean
          can_delete?: boolean
          can_edit?: boolean
          can_view?: boolean
          id?: string
          module?: string
          role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'fk_role_permissions_role'
            columns: ['role']
            isOneToOne: false
            referencedRelation: 'roles'
            referencedColumns: ['name']
          },
        ]
      }
      roles: {
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
      sac_records: {
        Row: {
          action_history: Json | null
          created_at: string
          description: string
          id: string
          limit_at: string
          patient_name: string
          received_at: string
          receiving_employee_id: string | null
          responsible_employee_id: string | null
          sector: string
          solution_details: string | null
          solved_at: string | null
          status: string
          type: string
        }
        Insert: {
          action_history?: Json | null
          created_at?: string
          description: string
          id?: string
          limit_at: string
          patient_name: string
          received_at?: string
          receiving_employee_id?: string | null
          responsible_employee_id?: string | null
          sector: string
          solution_details?: string | null
          solved_at?: string | null
          status?: string
          type: string
        }
        Update: {
          action_history?: Json | null
          created_at?: string
          description?: string
          id?: string
          limit_at?: string
          patient_name?: string
          received_at?: string
          receiving_employee_id?: string | null
          responsible_employee_id?: string | null
          sector?: string
          solution_details?: string | null
          solved_at?: string | null
          status?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: 'sac_records_receiving_employee_id_fkey'
            columns: ['receiving_employee_id']
            isOneToOne: false
            referencedRelation: 'employees'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'sac_records_responsible_employee_id_fkey'
            columns: ['responsible_employee_id']
            isOneToOne: false
            referencedRelation: 'employees'
            referencedColumns: ['id']
          },
        ]
      }
      specialty_configs: {
        Row: {
          color_hex: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          color_hex: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          color_hex?: string
          created_at?: string
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
      work_schedules: {
        Row: {
          afternoon_end: string | null
          afternoon_snack_end: string | null
          afternoon_snack_start: string | null
          afternoon_start: string | null
          created_at: string
          employee_id: string
          id: string
          morning_end: string | null
          morning_snack_end: string | null
          morning_snack_start: string | null
          morning_start: string | null
          total_daily_hours: number | null
          work_date: string
        }
        Insert: {
          afternoon_end?: string | null
          afternoon_snack_end?: string | null
          afternoon_snack_start?: string | null
          afternoon_start?: string | null
          created_at?: string
          employee_id: string
          id?: string
          morning_end?: string | null
          morning_snack_end?: string | null
          morning_snack_start?: string | null
          morning_start?: string | null
          total_daily_hours?: number | null
          work_date: string
        }
        Update: {
          afternoon_end?: string | null
          afternoon_snack_end?: string | null
          afternoon_snack_start?: string | null
          afternoon_start?: string | null
          created_at?: string
          employee_id?: string
          id?: string
          morning_end?: string | null
          morning_snack_end?: string | null
          morning_snack_start?: string | null
          morning_start?: string | null
          total_daily_hours?: number | null
          work_date?: string
        }
        Relationships: [
          {
            foreignKeyName: 'work_schedules_employee_id_fkey'
            columns: ['employee_id']
            isOneToOne: false
            referencedRelation: 'employees'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      fix_auth_user_tokens: { Args: { user_id: string }; Returns: undefined }
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
//   sector: text (nullable, default: 'GERAL'::text)
//   access_level: text (nullable, default: 'ACESSO GERAL'::text)
//   logo_url: text (nullable)
//   description: text (nullable)
//   target_users: text (nullable)
//   frequency: text (nullable)
//   video_url: text (nullable)
//   manual_steps: jsonb (nullable, default: '[]'::jsonb)
//   troubleshooting: jsonb (nullable, default: '[]'::jsonb)
//   security_note: text (nullable)
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
//   requester_id: uuid (nullable)
//   received_at: timestamp with time zone (nullable)
//   completed_at: timestamp with time zone (nullable)
//   sac_record_id: uuid (nullable)
//   periodicity: text (nullable)
//   end_date: date (nullable)
// Table: agenda_segmentation
//   id: uuid (not null, default: gen_random_uuid())
//   consultorio_id: uuid (not null)
//   day_of_week: integer (not null)
//   shift: text (not null)
//   specialty_id: uuid (nullable)
//   dentist_id: uuid (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: app_settings
//   id: uuid (not null, default: gen_random_uuid())
//   global_card_fee: numeric (nullable, default: 0)
//   global_commission: numeric (nullable, default: 0)
//   global_inadimplency: numeric (nullable, default: 0)
//   global_taxes: numeric (nullable, default: 0)
//   hourly_cost_fixed_items: jsonb (nullable, default: '[]'::jsonb)
//   hourly_cost_monthly_hours: numeric (nullable, default: 160)
//   created_at: timestamp with time zone (not null, default: now())
//   predicted_loss_percentage: numeric (nullable, default: 20)
//   evaluation_factor_percentage: numeric (nullable, default: 15)
//   negotiation_settings: jsonb (nullable, default: '{"ranges": [{"max": 2999.99, "min": 1000, "maxInstallments": 4}, {"max": 4999.99, "min": 3000, "maxInstallments": 8}, {"max": 7999.99, "min": 5000, "maxInstallments": 12}, {"max": 11999.99, "min": 8000, "maxInstallments": 18}, {"max": 9999999, "min": 12000, "maxInstallments": 24}], "defaultEntryPercentage": 30}'::jsonb)
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
//   last_message_at: timestamp with time zone (nullable)
// Table: clinica_consultorios
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   morning_start: time without time zone (nullable)
//   morning_end: time without time zone (nullable)
//   afternoon_start: time without time zone (nullable)
//   afternoon_end: time without time zone (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: consultorio_weekly_schedules
//   id: uuid (not null, default: gen_random_uuid())
//   consultorio_id: uuid (not null)
//   day_of_week: integer (not null)
//   morning_start: time without time zone (nullable)
//   morning_end: time without time zone (nullable)
//   afternoon_start: time without time zone (nullable)
//   afternoon_end: time without time zone (nullable)
//   is_closed: boolean (not null, default: false)
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
//   pix_key: text (nullable)
//   pix_type: text (nullable)
//   bank_name: text (nullable)
//   pix_number: text (nullable)
//   no_system_access: boolean (nullable, default: false)
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
//   specialty_details: jsonb (nullable, default: '{}'::jsonb)
//   nfe_number: text (nullable)
//   storage_room: text (nullable)
//   cabinet_number: text (nullable)
//   critical_observations: text (nullable)
//   consumption_mode: text (nullable)
//   consumption_reference: text (nullable)
// Table: inventory_movements
//   id: uuid (not null, default: gen_random_uuid())
//   inventory_id: uuid (not null)
//   user_id: uuid (nullable)
//   type: text (not null)
//   quantity: integer (not null)
//   recipient: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: inventory_settings
//   id: uuid (not null, default: gen_random_uuid())
//   category: text (not null)
//   label: text (nullable)
//   value: text (not null)
//   created_at: timestamp with time zone (not null, default: now())
// Table: inventory_temporary_outflows
//   id: uuid (not null, default: gen_random_uuid())
//   inventory_id: uuid (not null)
//   employee_id: uuid (not null)
//   quantity: integer (not null)
//   status: text (not null, default: 'PENDING'::text)
//   created_at: timestamp with time zone (not null, default: now())
// Table: onboarding
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   role: text (not null)
//   department: text (not null)
//   tasks: jsonb (nullable, default: '[]'::jsonb)
//   created_at: timestamp with time zone (not null, default: now())
// Table: price_list
//   id: uuid (not null, default: gen_random_uuid())
//   work_type: text (not null)
//   category: text (not null)
//   material: text (nullable)
//   price: numeric (nullable, default: 0)
//   sector: text (nullable)
//   execution_time: integer (nullable, default: 0)
//   cadista_cost: numeric (nullable, default: 0)
//   material_cost: numeric (nullable, default: 0)
//   fixed_cost: numeric (nullable, default: 0)
//   created_at: timestamp with time zone (not null, default: now())
// Table: price_stages
//   id: uuid (not null, default: gen_random_uuid())
//   price_list_id: uuid (nullable)
//   name: text (not null)
//   percentage: numeric (nullable, default: 0)
//   created_at: timestamp with time zone (not null, default: now())
// Table: profiles
//   id: uuid (not null)
//   email: text (not null, default: ''::text)
//   name: text (not null, default: ''::text)
//   created_at: timestamp with time zone (not null, default: now())
//   must_change_password: boolean (nullable, default: false)
// Table: role_permissions
//   id: uuid (not null, default: gen_random_uuid())
//   role: text (not null)
//   module: text (not null)
//   can_view: boolean (not null, default: false)
//   can_create: boolean (not null, default: false)
//   can_edit: boolean (not null, default: false)
//   can_delete: boolean (not null, default: false)
//   updated_at: timestamp with time zone (not null, default: now())
// Table: roles
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   created_at: timestamp with time zone (not null, default: now())
// Table: sac_records
//   id: uuid (not null, default: gen_random_uuid())
//   type: text (not null)
//   patient_name: text (not null)
//   receiving_employee_id: uuid (nullable)
//   responsible_employee_id: uuid (nullable)
//   status: text (not null, default: 'OPORTUNIDADE DE SOLUÇÃO'::text)
//   sector: text (not null)
//   description: text (not null)
//   solution_details: text (nullable)
//   received_at: timestamp with time zone (not null, default: now())
//   limit_at: timestamp with time zone (not null)
//   solved_at: timestamp with time zone (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   action_history: jsonb (nullable, default: '[]'::jsonb)
// Table: specialty_configs
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   color_hex: text (not null)
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
// Table: work_schedules
//   id: uuid (not null, default: gen_random_uuid())
//   employee_id: uuid (not null)
//   work_date: date (not null)
//   morning_start: time without time zone (nullable)
//   afternoon_end: time without time zone (nullable)
//   morning_snack_start: time without time zone (nullable)
//   morning_snack_end: time without time zone (nullable)
//   afternoon_snack_start: time without time zone (nullable)
//   afternoon_snack_end: time without time zone (nullable)
//   total_daily_hours: numeric (nullable, default: 0)
//   created_at: timestamp with time zone (not null, default: now())
//   morning_end: time without time zone (nullable)
//   afternoon_start: time without time zone (nullable)

// --- CONSTRAINTS ---
// Table: acessos
//   PRIMARY KEY acessos_pkey: PRIMARY KEY (id)
// Table: agenda
//   PRIMARY KEY agenda_pkey: PRIMARY KEY (id)
//   FOREIGN KEY agenda_requester_id_fkey: FOREIGN KEY (requester_id) REFERENCES employees(id) ON DELETE SET NULL
//   FOREIGN KEY agenda_sac_record_id_fkey: FOREIGN KEY (sac_record_id) REFERENCES sac_records(id) ON DELETE CASCADE
// Table: agenda_segmentation
//   UNIQUE agenda_segmentation_consultorio_id_day_of_week_shift_key: UNIQUE (consultorio_id, day_of_week, shift)
//   FOREIGN KEY agenda_segmentation_consultorio_id_fkey: FOREIGN KEY (consultorio_id) REFERENCES clinica_consultorios(id) ON DELETE CASCADE
//   CHECK agenda_segmentation_day_of_week_check: CHECK (((day_of_week >= 1) AND (day_of_week <= 6)))
//   FOREIGN KEY agenda_segmentation_dentist_id_fkey: FOREIGN KEY (dentist_id) REFERENCES employees(id) ON DELETE SET NULL
//   PRIMARY KEY agenda_segmentation_pkey: PRIMARY KEY (id)
//   CHECK agenda_segmentation_shift_check: CHECK ((shift = ANY (ARRAY['MANHÃ'::text, 'TARDE'::text])))
//   FOREIGN KEY agenda_segmentation_specialty_id_fkey: FOREIGN KEY (specialty_id) REFERENCES specialty_configs(id) ON DELETE SET NULL
// Table: app_settings
//   PRIMARY KEY app_settings_pkey: PRIMARY KEY (id)
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
// Table: clinica_consultorios
//   PRIMARY KEY clinica_consultorios_pkey: PRIMARY KEY (id)
// Table: consultorio_weekly_schedules
//   UNIQUE consultorio_weekly_schedules_consultorio_id_day_of_week_key: UNIQUE (consultorio_id, day_of_week)
//   FOREIGN KEY consultorio_weekly_schedules_consultorio_id_fkey: FOREIGN KEY (consultorio_id) REFERENCES clinica_consultorios(id) ON DELETE CASCADE
//   CHECK consultorio_weekly_schedules_day_of_week_check: CHECK (((day_of_week >= 1) AND (day_of_week <= 6)))
//   PRIMARY KEY consultorio_weekly_schedules_pkey: PRIMARY KEY (id)
// Table: documents
//   PRIMARY KEY documents_pkey: PRIMARY KEY (id)
// Table: employee_documents
//   FOREIGN KEY employee_documents_employee_id_fkey: FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
//   PRIMARY KEY employee_documents_pkey: PRIMARY KEY (id)
// Table: employees
//   PRIMARY KEY employees_pkey: PRIMARY KEY (id)
//   FOREIGN KEY employees_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL
//   FOREIGN KEY fk_employees_role: FOREIGN KEY (role) REFERENCES roles(name) ON UPDATE CASCADE ON DELETE RESTRICT
// Table: inventory
//   PRIMARY KEY inventory_pkey: PRIMARY KEY (id)
// Table: inventory_movements
//   FOREIGN KEY inventory_movements_inventory_id_fkey: FOREIGN KEY (inventory_id) REFERENCES inventory(id) ON DELETE CASCADE
//   PRIMARY KEY inventory_movements_pkey: PRIMARY KEY (id)
//   FOREIGN KEY inventory_movements_user_id_fkey: FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE SET NULL
// Table: inventory_settings
//   PRIMARY KEY inventory_settings_pkey: PRIMARY KEY (id)
// Table: inventory_temporary_outflows
//   FOREIGN KEY inventory_temporary_outflows_employee_id_fkey: FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
//   FOREIGN KEY inventory_temporary_outflows_inventory_id_fkey: FOREIGN KEY (inventory_id) REFERENCES inventory(id) ON DELETE CASCADE
//   PRIMARY KEY inventory_temporary_outflows_pkey: PRIMARY KEY (id)
//   CHECK inventory_temporary_outflows_quantity_check: CHECK ((quantity > 0))
//   CHECK inventory_temporary_outflows_status_check: CHECK ((status = ANY (ARRAY['PENDING'::text, 'FINALIZED'::text, 'RETURNED'::text])))
// Table: onboarding
//   PRIMARY KEY onboarding_pkey: PRIMARY KEY (id)
// Table: price_list
//   PRIMARY KEY price_list_pkey: PRIMARY KEY (id)
// Table: price_stages
//   PRIMARY KEY price_stages_pkey: PRIMARY KEY (id)
//   FOREIGN KEY price_stages_price_list_id_fkey: FOREIGN KEY (price_list_id) REFERENCES price_list(id) ON DELETE CASCADE
// Table: profiles
//   FOREIGN KEY profiles_id_fkey: FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
//   PRIMARY KEY profiles_pkey: PRIMARY KEY (id)
// Table: role_permissions
//   FOREIGN KEY fk_role_permissions_role: FOREIGN KEY (role) REFERENCES roles(name) ON UPDATE CASCADE ON DELETE CASCADE
//   PRIMARY KEY role_permissions_pkey: PRIMARY KEY (id)
//   UNIQUE role_permissions_role_module_key: UNIQUE (role, module)
// Table: roles
//   UNIQUE roles_name_key: UNIQUE (name)
//   PRIMARY KEY roles_pkey: PRIMARY KEY (id)
// Table: sac_records
//   PRIMARY KEY sac_records_pkey: PRIMARY KEY (id)
//   FOREIGN KEY sac_records_receiving_employee_id_fkey: FOREIGN KEY (receiving_employee_id) REFERENCES employees(id) ON DELETE SET NULL
//   FOREIGN KEY sac_records_responsible_employee_id_fkey: FOREIGN KEY (responsible_employee_id) REFERENCES employees(id) ON DELETE SET NULL
//   CHECK sac_records_status_check: CHECK ((status = ANY (ARRAY['OPORTUNIDADE DE SOLUÇÃO'::text, 'RECEBIDO'::text, 'SENDO TRATADO'::text, 'RESOLVIDO'::text])))
//   CHECK sac_records_type_check: CHECK ((type = ANY (ARRAY['RECLAMAÇÃO'::text, 'SUGESTÃO'::text])))
// Table: specialty_configs
//   PRIMARY KEY specialty_configs_pkey: PRIMARY KEY (id)
// Table: suppliers
//   PRIMARY KEY suppliers_pkey: PRIMARY KEY (id)
// Table: work_schedules
//   FOREIGN KEY work_schedules_employee_id_fkey: FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
//   UNIQUE work_schedules_employee_id_work_date_key: UNIQUE (employee_id, work_date)
//   PRIMARY KEY work_schedules_pkey: PRIMARY KEY (id)

// --- ROW LEVEL SECURITY POLICIES ---
// Table: acessos
//   Policy "Allow all authenticated users" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: agenda
//   Policy "Agenda delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "Agenda insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "Agenda update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "Agenda visibility" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: ((assigned_to = ( SELECT (employees.id)::text AS id    FROM employees   WHERE (employees.user_id = auth.uid())  LIMIT 1)) OR (assigned_to = 'none'::text) OR (assigned_to IS NULL) OR (requester_id = ( SELECT employees.id    FROM employees   WHERE (employees.user_id = auth.uid())  LIMIT 1)) OR is_master_user(auth.uid()) OR (EXISTS ( SELECT 1    FROM employees e   WHERE ((e.user_id = auth.uid()) AND (('ADMIN'::text = ANY (e.team_category)) OR ('DIRETORIA'::text = ANY (e.team_category)))))))
// Table: agenda_segmentation
//   Policy "Allow all authenticated users on agenda_segmentation" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: app_settings
//   Policy "Allow all authenticated users on app_settings" (ALL, PERMISSIVE) roles={authenticated}
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
// Table: clinica_consultorios
//   Policy "Allow all authenticated users on clinica_consultorios" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: consultorio_weekly_schedules
//   Policy "Allow all authenticated users on consultorio_weekly_schedules" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
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
//   Policy "authenticated_select_employees" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
// Table: inventory
//   Policy "Allow all authenticated users" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: inventory_movements
//   Policy "Allow all authenticated users" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: inventory_settings
//   Policy "Allow all authenticated users" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: inventory_temporary_outflows
//   Policy "Allow all authenticated users" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: onboarding
//   Policy "Allow all authenticated users" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: price_list
//   Policy "Allow all authenticated users on price_list" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: price_stages
//   Policy "Allow all authenticated users on price_stages" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: profiles
//   Policy "Allow all authenticated users" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
//   Policy "authenticated_select_profiles" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
// Table: role_permissions
//   Policy "Allow all authenticated users" (ALL, PERMISSIVE) roles={public}
//     USING: (auth.role() = 'authenticated'::text)
//     WITH CHECK: (auth.role() = 'authenticated'::text)
// Table: roles
//   Policy "Allow all authenticated users to read roles" (SELECT, PERMISSIVE) roles={public}
//     USING: (auth.role() = 'authenticated'::text)
//   Policy "Master users can delete roles" (DELETE, PERMISSIVE) roles={public}
//     USING: ((auth.role() = 'authenticated'::text) AND is_master_user(auth.uid()))
//   Policy "Master users can insert roles" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: ((auth.role() = 'authenticated'::text) AND is_master_user(auth.uid()))
//   Policy "Master users can update roles" (UPDATE, PERMISSIVE) roles={public}
//     USING: ((auth.role() = 'authenticated'::text) AND is_master_user(auth.uid()))
// Table: sac_records
//   Policy "Sac delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "Sac insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "Sac update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "Sac visibility" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: ((responsible_employee_id = ( SELECT employees.id    FROM employees   WHERE (employees.user_id = auth.uid())  LIMIT 1)) OR (receiving_employee_id = ( SELECT employees.id    FROM employees   WHERE (employees.user_id = auth.uid())  LIMIT 1)) OR is_master_user(auth.uid()) OR (EXISTS ( SELECT 1    FROM employees e   WHERE ((e.user_id = auth.uid()) AND (('ADMIN'::text = ANY (e.team_category)) OR ('DIRETORIA'::text = ANY (e.team_category)))))))
// Table: specialty_configs
//   Policy "Allow all authenticated users on specialty_configs" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: suppliers
//   Policy "Allow all authenticated users" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: work_schedules
//   Policy "Allow all authenticated users" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true

// --- DATABASE FUNCTIONS ---
// FUNCTION fix_auth_user_tokens(uuid)
//   CREATE OR REPLACE FUNCTION public.fix_auth_user_tokens(user_id uuid)
//    RETURNS void
//    LANGUAGE sql
//    SECURITY DEFINER
//   AS $function$
//     UPDATE auth.users
//     SET
//       confirmation_token = COALESCE(confirmation_token, ''),
//       recovery_token = COALESCE(recovery_token, ''),
//       email_change_token_new = COALESCE(email_change_token_new, ''),
//       email_change = COALESCE(email_change, ''),
//       email_change_token_current = COALESCE(email_change_token_current, ''),
//       phone_change = COALESCE(phone_change, ''),
//       phone_change_token = COALESCE(phone_change_token, ''),
//       reauthentication_token = COALESCE(reauthentication_token, ''),
//       phone = NULLIF(phone, '')
//     WHERE id = user_id;
//   $function$
//
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
//     VALUES (NEW.id, COALESCE(NEW.email, ''), COALESCE(NEW.raw_user_meta_data->>'name', 'Colaborador'))
//     ON CONFLICT (id) DO UPDATE SET
//       email = EXCLUDED.email,
//       name = EXCLUDED.name;
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
// FUNCTION sync_agenda_to_sac()
//   CREATE OR REPLACE FUNCTION public.sync_agenda_to_sac()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//       IF NEW.is_completed = true AND OLD.is_completed = false AND NEW.type = 'SAC' AND NEW.sac_record_id IS NOT NULL THEN
//           UPDATE public.sac_records
//           SET status = 'RESOLVIDO', solved_at = NOW()
//           WHERE id = NEW.sac_record_id AND status != 'RESOLVIDO';
//       END IF;
//       RETURN NEW;
//   END;
//   $function$
//
// FUNCTION sync_employee_dates_to_agenda()
//   CREATE OR REPLACE FUNCTION public.sync_employee_dates_to_agenda()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//       v_date_str text;
//       v_title text;
//   BEGIN
//       -- Handle DELETE
//       IF TG_OP = 'DELETE' THEN
//           DELETE FROM public.agenda WHERE assigned_to = OLD.id::text AND is_completed = false AND (type = 'BÔNUS' OR type = 'FÉRIAS');
//           RETURN OLD;
//       END IF;
//
//       -- Handle Bonus Due Date
//       IF NEW.bonus_due_date IS NOT NULL AND NEW.bonus_due_date <> '' THEN
//           IF TG_OP = 'INSERT' OR OLD.bonus_due_date IS DISTINCT FROM NEW.bonus_due_date OR OLD.name IS DISTINCT FROM NEW.name THEN
//               v_title := 'VENCIMENTO DE BÔNUS - ' || NEW.name;
//               UPDATE public.agenda SET date = NEW.bonus_due_date, title = v_title WHERE assigned_to = NEW.id::text AND type = 'BÔNUS' AND is_completed = false;
//               IF NOT FOUND THEN
//                   INSERT INTO public.agenda (title, date, time, location, type, assigned_to, created_by) VALUES (v_title, NEW.bonus_due_date, '08:00', 'SISTEMA', 'BÔNUS', NEW.id::text, 'SISTEMA');
//               END IF;
//           END IF;
//       ELSIF TG_OP = 'UPDATE' AND (OLD.bonus_due_date IS NOT NULL AND OLD.bonus_due_date <> '') THEN
//           DELETE FROM public.agenda WHERE assigned_to = NEW.id::text AND type = 'BÔNUS' AND is_completed = false;
//       END IF;
//
//       -- Handle Vacation Due Date
//       IF NEW.vacation_due_date IS NOT NULL THEN
//           IF TG_OP = 'INSERT' OR OLD.vacation_due_date IS DISTINCT FROM NEW.vacation_due_date OR OLD.name IS DISTINCT FROM NEW.name THEN
//               v_date_str := to_char(NEW.vacation_due_date AT TIME ZONE 'UTC', 'YYYY-MM-DD');
//               v_title := 'VENCIMENTO DE FÉRIAS - ' || NEW.name;
//               UPDATE public.agenda SET date = v_date_str, title = v_title WHERE assigned_to = NEW.id::text AND type = 'FÉRIAS' AND is_completed = false;
//               IF NOT FOUND THEN
//                   INSERT INTO public.agenda (title, date, time, location, type, assigned_to, created_by) VALUES (v_title, v_date_str, '08:00', 'SISTEMA', 'FÉRIAS', NEW.id::text, 'SISTEMA');
//               END IF;
//           END IF;
//       ELSIF TG_OP = 'UPDATE' AND OLD.vacation_due_date IS NOT NULL THEN
//           DELETE FROM public.agenda WHERE assigned_to = NEW.id::text AND type = 'FÉRIAS' AND is_completed = false;
//       END IF;
//
//       RETURN NEW;
//   END;
//   $function$
//
// FUNCTION sync_sac_to_agenda()
//   CREATE OR REPLACE FUNCTION public.sync_sac_to_agenda()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//       IF NEW.status = 'RESOLVIDO' AND OLD.status != 'RESOLVIDO' THEN
//           UPDATE public.agenda
//           SET is_completed = true, completed_at = NOW()
//           WHERE sac_record_id = NEW.id AND is_completed = false;
//       END IF;
//       RETURN NEW;
//   END;
//   $function$
//
// FUNCTION update_room_last_message_at()
//   CREATE OR REPLACE FUNCTION public.update_room_last_message_at()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     UPDATE public.chat_rooms
//     SET last_message_at = NEW.created_at
//     WHERE id = NEW.room_id;
//     RETURN NEW;
//   END;
//   $function$
//

// --- TRIGGERS ---
// Table: agenda
//   trg_sync_agenda_to_sac: CREATE TRIGGER trg_sync_agenda_to_sac AFTER UPDATE ON public.agenda FOR EACH ROW EXECUTE FUNCTION sync_agenda_to_sac()
// Table: chat_messages
//   on_chat_message_created: CREATE TRIGGER on_chat_message_created AFTER INSERT ON public.chat_messages FOR EACH ROW EXECUTE FUNCTION update_room_last_message_at()
// Table: employees
//   trg_sync_employee_dates_to_agenda: CREATE TRIGGER trg_sync_employee_dates_to_agenda AFTER INSERT OR DELETE OR UPDATE ON public.employees FOR EACH ROW EXECUTE FUNCTION sync_employee_dates_to_agenda()
// Table: sac_records
//   trg_sync_sac_to_agenda: CREATE TRIGGER trg_sync_sac_to_agenda AFTER UPDATE ON public.sac_records FOR EACH ROW EXECUTE FUNCTION sync_sac_to_agenda()

// --- INDEXES ---
// Table: agenda_segmentation
//   CREATE UNIQUE INDEX agenda_segmentation_consultorio_id_day_of_week_shift_key ON public.agenda_segmentation USING btree (consultorio_id, day_of_week, shift)
// Table: chat_participants
//   CREATE UNIQUE INDEX chat_participants_room_id_user_id_key ON public.chat_participants USING btree (room_id, user_id)
// Table: consultorio_weekly_schedules
//   CREATE UNIQUE INDEX consultorio_weekly_schedules_consultorio_id_day_of_week_key ON public.consultorio_weekly_schedules USING btree (consultorio_id, day_of_week)
// Table: role_permissions
//   CREATE UNIQUE INDEX role_permissions_role_module_key ON public.role_permissions USING btree (role, module)
// Table: roles
//   CREATE UNIQUE INDEX roles_name_key ON public.roles USING btree (name)
// Table: sac_records
//   CREATE INDEX sac_records_received_at_idx ON public.sac_records USING btree (received_at)
//   CREATE INDEX sac_records_status_idx ON public.sac_records USING btree (status)
// Table: work_schedules
//   CREATE UNIQUE INDEX work_schedules_employee_id_work_date_key ON public.work_schedules USING btree (employee_id, work_date)
