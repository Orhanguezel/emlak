"use client";
import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Section } from "./shared/Section";

type Props = {
  metaTitle: string; setMetaTitle: (v: string)=>void;
  metaDesc: string; setMetaDesc: (v: string)=>void;
  tagsStr: string; setTagsStr: (v: string)=>void;
};

export function SEOSection({ metaTitle, setMetaTitle, metaDesc, setMetaDesc, tagsStr, setTagsStr }: Props) {
  return (
    <Section title="SEO">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Meta Title</Label>
          <Input value={metaTitle} onChange={(e)=>setMetaTitle(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Meta Description</Label>
          <Textarea rows={3} value={metaDesc} onChange={(e)=>setMetaDesc(e.target.value)} />
        </div>
        <div className="sm:col-span-2 space-y-2">
          <Label>Etiketler (virgülle ayır)</Label>
          <Input value={tagsStr} onChange={(e)=>setTagsStr(e.target.value)} placeholder="granıt, mermer, sütunlu…" />
        </div>
      </div>
    </Section>
  );
}
