import type { RootDataDump } from "@/components/admin/AdminPanel/types";

export function exportAllToJson(filename: string, data: RootDataDump) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".json") ? filename : `${filename}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function importAllFromJson(file: File): Promise<RootDataDump> {
  const text = await file.text();
  const parsed = JSON.parse(text) as RootDataDump;
  return parsed;
}
