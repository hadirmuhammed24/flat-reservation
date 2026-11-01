const USERS_KEY = 'matrouh_accounts_v1';
const SESSION_KEY = 'matrouh_session_v1';

export interface Account {
  id: string;
  name: string;
  email: string;
}

interface StoredAccount extends Account {
  salt: string;
  hash: string;
}

export type AuthError =
  | 'invalid_email'
  | 'weak_password'
  | 'short_name'
  | 'exists'
  | 'mismatch'
  | 'bad_login';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const readUsers = (): StoredAccount[] => {
  try {
    const raw = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
};

const writeUsers = (users: StoredAccount[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const toHex = (bytes: ArrayBuffer) =>
  [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, '0')).join('');

const fromHex = (hex: string) => {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
};

const deriveHash = async (password: string, salt: Uint8Array) => {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: salt as BufferSource, iterations: 120_000, hash: 'SHA-256' },
    key,
    256,
  );
  return toHex(bits);
};

const publicAccount = (user: StoredAccount): Account => ({
  id: user.id,
  name: user.name,
  email: user.email,
});

export const loadSession = (): Account | null => {
  const id = localStorage.getItem(SESSION_KEY);
  if (!id) return null;
  const user = readUsers().find((item) => item.id === id);
  return user ? publicAccount(user) : null;
};

export const signOut = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const registerAccount = async (input: {
  name: string;
  email: string;
  password: string;
  confirm: string;
}): Promise<{ account?: Account; error?: AuthError }> => {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  if (name.length < 2) return { error: 'short_name' };
  if (!EMAIL_PATTERN.test(email)) return { error: 'invalid_email' };
  if (input.password.length < 8) return { error: 'weak_password' };
  if (input.password !== input.confirm) return { error: 'mismatch' };

  const users = readUsers();
  if (users.some((user) => user.email === email)) return { error: 'exists' };

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const account: StoredAccount = {
    id: crypto.randomUUID(),
    name,
    email,
    salt: toHex(salt.buffer),
    hash: await deriveHash(input.password, salt),
  };
  writeUsers([...users, account]);
  localStorage.setItem(SESSION_KEY, account.id);
  return { account: publicAccount(account) };
};

export const signInAccount = async (
  emailRaw: string,
  password: string,
): Promise<{ account?: Account; error?: AuthError }> => {
  const email = emailRaw.trim().toLowerCase();
  if (!EMAIL_PATTERN.test(email) || password.length === 0) return { error: 'bad_login' };

  const user = readUsers().find((item) => item.email === email);
  if (!user) return { error: 'bad_login' };

  const hash = await deriveHash(password, fromHex(user.salt));
  if (hash !== user.hash) return { error: 'bad_login' };

  localStorage.setItem(SESSION_KEY, user.id);
  return { account: publicAccount(user) };
};
