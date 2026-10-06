import Link from "next/link";
import { Badge, Card, CardBody, CardHeader } from "@/components/customizeComponents";
import type { Tone } from "@/lib/theme";

export const metadata = { title: "Developer notes · Dashboard" };

type Status = "Live API" | "Mock data" | "Demo only";
const statusTone: Record<Status, Tone> = { "Live API": "success", "Mock data": "warning", "Demo only": "info" };

const stack = ["Next.js 16 (App Router)", "React 19", "TypeScript", "Tailwind CSS 4", "Redux Toolkit", "Sonner"];

const features: { title: string; status?: Status; points: string[] }[] = [
  {
    title: "Authentication",
    status: "Live API",
    points: [
      "Sign in against DummyJSON POST /user/login; the access token is kept in a Redux session persisted to localStorage and synced across tabs.",
      "AuthGuard protects every dashboard route and re-validates the token with GET /user/me, signing the user out on 401/403.",
      "Register page posts to /users/add. DummyJSON does not store users, so registered accounts are also saved in this browser (hashed password) so they can sign in. Demo only, not real security.",
    ],
  },
  {
    title: "Users",
    status: "Live API",
    points: [
      "Users list and user detail pages load from DummyJSON (/users, /users/:id) with loading and retry states.",
      "Add user posts to /users/add before the row appears; edit and delete update local state only (the API is read-only for these).",
    ],
  },
  {
    title: "Orders, overview and analytics",
    status: "Live API",
    points: [
      "Orders load from the fakestoreapi.noksha.dev orders API; customer names are resolved from the DummyJSON users API.",
      "Overview and Analytics are computed from those orders: revenue, average order value, delivery rate, daily revenue, status breakdown, top products and top customers.",
      "Orders support add, edit and delete in local state (the API is read-only), with stats recalculated from the current rows.",
    ],
  },
  {
    title: "Reusable CRUD",
    points: [
      "ResourceManager + EntityForm build a paginated table, add/edit modal, delete confirmation and validation from a column list and a field config. Users and Orders both use it.",
    ],
  },
  {
    title: "Data layer",
    points: [
      "A typed requester (endpoint config + fetch) wrapped by the useRequester hook, with useErrorHandler giving loading state and error toasts.",
      "Endpoints are declared in one file and the base URL comes from NEXT_PUBLIC_API_URL.",
    ],
  },
  {
    title: "UI system",
    points: [
      "Own component library in components/customizeComponents (Button, Card, DataTable, Modal, Field, Select, Pagination, Badge, Avatar, charts and more).",
      "Light/dark theme from design tokens with a no-flash init script, responsive sidebar shell, and a notification bell that keeps toast history.",
    ],
  },
];

const limitations = [
  "The orders API only has 20 orders from one month, so there are no month-over-month trends.",
  "The header search box and the Export report button are not wired up.",
  "The user role is stored in the session but not used to restrict any page or action.",
  "Edits and deletes on users do not persist, and there are no automated tests yet.",
];

export default function DevPage() {
  return (
    <main className="mx-auto max-w-4xl p-4 sm:p-8">
      <Link href="/login" className="text-sm text-muted hover:text-foreground">
        ← Back to the app
      </Link>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">Developer notes</h1>
      <p className="mt-2 text-muted">
        An admin dashboard built to practice a production-style front end: authentication, data fetching, reusable CRUD and
        a custom UI kit. This page lists what is implemented and what is not.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {stack.map((s) => (
          <Badge key={s} tone="primary">
            {s}
          </Badge>
        ))}
      </div>

      <p className="mt-6 text-sm text-muted">
        Try it: sign in with <strong className="text-foreground">gouda</strong> /{" "}
        <strong className="text-foreground">goudapass</strong>, or register your own account.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {features.map((f) => (
          <Card key={f.title}>
            <CardHeader title={f.title} action={f.status && <Badge tone={statusTone[f.status]}>{f.status}</Badge>} />
            <CardBody>
              <ul className="flex list-disc flex-col gap-2 pl-4 text-sm text-muted">
                {f.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card className="mt-4">
        <CardHeader title="Not implemented / known gaps" />
        <CardBody>
          <ul className="flex list-disc flex-col gap-2 pl-4 text-sm text-muted">
            {limitations.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </CardBody>
      </Card>
    </main>
  );
}
