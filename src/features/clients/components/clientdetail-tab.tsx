"use client"

import * as React from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { Input } from "@/shared/components/ui/input"
import { Button } from "@/shared/components/ui/button"
import { Pencil, RefreshCcw } from "lucide-react"
import { useState } from "react";

export default function ClientDetailTabs() {

    const [isEditable, setIsEditable] = useState(false);

  return (
    <Tabs defaultValue="details" className="flex-1 flex flex-col overflow-hidden">
  {/* Card chứa TabsList (Header) */}
  <Card className="rounded-b-none border-b-0">
    <div className="px-2 pt-1 pb-2">
      <TabsList className="w-full justify-start bg-transparent">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="permissions">Permissions</TabsTrigger>
      </TabsList>
    </div>
  </Card>

  {/* Card chứa nội dung, có thể scroll */}
  <Card className="flex-1 overflow-hidden rounded-t-none">
  <div className="h-full flex flex-col px-4 pb-6 pt-0">
    <div className="flex-1 overflow-auto">
        <div className="flex justify-end mt-4 gap-x-2">
    <Button size="sm" variant="outline">
        <RefreshCcw className="w-4 h-4 mr-2" />
        Deactivate
    </Button>

    {isEditable ? (
        <>
        <Button
            size="sm"
            variant="outline"
            onClick={() => setIsEditable(false)} // Cancel
        >
            Cancel
        </Button>
        <Button
            size="sm"
            className="bg-[#0f6cbd] text-white hover:bg-[#084c91]"
            onClick={() => {
            // TODO: handle save logic here
            setIsEditable(false);
            }}
        >
            Save
        </Button>
        </>
    ) : (
        <Button
        size="sm"
        className="bg-[#0f6cbd] text-white hover:bg-[#084c91]"
        onClick={() => setIsEditable(true)} // Edit
        >
        <Pencil className="w-4 h-4 mr-2" />
        Edit
        </Button>
    )}
    </div>


      <div>
          <TabsContent value="details">
            <div className="space-y-2 p-2">
              <p>Client ID</p>
              <Input
                disabled={true}
                className="bg-transparent"
                placeholder="Enter client name"
              />
              <p>Client Name</p>
              <Input
                disabled={!isEditable}
                className="bg-transparent"
                placeholder="Enter client name"
              />
              <p>Identifier</p>
              <Input
                disabled={true}
                className="bg-transparent"
                placeholder="Enter client name"
              />
              <p>Description</p>
              <Input
                disabled={!isEditable}
                className="bg-transparent"
                placeholder="Enter client name"
              />
              <p>Homepage URL</p>
              <Input
                disabled={!isEditable}
                className="bg-transparent"
                placeholder="Enter client name"
              />

              <div className="flex flex-col items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer ${
                    isEditable
                      ? "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100"
                      : "bg-muted cursor-not-allowed opacity-60"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      Click to upload or drag and drop
                    </p>
                  </div>
                  <Input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    disabled={!isEditable}
                  />
                </label>

                <div className="flex items-center mt-2">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    disabled={!isEditable}
                  >
                    <label htmlFor="dropzone-file">Select a file</label>
                  </Button>
                  <span className="ml-2 text-sm text-muted-foreground">
                    or Drop file here
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="permissions">
            <p>Access and update your documents.</p>
          </TabsContent>
        </div>
      </div>
      </div>
  </Card>
</Tabs>

  );
}