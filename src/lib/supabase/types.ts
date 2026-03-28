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
      cargos: {
        Row: {
          created_at: string
          descricao: string | null
          id: string
          nome: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
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
      departamentos: {
        Row: {
          created_at: string
          id: string
          nome: string
        }
        Insert: {
          created_at?: string
          id?: string
          nome: string
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
        }
        Relationships: []
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
        Relationships: []
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
      kpis_config: {
        Row: {
          campos_json: Json | null
          cargo_id: string | null
          created_at: string
          id: string
          meta_padrao: number
          nome_kpi: string
          unidade: string
        }
        Insert: {
          campos_json?: Json | null
          cargo_id?: string | null
          created_at?: string
          id?: string
          meta_padrao?: number
          nome_kpi: string
          unidade: string
        }
        Update: {
          campos_json?: Json | null
          cargo_id?: string | null
          created_at?: string
          id?: string
          meta_padrao?: number
          nome_kpi?: string
          unidade?: string
        }
        Relationships: [
          {
            foreignKeyName: "kpis_config_cargo_id_fkey"
            columns: ["cargo_id"]
            isOneToOne: false
            referencedRelation: "cargos"
            referencedColumns: ["id"]
          },
        ]
      }
      kpis_dados: {
        Row: {
          cargo_id: string | null
          created_at: string
          data: string
          id: string
          kpi_id: string | null
          usuario_id: string | null
          valor_atual: number
          valores_json: Json | null
        }
        Insert: {
          cargo_id?: string | null
          created_at?: string
          data: string
          id?: string
          kpi_id?: string | null
          usuario_id?: string | null
          valor_atual?: number
          valores_json?: Json | null
        }
        Update: {
          cargo_id?: string | null
          created_at?: string
          data?: string
          id?: string
          kpi_id?: string | null
          usuario_id?: string | null
          valor_atual?: number
          valores_json?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "kpis_dados_cargo_id_fkey"
            columns: ["cargo_id"]
            isOneToOne: false
            referencedRelation: "cargos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kpis_dados_kpi_id_fkey"
            columns: ["kpi_id"]
            isOneToOne: false
            referencedRelation: "kpis_config"
            referencedColumns: ["id"]
          },
        ]
      }
      kpis_permissoes: {
        Row: {
          cargo_id: string
          created_at: string
          id: string
          kpi_id: string
          pode_editar: boolean
          pode_visualizar: boolean
        }
        Insert: {
          cargo_id: string
          created_at?: string
          id?: string
          kpi_id: string
          pode_editar?: boolean
          pode_visualizar?: boolean
        }
        Update: {
          cargo_id?: string
          created_at?: string
          id?: string
          kpi_id?: string
          pode_editar?: boolean
          pode_visualizar?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "kpis_permissoes_cargo_id_fkey"
            columns: ["cargo_id"]
            isOneToOne: false
            referencedRelation: "cargos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kpis_permissoes_kpi_id_fkey"
            columns: ["kpi_id"]
            isOneToOne: false
            referencedRelation: "kpis_config"
            referencedColumns: ["id"]
          },
        ]
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
      menus_sistema: {
        Row: {
          created_at: string
          icone: string | null
          id: string
          menu_filho: string | null
          menu_pai: string | null
          nome: string
          ordem: number | null
          rota: string | null
        }
        Insert: {
          created_at?: string
          icone?: string | null
          id?: string
          menu_filho?: string | null
          menu_pai?: string | null
          nome: string
          ordem?: number | null
          rota?: string | null
        }
        Update: {
          created_at?: string
          icone?: string | null
          id?: string
          menu_filho?: string | null
          menu_pai?: string | null
          nome?: string
          ordem?: number | null
          rota?: string | null
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
      permissoes_cargo: {
        Row: {
          cargo_id: string
          created_at: string
          id: string
          menu_id: string
          pode_criar: boolean
          pode_deletar: boolean
          pode_editar: boolean
          pode_ver: boolean
        }
        Insert: {
          cargo_id: string
          created_at?: string
          id?: string
          menu_id: string
          pode_criar?: boolean
          pode_deletar?: boolean
          pode_editar?: boolean
          pode_ver?: boolean
        }
        Update: {
          cargo_id?: string
          created_at?: string
          id?: string
          menu_id?: string
          pode_criar?: boolean
          pode_deletar?: boolean
          pode_editar?: boolean
          pode_ver?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "permissoes_cargo_cargo_id_fkey"
            columns: ["cargo_id"]
            isOneToOne: false
            referencedRelation: "cargos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permissoes_cargo_menu_id_fkey"
            columns: ["menu_id"]
            isOneToOne: false
            referencedRelation: "menus_sistema"
            referencedColumns: ["id"]
          },
        ]
      }
      permissoes_usuario: {
        Row: {
          created_at: string
          id: string
          menu_id: string
          pode_criar: boolean
          pode_deletar: boolean
          pode_editar: boolean
          pode_ver: boolean
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          menu_id: string
          pode_criar?: boolean
          pode_deletar?: boolean
          pode_editar?: boolean
          pode_ver?: boolean
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          menu_id?: string
          pode_criar?: boolean
          pode_deletar?: boolean
          pode_editar?: boolean
          pode_ver?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "permissoes_usuario_menu_id_fkey"
            columns: ["menu_id"]
            isOneToOne: false
            referencedRelation: "menus_sistema"
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
      profiles: {
        Row: {
          cargo_id: string | null
          cpf: string | null
          created_at: string
          data_admissao: string | null
          data_nascimento: string | null
          departamento_id: string | null
          email: string
          id: string
          nome: string | null
          pix_banco: string | null
          pix_numero: string | null
          pix_tipo: string | null
          telefone: string | null
          updated_at: string
        }
        Insert: {
          cargo_id?: string | null
          cpf?: string | null
          created_at?: string
          data_admissao?: string | null
          data_nascimento?: string | null
          departamento_id?: string | null
          email: string
          id: string
          nome?: string | null
          pix_banco?: string | null
          pix_numero?: string | null
          pix_tipo?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          cargo_id?: string | null
          cpf?: string | null
          created_at?: string
          data_admissao?: string | null
          data_nascimento?: string | null
          departamento_id?: string | null
          email?: string
          id?: string
          nome?: string | null
          pix_banco?: string | null
          pix_numero?: string | null
          pix_tipo?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_cargo_id_fkey"
            columns: ["cargo_id"]
            isOneToOne: false
            referencedRelation: "cargos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_departamento_id_fkey"
            columns: ["departamento_id"]
            isOneToOne: false
            referencedRelation: "departamentos"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          action_id: string
          created_at: string
          id: string
          role_id: string
        }
        Insert: {
          action_id: string
          created_at?: string
          id?: string
          role_id: string
        }
        Update: {
          action_id?: string
          created_at?: string
          id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "sys_actions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      rotinas_config: {
        Row: {
          acao: string
          cargo_id: string
          colaborador_id: string | null
          created_at: string
          data_fim: string | null
          data_inicio: string | null
          dias_semana: Json
          frequencia: string
          horario: string
          id: string
        }
        Insert: {
          acao: string
          cargo_id: string
          colaborador_id?: string | null
          created_at?: string
          data_fim?: string | null
          data_inicio?: string | null
          dias_semana?: Json
          frequencia?: string
          horario: string
          id?: string
        }
        Update: {
          acao?: string
          cargo_id?: string
          colaborador_id?: string | null
          created_at?: string
          data_fim?: string | null
          data_inicio?: string | null
          dias_semana?: Json
          frequencia?: string
          horario?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rotinas_config_cargo_id_fkey"
            columns: ["cargo_id"]
            isOneToOne: false
            referencedRelation: "cargos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rotinas_config_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      rotinas_execucao: {
        Row: {
          concluido: boolean
          created_at: string
          data: string
          id: string
          rotina_id: string
          timestamp_conclusao: string | null
          usuario_id: string
        }
        Insert: {
          concluido?: boolean
          created_at?: string
          data: string
          id?: string
          rotina_id: string
          timestamp_conclusao?: string | null
          usuario_id: string
        }
        Update: {
          concluido?: boolean
          created_at?: string
          data?: string
          id?: string
          rotina_id?: string
          timestamp_conclusao?: string | null
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rotinas_execucao_rotina_id_fkey"
            columns: ["rotina_id"]
            isOneToOne: false
            referencedRelation: "rotinas_config"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rotinas_execucao_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      rotinas_pontos: {
        Row: {
          created_at: string
          data: string
          id: string
          percentual: number
          pontos: number
          usuario_id: string
        }
        Insert: {
          created_at?: string
          data: string
          id?: string
          percentual?: number
          pontos?: number
          usuario_id: string
        }
        Update: {
          created_at?: string
          data?: string
          id?: string
          percentual?: number
          pontos?: number
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rotinas_pontos_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
        Relationships: []
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
      sys_actions: {
        Row: {
          created_at: string
          description: string | null
          id: string
          module: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          module: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          module?: string
          name?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      fix_auth_user_tokens: { Args: { user_id: string }; Returns: undefined }
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
      is_room_participant: {
        Args: { checking_room_id: string }
        Returns: boolean
      }
      marcar_rotina_concluida: {
        Args: { p_data: string; p_rotina_id: string; p_usuario_id: string }
        Returns: undefined
      }
      mark_room_read: {
        Args: { p_room_id: string; p_user_id: string }
        Returns: undefined
      }
      reset_financial_data: {
        Args: { acting_user_name: string }
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
// Table: cargos
//   id: uuid (not null, default: gen_random_uuid())
//   nome: text (not null)
//   descricao: text (nullable)
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
// Table: departamentos
//   id: uuid (not null, default: gen_random_uuid())
//   nome: text (not null)
//   created_at: timestamp with time zone (not null, default: now())
// Table: departments
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   created_at: timestamp with time zone (not null, default: now())
// Table: documents
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   date: text (not null)
//   created_at: timestamp with time zone (not null, default: now())
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
// Table: kpis_config
//   id: uuid (not null, default: gen_random_uuid())
//   cargo_id: uuid (nullable)
//   nome_kpi: text (not null)
//   unidade: text (not null)
//   meta_padrao: numeric (not null, default: 0)
//   created_at: timestamp with time zone (not null, default: now())
//   campos_json: jsonb (nullable, default: '{}'::jsonb)
// Table: kpis_dados
//   id: uuid (not null, default: gen_random_uuid())
//   kpi_id: uuid (nullable)
//   cargo_id: uuid (nullable)
//   valor_atual: numeric (not null, default: 0)
//   data: date (not null)
//   usuario_id: uuid (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   valores_json: jsonb (nullable, default: '{}'::jsonb)
// Table: kpis_permissoes
//   id: uuid (not null, default: gen_random_uuid())
//   cargo_id: uuid (not null)
//   kpi_id: uuid (not null)
//   pode_visualizar: boolean (not null, default: false)
//   pode_editar: boolean (not null, default: false)
//   created_at: timestamp with time zone (not null, default: now())
// Table: menu_configurations
//   id: uuid (not null, default: gen_random_uuid())
//   tab_name: text (not null)
//   icon: text (nullable)
//   link: text (not null)
//   authorized_sectors: _text (nullable, default: '{}'::text[])
//   created_at: timestamp with time zone (not null, default: now())
// Table: menus_sistema
//   id: uuid (not null, default: gen_random_uuid())
//   nome: text (not null)
//   rota: text (nullable)
//   icone: text (nullable)
//   ordem: integer (nullable, default: 0)
//   created_at: timestamp with time zone (not null, default: now())
//   menu_pai: text (nullable)
//   menu_filho: text (nullable)
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
// Table: permissoes_cargo
//   id: uuid (not null, default: gen_random_uuid())
//   cargo_id: uuid (not null)
//   menu_id: uuid (not null)
//   pode_ver: boolean (not null, default: false)
//   pode_editar: boolean (not null, default: false)
//   pode_deletar: boolean (not null, default: false)
//   created_at: timestamp with time zone (not null, default: now())
//   pode_criar: boolean (not null, default: false)
// Table: permissoes_usuario
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   menu_id: uuid (not null)
//   pode_ver: boolean (not null, default: false)
//   pode_editar: boolean (not null, default: false)
//   pode_deletar: boolean (not null, default: false)
//   created_at: timestamp with time zone (not null, default: now())
//   pode_criar: boolean (not null, default: false)
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
//   email: text (not null)
//   nome: text (nullable)
//   cargo_id: uuid (nullable)
//   departamento_id: uuid (nullable)
//   cpf: text (nullable)
//   telefone: text (nullable)
//   data_nascimento: date (nullable)
//   pix_tipo: text (nullable)
//   pix_numero: text (nullable)
//   pix_banco: text (nullable)
//   data_admissao: date (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: role_permissions
//   id: uuid (not null, default: gen_random_uuid())
//   role_id: uuid (not null)
//   action_id: uuid (not null)
//   created_at: timestamp with time zone (not null, default: now())
// Table: roles
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   description: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: rotinas_config
//   id: uuid (not null, default: gen_random_uuid())
//   cargo_id: uuid (not null)
//   acao: text (not null)
//   horario: text (not null)
//   dias_semana: jsonb (not null, default: '[]'::jsonb)
//   frequencia: text (not null, default: 'diario'::text)
//   data_inicio: date (nullable)
//   data_fim: date (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   colaborador_id: uuid (nullable)
// Table: rotinas_execucao
//   id: uuid (not null, default: gen_random_uuid())
//   rotina_id: uuid (not null)
//   usuario_id: uuid (not null)
//   data: date (not null)
//   concluido: boolean (not null, default: false)
//   timestamp_conclusao: timestamp with time zone (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: rotinas_pontos
//   id: uuid (not null, default: gen_random_uuid())
//   usuario_id: uuid (not null)
//   data: date (not null)
//   pontos: integer (not null, default: 0)
//   percentual: numeric (not null, default: 0)
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
// Table: sys_actions
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   description: text (nullable)
//   module: text (not null)
//   created_at: timestamp with time zone (not null, default: now())
// Table: user_roles
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   role_id: uuid (not null)
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
//   FOREIGN KEY agenda_sac_record_id_fkey: FOREIGN KEY (sac_record_id) REFERENCES sac_records(id) ON DELETE CASCADE
// Table: agenda_segmentation
//   UNIQUE agenda_segmentation_consultorio_id_day_of_week_shift_key: UNIQUE (consultorio_id, day_of_week, shift)
//   FOREIGN KEY agenda_segmentation_consultorio_id_fkey: FOREIGN KEY (consultorio_id) REFERENCES clinica_consultorios(id) ON DELETE CASCADE
//   CHECK agenda_segmentation_day_of_week_check: CHECK (((day_of_week >= 1) AND (day_of_week <= 6)))
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
// Table: cargos
//   UNIQUE cargos_nome_key: UNIQUE (nome)
//   PRIMARY KEY cargos_pkey: PRIMARY KEY (id)
// Table: cash_box_closings
//   PRIMARY KEY cash_box_closings_pkey: PRIMARY KEY (id)
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
// Table: checklist_modelos
//   PRIMARY KEY checklist_modelos_pkey: PRIMARY KEY (id)
//   FOREIGN KEY checklist_modelos_sector_id_fkey: FOREIGN KEY (sector_id) REFERENCES sectors(id) ON DELETE SET NULL
// Table: clinica_consultorios
//   PRIMARY KEY clinica_consultorios_pkey: PRIMARY KEY (id)
// Table: departamentos
//   UNIQUE departamentos_nome_key: UNIQUE (nome)
//   PRIMARY KEY departamentos_pkey: PRIMARY KEY (id)
// Table: departments
//   UNIQUE departments_name_key: UNIQUE (name)
//   PRIMARY KEY departments_pkey: PRIMARY KEY (id)
// Table: documents
//   PRIMARY KEY documents_pkey: PRIMARY KEY (id)
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
//   FOREIGN KEY inventory_temporary_outflows_inventory_id_fkey: FOREIGN KEY (inventory_id) REFERENCES inventory(id) ON DELETE CASCADE
//   PRIMARY KEY inventory_temporary_outflows_pkey: PRIMARY KEY (id)
//   CHECK inventory_temporary_outflows_quantity_check: CHECK ((quantity > 0))
//   CHECK inventory_temporary_outflows_status_check: CHECK ((status = ANY (ARRAY['PENDING'::text, 'FINALIZED'::text, 'RETURNED'::text])))
// Table: kpi_commercial_entries
//   PRIMARY KEY kpi_commercial_entries_pkey: PRIMARY KEY (id)
//   CHECK kpi_commercial_entries_type_check: CHECK ((type = ANY (ARRAY['VENDA'::text, 'AVALIACAO'::text])))
// Table: kpis
//   PRIMARY KEY kpis_pkey: PRIMARY KEY (id)
// Table: kpis_config
//   FOREIGN KEY kpis_config_cargo_id_fkey: FOREIGN KEY (cargo_id) REFERENCES cargos(id) ON DELETE CASCADE
//   PRIMARY KEY kpis_config_pkey: PRIMARY KEY (id)
// Table: kpis_dados
//   FOREIGN KEY kpis_dados_cargo_id_fkey: FOREIGN KEY (cargo_id) REFERENCES cargos(id) ON DELETE CASCADE
//   FOREIGN KEY kpis_dados_kpi_id_fkey: FOREIGN KEY (kpi_id) REFERENCES kpis_config(id) ON DELETE CASCADE
//   PRIMARY KEY kpis_dados_pkey: PRIMARY KEY (id)
//   FOREIGN KEY kpis_dados_usuario_id_fkey: FOREIGN KEY (usuario_id) REFERENCES auth.users(id) ON DELETE SET NULL
// Table: kpis_permissoes
//   FOREIGN KEY kpis_permissoes_cargo_id_fkey: FOREIGN KEY (cargo_id) REFERENCES cargos(id) ON DELETE CASCADE
//   UNIQUE kpis_permissoes_cargo_id_kpi_id_key: UNIQUE (cargo_id, kpi_id)
//   FOREIGN KEY kpis_permissoes_kpi_id_fkey: FOREIGN KEY (kpi_id) REFERENCES kpis_config(id) ON DELETE CASCADE
//   PRIMARY KEY kpis_permissoes_pkey: PRIMARY KEY (id)
// Table: menu_configurations
//   PRIMARY KEY menu_configurations_pkey: PRIMARY KEY (id)
// Table: menus_sistema
//   UNIQUE menus_sistema_nome_key: UNIQUE (nome)
//   PRIMARY KEY menus_sistema_pkey: PRIMARY KEY (id)
// Table: monthly_readings
//   PRIMARY KEY monthly_readings_pkey: PRIMARY KEY (id)
//   FOREIGN KEY monthly_readings_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
//   UNIQUE monthly_readings_user_month_key: UNIQUE (user_id, reference_month)
// Table: onboarding
//   PRIMARY KEY onboarding_pkey: PRIMARY KEY (id)
// Table: permissoes_cargo
//   FOREIGN KEY permissoes_cargo_cargo_id_fkey: FOREIGN KEY (cargo_id) REFERENCES cargos(id) ON DELETE CASCADE
//   UNIQUE permissoes_cargo_cargo_menu_key: UNIQUE (cargo_id, menu_id)
//   FOREIGN KEY permissoes_cargo_menu_id_fkey: FOREIGN KEY (menu_id) REFERENCES menus_sistema(id) ON DELETE CASCADE
//   PRIMARY KEY permissoes_cargo_pkey: PRIMARY KEY (id)
// Table: permissoes_usuario
//   FOREIGN KEY permissoes_usuario_menu_id_fkey: FOREIGN KEY (menu_id) REFERENCES menus_sistema(id) ON DELETE CASCADE
//   PRIMARY KEY permissoes_usuario_pkey: PRIMARY KEY (id)
//   FOREIGN KEY permissoes_usuario_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
//   UNIQUE permissoes_usuario_user_menu_key: UNIQUE (user_id, menu_id)
// Table: price_list
//   PRIMARY KEY price_list_pkey: PRIMARY KEY (id)
// Table: price_stages
//   PRIMARY KEY price_stages_pkey: PRIMARY KEY (id)
//   FOREIGN KEY price_stages_price_list_id_fkey: FOREIGN KEY (price_list_id) REFERENCES price_list(id) ON DELETE CASCADE
// Table: profiles
//   FOREIGN KEY profiles_cargo_id_fkey: FOREIGN KEY (cargo_id) REFERENCES cargos(id) ON DELETE SET NULL
//   UNIQUE profiles_cpf_key: UNIQUE (cpf)
//   FOREIGN KEY profiles_departamento_id_fkey: FOREIGN KEY (departamento_id) REFERENCES departamentos(id) ON DELETE SET NULL
//   FOREIGN KEY profiles_id_fkey: FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
//   PRIMARY KEY profiles_pkey: PRIMARY KEY (id)
// Table: role_permissions
//   FOREIGN KEY role_permissions_action_id_fkey: FOREIGN KEY (action_id) REFERENCES sys_actions(id) ON DELETE CASCADE
//   PRIMARY KEY role_permissions_pkey: PRIMARY KEY (id)
//   UNIQUE role_permissions_role_action_key: UNIQUE (role_id, action_id)
//   FOREIGN KEY role_permissions_role_id_fkey: FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
// Table: roles
//   UNIQUE roles_name_key: UNIQUE (name)
//   PRIMARY KEY roles_pkey: PRIMARY KEY (id)
// Table: rotinas_config
//   FOREIGN KEY rotinas_config_cargo_id_fkey: FOREIGN KEY (cargo_id) REFERENCES cargos(id) ON DELETE CASCADE
//   FOREIGN KEY rotinas_config_colaborador_id_fkey: FOREIGN KEY (colaborador_id) REFERENCES profiles(id) ON DELETE CASCADE
//   PRIMARY KEY rotinas_config_pkey: PRIMARY KEY (id)
// Table: rotinas_execucao
//   PRIMARY KEY rotinas_execucao_pkey: PRIMARY KEY (id)
//   FOREIGN KEY rotinas_execucao_rotina_id_fkey: FOREIGN KEY (rotina_id) REFERENCES rotinas_config(id) ON DELETE CASCADE
//   UNIQUE rotinas_execucao_unique: UNIQUE (rotina_id, usuario_id, data)
//   FOREIGN KEY rotinas_execucao_usuario_id_fkey: FOREIGN KEY (usuario_id) REFERENCES profiles(id) ON DELETE CASCADE
// Table: rotinas_pontos
//   PRIMARY KEY rotinas_pontos_pkey: PRIMARY KEY (id)
//   UNIQUE rotinas_pontos_unique: UNIQUE (usuario_id, data)
//   FOREIGN KEY rotinas_pontos_usuario_id_fkey: FOREIGN KEY (usuario_id) REFERENCES profiles(id) ON DELETE CASCADE
// Table: sac_records
//   PRIMARY KEY sac_records_pkey: PRIMARY KEY (id)
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
// Table: sys_actions
//   UNIQUE sys_actions_name_key: UNIQUE (name)
//   PRIMARY KEY sys_actions_pkey: PRIMARY KEY (id)
// Table: user_roles
//   PRIMARY KEY user_roles_pkey: PRIMARY KEY (id)
//   FOREIGN KEY user_roles_role_id_fkey: FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
//   FOREIGN KEY user_roles_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
//   UNIQUE user_roles_user_role_key: UNIQUE (user_id, role_id)
// Table: work_schedules
//   UNIQUE work_schedules_employee_id_work_date_key: UNIQUE (employee_id, work_date)
//   PRIMARY KEY work_schedules_pkey: PRIMARY KEY (id)

// --- ROW LEVEL SECURITY POLICIES ---
// Table: acessos
//   Policy "acessos_admin_only" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (is_admin_user(auth.uid()) OR is_master_user(auth.uid()))
//     WITH CHECK: (is_admin_user(auth.uid()) OR is_master_user(auth.uid()))
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
// Table: cargos
//   Policy "Allow all authenticated users on cargos" (ALL, PERMISSIVE) roles={authenticated}
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
//   Policy "Users can view participants in their rooms" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: ((user_id = auth.uid()) OR is_room_participant(room_id))
// Table: chat_rooms
//   Policy "Users can create rooms" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: ((auth.role() = 'authenticated'::text) AND ((type = 'individual'::text) OR ((type = 'group'::text) AND is_master_user(auth.uid()))))
//   Policy "Users can view rooms they are in" (SELECT, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM chat_participants cp   WHERE ((cp.room_id = cp.id) AND (cp.user_id = auth.uid()))))
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
// Table: departamentos
//   Policy "Allow all authenticated users on departamentos" (ALL, PERMISSIVE) roles={authenticated}
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
// Table: kpis_config
//   Policy "Allow authenticated all kpis_config" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: kpis_dados
//   Policy "Allow authenticated all kpis_dados" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: kpis_permissoes
//   Policy "Allow all authenticated users on kpis_permissoes" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: menu_configurations
//   Policy "Allow all authenticated users" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: menus_sistema
//   Policy "Allow all authenticated users on menus_sistema" (ALL, PERMISSIVE) roles={authenticated}
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
// Table: permissoes_cargo
//   Policy "Allow all authenticated users on permissoes_cargo" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: permissoes_usuario
//   Policy "Allow all authenticated users on permissoes_usuario" (ALL, PERMISSIVE) roles={authenticated}
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
// Table: profiles
//   Policy "Allow all authenticated users on profiles" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: role_permissions
//   Policy "Allow all authenticated users on role_permissions" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: roles
//   Policy "Allow all authenticated users on roles" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: rotinas_config
//   Policy "rotinas_config_admin_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (is_admin_user(auth.uid()) OR is_master_user(auth.uid()))
//   Policy "rotinas_config_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (is_admin_user(auth.uid()) OR is_master_user(auth.uid()) OR (colaborador_id = auth.uid()) OR ((colaborador_id IS NULL) AND (cargo_id IN ( SELECT profiles.cargo_id    FROM profiles   WHERE (profiles.id = auth.uid())))))
// Table: rotinas_execucao
//   Policy "rotinas_execucao_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (usuario_id = auth.uid())
//   Policy "rotinas_execucao_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "rotinas_execucao_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (usuario_id = auth.uid())
// Table: rotinas_pontos
//   Policy "rotinas_pontos_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (usuario_id = auth.uid())
//   Policy "rotinas_pontos_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "rotinas_pontos_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (usuario_id = auth.uid())
// Table: sac_records
//   Policy "Sac delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (is_master_user(auth.uid()) OR is_admin_user(auth.uid()))
//   Policy "Sac insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
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
// Table: sys_actions
//   Policy "Allow all authenticated users on sys_actions" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: user_roles
//   Policy "Allow all authenticated users on user_roles" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: work_schedules
//   Policy "Allow all authenticated users" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true

// --- WARNING: TABLES WITH RLS ENABLED BUT NO POLICIES ---
// These tables have Row Level Security enabled but NO policies defined.
// This means ALL queries (SELECT, INSERT, UPDATE, DELETE) will return ZERO rows
// for non-superuser roles (including the anon and authenticated roles used by the app).
// You MUST create RLS policies for these tables to allow data access.
//   - agenda

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
//     INSERT INTO public.profiles (id, email)
//     VALUES (NEW.id, NEW.email)
//     ON CONFLICT (id) DO NOTHING;
//     RETURN NEW;
//   END;
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
//       SELECT 1 FROM public.user_roles ur
//       JOIN public.roles r ON ur.role_id = r.id
//       WHERE ur.user_id = user_uuid AND r.name IN ('ADMIN', 'MASTER', 'DIRETORIA')
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
//       SELECT 1 FROM public.user_roles ur
//       JOIN public.roles r ON ur.role_id = r.id
//       WHERE ur.user_id = user_uuid AND r.name IN ('ADMIN', 'MASTER')
//     );
//   $function$
//   
// FUNCTION is_room_participant(uuid)
//   CREATE OR REPLACE FUNCTION public.is_room_participant(checking_room_id uuid)
//    RETURNS boolean
//    LANGUAGE sql
//    SECURITY DEFINER
//   AS $function$
//     SELECT EXISTS (
//       SELECT 1 FROM public.chat_participants 
//       WHERE room_id = checking_room_id AND user_id = auth.uid()
//     );
//   $function$
//   
// FUNCTION marcar_rotina_concluida(uuid, uuid, date)
//   CREATE OR REPLACE FUNCTION public.marcar_rotina_concluida(p_rotina_id uuid, p_usuario_id uuid, p_data date)
//    RETURNS void
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//       v_cargo_id UUID;
//       v_total_tarefas INT;
//       v_concluidas INT;
//       v_percentual NUMERIC;
//       v_pontos INT;
//       v_dia_semana TEXT;
//       v_dias_map TEXT[] := ARRAY['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
//       v_hoje DATE;
//       v_agora TIME;
//       v_horario_tarefa TIME;
//   BEGIN
//       -- Verify Date (only allow current date in America/Sao_Paulo)
//       v_hoje := (NOW() AT TIME ZONE 'America/Sao_Paulo')::DATE;
//       v_agora := (NOW() AT TIME ZONE 'America/Sao_Paulo')::TIME;
//       
//       IF p_data != v_hoje THEN
//           RAISE EXCEPTION 'Só é permitido marcar rotinas do dia atual.';
//       END IF;
//   
//       -- Verify Time (only allow if task time is <= current time)
//       SELECT (horario || ':00')::TIME INTO v_horario_tarefa FROM public.rotinas_config WHERE id = p_rotina_id;
//       IF v_horario_tarefa IS NOT NULL AND v_horario_tarefa > v_agora THEN
//           RAISE EXCEPTION 'Ainda não é o horário permitido para marcar esta tarefa.';
//       END IF;
//   
//       -- 1. Insert or Update Execution
//       INSERT INTO public.rotinas_execucao (rotina_id, usuario_id, data, concluido, timestamp_conclusao)
//       VALUES (p_rotina_id, p_usuario_id, p_data, true, NOW())
//       ON CONFLICT (rotina_id, usuario_id, data)
//       DO UPDATE SET concluido = true, timestamp_conclusao = NOW() WHERE public.rotinas_execucao.concluido = false;
//   
//       -- 2. Recalculate Points
//       SELECT cargo_id INTO v_cargo_id FROM public.profiles WHERE id = p_usuario_id;
//       v_dia_semana := v_dias_map[EXTRACT(DOW FROM p_data) + 1];
//   
//       -- Total Tasks for this Colaborador (individual + general cargo tasks)
//       SELECT COUNT(*) INTO v_total_tarefas
//       FROM public.rotinas_config
//       WHERE (colaborador_id = p_usuario_id OR (cargo_id = v_cargo_id AND colaborador_id IS NULL))
//         AND (dias_semana ? v_dia_semana);
//   
//       IF v_total_tarefas = 0 THEN
//           v_total_tarefas := 1;
//       END IF;
//   
//       -- Completed Tasks for this Colaborador
//       SELECT COUNT(*) INTO v_concluidas
//       FROM public.rotinas_execucao re
//       JOIN public.rotinas_config rc ON re.rotina_id = rc.id
//       WHERE re.usuario_id = p_usuario_id
//         AND re.data = p_data
//         AND re.concluido = true
//         AND (rc.colaborador_id = p_usuario_id OR (rc.cargo_id = v_cargo_id AND rc.colaborador_id IS NULL));
//   
//       v_percentual := (v_concluidas::NUMERIC / v_total_tarefas::NUMERIC) * 100;
//       v_pontos := ROUND(v_percentual / 10);
//   
//       INSERT INTO public.rotinas_pontos (usuario_id, data, pontos, percentual)
//       VALUES (p_usuario_id, p_data, v_pontos, v_percentual)
//       ON CONFLICT (usuario_id, data)
//       DO UPDATE SET pontos = EXCLUDED.pontos, percentual = EXCLUDED.percentual;
//   END;
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
// Table: fiscal_boleto_entries
//   trg_audit_fiscal_boleto_deletions: CREATE TRIGGER trg_audit_fiscal_boleto_deletions AFTER DELETE ON public.fiscal_boleto_entries FOR EACH ROW EXECUTE FUNCTION audit_fiscal_boleto_deletions()
// Table: fiscal_sales_entries
//   trg_audit_fiscal_sales_deletions: CREATE TRIGGER trg_audit_fiscal_sales_deletions AFTER DELETE ON public.fiscal_sales_entries FOR EACH ROW EXECUTE FUNCTION audit_fiscal_sales_deletions()
// Table: sac_records
//   trg_sync_sac_to_agenda: CREATE TRIGGER trg_sync_sac_to_agenda AFTER UPDATE ON public.sac_records FOR EACH ROW EXECUTE FUNCTION sync_sac_to_agenda()

// --- INDEXES ---
// Table: agenda_segmentation
//   CREATE UNIQUE INDEX agenda_segmentation_consultorio_id_day_of_week_shift_key ON public.agenda_segmentation USING btree (consultorio_id, day_of_week, shift)
// Table: cargos
//   CREATE UNIQUE INDEX cargos_nome_key ON public.cargos USING btree (nome)
// Table: chat_participants
//   CREATE UNIQUE INDEX chat_participants_room_id_user_id_key ON public.chat_participants USING btree (room_id, user_id)
// Table: departamentos
//   CREATE UNIQUE INDEX departamentos_nome_key ON public.departamentos USING btree (nome)
// Table: departments
//   CREATE UNIQUE INDEX departments_name_key ON public.departments USING btree (name)
// Table: fiscal_limit_configs
//   CREATE UNIQUE INDEX fiscal_limit_configs_company_month_year_idx ON public.fiscal_limit_configs USING btree (company_id, month, year)
// Table: hub_announcement_reads
//   CREATE UNIQUE INDEX hub_announcement_reads_user_id_announcement_id_key ON public.hub_announcement_reads USING btree (user_id, announcement_id)
// Table: kpis_permissoes
//   CREATE UNIQUE INDEX kpis_permissoes_cargo_id_kpi_id_key ON public.kpis_permissoes USING btree (cargo_id, kpi_id)
// Table: menus_sistema
//   CREATE UNIQUE INDEX menus_sistema_nome_key ON public.menus_sistema USING btree (nome)
// Table: monthly_readings
//   CREATE UNIQUE INDEX monthly_readings_user_month_key ON public.monthly_readings USING btree (user_id, reference_month)
// Table: permissoes_cargo
//   CREATE INDEX idx_permissoes_cargo_cargo_id ON public.permissoes_cargo USING btree (cargo_id)
//   CREATE INDEX idx_permissoes_cargo_menu_id ON public.permissoes_cargo USING btree (menu_id)
//   CREATE UNIQUE INDEX permissoes_cargo_cargo_menu_key ON public.permissoes_cargo USING btree (cargo_id, menu_id)
// Table: permissoes_usuario
//   CREATE INDEX idx_permissoes_usuario_menu_id ON public.permissoes_usuario USING btree (menu_id)
//   CREATE INDEX idx_permissoes_usuario_user_id ON public.permissoes_usuario USING btree (user_id)
//   CREATE UNIQUE INDEX permissoes_usuario_user_menu_key ON public.permissoes_usuario USING btree (user_id, menu_id)
// Table: profiles
//   CREATE INDEX idx_profiles_cargo_id ON public.profiles USING btree (cargo_id)
//   CREATE INDEX idx_profiles_departamento_id ON public.profiles USING btree (departamento_id)
//   CREATE UNIQUE INDEX profiles_cpf_key ON public.profiles USING btree (cpf)
// Table: role_permissions
//   CREATE INDEX idx_role_permissions_action_id ON public.role_permissions USING btree (action_id)
//   CREATE INDEX idx_role_permissions_role_id ON public.role_permissions USING btree (role_id)
//   CREATE UNIQUE INDEX role_permissions_role_action_key ON public.role_permissions USING btree (role_id, action_id)
// Table: roles
//   CREATE UNIQUE INDEX roles_name_key ON public.roles USING btree (name)
// Table: rotinas_execucao
//   CREATE UNIQUE INDEX rotinas_execucao_unique ON public.rotinas_execucao USING btree (rotina_id, usuario_id, data)
// Table: rotinas_pontos
//   CREATE UNIQUE INDEX rotinas_pontos_unique ON public.rotinas_pontos USING btree (usuario_id, data)
// Table: sac_records
//   CREATE INDEX sac_records_received_at_idx ON public.sac_records USING btree (received_at)
//   CREATE INDEX sac_records_status_idx ON public.sac_records USING btree (status)
// Table: ser_5s_submissions
//   CREATE UNIQUE INDEX ser_5s_unique_week ON public.ser_5s_submissions USING btree (user_id, reference_week)
// Table: sys_actions
//   CREATE INDEX idx_sys_actions_module ON public.sys_actions USING btree (module)
//   CREATE UNIQUE INDEX sys_actions_name_key ON public.sys_actions USING btree (name)
// Table: user_roles
//   CREATE INDEX idx_user_roles_role_id ON public.user_roles USING btree (role_id)
//   CREATE INDEX idx_user_roles_user_id ON public.user_roles USING btree (user_id)
//   CREATE UNIQUE INDEX user_roles_user_role_key ON public.user_roles USING btree (user_id, role_id)
// Table: work_schedules
//   CREATE UNIQUE INDEX work_schedules_employee_id_work_date_key ON public.work_schedules USING btree (employee_id, work_date)

