// src/components/admin/AdminPanel/form/properties/PropertyDescriptionSection.tsx

"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Section } from "@/components/admin/AdminPanel/form/sections/shared/Section";

type Props = {
  description: string;
  setDescription: (v: string) => void;
};

export function PropertyDescriptionSection(p: Props) {
  return (
    <Section title="Açıklama">
      <Textarea
        rows={8}
        value={p.description}
        onChange={(e) => p.setDescription(e.target.value)}
        placeholder="Detay açıklama…"
      />
    </Section>
  );
}
