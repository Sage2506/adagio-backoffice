import { describe, expect, it } from "vitest";
import { formatDayMonth, formatPrettyDateShort, formatPrettyLongDateShort } from "./numbers";

describe("formatPrettyDateShort", () => {
  it("devuelve la fecha en formato DD-MMM-YYYY para una fecha estándar", () => {
    expect(formatPrettyDateShort("2026-01-06")).toBe("06-ene-2026");
  });

  it("devuelve la fecha en formato DD-MMM-YYYY para una fecha con tiempo", () => {
    expect(formatPrettyDateShort("2026-12-25T15:30:00Z")).toBe("25-dic-2026");
  });

  it("devuelve 'N/A' si el string está vacío", () => {
    expect(formatPrettyDateShort("")).toBe("N/A");
  });

  it("devuelve la fecha correctamente para meses y días de un solo dígito", () => {
    expect(formatPrettyDateShort("2026-03-05")).toBe("05-mar-2026");
  });

  it("preserves the calendar day for date-only values", () => {
    expect(formatPrettyDateShort("2026-06-17")).toBe("17-jun-2026");
    expect(formatDayMonth("2026-06-17")).toBe("17/06");
    expect(formatPrettyLongDateShort("2026-06-17")).toBe("17-Jun-2026");
  });

  it("formats timestamps using their UTC date", () => {
    const timestamp = "2026-06-17T00:30:00+02:00";

    expect(formatDayMonth(timestamp)).toBe("16/06");
    expect(formatPrettyLongDateShort(timestamp)).toBe("16-Jun-2026");
  });

  it("returns 'N/A' for invalid date strings", () => {
    expect(formatPrettyDateShort("2026-02-30")).toBe("N/A");
    expect(formatDayMonth("not-a-date")).toBe("N/A");
    expect(formatPrettyLongDateShort("not-a-date")).toBe("N/A");
  });
});
