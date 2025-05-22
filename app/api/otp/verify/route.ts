import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: Request) {
  try {
    const { phone, code } = await request.json()

    if (!phone || !code) {
      return NextResponse.json(
        { success: false, message: "Phone number and verification code are required" },
        { status: 400 },
      )
    }

    // Get the stored OTP for this phone number
    const { data, error } = await supabase
      .from("otp_codes")
      .select("*")
      .eq("phone", phone)
      .eq("code", code)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error || !data) {
      return NextResponse.json({ success: false, message: "Invalid or expired verification code" }, { status: 400 })
    }

    // Delete the used OTP
    await supabase.from("otp_codes").delete().eq("id", data.id)

    return NextResponse.json({ success: true, message: "Phone verified successfully" })
  } catch (error) {
    console.error("Error verifying OTP:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
