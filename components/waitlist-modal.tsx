"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"
import { subscribeToWaitlist } from "@/app/actions/subscribe"

interface WaitlistModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [message, setMessage] = useState("")
  const [isError, setIsError] = useState(false)

  // Close modal when escape key is pressed
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscapeKey)
    return () => document.removeEventListener("keydown", handleEscapeKey)
  }, [isOpen, onClose])

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!email || isSubmitting) return

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("email", email)

      const result = await subscribeToWaitlist(formData)

      if (result.success) {
        setIsSubmitted(true)
        setIsError(false)
        setMessage(result.message)
        setEmail("")

        // Reset the submitted state after 3 seconds
        setTimeout(() => {
          setIsSubmitted(false)
          setMessage("")
          onClose()
        }, 3000)
      } else {
        setIsError(true)
        setMessage(result.message)
      }
    } catch (error) {
      setIsError(true)
      setMessage("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md p-6 md:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white"
          aria-label="Close popup"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <h3 className="text-2xl md:text-3xl font-bold font-headline mb-2">
            Join Our <span className="text-red-500">Waitlist</span>
          </h3>
          <p className="text-zinc-300 font-body">Enter your email to get exclusive early access</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div className="w-full">
            <label htmlFor="email" className="block text-sm font-medium text-zinc-400 mb-1 font-body">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 bg-zinc-800 bg-opacity-70 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-body text-base"
              required
              disabled={isSubmitting}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full px-6 py-3 text-white rounded-lg flex items-center justify-center font-headline mt-2 ${
              isSubmitted ? "bg-green-500" : isError ? "bg-red-700" : "bg-red-500"
            } ${isSubmitting ? "opacity-70" : ""}`}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : isSubmitted ? "Joined!" : <span className="mx-auto">Join Now</span>}
          </motion.button>

          {message && (
            <p className={`mt-3 text-sm text-center ${isError ? "text-red-400" : "text-green-400"}`}>{message}</p>
          )}
        </form>
      </div>
    </div>
  )
}
