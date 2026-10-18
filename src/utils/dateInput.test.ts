import { describe, expect, it } from "vitest";
import { formatDateDDMMYYYY, maskDateInput, parseDateDDMMYYYY, parseYYYYMMDDToDate } from "./dateInput";

describe("maskDateInput", () => {
  it("inserts the slashes while typing digits", () => {
    expect(maskDateInput("2")).toBe("2");
    expect(maskDateInput("25")).toBe("25");
    expect(maskDateInput("250")).toBe("25/0");
    expect(maskDateInput("25061")).toBe("25/06/1");
    expect(maskDateInput("25061996")).toBe("25/06/1996");
  });

  it("ignores non-digits and extra digits", () => {
    expect(maskDateInput("25-06-1996")).toBe("25/06/1996");
    expect(maskDateInput("2506199612")).toBe("25/06/1996");
    expect(maskDateInput("ab")).toBe("");
  });

  it("deletes a digit when backspacing over a slash", () => {
    expect(maskDateInput("2506", "25/06")).toBe("25/0");
    expect(maskDateInput("25/0", "25/06")).toBe("25/0");
  });
});

describe("parseDateDDMMYYYY", () => {
  it("parses a complete valid date", () => {
    const date = parseDateDDMMYYYY("25/06/1996");
    expect(date?.getFullYear()).toBe(1996);
    expect(date?.getMonth()).toBe(5);
    expect(date?.getDate()).toBe(25);
  });

  it("rejects incomplete, impossible and out of range dates", () => {
    expect(parseDateDDMMYYYY("25/06/199")).toBeNull();
    expect(parseDateDDMMYYYY("31/02/1996")).toBeNull();
    expect(parseDateDDMMYYYY("00/06/1996")).toBeNull();
    expect(parseDateDDMMYYYY("25/13/1996")).toBeNull();
    expect(parseDateDDMMYYYY("25/06/0996")).toBeNull();
  });
});

describe("formatDateDDMMYYYY", () => {
  it("formats as dd/mm/yyyy with leading zeros", () => {
    expect(formatDateDDMMYYYY(new Date(1996, 5, 5))).toBe("05/06/1996");
  });

  it("returns an empty string without a date", () => {
    expect(formatDateDDMMYYYY(null)).toBe("");
  });
});

describe("parseYYYYMMDDToDate", () => {
  it("builds a local date without shifting the day", () => {
    const date = parseYYYYMMDDToDate("2026-10-17");
    expect(formatDateDDMMYYYY(date)).toBe("17/10/2026");
  });

  it("returns null for invalid values", () => {
    expect(parseYYYYMMDDToDate("")).toBeNull();
  });
});
