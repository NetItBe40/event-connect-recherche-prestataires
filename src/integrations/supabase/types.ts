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
      apikeys: {
        Row: {
          apikey: string | null
          created_at: string
          id: number
          provider: string | null
        }
        Insert: {
          apikey?: string | null
          created_at?: string
          id?: number
          provider?: string | null
        }
        Update: {
          apikey?: string | null
          created_at?: string
          id?: number
          provider?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      place_subcategories: {
        Row: {
          place_id: string
          subcategory_id: string
        }
        Insert: {
          place_id: string
          subcategory_id: string
        }
        Update: {
          place_id?: string
          subcategory_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "place_subcategories_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "place_subcategories_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      places: {
        Row: {
          address: string
          city: string | null
          created_at: string
          description: string | null
          description2: string | null
          email_1: string | null
          email_2: string | null
          facebook: string | null
          github: string | null
          id: string
          instagram: string | null
          latitude: number | null
          linkedin: string | null
          longitude: number | null
          opening_hours: Json | null
          phone: string | null
          photobing1: string | null
          photos: string | null
          pinterest: string | null
          place_id: string | null
          place_link: string | null
          price_level: string | null
          rating: string | null
          reviews: string | null
          snapchat: string | null
          state: string | null
          tiktok: string | null
          timezone: string | null
          title: string
          twitter: string | null
          type: string | null
          verified: boolean | null
          website: string | null
          youtube: string | null
        }
        Insert: {
          address: string
          city?: string | null
          created_at?: string
          description?: string | null
          description2?: string | null
          email_1?: string | null
          email_2?: string | null
          facebook?: string | null
          github?: string | null
          id?: string
          instagram?: string | null
          latitude?: number | null
          linkedin?: string | null
          longitude?: number | null
          opening_hours?: Json | null
          phone?: string | null
          photobing1?: string | null
          photos?: string | null
          pinterest?: string | null
          place_id?: string | null
          place_link?: string | null
          price_level?: string | null
          rating?: string | null
          reviews?: string | null
          snapchat?: string | null
          state?: string | null
          tiktok?: string | null
          timezone?: string | null
          title: string
          twitter?: string | null
          type?: string | null
          verified?: boolean | null
          website?: string | null
          youtube?: string | null
        }
        Update: {
          address?: string
          city?: string | null
          created_at?: string
          description?: string | null
          description2?: string | null
          email_1?: string | null
          email_2?: string | null
          facebook?: string | null
          github?: string | null
          id?: string
          instagram?: string | null
          latitude?: number | null
          linkedin?: string | null
          longitude?: number | null
          opening_hours?: Json | null
          phone?: string | null
          photobing1?: string | null
          photos?: string | null
          pinterest?: string | null
          place_id?: string | null
          place_link?: string | null
          price_level?: string | null
          rating?: string | null
          reviews?: string | null
          snapchat?: string | null
          state?: string | null
          tiktok?: string | null
          timezone?: string | null
          title?: string
          twitter?: string | null
          type?: string | null
          verified?: boolean | null
          website?: string | null
          youtube?: string | null
        }
        Relationships: []
      }
      subcategories: {
        Row: {
          category_id: string | null
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_secret: {
        Args: {
          secret_name: string
        }
        Returns: {
          secret: string
        }[]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
