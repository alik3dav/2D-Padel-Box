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
    <aside className="flex h-full w-72 flex-col border-l border-border/70 bg-[#0c121b]/70 p-3.5">
      <div className="mb-2.5">
        <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground/90">Inspector</h2>
        <p className="text-[11px] text-muted-foreground/85">Properties and plot setup</p>
      </div>

      <div className="space-y-2.5 overflow-y-auto pr-0.5">
        <InspectorEmpty />

        <Card className="border-border/70 bg-card/40 shadow-none">
          <CardHeader className="pb-2.5">
            <CardTitle className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Plot Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <div className="space-y-1">
              <Label htmlFor="plot-width" className="text-[11px] text-muted-foreground">
                Width (meters)
              </Label>
              <Input id="plot-width" defaultValue="40" className="h-8 border-border/65 bg-background/30 text-xs" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="plot-height" className="text-[11px] text-muted-foreground">
                Height (meters)
              </Label>
              <Input id="plot-height" defaultValue="25" className="h-8 border-border/65 bg-background/30 text-xs" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/40 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid h-8 w-full grid-cols-2 bg-muted/40 p-0.5">
                <TabsTrigger value="basic" className="text-xs">
                  Basic
                </TabsTrigger>
                <TabsTrigger value="advanced" className="text-xs">
                  Advanced
                </TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="mt-2">
                <Accordion type="single" collapsible defaultValue="Position" className="w-full">
                  {sections.map((section) => (
                    <AccordionItem value={section} key={section}>
                      <AccordionTrigger className="py-2 text-xs">{section}</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-1.5">
                          <div className="grid grid-cols-2 gap-2">
                            <Input placeholder="X" className="h-8 border-border/65 bg-background/30 text-xs" />
                            <Input placeholder="Y" className="h-8 border-border/65 bg-background/30 text-xs" />
                          </div>
                          <div className="flex items-center justify-between rounded-md border border-border/65 bg-background/25 px-2.5 py-1.5">
                            <Label className="text-[11px] text-muted-foreground">Enabled</Label>
                            <Switch />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
              <TabsContent value="advanced" className="mt-2">
                <div className="rounded-md border border-dashed border-border/70 bg-background/20 p-3 text-xs text-muted-foreground">
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
