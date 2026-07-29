import { describe, it, expect } from "vitest";
import { isValidStatusTransition } from "./request-status";

describe("isValidStatusTransition", () => {
  it("дозволяє новий -> контакт", () => {
    expect(isValidStatusTransition("new", "contacted")).toBe(true);
  });

  it("дозволяє контакт -> в роботі -> виконано", () => {
    expect(isValidStatusTransition("contacted", "in_progress")).toBe(true);
    expect(isValidStatusTransition("in_progress", "done")).toBe(true);
  });

  it("дозволяє скасування з будь-якого не-термінального стану", () => {
    expect(isValidStatusTransition("new", "cancelled")).toBe(true);
    expect(isValidStatusTransition("contacted", "cancelled")).toBe(true);
    expect(isValidStatusTransition("in_progress", "cancelled")).toBe(true);
  });

  it("забороняє перехід з термінальних станів (done/cancelled)", () => {
    expect(isValidStatusTransition("done", "in_progress")).toBe(false);
    expect(isValidStatusTransition("cancelled", "new")).toBe(false);
  });

  it("забороняє перескакування етапів (new -> done напряму)", () => {
    expect(isValidStatusTransition("new", "done")).toBe(false);
  });

  it("забороняє перехід назад (in_progress -> new)", () => {
    expect(isValidStatusTransition("in_progress", "new")).toBe(false);
  });

  it("забороняє 'перехід' у той самий статус", () => {
    expect(isValidStatusTransition("new", "new")).toBe(false);
  });
});
