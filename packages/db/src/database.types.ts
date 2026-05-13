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
      admin_users: {
        Row: {
          created_at: string
          display_name: string | null
          email: string
          id: string
          role: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email: string
          id: string
          role?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string
          id?: string
          role?: string
        }
        Relationships: []
      }
      api_quota_log: {
        Row: {
          calls_used: number
          day: string
          endpoint: string
          errors: number
          id: number
          store_slug: string
        }
        Insert: {
          calls_used?: number
          day?: string
          endpoint: string
          errors?: number
          id?: number
          store_slug: string
        }
        Update: {
          calls_used?: number
          day?: string
          endpoint?: string
          errors?: number
          id?: number
          store_slug?: string
        }
        Relationships: []
      }
      banned_users: {
        Row: {
          banned_at: string
          banned_by: string | null
          reason: string | null
          telegram_user_id: number
        }
        Insert: {
          banned_at?: string
          banned_by?: string | null
          reason?: string | null
          telegram_user_id: number
        }
        Update: {
          banned_at?: string
          banned_by?: string | null
          reason?: string | null
          telegram_user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "banned_users_banned_by_fkey"
            columns: ["banned_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      channels: {
        Row: {
          active: boolean
          config: Json
          created_at: string
          discussion_chat_id: string | null
          display_name: string | null
          id: string
          platform: string
          slug: string
          telegram_chat_id: string
        }
        Insert: {
          active?: boolean
          config?: Json
          created_at?: string
          discussion_chat_id?: string | null
          display_name?: string | null
          id?: string
          platform?: string
          slug: string
          telegram_chat_id: string
        }
        Update: {
          active?: boolean
          config?: Json
          created_at?: string
          discussion_chat_id?: string | null
          display_name?: string | null
          id?: string
          platform?: string
          slug?: string
          telegram_chat_id?: string
        }
        Relationships: []
      }
      coupons: {
        Row: {
          active: boolean
          applicable_categories: string[] | null
          applicable_product_ids: string[] | null
          code: string
          created_at: string
          description: string | null
          discount_percent: number | null
          discount_value_cents: number | null
          id: string
          max_discount_cents: number | null
          min_order_value_cents: number | null
          raw: Json | null
          scope: string
          source: string | null
          store_seller_id: string | null
          store_slug: string
          type: string
          updated_at: string
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          active?: boolean
          applicable_categories?: string[] | null
          applicable_product_ids?: string[] | null
          code: string
          created_at?: string
          description?: string | null
          discount_percent?: number | null
          discount_value_cents?: number | null
          id?: string
          max_discount_cents?: number | null
          min_order_value_cents?: number | null
          raw?: Json | null
          scope: string
          source?: string | null
          store_seller_id?: string | null
          store_slug: string
          type: string
          updated_at?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          active?: boolean
          applicable_categories?: string[] | null
          applicable_product_ids?: string[] | null
          code?: string
          created_at?: string
          description?: string | null
          discount_percent?: number | null
          discount_value_cents?: number | null
          id?: string
          max_discount_cents?: number | null
          min_order_value_cents?: number | null
          raw?: Json | null
          scope?: string
          source?: string | null
          store_seller_id?: string | null
          store_slug?: string
          type?: string
          updated_at?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coupons_store_slug_fkey"
            columns: ["store_slug"]
            isOneToOne: false
            referencedRelation: "store_configs"
            referencedColumns: ["slug"]
          },
        ]
      }
      curation_blacklist: {
        Row: {
          created_at: string
          id: string
          pattern: string
          pattern_type: string
          reason: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          pattern: string
          pattern_type: string
          reason?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          pattern?: string
          pattern_type?: string
          reason?: string | null
        }
        Relationships: []
      }
      discovery_queries: {
        Row: {
          active: boolean
          cooldown_until: string | null
          created_at: string
          id: string
          label: string
          last_error: string | null
          last_run_at: string | null
          params: Json
          priority: number
          store_slug: string
        }
        Insert: {
          active?: boolean
          cooldown_until?: string | null
          created_at?: string
          id?: string
          label: string
          last_error?: string | null
          last_run_at?: string | null
          params: Json
          priority?: number
          store_slug: string
        }
        Update: {
          active?: boolean
          cooldown_until?: string | null
          created_at?: string
          id?: string
          label?: string
          last_error?: string | null
          last_run_at?: string | null
          params?: Json
          priority?: number
          store_slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "discovery_queries_store_slug_fkey"
            columns: ["store_slug"]
            isOneToOne: false
            referencedRelation: "store_configs"
            referencedColumns: ["slug"]
          },
        ]
      }
      job_queue: {
        Row: {
          attempts: number
          completed_at: string | null
          created_at: string
          failed_at: string | null
          id: number
          kind: string
          last_error: string | null
          locked_at: string | null
          locked_by: string | null
          max_attempts: number
          payload: Json
          priority: number
          result: Json | null
          scheduled_for: string
          status: string
        }
        Insert: {
          attempts?: number
          completed_at?: string | null
          created_at?: string
          failed_at?: string | null
          id?: number
          kind: string
          last_error?: string | null
          locked_at?: string | null
          locked_by?: string | null
          max_attempts?: number
          payload: Json
          priority?: number
          result?: Json | null
          scheduled_for?: string
          status?: string
        }
        Update: {
          attempts?: number
          completed_at?: string | null
          created_at?: string
          failed_at?: string | null
          id?: number
          kind?: string
          last_error?: string | null
          locked_at?: string | null
          locked_by?: string | null
          max_attempts?: number
          payload?: Json
          priority?: number
          result?: Json | null
          scheduled_for?: string
          status?: string
        }
        Relationships: []
      }
      offers: {
        Row: {
          affiliate_url: string | null
          applied_coupon_codes: string[] | null
          approved_at: string | null
          approved_by: string | null
          coin_discount_cents: number | null
          created_at: string
          curation_breakdown: Json | null
          curation_score: number | null
          custom_caption: string | null
          custom_metadata: Json | null
          discount_percent: number | null
          expires_at: string | null
          final_price_cents: number | null
          id: string
          is_lowest_30d: boolean | null
          is_lowest_90d: boolean | null
          original_price_cents: number | null
          price_cents: number
          product_id: string
          rejection_reason: string | null
          status: string
          store_slug: string
          updated_at: string
        }
        Insert: {
          affiliate_url?: string | null
          applied_coupon_codes?: string[] | null
          approved_at?: string | null
          approved_by?: string | null
          coin_discount_cents?: number | null
          created_at?: string
          curation_breakdown?: Json | null
          curation_score?: number | null
          custom_caption?: string | null
          custom_metadata?: Json | null
          discount_percent?: number | null
          expires_at?: string | null
          final_price_cents?: number | null
          id?: string
          is_lowest_30d?: boolean | null
          is_lowest_90d?: boolean | null
          original_price_cents?: number | null
          price_cents: number
          product_id: string
          rejection_reason?: string | null
          status?: string
          store_slug: string
          updated_at?: string
        }
        Update: {
          affiliate_url?: string | null
          applied_coupon_codes?: string[] | null
          approved_at?: string | null
          approved_by?: string | null
          coin_discount_cents?: number | null
          created_at?: string
          curation_breakdown?: Json | null
          curation_score?: number | null
          custom_caption?: string | null
          custom_metadata?: Json | null
          discount_percent?: number | null
          expires_at?: string | null
          final_price_cents?: number | null
          id?: string
          is_lowest_30d?: boolean | null
          is_lowest_90d?: boolean | null
          original_price_cents?: number | null
          price_cents?: number
          product_id?: string
          rejection_reason?: string | null
          status?: string
          store_slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "offers_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          affiliate_url: string | null
          caption: string
          channel_id: string
          deleted_at: string | null
          forwards_count: number | null
          id: string
          kind: string
          metadata: Json | null
          metrics_updated_at: string | null
          offer_id: string | null
          photo_url: string | null
          product_id: string | null
          published_at: string
          telegram_message_id: number | null
          telegram_thread_id: number | null
          views_count: number | null
        }
        Insert: {
          affiliate_url?: string | null
          caption: string
          channel_id: string
          deleted_at?: string | null
          forwards_count?: number | null
          id?: string
          kind?: string
          metadata?: Json | null
          metrics_updated_at?: string | null
          offer_id?: string | null
          photo_url?: string | null
          product_id?: string | null
          published_at?: string
          telegram_message_id?: number | null
          telegram_thread_id?: number | null
          views_count?: number | null
        }
        Update: {
          affiliate_url?: string | null
          caption?: string
          channel_id?: string
          deleted_at?: string | null
          forwards_count?: number | null
          id?: string
          kind?: string
          metadata?: Json | null
          metrics_updated_at?: string | null
          offer_id?: string | null
          photo_url?: string | null
          product_id?: string | null
          published_at?: string
          telegram_message_id?: number | null
          telegram_thread_id?: number | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      price_history: {
        Row: {
          final_price_cents: number | null
          id: number
          observed_at: string
          price_cents: number
          product_id: string
          raw_snapshot: Json | null
          source: string
        }
        Insert: {
          final_price_cents?: number | null
          id?: number
          observed_at?: string
          price_cents: number
          product_id: string
          raw_snapshot?: Json | null
          source?: string
        }
        Update: {
          final_price_cents?: number | null
          id?: number
          observed_at?: string
          price_cents?: number
          product_id?: string
          raw_snapshot?: Json | null
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "price_history_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand: string | null
          cached_image_path: string | null
          category_path: string[]
          deleted_at: string | null
          description: string | null
          external_id: string
          first_seen_at: string
          id: string
          image_urls: string[]
          last_seen_at: string
          orders_count: number | null
          promotions: Json | null
          rating_avg: number | null
          rating_count: number | null
          raw: Json | null
          seller_country: string | null
          seller_name: string | null
          seller_rating: number | null
          shipping: Json | null
          store_slug: string
          title: string
          url: string
          video_url: string | null
        }
        Insert: {
          brand?: string | null
          cached_image_path?: string | null
          category_path?: string[]
          deleted_at?: string | null
          description?: string | null
          external_id: string
          first_seen_at?: string
          id?: string
          image_urls?: string[]
          last_seen_at?: string
          orders_count?: number | null
          promotions?: Json | null
          rating_avg?: number | null
          rating_count?: number | null
          raw?: Json | null
          seller_country?: string | null
          seller_name?: string | null
          seller_rating?: number | null
          shipping?: Json | null
          store_slug: string
          title: string
          url: string
          video_url?: string | null
        }
        Update: {
          brand?: string | null
          cached_image_path?: string | null
          category_path?: string[]
          deleted_at?: string | null
          description?: string | null
          external_id?: string
          first_seen_at?: string
          id?: string
          image_urls?: string[]
          last_seen_at?: string
          orders_count?: number | null
          promotions?: Json | null
          rating_avg?: number | null
          rating_count?: number | null
          raw?: Json | null
          seller_country?: string | null
          seller_name?: string | null
          seller_rating?: number | null
          shipping?: Json | null
          store_slug?: string
          title?: string
          url?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_store_slug_fkey"
            columns: ["store_slug"]
            isOneToOne: false
            referencedRelation: "store_configs"
            referencedColumns: ["slug"]
          },
        ]
      }
      publisher_config: {
        Row: {
          coupon_post_frequency_hours: number
          diversity_window: number
          id: number
          max_posts_per_day: number
          max_posts_per_hour: number
          max_same_category_in_window: number
          min_interval_minutes: number
          posting_hours: Json
          updated_at: string
        }
        Insert: {
          coupon_post_frequency_hours?: number
          diversity_window?: number
          id?: number
          max_posts_per_day?: number
          max_posts_per_hour?: number
          max_same_category_in_window?: number
          min_interval_minutes?: number
          posting_hours?: Json
          updated_at?: string
        }
        Update: {
          coupon_post_frequency_hours?: number
          diversity_window?: number
          id?: number
          max_posts_per_day?: number
          max_posts_per_hour?: number
          max_same_category_in_window?: number
          min_interval_minutes?: number
          posting_hours?: Json
          updated_at?: string
        }
        Relationships: []
      }
      store_configs: {
        Row: {
          active: boolean
          api_credentials: Json | null
          config: Json | null
          created_at: string
          curation_weights: Json
          daily_api_budget: number | null
          display_name: string
          scraper_enabled: boolean | null
          slug: string
          thresholds: Json
          updated_at: string
        }
        Insert: {
          active?: boolean
          api_credentials?: Json | null
          config?: Json | null
          created_at?: string
          curation_weights?: Json
          daily_api_budget?: number | null
          display_name: string
          scraper_enabled?: boolean | null
          slug: string
          thresholds?: Json
          updated_at?: string
        }
        Update: {
          active?: boolean
          api_credentials?: Json | null
          config?: Json | null
          created_at?: string
          curation_weights?: Json
          daily_api_budget?: number | null
          display_name?: string
          scraper_enabled?: boolean | null
          slug?: string
          thresholds?: Json
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      bytea_to_text: { Args: { data: string }; Returns: string }
      claim_jobs: {
        Args: { p_kind: string; p_limit: number; p_worker: string }
        Returns: {
          attempts: number
          completed_at: string | null
          created_at: string
          failed_at: string | null
          id: number
          kind: string
          last_error: string | null
          locked_at: string | null
          locked_by: string | null
          max_attempts: number
          payload: Json
          priority: number
          result: Json | null
          scheduled_for: string
          status: string
        }[]
        SetofOptions: {
          from: "*"
          to: "job_queue"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      complete_job: {
        Args: { p_job_id: number; p_result?: Json }
        Returns: undefined
      }
      current_admin_role: { Args: never; Returns: string }
      fail_job: {
        Args: { p_error: string; p_job_id: number }
        Returns: undefined
      }
      http: {
        Args: { request: Database["public"]["CompositeTypes"]["http_request"] }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
        SetofOptions: {
          from: "http_request"
          to: "http_response"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      http_delete:
        | {
            Args: { uri: string }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
            SetofOptions: {
              from: "*"
              to: "http_response"
              isOneToOne: true
              isSetofReturn: false
            }
          }
        | {
            Args: { content: string; content_type: string; uri: string }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
            SetofOptions: {
              from: "*"
              to: "http_response"
              isOneToOne: true
              isSetofReturn: false
            }
          }
      http_get:
        | {
            Args: { uri: string }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
            SetofOptions: {
              from: "*"
              to: "http_response"
              isOneToOne: true
              isSetofReturn: false
            }
          }
        | {
            Args: { data: Json; uri: string }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
            SetofOptions: {
              from: "*"
              to: "http_response"
              isOneToOne: true
              isSetofReturn: false
            }
          }
      http_head: {
        Args: { uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
        SetofOptions: {
          from: "*"
          to: "http_response"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      http_header: {
        Args: { field: string; value: string }
        Returns: Database["public"]["CompositeTypes"]["http_header"]
        SetofOptions: {
          from: "*"
          to: "http_header"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      http_list_curlopt: {
        Args: never
        Returns: {
          curlopt: string
          value: string
        }[]
      }
      http_patch: {
        Args: { content: string; content_type: string; uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
        SetofOptions: {
          from: "*"
          to: "http_response"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      http_post:
        | {
            Args: { content: string; content_type: string; uri: string }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
            SetofOptions: {
              from: "*"
              to: "http_response"
              isOneToOne: true
              isSetofReturn: false
            }
          }
        | {
            Args: { data: Json; uri: string }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
            SetofOptions: {
              from: "*"
              to: "http_response"
              isOneToOne: true
              isSetofReturn: false
            }
          }
      http_put: {
        Args: { content: string; content_type: string; uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
        SetofOptions: {
          from: "*"
          to: "http_response"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      http_reset_curlopt: { Args: never; Returns: boolean }
      http_set_curlopt: {
        Args: { curlopt: string; value: string }
        Returns: boolean
      }
      is_authenticated_admin: { Args: never; Returns: boolean }
      is_curator_or_above: { Args: never; Returns: boolean }
      is_super_admin: { Args: never; Returns: boolean }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      text_to_bytea: { Args: { data: string }; Returns: string }
      urlencode:
        | { Args: { data: Json }; Returns: string }
        | {
            Args: { string: string }
            Returns: {
              error: true
            } & "Could not choose the best candidate function between: public.urlencode(string => bytea), public.urlencode(string => varchar). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
          }
        | {
            Args: { string: string }
            Returns: {
              error: true
            } & "Could not choose the best candidate function between: public.urlencode(string => bytea), public.urlencode(string => varchar). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
          }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      http_header: {
        field: string | null
        value: string | null
      }
      http_request: {
        method: unknown
        uri: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content_type: string | null
        content: string | null
      }
      http_response: {
        status: number | null
        content_type: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content: string | null
      }
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
