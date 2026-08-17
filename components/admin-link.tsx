"use client"

import Link from "next/link"
import { useState, useEffect } from "react"

export function AdminLink() {
  const [blink, setBlink] = useState(true)

  // Effet de clignotement du curseur
  useEffect(() => {
    const interval = setInterval(() => {
      setBlink((prev) => !prev)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex justify-center mt-4">
      <Link href="/admin">
        <div className="bg-black text-green-400 font-mono text-xs p-2 rounded border border-green-500 shadow-md hover:shadow-lg hover:border-green-400 transition-all inline-block">
          <span className="text-blue-400">{"# "}</span>
          <span className="text-purple-400">{"print"}</span>
          <span>{"("}</span>
          <span className="text-yellow-400">{'"created by Cheikh GUEYE"'}</span>
          <span>{")"}</span>
          <span className={`ml-1 ${blink ? "opacity-100" : "opacity-0"} transition-opacity duration-100`}>|</span>
        </div>
      </Link>
    </div>
  )
}
