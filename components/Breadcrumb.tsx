import Link from "next/link";
import { breadcrumbSchema } from "@/lib/schema";

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="text-[13px] text-muted mb-[22px]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema(items)),
        }}
      />
      {items.map((item, i) => (
        <span key={i}>
          {i > 0 && <span className="mx-1">&rsaquo;</span>}
          {i < items.length - 1 ? (
            <Link
              href={item.href}
              className="hover:text-brass transition-colors"
            >
              {item.name}
            </Link>
          ) : (
            <span>{item.name}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
