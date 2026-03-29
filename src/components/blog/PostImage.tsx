import Image from "next/image";

export function PostImage({ src, alt }: { src?: string; alt?: string }) {
  return (
    <figure className="my-6">
      {src && (
        <Image
          src={src}
          alt={alt ?? ""}
          width={1200}
          height={630}
          className="w-full h-auto rounded-sm"
          sizes="(max-width: 640px) 100vw, 672px"
        />
      )}
      {alt && (
        <figcaption className="mt-2 text-center text-xs text-muted-foreground italic">
          {alt}
        </figcaption>
      )}
    </figure>
  );
}
