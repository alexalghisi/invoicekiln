export const SESSION_COOKIE = "ik_session";

export function hasSessionCookie(cookieHeader: string | null): boolean {
  if (!cookieHeader) return false;
  return cookieHeader.split(";").some((part) => part.trim().startsWith(`${SESSION_COOKIE}=`));
}
