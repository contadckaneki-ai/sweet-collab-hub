const DISCORD_CLIENT_ID = "1470895059393056809";
const REDIRECT_URI = `${window.location.origin}/auth/callback`;
const SCOPES = ["identify", "guilds"];

export function getDiscordAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "token",
    scope: SCOPES.join(" "),
  });
  return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
}

export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  global_name: string | null;
}

export interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
}

export function saveToken(token: string): void {
  localStorage.setItem("discord_token", token);
}

export function getToken(): string | null {
  return localStorage.getItem("discord_token");
}

export function clearToken(): void {
  localStorage.removeItem("discord_token");
  localStorage.removeItem("discord_user");
}

export function saveUser(user: DiscordUser): void {
  localStorage.setItem("discord_user", JSON.stringify(user));
}

export function getUser(): DiscordUser | null {
  const raw = localStorage.getItem("discord_user");
  return raw ? JSON.parse(raw) : null;
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export async function fetchDiscordUser(token: string): Promise<DiscordUser> {
  const res = await fetch("https://discord.com/api/v10/users/@me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

export async function fetchUserGuilds(token: string): Promise<DiscordGuild[]> {
  const res = await fetch("https://discord.com/api/v10/users/@me/guilds", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch guilds");
  return res.json();
}

export function getUserAvatarUrl(user: DiscordUser): string {
  if (user.avatar) {
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`;
  }
  const defaultIndex = user.discriminator === "0"
    ? (BigInt(user.id) >> 22n) % 6n
    : Number(user.discriminator) % 5;
  return `https://cdn.discordapp.com/embed/avatars/${defaultIndex}.png`;
}

export function getGuildIconUrl(guild: DiscordGuild): string | null {
  if (!guild.icon) return null;
  return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128`;
}
