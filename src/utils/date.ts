export function toBackendDateTime(value?: string): string {
  const fallback = new Date().toISOString();
  if (!value) return fallback;
  if (value.includes("T")) return value;
  const now = new Date();

  // DD.MM.YYYY
  const ddmmyyyy = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value);
  if (ddmmyyyy) {
    const [, dd, mm, yyyy] = ddmmyyyy;
    const date = new Date(
      Number(yyyy),
      Number(mm) - 1,
      Number(dd),
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
      now.getMilliseconds(),
    );
    return date.toISOString();
  }

  // YYYY-MM-DD (input type="date")
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const year = Number(value.slice(0, 4));
    const month = Number(value.slice(5, 7)) - 1;
    const day = Number(value.slice(8, 10));
    const date = new Date(
      year,
      month,
      day,
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
      now.getMilliseconds(),
    );
    return date.toISOString();
  }

  const parsed = new Date(value);
  if (!isNaN(parsed.getTime())) return parsed.toISOString();
  return fallback;
}
