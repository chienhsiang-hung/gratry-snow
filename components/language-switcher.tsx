"use client"

import * as React from "react"
import { Globe } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()

  // 切換網址中的語系前綴
  const switchLocale = (locale: string) => {
    if (!pathname) return
    
    // 將當前路徑的語系部分替換掉 (例如從 /zh/about 換成 /en/about)
    const newPath = pathname.replace(/^\/[^\/]+/, `/${locale}`)
    router.push(newPath)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">切換語言</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => switchLocale("zh")}>
          中文 (繁體)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => switchLocale("en")}>
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}