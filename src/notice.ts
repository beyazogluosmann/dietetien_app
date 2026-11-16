export function withNotice(path: string, notice: string) {
  const [base, query] = path.split("?");
  const params = new URLSearchParams(query ?? "");
  params.set("notice", notice);
  return `${base}?${params.toString()}`;
}
