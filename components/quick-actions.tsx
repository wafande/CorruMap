"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Scale, User, FileText } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"

export function QuickActions() {
  const { t } = useTranslation()

  const actions = [
    {
      href: "/submit",
      label: t("actions.report_corruption"),
      icon: FileText,
      variant: "default" as const,
    },
    {
      href: "/missing-persons",
      label: t("actions.report_missing"),
      icon: Users,
      variant: "outline" as const,
    },
    {
      href: "/judicial",
      label: t("actions.report_judicial"),
      icon: Scale,
      variant: "outline" as const,
    },
    {
      href: "/profiles",
      label: t("actions.report_profile"),
      icon: User,
      variant: "outline" as const,
    },
  ]

  return (
    <Card className="md:hidden mb-6 bg-slate-800/50 border-slate-700">
      <CardContent className="p-4">
        <h3 className="font-semibold mb-3 text-center text-white">{t("actions.quick_actions")}</h3>
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.href}
                asChild
                variant={action.variant}
                size="sm"
                className={`h-auto py-3 flex-col space-y-1 ${
                  action.variant === "default"
                    ? "bg-kenya-red hover:bg-red-700 text-white"
                    : "border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                <Link href={action.href}>
                  <Icon className="h-4 w-4" />
                  <span className="text-xs text-center leading-tight">{action.label}</span>
                </Link>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
