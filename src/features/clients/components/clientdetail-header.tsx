import * as React from "react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"

export default function ClientDetailHeader() {
  return (
    <Card>
    <CardHeader>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <CardTitle>Clients</CardTitle>
          <CardDescription>UI for admins to manage identities.</CardDescription>
        </div>
      </div>
    </CardHeader>
  </Card>
  );
}