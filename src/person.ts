const personName = /^[\p{L}]+(?:[ '\u2019-][\p{L}]+)*$/u;
const emailAddress = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

export function parsePersonName(value: string) {
  const cleaned = value.trim().replace(/\s+/g, " ");
  if (cleaned.length < 2 || cleaned.length > 40 || !personName.test(cleaned)) {
    return null;
  }
  return cleaned;
}

export function parseEmail(value: string) {
  const email = value.trim().toLowerCase();
  if (email.length > 254 || email.includes("..") || !emailAddress.test(email)) {
    return null;
  }
  const [local, domain] = email.split("@");
  if (!local || !domain || local.length > 64) {
    return null;
  }
  if (domain.startsWith("-") || domain.endsWith("-") || domain.includes(".-") || domain.includes("-.")) {
    return null;
  }
  return email;
}

export function fullName(name: string, surname?: string | null) {
  return [name.trim(), surname?.trim()].filter(Boolean).join(" ");
}
