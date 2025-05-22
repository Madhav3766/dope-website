"use server"

import { z } from "zod"

// Form validation schema
const waitlistSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(7, "Please enter a valid phone number"),
})

type SubscribeResult = {
  success: boolean
  message: string
}

export async function subscribeToWaitlist(formData: FormData): Promise<SubscribeResult> {
  try {
    // Extract form data
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string

    // Validate form data
    const result = waitlistSchema.safeParse({ name, email, phone })

    if (!result.success) {
      const errorMessage = result.error.issues[0]?.message || "Please check your information and try again"
      return {
        success: false,
        message: errorMessage,
      }
    }

    // Here you would connect to your database
    // For example with Supabase, Neon, or another database

    // Example with a hypothetical database client:
    // await db.insert('waitlist', { name, email, phone, createdAt: new Date() })

    // For now, we'll just log it
    console.log("Saving to waitlist:", { name, email, phone })

    return {
      success: true,
      message: "Thank you for joining our waitlist!",
    }
  } catch (error) {
    console.error("Error saving to waitlist:", error)
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    }
  }
}
