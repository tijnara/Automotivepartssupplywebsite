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
            products: {
                Row: {
                    id: number
                    name: string
                    category: string
                    brand: string | null
                    price: number
                    original_price: number | null
                    rating: number | null
                    reviews: number | null
                    in_stock: boolean
                    quantity: number
                    image: string
                    created_at: string
                }
                Insert: {
                    id?: number
                    name: string
                    category: string
                    brand?: string | null
                    price: number
                    original_price?: number | null
                    rating?: number | null
                    reviews?: number | null
                    in_stock?: boolean
                    quantity?: number
                    image: string
                    created_at?: string
                }
                Update: {
                    id?: number
                    name?: string
                    category?: string
                    brand?: string | null
                    price?: number
                    original_price?: number | null
                    rating?: number | null
                    reviews?: number | null
                    in_stock?: boolean
                    quantity?: number
                    image?: string
                    created_at?: string
                }
                Relationships: []
            }
            vehicles: {
                Row: {
                    id: number
                    make: string
                    model: string
                    year_start: number
                    year_end: number | null
                    created_at: string
                }
                Insert: {
                    id?: number
                    make: string
                    model: string
                    year_start: number
                    year_end?: number | null
                    created_at?: string
                }
                Update: {
                    id?: number
                    make?: string
                    model?: string
                    year_start?: number
                    year_end?: number | null
                    created_at?: string
                }
                Relationships: []
            }
            product_fitment: {
                Row: {
                    id: number
                    product_id: number
                    vehicle_id: number
                }
                Insert: {
                    id?: number
                    product_id: number
                    vehicle_id: number
                }
                Update: {
                    id?: number
                    product_id?: number
                    vehicle_id?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "product_fitment_product_id_fkey"
                        columns: ["product_id"]
                        isOneToOne: false
                        referencedRelation: "products"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "product_fitment_vehicle_id_fkey"
                        columns: ["vehicle_id"]
                        isOneToOne: false
                        referencedRelation: "vehicles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            inventory_transactions: {
                Row: {
                    id: number
                    product_id: number
                    quantity_change: number
                    transaction_type: string
                    notes: string | null
                    created_at: string
                }
                Insert: {
                    id?: number
                    product_id: number
                    quantity_change: number
                    transaction_type: string
                    notes?: string | null
                    created_at?: string
                }
                Update: {
                    id?: number
                    product_id?: number
                    quantity_change?: number
                    transaction_type?: string
                    notes?: string | null
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "inventory_transactions_product_id_fkey"
                        columns: ["product_id"]
                        isOneToOne: false
                        referencedRelation: "products"
                        referencedColumns: ["id"]
                    }
                ]
            }
            contact_messages: {
                Row: {
                    id: number
                    name: string
                    email: string
                    phone: string | null
                    message: string
                    status: string
                    created_at: string
                }
                Insert: {
                    id?: number
                    name: string
                    email: string
                    phone?: string | null
                    message: string
                    status?: string
                    created_at?: string
                }
                Update: {
                    id?: number
                    name?: string
                    email?: string
                    phone?: string | null
                    message?: string
                    status?: string
                    created_at?: string
                }
                Relationships: []
            }
            orders: {
                Row: {
                    id: number
                    customer_name: string
                    customer_email: string
                    customer_phone: string | null
                    total_amount: number
                    status: string
                    payment_status: string
                    created_at: string
                    shipping_address: string | null
                    shipping_method: string | null
                    payment_method: string | null
                    // ADDED COLUMNS
                    shipping_province: string | null
                    shipping_city: string | null
                }
                Insert: {
                    id?: number
                    customer_name: string
                    customer_email: string
                    customer_phone?: string | null
                    total_amount: number
                    status?: string
                    payment_status?: string
                    created_at?: string
                    shipping_address?: string | null
                    shipping_method?: string | null
                    payment_method?: string | null
                    // ADDED COLUMNS
                    shipping_province?: string | null
                    shipping_city?: string | null
                }
                Update: {
                    id?: number
                    customer_name?: string
                    customer_email?: string
                    customer_phone?: string | null
                    total_amount?: number
                    status?: string
                    payment_status?: string
                    created_at?: string
                    shipping_address?: string | null
                    shipping_method?: string | null
                    payment_method?: string | null
                    // ADDED COLUMNS
                    shipping_province?: string | null
                    shipping_city?: string | null
                }
                Relationships: []
            }
            order_items: {
                Row: {
                    id: number
                    order_id: number
                    product_id: number | null
                    quantity: number
                    price_at_purchase: number
                }
                Insert: {
                    id?: number
                    order_id: number
                    product_id?: number | null
                    quantity?: number
                    price_at_purchase: number
                }
                Update: {
                    id?: number
                    order_id?: number
                    product_id?: number | null
                    quantity?: number
                    price_at_purchase?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "order_items_order_id_fkey"
                        columns: ["order_id"]
                        isOneToOne: false
                        referencedRelation: "orders"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "order_items_product_id_fkey"
                        columns: ["product_id"]
                        isOneToOne: false
                        referencedRelation: "products"
                        referencedColumns: ["id"]
                    }
                ]
            }
            hero_slides: {
                Row: {
                    id: number
                    image_url: string
                    title: string | null
                    subtitle: string | null
                    is_active: boolean
                    created_at: string
                    title_color: string | null
                    title_size: string | null
                    subtitle_color: string | null
                    subtitle_size: string | null
                    text_align: string | null
                }
                Insert: {
                    id?: number
                    image_url: string
                    title?: string | null
                    subtitle?: string | null
                    is_active?: boolean
                    created_at?: string
                    title_color?: string | null
                    title_size?: string | null
                    subtitle_color?: string | null
                    subtitle_size?: string | null
                    text_align?: string | null
                }
                Update: {
                    id?: number
                    image_url?: string
                    title?: string | null
                    subtitle?: string | null
                    is_active?: boolean
                    created_at?: string
                    title_color?: string | null
                    title_size?: string | null
                    subtitle_color?: string | null
                    subtitle_size?: string | null
                    text_align?: string | null
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