export function PostImage({ src, alt }: { src?: string; alt?: string }) {
  return (
    <figure className="my-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt ?? ""} className="w-full rounded-sm" />
      {alt && (
        <figcaption className="mt-2 text-center text-xs text-muted-foreground italic">
          {alt}
        </figcaption>
      )}
    </figure>
  );
}
