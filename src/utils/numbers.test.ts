import { formatPrettyDateShort } from "./numbers";

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
});
