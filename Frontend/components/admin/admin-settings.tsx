"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"

export function AdminSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    maintenanceMode: false,
    premiumFeaturesFree: false,
  })

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-bold mb-6">Platform Settings</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-foreground/60">Send notifications to admins</p>
            </div>
            <Switch checked={settings.emailNotifications} onCheckedChange={() => handleToggle("emailNotifications")} />
          </div>

          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <p className="font-medium">Maintenance Mode</p>
              <p className="text-sm text-foreground/60">Disable platform for users</p>
            </div>
            <Switch checked={settings.maintenanceMode} onCheckedChange={() => handleToggle("maintenanceMode")} />
          </div>

          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <p className="font-medium">Premium Features for Free Users</p>
              <p className="text-sm text-foreground/60">Temporarily enable all features</p>
            </div>
            <Switch
              checked={settings.premiumFeaturesFree}
              onCheckedChange={() => handleToggle("premiumFeaturesFree")}
            />
          </div>
        </div>
      </Card>

      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-bold mb-4">Danger Zone</h3>
        <Button variant="destructive" className="w-full">
          Reset All Data
        </Button>
      </Card>
    </div>
  )
}
