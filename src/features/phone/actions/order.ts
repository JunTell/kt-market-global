"use server"

import { createClient } from "@/shared/api/supabase/server"
import { updateTag } from "next/cache"
import { z } from "zod"

const OrderSchema = z.object({
    company: z.string(),
    device: z.string(),
    capacity: z.string(),
    color: z.string(),
    name: z.string(),
    birthday: z.string(),
    phone: z.string(),
    funnel: z.string().optional(),
    country: z.string(),
    plan_name: z.string(),
    join_type: z.string(),
    contract: z.string(),
    discount_type: z.string(),
    requirements: z.string().optional().nullable(),
    form_data: z.any(), // Storing the full JSON payload
})

export type OrderState = {
    message?: string
    error?: string
    success?: boolean
}

export async function submitOrder(
    prevState: OrderState,
    formData: z.infer<typeof OrderSchema>
): Promise<OrderState> {
    const supabase = await createClient()

    // Validate fields
    const validatedFields = OrderSchema.safeParse(formData)

    if (!validatedFields.success) {
        return {
            error: "Invalid fields: " + validatedFields.error.message,
            success: false,
        }
    }

    const { data } = validatedFields

    try {
        const { error } = await supabase.from("foreigner_order").insert([
            {
                company: data.company,
                device: data.device,
                capacity: data.capacity,
                color: data.color,
                name: data.name,
                birthday: data.birthday,
                phone: data.phone,
                funnel: data.funnel,
                is_agreed_tos: true,
                country: data.country,
                plan_name: data.plan_name,
                join_type: data.join_type,
                contract: data.contract,
                discount_type: data.discount_type,
                requirements: data.requirements,
                form_data: data.form_data,
            },
        ])

        if (error) {
            console.error("Supabase Insert Error:", error)
            throw new Error("Database Error: " + error.message)
        }

        // Invalidate cache if there's any dashboard or list viewing orders
        // Using updateTag from Next.js 16 for immediate consistency if applicable
        updateTag("orders-list")

        return {
            success: true,
            message: "Order submitted successfully",
        }
    } catch (error) {
        console.error("Submit Error:", error)
        return {
            error: error instanceof Error ? error.message : "Unknown error occurred",
            success: false,
        }
    }
}
