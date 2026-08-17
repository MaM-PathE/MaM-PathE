"use client"

import { useState, useEffect } from "react"

export function TerminalSignature() {
  const [showFirstCommand, setShowFirstCommand] = useState(false)
  const [showFirstOutput, setShowFirstOutput] = useState(false)
  const [showSecondCommand, setShowSecondCommand] = useState(false)
  const [cursorVisible, setCursorVisible] = useState(true)

  useEffect(() => {
    // Animation séquentielle
    const timer1 = setTimeout(() => setShowFirstCommand(true), 500)
    const timer2 = setTimeout(() => setShowFirstOutput(true), 1200)
    const timer3 = setTimeout(() => setShowSecondCommand(true), 1800)

    // Animation du curseur clignotant
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev)
    }, 530)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearInterval(cursorInterval)
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center py-6">
      <p className="text-xs text-primary-foreground/70 mb-2">© 2025 Tous droits réservés.</p>

      <div className="w-48 rounded-md overflow-hidden bg-[#1e1e2e] shadow-lg">
        {/* Barre de titre du terminal */}
        <div className="bg-[#2a2a3c] py-0.5 px-1.5 flex items-center">
          <div className="flex space-x-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
          </div>
          <div className="text-[9px] text-gray-400 ml-1.5">terminal</div>
        </div>

        {/* Contenu du terminal */}
        <div className="p-1.5 font-mono text-[10px] text-gray-200">
          {showFirstCommand && (
            <div className="flex">
              <span className="text-green-400 mr-0.5">$</span>
              <span>echo "Created by"</span>
            </div>
          )}

          {showFirstOutput && <div className="mt-0.5">Created by</div>}

          {showSecondCommand && (
            <div className="flex mt-0.5">
              <span className="text-green-400 mr-0.5">$</span>
              <span>
                print"<span className="text-cyan-400">Cheikh GUEYE</span>"
              </span>
              <span className={`ml-0.5 ${cursorVisible ? "opacity-100" : "opacity-0"}`}>▋</span>
            </div>
          )}

          {!showSecondCommand && <div className="h-2.5"></div>}
        </div>
      </div>
    </div>
  )
}
