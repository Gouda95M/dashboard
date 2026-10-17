export type SessionRole = "admin" | "moderator" | "user";

/** Shape returned by DummyJSON GET /user/me (only the fields we use). */
export type MeResponse = Pick<LoginResponse, "id" | "username" | "email" | "firstName" | "lastName"> & {
  role: SessionRole;
};

export type LoginResponse = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
};

export type Session = Pick<
  LoginResponse,
  "id" | "username" | "email" | "firstName" | "lastName" | "accessToken"
> & {
  role?: SessionRole;
};

export const toSession = ({
  id,
  username,
  email,
  firstName,
  lastName,
  accessToken,
}: LoginResponse): Session => ({
  id,
  username,
  email,
  firstName,
  lastName,
  accessToken,
});

export const bearer = (session: Session) => ({
  Authorization: `Bearer ${session.accessToken}`,
});

export const SESSION_STORAGE_KEY = "dashboard-session";

export function readStoredSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function writeStoredSession(session: Session | null) {
  try {
    if (session)
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    else localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {}
}

const LOCAL_ACCOUNTS_KEY = "dashboard-local-accounts";
const LOCAL_TOKEN_PREFIX = "local:";

type LocalAccount = Omit<Session, "accessToken" | "role"> & {
  passwordHash: string;
};

export const isLocalSession = (session: Session) =>
  session.accessToken.startsWith(LOCAL_TOKEN_PREFIX);

async function hash(text: string) {
  const bytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text),
  );
  return Array.from(new Uint8Array(bytes), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}

function readAccounts(): LocalAccount[] {
  try {
    return JSON.parse(
      localStorage.getItem(LOCAL_ACCOUNTS_KEY) ?? "[]",
    ) as LocalAccount[];
  } catch {
    return [];
  }
}

const sameUsername = (a: string, b: string) =>
  a.trim().toLowerCase() === b.trim().toLowerCase();

export const localUsernameTaken = (username: string) =>
  sameUsername(DEMO_ACCOUNT.username, username) ||
  readAccounts().some((a) => sameUsername(a.username, username));

export async function saveLocalAccount(
  account: Pick<
    LocalAccount,
    "id" | "username" | "email" | "firstName" | "lastName"
  >,
  password: string,
) {
  const accounts = readAccounts();
  accounts.push({ ...account, passwordHash: await hash(password) });
  try {
    localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch {}
}

/** Built-in demo account (shown on the sign-in page); it never touches DummyJSON. */
const DEMO_ACCOUNT = {
  id: 0,
  username: "gouda",
  password: "goudapass",
  email: "gouda@example.com",
  firstName: "Gouda",
  lastName: "Demo",
};

/** Returns a session when the credentials match the demo account or an account registered in this browser. */
export async function loginLocal(
  username: string,
  password: string,
): Promise<Session | null> {
  if (sameUsername(DEMO_ACCOUNT.username, username) && password === DEMO_ACCOUNT.password) {
    const { id, username: name, email, firstName, lastName } = DEMO_ACCOUNT;
    return { id, username: name, email, firstName, lastName, accessToken: `${LOCAL_TOKEN_PREFIX}demo`, role: "admin" };
  }
  const account = readAccounts().find((a) =>
    sameUsername(a.username, username),
  );
  if (!account || account.passwordHash !== (await hash(password))) return null;
  const { id, username: name, email, firstName, lastName } = account;
  return {
    id,
    username: name,
    email,
    firstName,
    lastName,
    accessToken: `${LOCAL_TOKEN_PREFIX}${account.id}`,
    role: "user",
  };
}
