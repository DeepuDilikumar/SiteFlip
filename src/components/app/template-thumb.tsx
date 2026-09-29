import type { TemplateId } from "@/templates/types";

/**
 * Miniature drawings of each template's layout, so operators can tell them
 * apart at a glance. Purely decorative.
 */
export function TemplateThumb({ id }: { id: TemplateId }) {
  if (id === "legacy") {
    return (
      <div aria-hidden="true" className="flex h-full flex-col gap-2 bg-[#f6f0e6] p-3">
        <div className="mx-auto h-1.5 w-12 rounded-full bg-[#2b211a]/70" />
        <div className="mt-1 flex flex-1 items-center gap-3">
          <div className="flex-1 space-y-1.5">
            <div className="h-1 w-8 rounded-full bg-[#8f4127]/70" />
            <div className="h-2.5 w-full rounded-sm bg-[#2b211a]/85" />
            <div className="h-2.5 w-4/5 rounded-sm bg-[#2b211a]/85" />
            <div className="h-1 w-full rounded-full bg-[#2b211a]/20" />
            <div className="mt-2 h-3 w-10 rounded-[2px] bg-[#8f4127]" />
          </div>
          <div className="grid size-12 place-items-center rounded-full border border-[#2b211a]/40">
            <div className="size-8 rounded-full bg-[#8f4127]" />
          </div>
        </div>
      </div>
    );
  }
  if (id === "modern") {
    return (
      <div aria-hidden="true" className="flex h-full flex-col bg-gradient-to-b from-[#f4f6f8] to-white">
        <div className="flex items-center justify-between border-b border-[#e2e7ed] bg-white px-3 py-1.5">
          <div className="h-1.5 w-10 rounded-full bg-[#0f1b2a]/80" />
          <div className="h-2.5 w-8 rounded-[3px] bg-[#0b5cad]" />
        </div>
        <div className="flex flex-1 items-center gap-3 p-3">
          <div className="flex-1 space-y-1.5">
            <div className="h-1 w-12 rounded-full bg-[#e5a00d]/80" />
            <div className="h-2.5 w-full rounded-sm bg-[#0f1b2a]/90" />
            <div className="h-2.5 w-3/4 rounded-sm bg-[#0f1b2a]/90" />
            <div className="mt-2 flex gap-1">
              <div className="h-3 w-10 rounded-[3px] bg-[#0b5cad]" />
              <div className="h-3 w-8 rounded-[3px] border border-[#e2e7ed]" />
            </div>
          </div>
          <div className="w-14 space-y-1 rounded-md bg-white p-1.5 shadow-[0_0_0_1px_#e2e7ed]">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-1">
                <div className="size-1.5 rounded-full bg-[#0b5cad]" />
                <div className="h-1 flex-1 rounded-full bg-[#0f1b2a]/30" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div aria-hidden="true" className="relative flex h-full flex-col overflow-hidden bg-[#f2f0eb] p-3">
      <div className="h-1.5 w-10 rounded-full bg-[#111110]/80" />
      <div className="mt-3 w-3/5 space-y-1">
        <div className="h-4 w-full rounded-sm bg-[#111110]" />
        <div className="h-4 w-4/5 rounded-sm bg-[#111110]" />
      </div>
      <div className="mt-2 h-3 w-12 rounded-full bg-[#111110]" />
      <div className="absolute -top-2 -right-3 size-16 rounded-full bg-[#e8481c]" />
      <div className="absolute right-6 bottom-0 h-10 w-9 rounded-t-full bg-[#111110]" />
      <div className="absolute right-3 bottom-3 size-3 rounded-full bg-[#f2b33d]" />
    </div>
  );
}
