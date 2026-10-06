import { Button } from "./Button";
import { cn } from "@/lib/cn";

type PaginationProps = {
  page: number; // 1-based
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
};

/** Page numbers with ellipses: 1 … 4 5 [6] 7 8 … 11 */
function pageItems(page: number, pageCount: number): (number | "gap")[] {
  const pages = new Set([1, pageCount, page - 1, page, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= pageCount).sort((a, b) => a - b);
  return sorted.flatMap((p, i) => (i > 0 && p - sorted[i - 1] > 1 ? ["gap" as const, p] : [p]));
}

export function Pagination({ page, pageSize, total, onChange }: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-3 py-3 sm:px-5">
      <p className="text-sm text-muted">
        Showing {from}–{to} of {total}
      </p>
      <div className="flex flex-wrap items-center gap-1">
        <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>
          Previous
        </Button>
        {pageItems(page, pageCount).map((item, i) =>
          item === "gap" ? (
            <span key={`gap-${i}`} className="px-1 text-muted">
              …
            </span>
          ) : (
            <Button
              key={item}
              variant={item === page ? "primary" : "ghost"}
              size="sm"
              aria-current={item === page ? "page" : undefined}
              className={cn("min-w-8 px-2")}
              onClick={() => onChange(item)}
            >
              {item}
            </Button>
          ),
        )}
        <Button variant="ghost" size="sm" disabled={page >= pageCount} onClick={() => onChange(page + 1)}>
          Next
        </Button>
      </div>
    </nav>
  );
}
