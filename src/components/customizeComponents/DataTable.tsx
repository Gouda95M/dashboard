"use client";

import { useState, type ReactNode } from "react";
import { Card, CardHeader } from "./Card";
import { Pagination } from "./Pagination";
import { Table, type Column } from "./Table";

type DataTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  pageSize?: number;
  title?: string;
  description?: string;
  emptyMessage?: ReactNode;
  className?: string;
};

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  pageSize,
  title,
  description,
  emptyMessage = "Nothing to show yet.",
  className,
}: DataTableProps<T>) {
  const [requestedPage, setRequestedPage] = useState(1);
  const pageCount = pageSize
    ? Math.max(1, Math.ceil(rows.length / pageSize))
    : 1;
  const page = Math.min(requestedPage, pageCount); // stays valid when rows are deleted
  const visible = pageSize
    ? rows.slice((page - 1) * pageSize, page * pageSize)
    : rows;

  return (
    <Card className={className}>
      {title && <CardHeader title={title} description={description} />}
      {rows.length ? (
        <>
          <div className={title ? "mt-3" : undefined}>
            <Table columns={columns} rows={visible} rowKey={rowKey} />
          </div>
          {pageSize && (
            <Pagination
              page={page}
              pageSize={pageSize}
              total={rows.length}
              onChange={setRequestedPage}
            />
          )}
        </>
      ) : (
        <p className="p-8 text-center text-sm text-muted">{emptyMessage}</p>
      )}
    </Card>
  );
}
