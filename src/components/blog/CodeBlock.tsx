import { CopyButton } from "./CopyButton";

function extractText(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(extractText).join("");
  if (typeof children === "object" && children !== null && "props" in (children as object)) {
    const el = children as React.ReactElement<{ children?: React.ReactNode }>;
    return extractText(el.props.children);
  }
  return "";
}

export function CodeBlock({ children, ...props }: React.ComponentProps<"pre">) {
  const code = extractText(children).replace(/\n$/, "");

  return (
    <div className="relative group">
      <pre {...props}>{children}</pre>
      <CopyButton code={code} />
    </div>
  );
}
