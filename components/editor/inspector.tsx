"use client";

import { InspectorEmpty } from "@/components/editor/inspector-empty";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const sections = ["Position", "Size", "Appearance", "Rotation", "Layer", "Lock"];

export function Inspector() {
  return (
    <aside className="flex h-full w-72 flex-col bg-[#0d141d] px-4 py-3.5 shadow-[inset_1px_0_0_rgba(255,255,255,0.03)]">
      <div className="mb-4">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/78">Inspector</h2>
        <p className="text-[11px] text-muted-foreground/68">Properties and plot setup</p>
      </div>

      <div className="space-y-5 overflow-y-auto pr-0.5">
        <InspectorEmpty />

        <section className="space-y-3">
          <h3 className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground/62">Plot Setup</h3>
          <div className="space-y-2.5">
            <div className="space-y-1">
              <Label htmlFor="plot-width" className="text-[11px] text-muted-foreground/72">
                Width (meters)
              </Label>
              <Input
                id="plot-width"
                defaultValue="40"
                className="h-8 border-transparent bg-[#111b26] text-xs focus-visible:ring-1"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="plot-height" className="text-[11px] text-muted-foreground/72">
                Height (meters)
              </Label>
              <Input
                id="plot-height"
                defaultValue="25"
                className="h-8 border-transparent bg-[#111b26] text-xs focus-visible:ring-1"
              />
            </div>
          </div>
        </section>

        <Separator className="bg-white/6" />

        <section className="space-y-3">
          <h3 className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground/62">Properties</h3>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid h-8 w-full grid-cols-2 bg-white/[0.035] p-0.5">
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
                  <AccordionItem value={section} key={section} className="border-white/6">
                    <AccordionTrigger className="py-2 text-xs text-foreground/88">{section}</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <Input placeholder="X" className="h-8 border-transparent bg-[#111b26] text-xs focus-visible:ring-1" />
                          <Input placeholder="Y" className="h-8 border-transparent bg-[#111b26] text-xs focus-visible:ring-1" />
                        </div>
                        <div className="flex items-center justify-between rounded-md bg-[#101923] px-2.5 py-1.5">
                          <Label className="text-[11px] text-muted-foreground/72">Enabled</Label>
                          <Switch />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
            <TabsContent value="advanced" className="mt-2">
              <div className="rounded-md bg-[#101923] p-3 text-xs text-muted-foreground/76">
                Advanced controls will appear in Phase 2.
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </aside>
  );
}
