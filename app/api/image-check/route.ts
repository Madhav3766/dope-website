import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    // Check if images directory exists
    const publicDir = path.join(process.cwd(), "public")
    const imagesDir = path.join(publicDir, "images")

    const publicExists = fs.existsSync(publicDir)
    const imagesDirExists = fs.existsSync(imagesDir)

    // Check for specific image files
    const logoPath = path.join(imagesDir, "logo.png")
    const mascotPath = path.join(imagesDir, "mascot.png")
    const backgroundPath = path.join(imagesDir, "background.png")

    const logoExists = fs.existsSync(logoPath)
    const mascotExists = fs.existsSync(mascotPath)
    const backgroundExists = fs.existsSync(backgroundPath)

    // List all files in the images directory if it exists
    let imageFiles: string[] = []
    if (imagesDirExists) {
      imageFiles = fs.readdirSync(imagesDir)
    }

    // List all files in the public directory
    let publicFiles: string[] = []
    if (publicExists) {
      publicFiles = fs.readdirSync(publicDir)
    }

    return NextResponse.json({
      directories: {
        publicExists,
        imagesDirExists,
      },
      files: {
        logoExists,
        mascotExists,
        backgroundExists,
      },
      imageFiles,
      publicFiles,
      serverInfo: {
        cwd: process.cwd(),
        env: process.env.NODE_ENV,
      },
    })
  } catch (error) {
    console.error("Error checking images:", error)
    return NextResponse.json({ error: "Failed to check images" }, { status: 500 })
  }
}
