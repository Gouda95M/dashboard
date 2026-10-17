"use client";

import Link from "next/link";
import { Avatar, Badge, Button, Card, CardBody, CardHeader, DetailList } from "@/components/customizeComponents";
import { useRequester } from "@/hooks/useRequester";
import { endpoints } from "@/lib/api/endpoints";
import { roleTone, statusTone, type UserDetail } from "@/lib/users";

const BackLink = () => (
  <Link href="/users" className="mb-4 inline-block text-sm text-muted hover:text-foreground">
    ← Back to users
  </Link>
);

export function UserDetails({ id }: { id: string }) {
  const { data: user, loading, reload } = useRequester<UserDetail>({ request: { endpoint: endpoints.users.detail(id) } });

  if (loading) return <Card className="p-8 text-center text-sm text-muted">Loading user...</Card>;
  if (!user) {
    return (
      <>
        <BackLink />
        <Card className="flex flex-col items-center gap-3 p-8 text-center">
          <p className="text-sm text-danger">Could not load this user.</p>
          <Button variant="secondary" size="sm" onClick={() => reload()}>
            Try again
          </Button>
        </Card>
      </>
    );
  }

  const { address, company } = user;

  return (
    <>
      <BackLink />
      <Card className="flex flex-wrap items-center gap-4 p-5">
        <Avatar name={user.name} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{user.name}</h1>
            <Badge tone={roleTone[user.role]}>{user.role}</Badge>
            <Badge tone={statusTone[user.status]}>{user.status}</Badge>
          </div>
          <p className="mt-1 text-sm text-muted">{company.name}</p>
        </div>
      </Card>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Contact" />
          <CardBody>
            <DetailList
              items={[
                { label: "Email", value: user.email },
                { label: "Phone", value: user.phone },
                { label: "Username", value: user.username },
                { label: "Website", value: user.website },
              ]}
            />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Address" />
          <CardBody>
            <DetailList
              items={[
                { label: "Street", value: address.street },
                { label: "Suite", value: address.suite },
                { label: "City", value: address.city },
                { label: "Postal code", value: address.zipcode },
              ]}
            />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Company" />
          <CardBody>
            <DetailList
              items={[
                { label: "Company", value: company.name },
                { label: "Tagline", value: company.catchPhrase },
                { label: "Focus", value: company.bs },
              ]}
            />
          </CardBody>
        </Card>
      </div>
    </>
  );
}
