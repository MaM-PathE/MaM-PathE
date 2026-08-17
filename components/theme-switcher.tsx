"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Palette, Check, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full">
        <Palette className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-accent transition-colors"
          aria-label="Select theme"
        >
          {theme === "light" ? (
            <Sun className="h-5 w-5 text-amber-500" />
          ) : (
            <Palette className="h-5 w-5 text-foreground" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px] p-2">
        <DropdownMenuItem
          className="flex items-center gap-2 px-3 py-2 cursor-pointer"
          onClick={() => setTheme("light")}
        >
          <Sun className="h-4 w-4 text-amber-500" />
          <span>Light</span>
          {theme === "light" && <Check className="h-4 w-4 ml-auto" />}
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 cursor-pointer" onClick={() => setTheme("dark")}>
          <Moon className="h-4 w-4 text-blue-500" />
          <span>Dark</span>
          {theme === "dark" && <Check className="h-4 w-4 ml-auto" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
