export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            products: {
                Row: {
                    id: number
                    name: string
                    category: string
                    price: number
                    original_price: number | null
                    rating: number | null
                    reviews: number | null
                    in_stock: boolean
                    image: string
                    created_at: string
                }
                Insert: {
                    id?: number
                    name: string
                    category: string
                    price: number
                    original_price?: number | null
                    rating?: number | null
                    reviews?: number | null
                    in_stock?: boolean
                    image: string
                    created_at?: string
                }
                Update: {
                    id?: number
                    name?: string
                    category?: string
                    price?: number
                    original_price?: number | null
                    rating?: number | null
                    reviews?: number | null
                    in_stock?: boolean
                    image?: string
                    created_at?: string
                }
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
            }
            orders: {
                Row: {
                    id: number
                    customer_name: string
                    customer_email: string
                    customer_phone: string | null
                    total_amount: number
                    status: string
                    created_at: string
                }
                Insert: {
                    id?: number
                    customer_name: string
                    customer_email: string
                    customer_phone?: string | null
                    total_amount: number
                    status?: string
                    created_at?: string
                }
                Update: {
                    id?: number
                    customer_name?: string
                    customer_email?: string
                    customer_phone?: string | null
                    total_amount?: number
                    status?: string
                    created_at?: string
                }
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
            }
        }
    }
}