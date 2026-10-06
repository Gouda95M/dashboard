import { UserDetails } from "@/components/UserDetails";

export const metadata = { title: "User details · Dashboard" };

export default async function UserDetailsPage({ params }: PageProps<"/users/[id]">) {
  const { id } = await params;
  return <UserDetails key={id} id={id} />;
}
