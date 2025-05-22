"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { X, ArrowLeft, Check, Loader2 } from "lucide-react"
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth"
import { auth } from "@/app/firebase"
import { subscribeToWaitlist } from "@/app/actions/waitlist"
import PhoneInput from "./phone-input"

// Form steps
enum FormStep {
  INITIAL_INFO = 0,
  VERIFY_PHONE = 1,
  SUCCESS = 2,
}

export default function WaitlistSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.3 })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formStep, setFormStep] = useState<FormStep>(FormStep.INITIAL_INFO)
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<any>(null)
  const [confirmationResult, setConfirmationResult] = useState<any>(null)
  const recaptchaContainerRef = useRef<HTMLDivElement>(null)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })

  const [otpCode, setOtpCode] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [isError, setIsError] = useState(false)
  const [mascotSrc, setMascotSrc] = useState("/images/mascot.png")
  const [mascotError, setMascotError] = useState(false)
  const [otpResendTimer, setOtpResendTimer] = useState(0)
  const [isPhoneValid, setIsPhoneValid] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePhoneChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      phone: value,
    }))

    // Validate Indian phone number
    const isValid = validateIndianPhoneNumber(value)
    setIsPhoneValid(isValid)
  }

  // Validate Indian phone number
  const validateIndianPhoneNumber = (phone: string): boolean => {
    if (!phone) return false

    // Must start with +91 and have 10 digits after that
    const regex = /^\+91[1-9]\d{9}$/
    return regex.test(phone.replace(/\s/g, ""))
  }

  // Initialize reCAPTCHA when modal opens
  useEffect(() => {
    if (isModalOpen && recaptchaContainerRef.current && !recaptchaVerifier) {
      try {
        const verifier = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
          size: "invisible",
          callback: () => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
            console.log("reCAPTCHA verified")
          },
          "expired-callback": () => {
            // Response expired. Ask user to solve reCAPTCHA again.
            console.log("reCAPTCHA expired")
            setMessage("Verification expired. Please try again.")
            setIsError(true)
          },
        })
        setRecaptchaVerifier(verifier)
      } catch (error) {
        console.error("Error initializing reCAPTCHA:", error)
      }
    }

    return () => {
      // Clean up reCAPTCHA when modal closes
      if (!isModalOpen && recaptchaVerifier) {
        recaptchaVerifier.clear()
        setRecaptchaVerifier(null)
      }
    }
  }, [isModalOpen, recaptchaVerifier])

  // Try different paths for mascot
  useEffect(() => {
    const checkImage = async (path: string): Promise<boolean> => {
      try {
        const response = await fetch(path, { method: "HEAD" })
        return response.ok
      } catch {
        return false
      }
    }

    const tryMascotPaths = async () => {
      // Only try alternative paths if the initial one failed
      if (mascotError) {
        // List of possible paths to try
        const paths = [
          "/mascot.png",
          "/public/images/mascot.png",
          "/public/mascot.png",
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mascot-dope-7qK3bNLPkqYD6KETodBDLALiMSsdtR.png", // Direct blob URL as last resort
        ]

        for (const path of paths) {
          const exists = await checkImage(path)
          if (exists) {
            setMascotSrc(path)
            setMascotError(false)
            break
          }
        }
      }
    }

    tryMascotPaths()
  }, [mascotError])

  // OTP resend timer
  useEffect(() => {
    if (otpResendTimer > 0) {
      const timer = setTimeout(() => {
        setOtpResendTimer(otpResendTimer - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [otpResendTimer])

  // Close modal when escape key is pressed
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        handleCloseModal()
      }
    }

    document.addEventListener("keydown", handleEscapeKey)
    return () => document.removeEventListener("keydown", handleEscapeKey)
  }, [isModalOpen])

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isModalOpen])

  const handleCloseModal = () => {
    setIsModalOpen(false)
    // Reset form state
    setFormStep(FormStep.INITIAL_INFO)
    setFormData({ name: "", email: "", phone: "" })
    setOtpCode("")
    setMessage("")
    setIsError(false)
    setConfirmationResult(null)
    setIsPhoneValid(false)
  }

  const handleSendOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!formData.phone || !formData.name || isSubmitting || !recaptchaVerifier || !isPhoneValid) return

    setIsSubmitting(true)
    setMessage("")
    setIsError(false)

    try {
      // Format phone number (ensure it has no spaces)
      const phoneNumber = formData.phone.replace(/\s/g, "")

      // Send OTP via Firebase
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
      setConfirmationResult(confirmation)
      setFormStep(FormStep.VERIFY_PHONE)
      setOtpResendTimer(30) // 30 seconds cooldown
      setMessage("Verification code sent!")
    } catch (error: any) {
      console.error("Error sending OTP:", error)
      setIsError(true)
      setMessage(error.message || "Failed to send verification code. Please try again.")

      // Reset reCAPTCHA if there was an error
      if (recaptchaVerifier) {
        recaptchaVerifier.clear()
        setRecaptchaVerifier(null)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!otpCode || isSubmitting || !confirmationResult) return

    setIsSubmitting(true)
    setMessage("")
    setIsError(false)

    try {
      // Verify OTP via Firebase
      await confirmationResult.confirm(otpCode)

      // OTP verified, now submit to waitlist
      const waitlistResult = await subscribeToWaitlist({
        name: formData.name,
        email: formData.email || "",
        phone: formData.phone.replace(/\s/g, ""), // Remove spaces
        verified: true,
      })

      if (waitlistResult.success) {
        setFormStep(FormStep.SUCCESS)
      } else {
        setIsError(true)
        setMessage(waitlistResult.message)
      }
    } catch (error: any) {
      console.error("Error verifying OTP:", error)
      setIsError(true)
      setMessage(error.message || "Invalid verification code. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendOTP = async () => {
    if (otpResendTimer > 0 || isSubmitting || !recaptchaVerifier || !isPhoneValid) return

    setIsSubmitting(true)
    setMessage("")
    setIsError(false)

    try {
      // Format phone number (ensure it has no spaces)
      const phoneNumber = formData.phone.replace(/\s/g, "")

      // Resend OTP via Firebase
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
      setConfirmationResult(confirmation)
      setOtpResendTimer(30) // 30 seconds cooldown
      setMessage("Verification code resent!")
    } catch (error: any) {
      console.error("Error resending OTP:", error)
      setIsError(true)
      setMessage(error.message || "Failed to resend code. Please try again.")

      // Reset reCAPTCHA if there was an error
      if (recaptchaVerifier) {
        recaptchaVerifier.clear()
        setRecaptchaVerifier(null)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div ref={ref} className="w-full flex flex-col items-center justify-center px-4 text-center">
      <div className="max-w-6xl mx-auto w-full bg-zinc-900/30 backdrop-blur-sm rounded-xl p-8 md:p-12 border border-zinc-800/30">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: isInView ? 0 : 30, opacity: isInView ? 1 : 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 md:mb-8 relative z-10"
        >
          <div className="relative w-16 h-16 md:w-20 md:h-20 mx-auto">
            {mascotError ? (
              // Fallback to a simple circle if all image attempts fail
              <div className="h-full w-full rounded-full bg-red-500 flex items-center justify-center">
                <span className="text-xl md:text-2xl font-bold text-white font-headline">D</span>
              </div>
            ) : (
              <img
                src={mascotSrc || "/placeholder.svg"}
                alt="DOPE Mascot"
                className="w-full h-full object-contain"
                onError={() => {
                  console.log("Waitlist mascot failed to load, trying alternatives")
                  setMascotError(true)
                }}
              />
            )}
          </div>
        </motion.div>

        {/* Explicitly added font-headline (Oswald) class to ensure it uses the correct font */}
        <motion.h2
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: isInView ? 0 : 30, opacity: isInView ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 font-headline relative z-10"
          style={{ fontFamily: "var(--font-oswald)" }} /* Inline style as additional assurance */
        >
          JOIN THE <span className="text-red-500">WAITLIST</span>
        </motion.h2>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: isInView ? 0 : 30, opacity: isInView ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base md:text-xl max-w-2xl mb-8 md:mb-10 font-body relative z-10 mx-auto"
        >
          Be the first to know. Early access. Exclusive drops. No noise — just the good stuff.
        </motion.p>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: isInView ? 0 : 30, opacity: isInView ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full max-w-md mx-auto relative z-10"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-3 text-white rounded-lg flex items-center justify-center font-headline bg-red-500 mx-auto"
            style={{ borderRadius: "0.5rem" }}
          >
            <span className="mx-auto">Join Now</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Modal/Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md p-6 md:p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
              aria-label="Close popup"
            >
              <X size={24} />
            </button>

            {/* reCAPTCHA container - invisible but needed for Firebase */}
            <div ref={recaptchaContainerRef} id="recaptcha-container"></div>

            {/* Step 1: Initial Information */}
            {formStep === FormStep.INITIAL_INFO && (
              <>
                <div className="text-center mb-6">
                  <h3 className="text-2xl md:text-3xl font-bold font-headline mb-2">
                    Join Our <span className="text-red-500">Waitlist</span>
                  </h3>
                  <p className="text-zinc-300 font-body">Be the First to Experience Dope Lifestyle</p>
                </div>

                <form onSubmit={handleSendOTP} className="w-full flex flex-col gap-4">
                  <div className="w-full">
                    <label htmlFor="name" className="block text-sm font-medium text-zinc-400 mb-1 font-body">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your name"
                      className="w-full px-4 py-3 bg-zinc-800 bg-opacity-70 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-body text-base"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="w-full">
                    <label htmlFor="email" className="block text-sm font-medium text-zinc-400 mb-1 font-body">
                      Email Address <span className="text-zinc-500">(optional)</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 bg-zinc-800 bg-opacity-70 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-body text-base"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="w-full">
                    <label htmlFor="phone" className="block text-sm font-medium text-zinc-400 mb-1 font-body">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <PhoneInput value={formData.phone} onChange={handlePhoneChange} disabled={isSubmitting} required />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full px-6 py-3 text-white rounded-lg flex items-center justify-center font-headline mt-2 
                    ${isError ? "bg-red-700" : "bg-red-500"} 
                    ${isSubmitting || !isPhoneValid ? "opacity-70" : ""}`}
                    type="submit"
                    disabled={isSubmitting || !isPhoneValid}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <Loader2 size={20} className="animate-spin mr-2" /> Sending Code...
                      </span>
                    ) : (
                      <span className="mx-auto">Continue</span>
                    )}
                  </motion.button>

                  {message && (
                    <p className={`mt-3 text-sm text-center ${isError ? "text-red-400" : "text-green-400"}`}>
                      {message}
                    </p>
                  )}

                  <p className="text-zinc-400 text-xs text-center mt-4 italic font-body">
                    We respect your privacy and promise to send only exclusive updates and early access offers. No spam,
                    ever.
                  </p>
                </form>
              </>
            )}

            {/* Step 2: Verify Phone */}
            {formStep === FormStep.VERIFY_PHONE && (
              <>
                <div className="text-center mb-6">
                  <button
                    onClick={() => setFormStep(FormStep.INITIAL_INFO)}
                    className="absolute top-4 left-4 text-zinc-400 hover:text-white flex items-center text-sm"
                  >
                    <ArrowLeft size={16} className="mr-1" /> Back
                  </button>
                  <h3 className="text-2xl md:text-3xl font-bold font-headline mb-2">Verify Your Phone</h3>
                  <p className="text-zinc-300 font-body">
                    Enter the verification code sent to <span className="font-semibold">{formData.phone}</span>
                  </p>
                </div>

                <form onSubmit={handleVerifyOTP} className="w-full flex flex-col gap-4">
                  <div className="w-full">
                    <label htmlFor="otp" className="block text-sm font-medium text-zinc-400 mb-1 font-body">
                      Verification Code
                    </label>
                    <input
                      type="text"
                      id="otp"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="Enter 6-digit code"
                      className="w-full px-4 py-3 bg-zinc-800 bg-opacity-70 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-body text-base text-center tracking-widest"
                      required
                      maxLength={6}
                      pattern="[0-9]{6}"
                      inputMode="numeric"
                      disabled={isSubmitting}
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full px-6 py-3 text-white rounded-lg flex items-center justify-center font-headline mt-2 
                    ${isError ? "bg-red-700" : "bg-red-500"} 
                    ${isSubmitting ? "opacity-70" : ""}`}
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <Loader2 size={20} className="animate-spin mr-2" /> Verifying...
                      </span>
                    ) : (
                      <span className="mx-auto">Verify & Join</span>
                    )}
                  </motion.button>

                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={otpResendTimer > 0 || isSubmitting}
                    className={`text-sm text-center mt-2 ${
                      otpResendTimer > 0 || isSubmitting ? "text-zinc-500" : "text-red-400 hover:text-red-300"
                    }`}
                  >
                    {otpResendTimer > 0 ? `Resend code in ${otpResendTimer}s` : "Didn't receive a code? Resend"}
                  </button>

                  {message && (
                    <p className={`mt-3 text-sm text-center ${isError ? "text-red-400" : "text-green-400"}`}>
                      {message}
                    </p>
                  )}
                </form>
              </>
            )}

            {/* Step 3: Success */}
            {formStep === FormStep.SUCCESS && (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check size={32} className="text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold font-headline mb-4">You're In!</h3>
                <p className="text-zinc-300 font-body mb-6">
                  Thanks for joining the DOPE waitlist. We'll keep you updated on our launch and exclusive offers.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCloseModal}
                  className="px-6 py-3 text-white rounded-lg flex items-center justify-center font-headline bg-red-500 mx-auto"
                >
                  <span className="mx-auto">Close</span>
                </motion.button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
