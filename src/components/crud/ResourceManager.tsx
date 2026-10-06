"use client";

import { useState, type ReactNode } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  Button,
  DataTable,
  Icon,
  Modal,
  type Column,
} from "@/components/customizeComponents";
import { notify } from "@/lib/notifications";
import { EntityForm } from "./EntityForm";
import type { FieldConfig } from "./types";

type ResourceManagerProps<T extends { id: string }> = {
  title: string;
  singular: string;
  initialItems: T[];
  columns: Column<T>[];
  fields: FieldConfig<T>[];
  newId: (items: T[]) => string;
  itemLabel: (item: T) => string;
  summary?: (items: T[]) => ReactNode;
  pageSize?: number;
  onCreate?: (values: Record<string, string | number>) => Promise<boolean>;
};

const cap = (text: string) => text[0].toUpperCase() + text.slice(1);

export function ResourceManager<T extends { id: string }>({
  title,
  singular,
  initialItems,
  columns,
  fields,
  newId,
  itemLabel,
  summary,
  pageSize,
  onCreate,
}: ResourceManagerProps<T>) {
  const [items, setItems] = useState(initialItems);
  const [editing, setEditing] = useState<T | "new" | null>(null);
  const [deleting, setDeleting] = useState<T | null>(null);

  const current = editing && editing !== "new" ? editing : null;
  const initialValues = Object.fromEntries(
    fields.map((f) => [
      f.name,
      current
        ? String(current[f.name])
        : f.type === "select"
          ? (f.options?.[0] ?? "")
          : "",
    ]),
  );

  async function save(values: Record<string, string>) {
    const parsed: Record<string, string | number> = Object.fromEntries(
      fields.map((f) => [
        f.name,
        f.type === "number" ? Number(values[f.name]) : values[f.name].trim(),
      ]),
    );
    if (!current && onCreate && !(await onCreate(parsed))) return;
    setItems((list) =>
      current
        ? list.map((i) => (i.id === current.id ? { ...i, ...parsed } : i))
        : [{ ...parsed, id: newId(list) } as unknown as T, ...list],
    );
    notify.success(
      current ? `${cap(singular)} updated` : `${cap(singular)} added`,
      {
        description: `${String(parsed[fields[0].name])} was ${current ? "saved" : "created"} successfully.`,
      },
    );
    setEditing(null);
  }

  function remove() {
    if (deleting) {
      setItems((list) => list.filter((i) => i.id !== deleting.id));
      notify.error(`${cap(singular)} deleted`, {
        description: `${itemLabel(deleting)} was removed.`,
      });
    }
    setDeleting(null);
  }

  const actions: Column<T> = {
    key: "actions",
    header: "",
    align: "right",
    render: (item) => (
      <div className="flex justify-end gap-1">
        <Button
          variant="ghost"
          size="sm"
          aria-label={`Edit ${itemLabel(item)}`}
          onClick={() => setEditing(item)}
        >
          <Icon name="edit" width={16} height={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          aria-label={`Delete ${itemLabel(item)}`}
          onClick={() => setDeleting(item)}
        >
          <Icon name="trash" width={16} height={16} />
        </Button>
      </div>
    ),
  };

  return (
    <>
      <PageHeader
        title={title}
        description={`${items.length} ${items.length === 1 ? singular : `${singular}s`} in total`}
        action={
          <Button onClick={() => setEditing("new")}>
            <Icon name="plus" width={16} height={16} /> Add {singular}
          </Button>
        }
      />
      {summary?.(items)}
      <DataTable
        className={summary ? "mt-6" : undefined}
        columns={[...columns, actions]}
        rows={items}
        rowKey={(i) => i.id}
        pageSize={pageSize}
        emptyMessage={`No ${singular}s yet. Add the first one.`}
      />

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={current ? `Edit ${singular}` : `Add ${singular}`}
      >
        <EntityForm
          fields={fields}
          initialValues={initialValues}
          submitLabel={current ? "Save changes" : `Add ${singular}`}
          onSubmit={save}
          onCancel={() => setEditing(null)}
        />
      </Modal>

      <Modal
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        title={`Delete ${singular}`}
      >
        <p className="text-sm text-muted">
          Are you sure you want to delete{" "}
          <strong className="text-foreground">
            {deleting && itemLabel(deleting)}
          </strong>
          ? This cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleting(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={remove}>
            Delete
          </Button>
        </div>
      </Modal>
    </>
  );
}
