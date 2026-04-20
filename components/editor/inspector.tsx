"use client";

import { InspectorEmpty } from "@/components/editor/inspector-empty";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const sections = ["Position", "Size", "Appearance", "Rotation", "Layer", "Lock"];

export function Inspector() {
  return (
    <aside className="flex h-full w-80 flex-col border-l border-border/80 bg-card/40 p-4">
      <div className="mb-3">
        <h2 className="text-sm font-semibold">Inspector</h2>
        <p className="text-xs text-muted-foreground">Properties and plot setup</p>
      </div>

      <div className="space-y-3 overflow-y-auto pr-1">
        <InspectorEmpty />

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Plot Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="plot-width">Width (meters)</Label>
              <Input id="plot-width" defaultValue="40" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="plot-height">Height (meters)</Label>
              <Input id="plot-height" defaultValue="25" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>
              <TabsContent value="basic">
                <Accordion type="single" collapsible defaultValue="Position" className="w-full">
                  {sections.map((section) => (
                    <AccordionItem value={section} key={section}>
                      <AccordionTrigger>{section}</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <Input placeholder="X" />
                            <Input placeholder="Y" />
                          </div>
                          <div className="flex items-center justify-between rounded-md border border-border/70 px-2.5 py-2">
                            <Label className="text-xs text-muted-foreground">Enabled</Label>
                            <Switch />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
              <TabsContent value="advanced">
                <div className="rounded-md border border-dashed border-border/80 p-3 text-xs text-muted-foreground">
                  Advanced controls will appear in Phase 2.
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}
