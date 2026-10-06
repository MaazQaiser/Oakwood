import Image from "next/image";
import { cn } from "@/lib/cn";
import { oakwoodInventoryImage, type OakwoodImageSlot } from "@/lib/media/oakwood";

export function OakwoodPhotoSlot({
  slot,
  sizes = "(max-width: 768px) 100vw, 50vw",
  className,
  fill = false,
  caption = "end",
}: {
  slot: OakwoodImageSlot;
  sizes?: string;
  className?: string;
  fill?: boolean;
  caption?: "start" | "end";
}) {
  const captionAlign =
    caption === "start" ? "justify-start" : "justify-end";
  const src = oakwoodInventoryImage(slot.src);

  if (src) {
    return (
      <div className={cn(fill ? "absolute inset-0" : "relative", className)}>
        <Image
          src={src}
          alt={slot.alt ?? slot.intended}
          fill
          sizes={sizes}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col bg-page-tint p-4",
        captionAlign,
        fill ? "absolute inset-0" : "relative min-h-40",
        className,
      )}
      role="img"
      aria-label={`${slot.label} photography slot. ${slot.intended}.`}
    >
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-primary-secondary">
        {slot.label}
      </p>
      <p className="mt-1 max-w-sm text-body-sm leading-snug text-secondary">
        Photography will appear here when the image is connected.
      </p>
    </div>
  );
}
