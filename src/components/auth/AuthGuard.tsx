"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useRequester } from "@/hooks/useRequester";
import { endpoints } from "@/lib/api/endpoints";
import type { ApiError } from "@/lib/api/types";
import { bearer, isLocalSession, type Session } from "@/lib/auth";
import { notify } from "@/lib/notifications";
import type { UserDetail } from "@/lib/users";
import { useAppDispatch, useSession } from "@/store/hooks";
import { clearSession, setSession } from "@/store/authSlice";

function SessionValidator({ session }: { session: Session }) {
  const dispatch = useAppDispatch();
  useRequester<UserDetail>({
    request: {
      endpoint: endpoints.auth.me,
      options: { headers: bearer(session) },
    },
    showErrorToast: false,
    doAfter: (me) =>
      void dispatch(
        setSession({
          ...session,
          id: me.id,
          username: me.username,
          email: me.email,
          firstName: me.firstName,
          lastName: me.lastName,
          role: me.role,
        }),
      ),
    onError: (error) => {
      const status = (error as ApiError).status;
      if (status === 401 || status === 403) {
        dispatch(clearSession());
        notify.error("Session expired", {
          description: "Please sign in again.",
        });
      }
    },
  });
  return null;
}

export function AuthGuard({ children }: { children: ReactNode }) {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session === null) router.replace("/login");
  }, [session, router]);

  if (!session)
    return (
      <div className="grid min-h-screen place-items-center text-sm text-muted">
        Loading...
      </div>
    );
  return (
    <>
      {!isLocalSession(session) && <SessionValidator session={session} />}
      {children}
    </>
  );
}
