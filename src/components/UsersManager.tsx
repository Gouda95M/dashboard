"use client";

import Link from "next/link";
import { Avatar, Badge, type Column } from "@/components/customizeComponents";
import { ResourceManager } from "@/components/crud/ResourceManager";
import type { FieldConfig } from "@/components/crud/types";
import { Button, Card } from "@/components/customizeComponents";
import { useRequester } from "@/hooks/useRequester";
import { endpoints } from "@/lib/api/endpoints";
import { roleTone, statusTone, toUser, type User, type UsersResponse } from "@/lib/users";

const columns: Column<User>[] = [
  {
    key: "name",
    header: "User",
    render: (u) => (
      <div className="flex items-center gap-3">
        <Avatar name={u.name} />
        <div>
          <Link href={`/users/${u.id}`} className="font-medium hover:text-primary hover:underline">
            {u.name}
          </Link>
          <p className="text-xs text-muted">{u.email}</p>
        </div>
      </div>
    ),
  },
  { key: "phone", header: "Phone", render: (u) => u.phone },
  { key: "company", header: "Company", render: (u) => u.company },
  { key: "role", header: "Role", render: (u) => <Badge tone={roleTone[u.role]}>{u.role}</Badge> },
  { key: "status", header: "Status", render: (u) => <Badge tone={statusTone[u.status]}>{u.status}</Badge> },
];

const fields: FieldConfig<User>[] = [
  { name: "name", label: "Name", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "phone", label: "Phone", type: "text" },
  { name: "company", label: "Company", type: "text" },
  { name: "role", label: "Role", type: "select", options: ["Admin", "Editor", "Viewer"] },
  { name: "status", label: "Status", type: "select", options: ["Active", "Inactive"] },
];

export function UsersManager() {
  const { data, loading, reload } = useRequester<UsersResponse>({ request: { endpoint: endpoints.users.list } });
  if (loading) return <Card className="p-8 text-center text-sm text-muted">Loading users...</Card>;
  if (!data) {
    return (
      <Card className="flex flex-col items-center gap-3 p-8 text-center">
        <p className="text-sm text-danger">Could not load users.</p>
        <Button variant="secondary" size="sm" onClick={() => reload()}>
          Try again
        </Button>
      </Card>
    );
  }

  return (
    <ResourceManager
      title="Users"
      singular="user"
      pageSize={20}
      initialItems={data.data.map(toUser)}
      columns={columns}
      fields={fields}
      newId={() => crypto.randomUUID()}
      itemLabel={(u) => u.name}
    />
  );
}
