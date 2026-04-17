"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";

export default function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();

  const handleLanguageChange = (newLocale: string) => {
    // Set cookie for next-intl
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Languages className="w-5 h-5 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleLanguageChange("en")} className={locale === "en" ? "font-bold text-purple-600" : ""}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageChange("ta")} className={locale === "ta" ? "font-bold text-purple-600" : ""}>
          தமிழ் (Tamil)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
