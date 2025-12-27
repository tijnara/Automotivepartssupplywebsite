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
                    brand: string | null // Added
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
                    brand?: string | null // Added
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
                    brand?: string | null // Added
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