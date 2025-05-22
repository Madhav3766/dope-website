import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: Request) {
  try {
    const { phone } = await request.json()

    if (!phone) {
      return NextResponse.json({ success: false, message: "Phone number is required" }, { status: 400 })
    }

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Store the OTP in Supabase for verification later
    const { error } = await supabase.from("otp_codes").insert({
      phone,
      code: otp,
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes expiry
    })

    if (error) {
      console.error("Error storing OTP:", error)
      return NextResponse.json({ success: false, message: "Failed to send verification code" }, { status: 500 })
    }

    // In production, you would integrate with Twilio, MessageBird, etc. to send the OTP via SMS
    console.log(`[SIMULATED] Sending OTP ${otp} to ${phone}`)

    return NextResponse.json({ success: true, message: "Verification code sent" })
  } catch (error) {
    console.error("Error sending OTP:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
