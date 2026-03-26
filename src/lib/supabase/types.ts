// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
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
    PostgrestVersion: "14.4"
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
            foreignKeyName: "agenda_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agenda_sac_record_id_fkey"
            columns: ["sac_record_id"]
            isOneToOne: false
            referencedRelation: "sac_records"
            referencedColumns: ["id"]
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
            foreignKeyName: "agenda_segmentation_consultorio_id_fkey"
            columns: ["consultorio_id"]
            isOneToOne: false
            referencedRelation: "clinica_consultorios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agenda_segmentation_dentist_id_fkey"
            columns: ["dentist_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agenda_segmentation_specialty_id_fkey"
            columns: ["specialty_id"]
            isOneToOne: false
            referencedRelation: "specialty_configs"
            referencedColumns: ["id"]
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
        Relationships: []
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
      cash_box_closings: {
        Row: {
          closed_by_id: string
          closing_date: string
          conferred_at: string | null
          created_at: string
          id: string
          received_by_id: string
          status: string
        }
        Insert: {
          closed_by_id: string
          closing_date: string
          conferred_at?: string | null
          created_at?: string
          id?: string
          received_by_id: string
          status?: string
        }
        Update: {
          closed_by_id?: string
          closing_date?: string
          conferred_at?: string | null
          created_at?: string
          id?: string
          received_by_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "cash_box_closings_closed_by_id_fkey"
            columns: ["closed_by_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cash_box_closings_received_by_id_fkey"
            columns: ["received_by_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
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
            foreignKeyName: "chat_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
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
            foreignKeyName: "chat_participants_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
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
      checklist_diario: {
        Row: {
          created_at: string
          date: string
          employee_id: string
          id: string
          is_executed: boolean
          modelo_id: string
        }
        Insert: {
          created_at?: string
          date: string
          employee_id: string
          id?: string
          is_executed?: boolean
          modelo_id: string
        }
        Update: {
          created_at?: string
          date?: string
          employee_id?: string
          id?: string
          is_executed?: boolean
          modelo_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklist_diario_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checklist_diario_modelo_id_fkey"
            columns: ["modelo_id"]
            isOneToOne: false
            referencedRelation: "checklist_modelos"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_modelos: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          sector_id: string | null
          task_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          sector_id?: string | null
          task_name: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          sector_id?: string | null
          task_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklist_modelos_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          },
        ]
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
            foreignKeyName: "consultorio_weekly_schedules_consultorio_id_fkey"
            columns: ["consultorio_id"]
            isOneToOne: false
            referencedRelation: "clinica_consultorios"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_routine_executions: {
        Row: {
          completed_at: string
          employee_id: string
          id: string
          routine_id: string
        }
        Insert: {
          completed_at?: string
          employee_id: string
          id?: string
          routine_id: string
        }
        Update: {
          completed_at?: string
          employee_id?: string
          id?: string
          routine_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_routine_executions_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_routine_executions_routine_id_fkey"
            columns: ["routine_id"]
            isOneToOne: false
            referencedRelation: "daily_routines"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_routines: {
        Row: {
          created_at: string
          days_of_week: number[] | null
          employee_id: string
          id: string
          role: string
          scheduled_time: string
          task_description: string
        }
        Insert: {
          created_at?: string
          days_of_week?: number[] | null
          employee_id: string
          id?: string
          role: string
          scheduled_time: string
          task_description: string
        }
        Update: {
          created_at?: string
          days_of_week?: number[] | null
          employee_id?: string
          id?: string
          role?: string
          scheduled_time?: string
          task_description?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_routines_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
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
            foreignKeyName: "employee_documents_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
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
          perfil_id: string | null
          phone: string | null
          pix_key: string | null
          pix_number: string | null
          pix_type: string | null
          rg: string | null
          role: string
          salary: string | null
          sector_id: string | null
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
          perfil_id?: string | null
          phone?: string | null
          pix_key?: string | null
          pix_number?: string | null
          pix_type?: string | null
          rg?: string | null
          role: string
          salary?: string | null
          sector_id?: string | null
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
          perfil_id?: string | null
          phone?: string | null
          pix_key?: string | null
          pix_number?: string | null
          pix_type?: string | null
          rg?: string | null
          role?: string
          salary?: string | null
          sector_id?: string | null
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
            foreignKeyName: "employees_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          },
        ]
      }
      fiscal_boleto_entries: {
        Row: {
          company_id: string
          created_at: string
          date: string
          document_number: string | null
          id: string
          observation: string | null
          value: number
        }
        Insert: {
          company_id: string
          created_at?: string
          date: string
          document_number?: string | null
          id?: string
          observation?: string | null
          value: number
        }
        Update: {
          company_id?: string
          created_at?: string
          date?: string
          document_number?: string | null
          id?: string
          observation?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "fiscal_boleto_entries_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "fiscal_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      fiscal_companies: {
        Row: {
          created_at: string
          id: string
          name: string
          priority_order: number
          show_in_dashboard: boolean
          tax_regime: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          priority_order?: number
          show_in_dashboard?: boolean
          tax_regime: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          priority_order?: number
          show_in_dashboard?: boolean
          tax_regime?: string
        }
        Relationships: []
      }
      fiscal_limit_configs: {
        Row: {
          company_id: string
          created_at: string
          id: string
          limit_value: number
          month: number
          year: number
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          limit_value: number
          month: number
          year: number
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          limit_value?: number
          month?: number
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "fiscal_limit_configs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "fiscal_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      fiscal_sales_entries: {
        Row: {
          company_id: string
          created_at: string
          date: string
          dinheiro_cdsi: number | null
          id: string
          observation: string | null
          payment_method: string | null
          sale_value: number
        }
        Insert: {
          company_id: string
          created_at?: string
          date: string
          dinheiro_cdsi?: number | null
          id?: string
          observation?: string | null
          payment_method?: string | null
          sale_value: number
        }
        Update: {
          company_id?: string
          created_at?: string
          date?: string
          dinheiro_cdsi?: number | null
          id?: string
          observation?: string | null
          payment_method?: string | null
          sale_value?: number
        }
        Relationships: [
          {
            foreignKeyName: "fiscal_sales_entries_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "fiscal_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      hub_announcement_reads: {
        Row: {
          announcement_id: string | null
          id: string
          points_earned: number
          read_at: string
          user_id: string | null
        }
        Insert: {
          announcement_id?: string | null
          id?: string
          points_earned?: number
          read_at?: string
          user_id?: string | null
        }
        Update: {
          announcement_id?: string | null
          id?: string
          points_earned?: number
          read_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hub_announcement_reads_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "hub_announcements"
            referencedColumns: ["id"]
          },
        ]
      }
      hub_announcements: {
        Row: {
          active: boolean | null
          content: string
          created_at: string
          created_by: string | null
          id: string
          title: string
        }
        Insert: {
          active?: boolean | null
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
          title: string
        }
        Update: {
          active?: boolean | null
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      hub_feedbacks: {
        Row: {
          created_at: string
          excellent_content: string
          id: string
          improvement_content: string
          points_earned: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          excellent_content: string
          id?: string
          improvement_content: string
          points_earned?: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          excellent_content?: string
          id?: string
          improvement_content?: string
          points_earned?: number
          user_id?: string | null
        }
        Relationships: []
      }
      innovation_records: {
        Row: {
          created_at: string
          evidence_url_or_desc: string | null
          id: string
          implementation_details: string
          perceived_results: string
          points_earned: number
          problem_description: string
          proposed_solution: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          evidence_url_or_desc?: string | null
          id?: string
          implementation_details: string
          perceived_results: string
          points_earned?: number
          problem_description: string
          proposed_solution: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          evidence_url_or_desc?: string | null
          id?: string
          implementation_details?: string
          perceived_results?: string
          points_earned?: number
          problem_description?: string
          proposed_solution?: string
          title?: string
          user_id?: string
        }
        Relationships: []
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
            foreignKeyName: "inventory_movements_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
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
            foreignKeyName: "inventory_temporary_outflows_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_temporary_outflows_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
        ]
      }
      kpi_commercial_entries: {
        Row: {
          created_at: string
          created_by: string | null
          entry_date: string
          id: string
          observation: string | null
          type: string
          value: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          entry_date: string
          id?: string
          observation?: string | null
          type: string
          value?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          entry_date?: string
          id?: string
          observation?: string | null
          type?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "kpi_commercial_entries_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      kpis: {
        Row: {
          created_at: string
          current_value: number
          format_type: string
          id: string
          name: string
          sector: string
          target_value: number
        }
        Insert: {
          created_at?: string
          current_value?: number
          format_type?: string
          id?: string
          name: string
          sector: string
          target_value?: number
        }
        Update: {
          created_at?: string
          current_value?: number
          format_type?: string
          id?: string
          name?: string
          sector?: string
          target_value?: number
        }
        Relationships: []
      }
      menu_configurations: {
        Row: {
          authorized_sectors: string[] | null
          created_at: string
          icon: string | null
          id: string
          link: string
          tab_name: string
        }
        Insert: {
          authorized_sectors?: string[] | null
          created_at?: string
          icon?: string | null
          id?: string
          link: string
          tab_name: string
        }
        Update: {
          authorized_sectors?: string[] | null
          created_at?: string
          icon?: string | null
          id?: string
          link?: string
          tab_name?: string
        }
        Relationships: []
      }
      monthly_readings: {
        Row: {
          created_at: string
          id: string
          main_learning: string
          material_name: string
          observations: string | null
          points_earned: number
          practical_application: string
          reference_month: string
          submission_date: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          main_learning: string
          material_name: string
          observations?: string | null
          points_earned?: number
          practical_application: string
          reference_month: string
          submission_date?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          main_learning?: string
          material_name?: string
          observations?: string | null
          points_earned?: number
          practical_application?: string
          reference_month?: string
          submission_date?: string
          user_id?: string
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
      performance_diaria: {
        Row: {
          created_at: string
          date: string
          employee_id: string
          id: string
          percentage: number
        }
        Insert: {
          created_at?: string
          date: string
          employee_id: string
          id?: string
          percentage?: number
        }
        Update: {
          created_at?: string
          date?: string
          employee_id?: string
          id?: string
          percentage?: number
        }
        Relationships: [
          {
            foreignKeyName: "performance_diaria_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
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
            foreignKeyName: "price_stages_price_list_id_fkey"
            columns: ["price_list_id"]
            isOneToOne: false
            referencedRelation: "price_list"
            referencedColumns: ["id"]
          },
        ]
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
            foreignKeyName: "sac_records_receiving_employee_id_fkey"
            columns: ["receiving_employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sac_records_responsible_employee_id_fkey"
            columns: ["responsible_employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      sectors: {
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
      ser_5s_submissions: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          photo_url: string
          points_earned: number
          reference_week: string
          submission_date: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          photo_url: string
          points_earned?: number
          reference_week: string
          submission_date?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          photo_url?: string
          points_earned?: number
          reference_week?: string
          submission_date?: string
          user_id?: string
        }
        Relationships: []
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
            foreignKeyName: "work_schedules_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calcular_aderencia_diaria: {
        Args: { p_date: string; p_employee_id: string }
        Returns: undefined
      }
      fix_auth_user_tokens: { Args: { user_id: string }; Returns: undefined }
      get_auth_user_rooms: { Args: never; Returns: string[] }
      get_monthly_ranking: {
        Args: { month_val: number; year_val: number }
        Returns: {
          employee_id: string
          employee_name: string
          total_points: number
          user_id: string
        }[]
      }
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
      is_admin_user: { Args: { user_uuid: string }; Returns: boolean }
      is_master_user: { Args: { user_uuid: string }; Returns: boolean }
      mark_room_read: {
        Args: { p_room_id: string; p_user_id: string }
        Returns: undefined
      }
      reset_financial_data: {
        Args: { acting_user_name: string }
        Returns: undefined
      }
      sync_my_employee_record: { Args: never; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
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
// Table: cash_box_closings
//   id: uuid (not null, default: gen_random_uuid())
//   closing_date: date (not null)
//   closed_by_id: uuid (not null)
//   received_by_id: uuid (not null)
//   status: text (not null, default: 'PENDENTE'::text)
//   conferred_at: timestamp with time zone (nullable)
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
// Table: checklist_diario
//   id: uuid (not null, default: gen_random_uuid())
//   employee_id: uuid (not null)
//   date: date (not null)
//   modelo_id: uuid (not null)
//   is_executed: boolean (not null, default: false)
//   created_at: timestamp with time zone (not null, default: now())
// Table: checklist_modelos
//   id: uuid (not null, default: gen_random_uuid())
//   task_name: text (not null)
//   sector_id: uuid (nullable)
//   is_active: boolean (not null, default: true)
//   created_at: timestamp with time zone (not null, default: now())
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
// Table: daily_routine_executions
//   id: uuid (not null, default: gen_random_uuid())
//   routine_id: uuid (not null)
//   employee_id: uuid (not null)
//   completed_at: timestamp with time zone (not null, default: now())
// Table: daily_routines
//   id: uuid (not null, default: gen_random_uuid())
//   employee_id: uuid (not null)
//   role: text (not null)
//   task_description: text (not null)
//   scheduled_time: time without time zone (not null)
//   created_at: timestamp with time zone (not null, default: now())
//   days_of_week: _int4 (nullable, default: '{0,1,2,3,4,5,6}'::integer[])
// Table: departments
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
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
//   team_category: _text (nullable, default: ARRAY[]::text[])
//   contract_details: text (nullable, default: ''::text)
//   bonus_type: text (nullable)
//   bonus_rules: text (nullable)
//   bonus_due_date: text (nullable)
//   pix_key: text (nullable)
//   pix_type: text (nullable)
//   bank_name: text (nullable)
//   pix_number: text (nullable)
//   no_system_access: boolean (nullable, default: false)
//   sector_id: uuid (nullable)
//   perfil_id: uuid (nullable)
// Table: fiscal_boleto_entries
//   id: uuid (not null, default: gen_random_uuid())
//   company_id: uuid (not null)
//   date: date (not null)
//   value: numeric (not null)
//   document_number: text (nullable)
//   observation: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: fiscal_companies
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   tax_regime: text (not null)
//   created_at: timestamp with time zone (not null, default: now())
//   priority_order: integer (not null, default: 1)
//   show_in_dashboard: boolean (not null, default: true)
// Table: fiscal_limit_configs
//   id: uuid (not null, default: gen_random_uuid())
//   company_id: uuid (not null)
//   month: integer (not null)
//   year: integer (not null)
//   limit_value: numeric (not null)
//   created_at: timestamp with time zone (not null, default: now())
// Table: fiscal_sales_entries
//   id: uuid (not null, default: gen_random_uuid())
//   company_id: uuid (not null)
//   date: date (not null)
//   sale_value: numeric (not null)
//   observation: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   dinheiro_cdsi: numeric (nullable, default: 0)
//   payment_method: text (nullable)
// Table: hub_announcement_reads
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (nullable)
//   announcement_id: uuid (nullable)
//   read_at: timestamp with time zone (not null, default: now())
//   points_earned: integer (not null, default: 0)
// Table: hub_announcements
//   id: uuid (not null, default: gen_random_uuid())
//   title: text (not null)
//   content: text (not null)
//   active: boolean (nullable, default: true)
//   created_by: uuid (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: hub_feedbacks
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (nullable)
//   excellent_content: text (not null)
//   improvement_content: text (not null)
//   points_earned: integer (not null, default: 0)
//   created_at: timestamp with time zone (not null, default: now())
// Table: innovation_records
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   title: text (not null)
//   problem_description: text (not null)
//   proposed_solution: text (not null)
//   implementation_details: text (not null)
//   perceived_results: text (not null)
//   evidence_url_or_desc: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   points_earned: integer (not null, default: 0)
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
// Table: kpi_commercial_entries
//   id: uuid (not null, default: gen_random_uuid())
//   entry_date: date (not null)
//   type: text (not null)
//   value: numeric (not null, default: 0)
//   observation: text (nullable)
//   created_by: uuid (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: kpis
//   id: uuid (not null, default: gen_random_uuid())
//   sector: text (not null)
//   name: text (not null)
//   target_value: numeric (not null, default: 0)
//   current_value: numeric (not null, default: 0)
//   format_type: text (not null, default: 'number'::text)
//   created_at: timestamp with time zone (not null, default: now())
// Table: menu_configurations
//   id: uuid (not null, default: gen_random_uuid())
//   tab_name: text (not null)
//   icon: text (nullable)
//   link: text (not null)
//   authorized_sectors: _text (nullable, default: '{}'::text[])
//   created_at: timestamp with time zone (not null, default: now())
// Table: monthly_readings
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   submission_date: timestamp with time zone (not null, default: now())
//   reference_month: text (not null)
//   material_name: text (not null)
//   main_learning: text (not null)
//   practical_application: text (not null)
//   observations: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   points_earned: integer (not null, default: 0)
// Table: onboarding
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   role: text (not null)
//   department: text (not null)
//   tasks: jsonb (nullable, default: '[]'::jsonb)
//   created_at: timestamp with time zone (not null, default: now())
// Table: performance_diaria
//   id: uuid (not null, default: gen_random_uuid())
//   employee_id: uuid (not null)
//   date: date (not null)
//   percentage: numeric (not null, default: 0)
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
// Table: sectors
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   created_at: timestamp with time zone (not null, default: now())
// Table: ser_5s_submissions
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   submission_date: timestamp with time zone (not null, default: now())
//   reference_week: text (not null)
//   photo_url: text (not null)
//   notes: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   points_earned: integer (not null, default: 0)
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
// Table: bonus_settings
//   PRIMARY KEY bonus_settings_pkey: PRIMARY KEY (id)
// Table: cash_box_closings
//   FOREIGN KEY cash_box_closings_closed_by_id_fkey: FOREIGN KEY (closed_by_id) REFERENCES employees(id)
//   PRIMARY KEY cash_box_closings_pkey: PRIMARY KEY (id)
//   FOREIGN KEY cash_box_closings_received_by_id_fkey: FOREIGN KEY (received_by_id) REFERENCES employees(id)
//   CHECK cash_box_closings_status_check: CHECK ((status = ANY (ARRAY['PENDENTE'::text, 'CONFERIDO'::text])))
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
// Table: checklist_diario
//   FOREIGN KEY checklist_diario_employee_id_fkey: FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
//   FOREIGN KEY checklist_diario_modelo_id_fkey: FOREIGN KEY (modelo_id) REFERENCES checklist_modelos(id) ON DELETE CASCADE
//   PRIMARY KEY checklist_diario_pkey: PRIMARY KEY (id)
//   UNIQUE checklist_diario_unique_entry: UNIQUE (employee_id, date, modelo_id)
// Table: checklist_modelos
//   PRIMARY KEY checklist_modelos_pkey: PRIMARY KEY (id)
//   FOREIGN KEY checklist_modelos_sector_id_fkey: FOREIGN KEY (sector_id) REFERENCES sectors(id) ON DELETE SET NULL
// Table: clinica_consultorios
//   PRIMARY KEY clinica_consultorios_pkey: PRIMARY KEY (id)
// Table: consultorio_weekly_schedules
//   UNIQUE consultorio_weekly_schedules_consultorio_id_day_of_week_key: UNIQUE (consultorio_id, day_of_week)
//   FOREIGN KEY consultorio_weekly_schedules_consultorio_id_fkey: FOREIGN KEY (consultorio_id) REFERENCES clinica_consultorios(id) ON DELETE CASCADE
//   CHECK consultorio_weekly_schedules_day_of_week_check: CHECK (((day_of_week >= 1) AND (day_of_week <= 6)))
//   PRIMARY KEY consultorio_weekly_schedules_pkey: PRIMARY KEY (id)
// Table: daily_routine_executions
//   FOREIGN KEY daily_routine_executions_employee_id_fkey: FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
//   PRIMARY KEY daily_routine_executions_pkey: PRIMARY KEY (id)
//   FOREIGN KEY daily_routine_executions_routine_id_fkey: FOREIGN KEY (routine_id) REFERENCES daily_routines(id) ON DELETE CASCADE
// Table: daily_routines
//   FOREIGN KEY daily_routines_employee_id_fkey: FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
//   PRIMARY KEY daily_routines_pkey: PRIMARY KEY (id)
// Table: departments
//   UNIQUE departments_name_key: UNIQUE (name)
//   PRIMARY KEY departments_pkey: PRIMARY KEY (id)
// Table: documents
//   PRIMARY KEY documents_pkey: PRIMARY KEY (id)
// Table: employee_documents
//   FOREIGN KEY employee_documents_employee_id_fkey: FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
//   PRIMARY KEY employee_documents_pkey: PRIMARY KEY (id)
// Table: employees
//   PRIMARY KEY employees_pkey: PRIMARY KEY (id)
//   FOREIGN KEY employees_sector_id_fkey: FOREIGN KEY (sector_id) REFERENCES sectors(id) ON DELETE SET NULL
//   FOREIGN KEY employees_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL
// Table: fiscal_boleto_entries
//   FOREIGN KEY fiscal_boleto_entries_company_id_fkey: FOREIGN KEY (company_id) REFERENCES fiscal_companies(id) ON DELETE CASCADE
//   PRIMARY KEY fiscal_boleto_entries_pkey: PRIMARY KEY (id)
// Table: fiscal_companies
//   PRIMARY KEY fiscal_companies_pkey: PRIMARY KEY (id)
//   CHECK fiscal_companies_tax_regime_check: CHECK ((tax_regime = ANY (ARRAY['Carnê-Leão'::text, 'Simples Nacional'::text, 'Lucro Presumido'::text, 'LUCRO CDSI'::text])))
// Table: fiscal_limit_configs
//   FOREIGN KEY fiscal_limit_configs_company_id_fkey: FOREIGN KEY (company_id) REFERENCES fiscal_companies(id) ON DELETE CASCADE
//   CHECK fiscal_limit_configs_month_check: CHECK (((month >= 1) AND (month <= 12)))
//   PRIMARY KEY fiscal_limit_configs_pkey: PRIMARY KEY (id)
// Table: fiscal_sales_entries
//   FOREIGN KEY fiscal_sales_entries_company_id_fkey: FOREIGN KEY (company_id) REFERENCES fiscal_companies(id) ON DELETE CASCADE
//   PRIMARY KEY fiscal_sales_entries_pkey: PRIMARY KEY (id)
// Table: hub_announcement_reads
//   FOREIGN KEY hub_announcement_reads_announcement_id_fkey: FOREIGN KEY (announcement_id) REFERENCES hub_announcements(id) ON DELETE CASCADE
//   PRIMARY KEY hub_announcement_reads_pkey: PRIMARY KEY (id)
//   UNIQUE hub_announcement_reads_user_id_announcement_id_key: UNIQUE (user_id, announcement_id)
//   FOREIGN KEY hub_announcement_reads_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: hub_announcements
//   FOREIGN KEY hub_announcements_created_by_fkey: FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL
//   PRIMARY KEY hub_announcements_pkey: PRIMARY KEY (id)
// Table: hub_feedbacks
//   PRIMARY KEY hub_feedbacks_pkey: PRIMARY KEY (id)
//   FOREIGN KEY hub_feedbacks_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: innovation_records
//   PRIMARY KEY innovation_records_pkey: PRIMARY KEY (id)
//   FOREIGN KEY innovation_records_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: inventory
//   PRIMARY KEY inventory_pkey: PRIMARY KEY (id)
// Table: inventory_movements
//   FOREIGN KEY inventory_movements_inventory_id_fkey: FOREIGN KEY (inventory_id) REFERENCES inventory(id) ON DELETE CASCADE
//   PRIMARY KEY inventory_movements_pkey: PRIMARY KEY (id)
// Table: inventory_settings
//   PRIMARY KEY inventory_settings_pkey: PRIMARY KEY (id)
// Table: inventory_temporary_outflows
//   FOREIGN KEY inventory_temporary_outflows_employee_id_fkey: FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
//   FOREIGN KEY inventory_temporary_outflows_inventory_id_fkey: FOREIGN KEY (inventory_id) REFERENCES inventory(id) ON DELETE CASCADE
//   PRIMARY KEY inventory_temporary_outflows_pkey: PRIMARY KEY (id)
//   CHECK inventory_temporary_outflows_quantity_check: CHECK ((quantity > 0))
//   CHECK inventory_temporary_outflows_status_check: CHECK ((status = ANY (ARRAY['PENDING'::text, 'FINALIZED'::text, 'RETURNED'::text])))
// Table: kpi_commercial_entries
//   FOREIGN KEY kpi_commercial_entries_created_by_fkey: FOREIGN KEY (created_by) REFERENCES employees(id) ON DELETE SET NULL
//   PRIMARY KEY kpi_commercial_entries_pkey: PRIMARY KEY (id)
//   CHECK kpi_commercial_entries_type_check: CHECK ((type = ANY (ARRAY['VENDA'::text, 'AVALIACAO'::text])))
// Table: kpis
//   PRIMARY KEY kpis_pkey: PRIMARY KEY (id)
// Table: menu_configurations
//   PRIMARY KEY menu_configurations_pkey: PRIMARY KEY (id)
// Table: monthly_readings
//   PRIMARY KEY monthly_readings_pkey: PRIMARY KEY (id)
//   FOREIGN KEY monthly_readings_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
//   UNIQUE monthly_readings_user_month_key: UNIQUE (user_id, reference_month)
// Table: onboarding
//   PRIMARY KEY onboarding_pkey: PRIMARY KEY (id)
// Table: performance_diaria
//   FOREIGN KEY performance_diaria_employee_id_fkey: FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
//   PRIMARY KEY performance_diaria_pkey: PRIMARY KEY (id)
//   UNIQUE performance_diaria_unique_entry: UNIQUE (employee_id, date)
// Table: price_list
//   PRIMARY KEY price_list_pkey: PRIMARY KEY (id)
// Table: price_stages
//   PRIMARY KEY price_stages_pkey: PRIMARY KEY (id)
//   FOREIGN KEY price_stages_price_list_id_fkey: FOREIGN KEY (price_list_id) REFERENCES price_list(id) ON DELETE CASCADE
// Table: sac_records
//   PRIMARY KEY sac_records_pkey: PRIMARY KEY (id)
//   FOREIGN KEY sac_records_receiving_employee_id_fkey: FOREIGN KEY (receiving_employee_id) REFERENCES employees(id) ON DELETE SET NULL
//   FOREIGN KEY sac_records_responsible_employee_id_fkey: FOREIGN KEY (responsible_employee_id) REFERENCES employees(id) ON DELETE SET NULL
//   CHECK sac_records_status_check: CHECK ((status = ANY (ARRAY['OPORTUNIDADE DE SOLUÇÃO'::text, 'RECEBIDO'::text, 'SENDO TRATADO'::text, 'RESOLVIDO'::text])))
//   CHECK sac_records_type_check: CHECK ((type = ANY (ARRAY['RECLAMAÇÃO'::text, 'SUGESTÃO'::text])))
// Table: sectors
//   PRIMARY KEY sectors_pkey: PRIMARY KEY (id)
// Table: ser_5s_submissions
//   PRIMARY KEY ser_5s_submissions_pkey: PRIMARY KEY (id)
//   FOREIGN KEY ser_5s_submissions_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
//   UNIQUE ser_5s_unique_week: UNIQUE (user_id, reference_week)
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
//   Policy "acessos_admin_only" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (is_admin_user(auth.uid()) OR is_master_user(auth.uid()))
//     WITH CHECK: (is_admin_user(auth.uid()) OR is_master_user(auth.uid()))
// Table: agenda
//   Policy "Agenda delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (is_master_user(auth.uid()) OR is_admin_user(auth.uid()) OR (requester_id = ( SELECT employees.id    FROM employees   WHERE (employees.user_id = auth.uid())  LIMIT 1)))
//   Policy "Agenda insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (is_master_user(auth.uid()) OR is_admin_user(auth.uid()) OR (requester_id = ( SELECT employees.id    FROM employees   WHERE (employees.user_id = auth.uid())  LIMIT 1)) OR (assigned_to = ( SELECT (employees.id)::text AS id    FROM employees   WHERE (employees.user_id = auth.uid())  LIMIT 1)))
//   Policy "Agenda update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (is_master_user(auth.uid()) OR is_admin_user(auth.uid()) OR (requester_id = ( SELECT employees.id    FROM employees   WHERE (employees.user_id = auth.uid())  LIMIT 1)) OR (assigned_to = ( SELECT (employees.id)::text AS id    FROM employees   WHERE (employees.user_id = auth.uid())  LIMIT 1)))
//   Policy "Agenda visibility" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: ((assigned_to = ( SELECT (employees.id)::text AS id    FROM employees   WHERE (employees.user_id = auth.uid())  LIMIT 1)) OR (assigned_to = 'none'::text) OR (assigned_to IS NULL) OR (requester_id = ( SELECT employees.id    FROM employees   WHERE (employees.user_id = auth.uid())  LIMIT 1)) OR is_master_user(auth.uid()) OR (EXISTS ( SELECT 1    FROM employees e   WHERE ((e.user_id = auth.uid()) AND (('ADMIN'::text = ANY (e.team_category)) OR ('DIRETORIA'::text = ANY (e.team_category)))))))
// Table: agenda_segmentation
//   Policy "Allow all authenticated users on agenda_segmentation" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: app_settings
//   Policy "app_settings_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (is_admin_user(auth.uid()) OR is_master_user(auth.uid()))
//   Policy "app_settings_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "app_settings_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (is_admin_user(auth.uid()) OR is_master_user(auth.uid()))
//   Policy "app_settings_write" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (is_admin_user(auth.uid()) OR is_master_user(auth.uid()))
// Table: audit_logs
//   Policy "Allow all authenticated users" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: bonus_settings
//   Policy "Allow all authenticated users" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: cash_box_closings
//   Policy "Allow all authenticated users on cash_box_closings" (ALL, PERMISSIVE) roles={authenticated}
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
// Table: checklist_diario
//   Policy "Allow all authenticated users on checklist_diario" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: checklist_modelos
//   Policy "Allow all authenticated users on checklist_modelos" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: clinica_consultorios
//   Policy "clinica_consultorios_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (is_admin_user(auth.uid()) OR is_master_user(auth.uid()))
//   Policy "clinica_consultorios_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (is_admin_user(auth.uid()) OR is_master_user(auth.uid()))
//   Policy "clinica_consultorios_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "clinica_consultorios_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (is_admin_user(auth.uid()) OR is_master_user(auth.uid()))
// Table: consultorio_weekly_schedules
//   Policy "Allow all authenticated users on consultorio_weekly_schedules" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: daily_routine_executions
//   Policy "Allow all authenticated users on daily_routine_executions" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: daily_routines
//   Policy "Allow all authenticated users on daily_routines" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: departments
//   Policy "Allow all authenticated users on departments" (ALL, PERMISSIVE) roles={authenticated}
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
// Table: fiscal_boleto_entries
//   Policy "Allow all authenticated users on fiscal_boleto_entries" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: fiscal_companies
//   Policy "Allow all authenticated users on fiscal_companies" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: fiscal_limit_configs
//   Policy "Allow all authenticated users on fiscal_limit_configs" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: fiscal_sales_entries
//   Policy "Allow all authenticated users on fiscal_sales_entries" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: hub_announcement_reads
//   Policy "Admins can delete hub_announcement_reads" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (is_admin_user(auth.uid()) OR is_master_user(auth.uid()))
//   Policy "Admins can update hub_announcement_reads" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (is_admin_user(auth.uid()) OR is_master_user(auth.uid()))
//   Policy "Users can insert own hub_announcement_reads" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (user_id = auth.uid())
//   Policy "hub_announcement_reads_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: ((user_id = auth.uid()) OR is_admin_user(auth.uid()) OR is_master_user(auth.uid()))
// Table: hub_announcements
//   Policy "Admins can delete hub_announcements" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (is_admin_user(auth.uid()) OR is_master_user(auth.uid()))
//   Policy "Admins can insert hub_announcements" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (is_admin_user(auth.uid()) OR is_master_user(auth.uid()))
//   Policy "Admins can update hub_announcements" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (is_admin_user(auth.uid()) OR is_master_user(auth.uid()))
//   Policy "Allow all authenticated users to read hub_announcements" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
// Table: hub_feedbacks
//   Policy "Admins can delete hub_feedbacks" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (is_admin_user(auth.uid()) OR is_master_user(auth.uid()))
//   Policy "Users can insert own feedbacks" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (user_id = auth.uid())
//   Policy "Users can read own feedbacks or admins can read all" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: ((user_id = auth.uid()) OR is_admin_user(auth.uid()) OR is_master_user(auth.uid()))
// Table: innovation_records
//   Policy "Users can insert their own innovation_records" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (user_id = auth.uid())
//   Policy "Users can view their own or admins can view all innovation_reco" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: ((user_id = auth.uid()) OR is_admin_user(auth.uid()) OR is_master_user(auth.uid()))
// Table: inventory
//   Policy "Allow all authenticated users" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: inventory_movements
//   Policy "inventory_movements_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (is_admin_user(auth.uid()) OR is_master_user(auth.uid()))
//   Policy "inventory_movements_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: ((user_id = auth.uid()) OR is_admin_user(auth.uid()) OR is_master_user(auth.uid()))
//   Policy "inventory_movements_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "inventory_movements_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (is_admin_user(auth.uid()) OR is_master_user(auth.uid()))
// Table: inventory_settings
//   Policy "Allow admins to delete inventory_settings" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (is_admin_user(auth.uid()) OR is_master_user(auth.uid()))
//   Policy "Allow admins to insert inventory_settings" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (is_admin_user(auth.uid()) OR is_master_user(auth.uid()))
//   Policy "Allow admins to update inventory_settings" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (is_admin_user(auth.uid()) OR is_master_user(auth.uid()))
//     WITH CHECK: (is_admin_user(auth.uid()) OR is_master_user(auth.uid()))
//   Policy "Allow authenticated users to read inventory_settings" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
// Table: inventory_temporary_outflows
//   Policy "Allow all authenticated users" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: kpi_commercial_entries
//   Policy "Allow all authenticated users on kpi_commercial_entries" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: kpis
//   Policy "Allow all authenticated users on kpis" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: menu_configurations
//   Policy "Allow all authenticated users" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: monthly_readings
//   Policy "Users can insert their own monthly_readings" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (user_id = auth.uid())
//   Policy "Users can view their own or admins can view all monthly_reading" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: ((user_id = auth.uid()) OR is_admin_user(auth.uid()) OR is_master_user(auth.uid()))
// Table: onboarding
//   Policy "Allow all authenticated users" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: performance_diaria
//   Policy "Allow all authenticated users on performance_diaria" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: price_list
//   Policy "price_list_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (is_admin_user(auth.uid()) OR is_master_user(auth.uid()))
//   Policy "price_list_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (is_admin_user(auth.uid()) OR is_master_user(auth.uid()))
//   Policy "price_list_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "price_list_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (is_admin_user(auth.uid()) OR is_master_user(auth.uid()))
// Table: price_stages
//   Policy "price_stages_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (is_admin_user(auth.uid()) OR is_master_user(auth.uid()))
//   Policy "price_stages_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (is_admin_user(auth.uid()) OR is_master_user(auth.uid()))
//   Policy "price_stages_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "price_stages_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (is_admin_user(auth.uid()) OR is_master_user(auth.uid()))
// Table: sac_records
//   Policy "Sac delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (is_master_user(auth.uid()) OR is_admin_user(auth.uid()))
//   Policy "Sac insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "Sac update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (is_master_user(auth.uid()) OR is_admin_user(auth.uid()) OR (responsible_employee_id = ( SELECT employees.id    FROM employees   WHERE (employees.user_id = auth.uid())  LIMIT 1)) OR (receiving_employee_id = ( SELECT employees.id    FROM employees   WHERE (employees.user_id = auth.uid())  LIMIT 1)))
//   Policy "Sac visibility" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: ((responsible_employee_id = ( SELECT employees.id    FROM employees   WHERE (employees.user_id = auth.uid())  LIMIT 1)) OR (receiving_employee_id = ( SELECT employees.id    FROM employees   WHERE (employees.user_id = auth.uid())  LIMIT 1)) OR is_master_user(auth.uid()) OR (EXISTS ( SELECT 1    FROM employees e   WHERE ((e.user_id = auth.uid()) AND (('ADMIN'::text = ANY (e.team_category)) OR ('DIRETORIA'::text = ANY (e.team_category)))))))
// Table: sectors
//   Policy "Allow all authenticated users" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: ser_5s_submissions
//   Policy "Users can insert their own" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (user_id = auth.uid())
//   Policy "Users can view their own or admins can view all" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: ((user_id = auth.uid()) OR is_admin_user(auth.uid()) OR is_master_user(auth.uid()))
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
// FUNCTION audit_fiscal_boleto_deletions()
//   CREATE OR REPLACE FUNCTION public.audit_fiscal_boleto_deletions()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//       INSERT INTO public.audit_logs (user_id, action)
//       VALUES (auth.uid(), 'EXCLUSÃO: Boleto apagado (ID: ' || OLD.id || ', Valor: ' || OLD.value || ')');
//       RETURN OLD;
//   END;
//   $function$
//   
// FUNCTION audit_fiscal_sales_deletions()
//   CREATE OR REPLACE FUNCTION public.audit_fiscal_sales_deletions()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//       INSERT INTO public.audit_logs (user_id, action)
//       VALUES (auth.uid(), 'EXCLUSÃO: Venda apagada (ID: ' || OLD.id || ', Valor: ' || OLD.sale_value || ')');
//       RETURN OLD;
//   END;
//   $function$
//   
// FUNCTION calcular_aderencia_diaria(uuid, date)
//   CREATE OR REPLACE FUNCTION public.calcular_aderencia_diaria(p_employee_id uuid, p_date date)
//    RETURNS void
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//       v_sector_id UUID;
//       v_role TEXT;
//       v_department TEXT;
//       v_team_category TEXT[];
//       v_day_of_week INT;
//       
//       v_total_routines INT := 0;
//       v_executed_routines INT := 0;
//       
//       v_total_checklist INT := 0;
//       v_executed_checklist INT := 0;
//       
//       v_total_tarefas INT := 0;
//       v_tarefas_executadas INT := 0;
//       v_percentual NUMERIC := 0;
//   BEGIN
//       -- 1. Obter o setor e cargo do colaborador
//       SELECT sector_id, role, department, COALESCE(team_category, ARRAY[]::text[]) 
//       INTO v_sector_id, v_role, v_department, v_team_category 
//       FROM public.employees WHERE id = p_employee_id;
//   
//       -- Se for Dentista ou Sócio, não faz nada
//       IF v_role ILIKE '%dentista%' OR v_role ILIKE '%sócio%' OR v_role ILIKE '%socio%' OR v_department ILIKE '%dentista%' OR 'DENTISTA' = ANY(v_team_category) OR 'SÓCIO' = ANY(v_team_category) THEN
//           RETURN;
//       END IF;
//   
//       -- Obter o dia da semana da data fornecida (0=Domingo, 6=Sábado) para PostgreSQL
//       SELECT extract(dow from p_date::timestamp) INTO v_day_of_week;
//   
//       -- Contar o total de rotinas diárias ativas para o colaborador naquele dia da semana
//       SELECT COUNT(*) INTO v_total_routines
//       FROM public.daily_routines
//       WHERE employee_id = p_employee_id
//         AND (days_of_week IS NULL OR v_day_of_week = ANY(days_of_week));
//   
//       -- Contar quantas foram concluídas (registradas em daily_routine_executions) na data específica
//       SELECT COUNT(DISTINCT r.id) INTO v_executed_routines
//       FROM public.daily_routines r
//       JOIN public.daily_routine_executions e ON r.id = e.routine_id
//       WHERE r.employee_id = p_employee_id
//         AND e.employee_id = p_employee_id
//         AND DATE(e.completed_at AT TIME ZONE 'UTC') = p_date;
//   
//       -- Contar Total de Tarefas Ativas no modelo de checklist dele (do setor dele ou global)
//       SELECT COUNT(*) INTO v_total_checklist
//       FROM public.checklist_modelos
//       WHERE (sector_id = v_sector_id OR sector_id IS NULL) AND is_active = true;
//   
//       -- Contar quantas foram marcadas como 'Executado = True' na tabela 'checklist_diario'
//       SELECT COUNT(*) INTO v_executed_checklist
//       FROM public.checklist_diario
//       WHERE employee_id = p_employee_id 
//         AND date = p_date 
//         AND is_executed = true;
//   
//       v_total_tarefas := v_total_routines + v_total_checklist;
//       v_tarefas_executadas := v_executed_routines + v_executed_checklist;
//   
//       -- 4. Cálculo: (Executadas / Total) * 100
//       IF v_total_tarefas > 0 THEN
//           v_percentual := (v_tarefas_executadas::NUMERIC / v_total_tarefas::NUMERIC) * 100;
//       ELSE
//           v_percentual := 0;
//       END IF;
//   
//       -- 5. Salve esse resultado em 'Performance_Diaria'
//       INSERT INTO public.performance_diaria (employee_id, date, percentage)
//       VALUES (p_employee_id, p_date, v_percentual)
//       ON CONFLICT (employee_id, date) 
//       DO UPDATE SET percentage = EXCLUDED.percentage;
//   END;
//   $function$
//   
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
// FUNCTION get_monthly_ranking(integer, integer)
//   CREATE OR REPLACE FUNCTION public.get_monthly_ranking(year_val integer, month_val integer)
//    RETURNS TABLE(user_id uuid, employee_id uuid, employee_name text, total_points bigint)
//    LANGUAGE sql
//    SECURITY DEFINER
//   AS $function$
//     SELECT 
//       e.user_id,
//       e.id as employee_id,
//       e.name as employee_name,
//       COALESCE(SUM(points.pts), 0) as total_points
//     FROM public.employees e
//     LEFT JOIN (
//       SELECT user_id, points_earned as pts 
//       FROM public.hub_announcement_reads 
//       WHERE extract(year from read_at) = year_val AND extract(month from read_at) = month_val
//       
//       UNION ALL
//       
//       SELECT user_id, points_earned as pts 
//       FROM public.hub_feedbacks 
//       WHERE extract(year from created_at) = year_val AND extract(month from created_at) = month_val
//       
//       UNION ALL
//       
//       SELECT user_id, points_earned as pts
//       FROM public.ser_5s_submissions
//       WHERE extract(year from submission_date) = year_val AND extract(month from submission_date) = month_val
//   
//       UNION ALL
//   
//       SELECT user_id, points_earned as pts
//       FROM public.monthly_readings
//       WHERE extract(year from submission_date) = year_val AND extract(month from submission_date) = month_val
//   
//       UNION ALL
//   
//       SELECT user_id, points_earned as pts
//       FROM public.innovation_records
//       WHERE extract(year from created_at) = year_val AND extract(month from created_at) = month_val
//   
//     ) points ON points.user_id = e.user_id
//     WHERE e.status != 'Desligado' AND e.user_id IS NOT NULL
//     GROUP BY e.user_id, e.id, e.name
//     ORDER BY total_points DESC, e.name ASC;
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
// FUNCTION is_admin_user(uuid)
//   CREATE OR REPLACE FUNCTION public.is_admin_user(user_uuid uuid)
//    RETURNS boolean
//    LANGUAGE sql
//    SECURITY DEFINER
//    SET search_path TO ''
//   AS $function$
//     SELECT EXISTS (
//       SELECT 1 FROM public.employees
//       WHERE user_id = user_uuid AND (
//         LOWER(role) LIKE '%admin%' OR
//         LOWER(role) LIKE '%diretor%' OR
//         'ADMIN'     = ANY(team_category) OR
//         'DIRETORIA' = ANY(team_category) OR
//         'MASTER'    = ANY(team_category)
//       )
//     );
//   $function$
//   
// FUNCTION is_master_user(uuid)
//   CREATE OR REPLACE FUNCTION public.is_master_user(user_uuid uuid)
//    RETURNS boolean
//    LANGUAGE sql
//    SECURITY DEFINER
//    SET search_path TO ''
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
// FUNCTION reset_financial_data(text)
//   CREATE OR REPLACE FUNCTION public.reset_financial_data(acting_user_name text)
//    RETURNS void
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//    SET search_path TO 'public'
//   AS $function$
//   DECLARE
//     current_user_id uuid;
//   BEGIN
//       current_user_id := auth.uid();
//       
//       IF current_user_id IS NULL THEN
//           RAISE EXCEPTION 'Não autenticado';
//       END IF;
//   
//       -- Verify if the user is an admin or master
//       IF NOT (public.is_admin_user(current_user_id) OR public.is_master_user(current_user_id)) THEN
//           RAISE EXCEPTION 'Acesso negado. Apenas administradores podem realizar esta ação.';
//       END IF;
//   
//       -- Delete all records from the target financial tables
//       -- Safe update extension requires a WHERE clause for DELETE operations
//       DELETE FROM public.cash_box_closings WHERE id IS NOT NULL;
//       DELETE FROM public.fiscal_sales_entries WHERE id IS NOT NULL;
//       DELETE FROM public.fiscal_boleto_entries WHERE id IS NOT NULL;
//   
//       -- Create the explicit audit log entry required
//       INSERT INTO public.audit_logs (user_id, action)
//       VALUES (
//           current_user_id, 
//           'RESET TOTAL: Todo o histórico de caixa e financeiro foi apagado por ' || COALESCE(acting_user_name, 'SISTEMA')
//       );
//   END;
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
// FUNCTION sync_my_employee_record()
//   CREATE OR REPLACE FUNCTION public.sync_my_employee_record()
//    RETURNS void
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//     v_user_id UUID;
//     v_email TEXT;
//   BEGIN
//     v_user_id := auth.uid();
//     IF v_user_id IS NULL THEN RETURN; END IF;
//     
//     SELECT email INTO v_email FROM auth.users WHERE id = v_user_id;
//     
//     IF v_email IS NOT NULL AND v_email != '' THEN
//       UPDATE public.employees 
//       SET user_id = v_user_id
//       WHERE lower(email) = lower(v_email) AND (user_id IS NULL OR user_id != v_user_id);
//     END IF;
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
// FUNCTION trg_audit_employee_sensitive_data()
//   CREATE OR REPLACE FUNCTION public.trg_audit_employee_sensitive_data()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//       action_desc TEXT;
//       current_user_id UUID;
//       changes TEXT := '';
//   BEGIN
//       current_user_id := auth.uid();
//       IF current_user_id IS NULL THEN RETURN NEW; END IF;
//   
//       IF NEW.salary IS DISTINCT FROM OLD.salary THEN
//           changes := changes || 'Salário, ';
//       END IF;
//       IF NEW.pix_number IS DISTINCT FROM OLD.pix_number THEN
//           changes := changes || 'PIX, ';
//       END IF;
//       IF NEW.bank_name IS DISTINCT FROM OLD.bank_name THEN
//           changes := changes || 'Banco, ';
//       END IF;
//       IF NEW.role IS DISTINCT FROM OLD.role THEN
//           changes := changes || 'Cargo, ';
//       END IF;
//       
//       IF changes != '' THEN
//           changes := rtrim(changes, ', ');
//           action_desc := 'DADOS SENSÍVEIS ALTERADOS: Colaborador ' || NEW.name || ' - Campos alterados: ' || changes;
//           INSERT INTO public.audit_logs (user_id, action) VALUES (current_user_id, action_desc);
//       END IF;
//       
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
//   audit_employee_sensitive_data: CREATE TRIGGER audit_employee_sensitive_data AFTER UPDATE ON public.employees FOR EACH ROW EXECUTE FUNCTION trg_audit_employee_sensitive_data()
//   trg_sync_employee_dates_to_agenda: CREATE TRIGGER trg_sync_employee_dates_to_agenda AFTER INSERT OR DELETE OR UPDATE ON public.employees FOR EACH ROW EXECUTE FUNCTION sync_employee_dates_to_agenda()
// Table: fiscal_boleto_entries
//   trg_audit_fiscal_boleto_deletions: CREATE TRIGGER trg_audit_fiscal_boleto_deletions AFTER DELETE ON public.fiscal_boleto_entries FOR EACH ROW EXECUTE FUNCTION audit_fiscal_boleto_deletions()
// Table: fiscal_sales_entries
//   trg_audit_fiscal_sales_deletions: CREATE TRIGGER trg_audit_fiscal_sales_deletions AFTER DELETE ON public.fiscal_sales_entries FOR EACH ROW EXECUTE FUNCTION audit_fiscal_sales_deletions()
// Table: sac_records
//   trg_sync_sac_to_agenda: CREATE TRIGGER trg_sync_sac_to_agenda AFTER UPDATE ON public.sac_records FOR EACH ROW EXECUTE FUNCTION sync_sac_to_agenda()

// --- INDEXES ---
// Table: agenda_segmentation
//   CREATE UNIQUE INDEX agenda_segmentation_consultorio_id_day_of_week_shift_key ON public.agenda_segmentation USING btree (consultorio_id, day_of_week, shift)
// Table: chat_participants
//   CREATE UNIQUE INDEX chat_participants_room_id_user_id_key ON public.chat_participants USING btree (room_id, user_id)
// Table: checklist_diario
//   CREATE UNIQUE INDEX checklist_diario_unique_entry ON public.checklist_diario USING btree (employee_id, date, modelo_id)
// Table: consultorio_weekly_schedules
//   CREATE UNIQUE INDEX consultorio_weekly_schedules_consultorio_id_day_of_week_key ON public.consultorio_weekly_schedules USING btree (consultorio_id, day_of_week)
// Table: departments
//   CREATE UNIQUE INDEX departments_name_key ON public.departments USING btree (name)
// Table: fiscal_limit_configs
//   CREATE UNIQUE INDEX fiscal_limit_configs_company_month_year_idx ON public.fiscal_limit_configs USING btree (company_id, month, year)
// Table: hub_announcement_reads
//   CREATE UNIQUE INDEX hub_announcement_reads_user_id_announcement_id_key ON public.hub_announcement_reads USING btree (user_id, announcement_id)
// Table: monthly_readings
//   CREATE UNIQUE INDEX monthly_readings_user_month_key ON public.monthly_readings USING btree (user_id, reference_month)
// Table: performance_diaria
//   CREATE UNIQUE INDEX performance_diaria_unique_entry ON public.performance_diaria USING btree (employee_id, date)
// Table: sac_records
//   CREATE INDEX sac_records_received_at_idx ON public.sac_records USING btree (received_at)
//   CREATE INDEX sac_records_status_idx ON public.sac_records USING btree (status)
// Table: ser_5s_submissions
//   CREATE UNIQUE INDEX ser_5s_unique_week ON public.ser_5s_submissions USING btree (user_id, reference_week)
// Table: work_schedules
//   CREATE UNIQUE INDEX work_schedules_employee_id_work_date_key ON public.work_schedules USING btree (employee_id, work_date)

