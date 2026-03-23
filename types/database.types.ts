/**
 * Tipos TypeScript gerados a partir do schema do Supabase — Raízes
 *
 * Para regenerar após alterações no banco:
 * npm run db:types
 *
 * (Requer: supabase CLI autenticado)
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "12.2.3";
  };
  public: {
    Tables: {
      banners: {
        Row: {
          id: string;
          section: string;
          image_desktop_url: string | null;
          image_mobile_url: string | null;
          link_url: string | null;
          active: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          section: string;
          image_desktop_url?: string | null;
          image_mobile_url?: string | null;
          link_url?: string | null;
          active?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          section?: string;
          image_desktop_url?: string | null;
          image_mobile_url?: string | null;
          link_url?: string | null;
          active?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          image_url: string | null;
          description: string | null;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          image_url?: string | null;
          description?: string | null;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          image_url?: string | null;
          description?: string | null;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number;
          stock_quantity: number;
          category_id: string | null;
          images_urls: string[] | null;
          metadata: Json | null;
          status: "draft" | "published";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          price: number;
          stock_quantity?: number;
          category_id?: string | null;
          images_urls?: string[] | null;
          metadata?: Json | null;
          status?: "draft" | "published";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          price?: number;
          stock_quantity?: number;
          category_id?: string | null;
          images_urls?: string[] | null;
          metadata?: Json | null;
          status?: "draft" | "published";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          }
        ];
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          status: "pending" | "paid" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
          total_amount: number;
          shipping_cost: number;
          tracking_code: string | null;
          customer_name: string | null;
          customer_email: string | null;
          customer_phone: string | null;
          customer_cpf: string | null;
          address_cep: string | null;
          address_street: string | null;
          address_number: string | null;
          address_complement: string | null;
          address_neighborhood: string | null;
          address_city: string | null;
          address_state: string | null;
          shipping_service: string | null;
          payment_link: string | null;
          payment_id: string | null;
          checkout_slug: string | null;
          melhor_envio_shipment_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          status?: "pending" | "paid" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
          total_amount: number;
          shipping_cost?: number;
          tracking_code?: string | null;
          customer_name?: string | null;
          customer_email?: string | null;
          customer_phone?: string | null;
          customer_cpf?: string | null;
          address_cep?: string | null;
          address_street?: string | null;
          address_number?: string | null;
          address_complement?: string | null;
          address_neighborhood?: string | null;
          address_city?: string | null;
          address_state?: string | null;
          shipping_service?: string | null;
          payment_link?: string | null;
          payment_id?: string | null;
          checkout_slug?: string | null;
          melhor_envio_shipment_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          status?: "pending" | "paid" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
          total_amount?: number;
          shipping_cost?: number;
          tracking_code?: string | null;
          customer_name?: string | null;
          customer_email?: string | null;
          customer_phone?: string | null;
          customer_cpf?: string | null;
          address_cep?: string | null;
          address_street?: string | null;
          address_number?: string | null;
          address_complement?: string | null;
          address_neighborhood?: string | null;
          address_city?: string | null;
          address_state?: string | null;
          shipping_service?: string | null;
          payment_link?: string | null;
          payment_id?: string | null;
          checkout_slug?: string | null;
          melhor_envio_shipment_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
          size: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
          size?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          quantity?: number;
          unit_price?: number;
          size?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, {
      Row: Record<string, unknown>;
      Relationships: {
        foreignKeyName: string;
        columns: string[];
        referencedRelation: string;
        referencedColumns: string[];
      }[];
    }>;
    Functions: Record<string, {
      Args: Record<string, unknown>;
      Returns: unknown;
    }>;
    Enums: {
      product_status: "draft" | "published";
      order_status:
        | "pending"
        | "paid"
        | "confirmed"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled"
        | "refunded";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// ---- Helper types ----

type PublicSchema = Database["public"];

export type Tables<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Row"];

export type TablesInsert<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Insert"];

export type TablesUpdate<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Update"];

export type Enums<T extends keyof PublicSchema["Enums"]> =
  PublicSchema["Enums"][T];

// ---- Domain types (aliases legíveis) ----

export type Banner = Tables<"banners">;
export type BannerInsert = TablesInsert<"banners">;
export type BannerUpdate = TablesUpdate<"banners">;

export type Category = Tables<"categories">;
export type CategoryInsert = TablesInsert<"categories">;
export type CategoryUpdate = TablesUpdate<"categories">;

export type Product = Tables<"products">;
export type ProductInsert = TablesInsert<"products">;
export type ProductUpdate = TablesUpdate<"products">;
export type ProductStatus = Enums<"product_status">;

export type Order = Tables<"orders">;
export type OrderInsert = TablesInsert<"orders">;
export type OrderUpdate = TablesUpdate<"orders">;
export type OrderStatus = Enums<"order_status">;

export type OrderItem = Tables<"order_items">;
export type OrderItemInsert = TablesInsert<"order_items">;
export type OrderItemUpdate = TablesUpdate<"order_items">;

// ---- Tipos compostos para UI ----

export type ProductWithCategory = Product & {
  categories: Category | null;
};

export type OrderWithItems = Order & {
  order_items: (OrderItem & {
    products: Product | null;
  })[];
};
