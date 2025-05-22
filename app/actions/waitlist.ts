"use server"

import { createClient } from "@supabase/supabase-js"
import { z } from "zod"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Form validation schema
const waitlistSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  phone: z.string().min(7, "Please enter a valid phone number"),
  verified: z.boolean().optional(),
})

type WaitlistEntry = z.infer<typeof waitlistSchema>

type ApiResult = {
  success: boolean
  message: string
}

// Subscribe to waitlist
export async function subscribeToWaitlist(entry: WaitlistEntry): Promise<ApiResult> {
  try {
    // Validate the entry
    const result = waitlistSchema.safeParse(entry)

    if (!result.success) {
      const errorMessage = result.error.issues[0]?.message || "Please check your information and try again"
      return {
        success: false,
        message: errorMessage,
      }
    }

    const { name, email, phone, verified } = entry

    // Check if phone verification is required but not done
    if (!verified) {
      return {
        success: false,
        message: "Phone verification required.",
      }
    }

    // Check for duplicate phone number
    const { data: existingPhone } = await supabase.from("waitlist").select("phone").eq("phone", phone).single()

    if (existingPhone) {
      return {
        success: false,
        message: "This phone number is already on our waitlist.",
      }
    }

    // Check for duplicate email if provided
    if (email) {
      const { data: existingEmail } = await supabase.from("waitlist").select("email").eq("email", email).single()

      if (existingEmail) {
        return {
          success: false,
          message: "This email is already on our waitlist.",
        }
      }
    }

    // Add to waitlist
    const { error } = await supabase.from("waitlist").insert({
      name,
      email: email || null,
      phone,
      created_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Error adding to waitlist:", error)
      return {
        success: false,
        message: "Failed to join waitlist. Please try again.",
      }
    }

    return {
      success: true,
      message: "Successfully joined the waitlist!",
    }
  } catch (error) {
    console.error("Error subscribing to waitlist:", error)
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    }
  }
}
