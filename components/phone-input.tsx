"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  required?: boolean
  className?: string
}

export default function PhoneInput({
  value,
  onChange,
  disabled = false,
  required = false,
  className = "",
}: PhoneInputProps) {
  const [displayValue, setDisplayValue] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [isValid, setIsValid] = useState(true)

  // Format the phone number for display
  useEffect(() => {
    // If the value already has +91, use it as is
    if (value.startsWith("+91")) {
      const numberPart = value.substring(3).trim()

      // Format the number part with spaces
      if (numberPart.length > 0) {
        let formatted = "+91 "

        // Add first 5 digits
        if (numberPart.length <= 5) {
          formatted += numberPart
        } else {
          formatted += `${numberPart.substring(0, 5)} ${numberPart.substring(5)}`
        }

        setDisplayValue(formatted.trim())
      } else {
        setDisplayValue("+91")
      }
    }
    // If it doesn't have +91 but has some value, add +91
    else if (value && !value.startsWith("+91")) {
      let rawNumber = value.replace(/\D/g, "")

      // If it starts with 91, remove it (user might have entered 91 instead of +91)
      if (rawNumber.startsWith("91") && rawNumber.length > 2) {
        rawNumber = rawNumber.substring(2)
      }

      // Format with +91 prefix
      let formatted = "+91 "

      // Add first 5 digits
      if (rawNumber.length <= 5) {
        formatted += rawNumber
      } else {
        formatted += `${rawNumber.substring(0, 5)} ${rawNumber.substring(5, 10)}`
      }

      setDisplayValue(formatted.trim())

      // Update the actual value with the correct format
      const cleanNumber = "+91" + rawNumber.substring(0, 10)
      if (cleanNumber !== value) {
        onChange(cleanNumber)
      }
    }
    // Empty value
    else if (!value) {
      setDisplayValue("")
    }
  }, [value, onChange])

  // Validate the phone number
  useEffect(() => {
    if (!value || value === "+91") {
      setIsValid(true)
      return
    }

    // Indian mobile numbers are 10 digits
    const numberPart = value.replace(/\D/g, "")
    const isValidIndian =
      (value.startsWith("+91") && numberPart.length === 12) || // +91 + 10 digits
      (numberPart.length === 10 && !value.startsWith("+")) // just 10 digits

    setIsValid(isValidIndian)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value

    // If user is trying to delete the +91 prefix, don't allow it
    if (input.length < 3) {
      setDisplayValue("+91")
      onChange("+91")
      return
    }

    // Remove all non-digit characters except the + at the beginning
    const cleaned = input.replace(/[^\d+]/g, "")

    // Ensure it starts with +91
    let formatted = cleaned
    if (!cleaned.startsWith("+91")) {
      // If it starts with just +, add 91
      if (cleaned.startsWith("+")) {
        formatted = "+91" + cleaned.substring(1).substring(0, 10)
      }
      // If it doesn't start with +, add +91
      else {
        formatted = "+91" + cleaned.substring(0, 10)
      }
    } else {
      // Limit to +91 + 10 digits
      formatted = cleaned.substring(0, 13)
    }

    onChange(formatted)
  }

  const handleFocus = () => {
    setIsFocused(true)
    // If empty, add the +91 prefix when focused
    if (!value) {
      onChange("+91")
    }
  }

  const handleBlur = () => {
    setIsFocused(false)
    // If only +91 is entered, clear it when blurred
    if (value === "+91") {
      onChange("")
      setDisplayValue("")
    }
  }

  return (
    <div className="relative">
      <input
        type="tel"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        required={required}
        placeholder="+91 98765 43210"
        className={`w-full px-4 py-3 bg-zinc-800 bg-opacity-70 rounded-lg focus:outline-none focus:ring-2 
        ${isValid ? "focus:ring-red-500" : "focus:ring-red-700 border border-red-700"} 
        font-body text-base ${className}`}
        maxLength={16} // +91 + space + 5 digits + space + 5 digits
      />
      {!isValid && value.length > 3 && (
        <p className="text-red-500 text-xs mt-1">Please enter a valid 10-digit Indian mobile number</p>
      )}
      {isValid && <p className="text-xs text-zinc-500 mt-1">Indian mobile number (+91)</p>}
    </div>
  )
}
