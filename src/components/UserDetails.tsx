"use client";

import Link from "next/link";
import { Avatar, Badge, Button, Card, CardBody, CardHeader, DetailList } from "@/components/customizeComponents";
import { useRequester } from "@/hooks/useRequester";
import { endpoints } from "@/lib/api/endpoints";
import { roleTone, type UserDetail } from "@/lib/users";

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

  const fullName = `${user.firstName} ${user.lastName}`;
  const { address, company } = user;

  return (
    <>
      <BackLink />
      <Card className="flex flex-wrap items-center gap-4 p-5">
        <Avatar name={fullName} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{fullName}</h1>
            <Badge tone={roleTone[user.role]}>{user.role}</Badge>
          </div>
          <p className="mt-1 text-sm text-muted">
            {company.title} · {company.name}
          </p>
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
              ]}
            />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Personal" />
          <CardBody>
            <DetailList
              items={[
                { label: "Age", value: user.age },
                { label: "Gender", value: user.gender },
                { label: "Birth date", value: user.birthDate },
                { label: "Blood group", value: user.bloodGroup },
                { label: "University", value: user.university },
              ]}
            />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Address" />
          <CardBody>
            <DetailList
              items={[
                { label: "Street", value: address.address },
                { label: "City", value: address.city },
                { label: "State", value: `${address.state} (${address.stateCode})` },
                { label: "Postal code", value: address.postalCode },
                { label: "Country", value: address.country },
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
                { label: "Department", value: company.department },
                { label: "Job title", value: company.title },
              ]}
            />
          </CardBody>
        </Card>
      </div>
    </>
  );
}
