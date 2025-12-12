export function genUsername(preferred?: string) {
  const base = (preferred || "user").replace(/\s+/g, "").toLowerCase();
  const rand = Math.random().toString(36).slice(2, 8);
  return `${base}-${rand}`;
}
