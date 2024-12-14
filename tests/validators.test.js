import { describe, it, expect } from "vitest";
import { saturday, monday, tuesday } from "./testConstants";

import {
  validateStartTime,
  validateTurnaroundHours,
  isWithinWorkingHours,
} from "../main/validators.js";

describe("validators", () => {
  describe("validateTurnaroundHours", () => {
    it("accepts valid turnaround hours (positive integer)", () => {
      const result = validateTurnaroundHours(10);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("accepts valid turnaround hours (positive float)", () => {
      const result = validateTurnaroundHours(5.5);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("accepts zero turnaround hours", () => {
      const result = validateTurnaroundHours(0);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("rejects negative turnaround hours", () => {
      const result = validateTurnaroundHours(-5);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Turnaround hours cannot be negative");
    });

    it("rejects non-number input (string)", () => {
      const result = validateTurnaroundHours("10");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Turnaround hours must be a finite non-negative number"
      );
    });

    it("rejects non-number input (object)", () => {
      const result = validateTurnaroundHours({ hours: 10 });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Turnaround hours must be a finite non-negative number"
      );
    });

    it("rejects non-number input (array)", () => {
      const result = validateTurnaroundHours([10]);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Turnaround hours must be a finite non-negative number"
      );
    });

    it("rejects NaN as turnaround hours", () => {
      const result = validateTurnaroundHours(NaN);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Turnaround hours must be a finite non-negative number"
      );
    });

    it("rejects Infinity as turnaround hours", () => {
      const result = validateTurnaroundHours(Infinity);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Turnaround hours must be a finite non-negative number"
      );
    });

    it("rejects turnaround hours exceeding maximum limit", () => {
      const result = validateTurnaroundHours(1500);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Turnaround hours exceed the maximum allowed limit"
      );
    });

    it("accepts turnaround hours exactly at the maximum limit", () => {
      const maxLimit = 1000; // Assuming MAX_TURNAROUND_HOURS is 1000
      const result = validateTurnaroundHours(maxLimit);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("rejects turnaround hours just above the maximum limit", () => {
      const maxLimitPlusOne = 1000.1;
      const result = validateTurnaroundHours(maxLimitPlusOne);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Turnaround hours exceed the maximum allowed limit"
      );
    });

    it("accepts turnaround hours just below the maximum limit", () => {
      const maxLimitMinusOne = 999.9;
      const result = validateTurnaroundHours(maxLimitMinusOne);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe("validateStartTime", () => {
    it("accepts valid UTC date string during working hours", () => {
      const startTime = `${tuesday} 14:00:00Z`;
      const result = validateStartTime(startTime);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("rejects empty string", () => {
      const result = validateStartTime("");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Start time must be a non-empty string");
    });

    it("rejects null input", () => {
      const result = validateStartTime(null);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Start time must be a non-empty string");
    });

    it("rejects non-string input", () => {
      const result = validateStartTime(123);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Start time must be a non-empty string");
    });

    it("rejects invalid date format", () => {
      const result = validateStartTime("not-a-date");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Invalid start time format");
    });

    it("rejects non-UTC timezone", () => {
      const result = validateStartTime(`${monday} 14:00:00+01:00`);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Start time must be in UTC timezone");
    });

    it("rejects time outside working hours", () => {
      const result = validateStartTime(`${monday} 20:00:00Z`);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Start time must be between 9:00 and 17:00 UTC"
      );
    });

    it("rejects weekend dates", () => {
      const result = validateStartTime(`${saturday} 14:00:00Z`);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Start time must be on a working day (Monday-Friday)"
      );
    });
  });

  describe("isWithinWorkingHours", () => {
    it("returns true for working hours", () => {
      const date = new Date(`${monday} 12:00:00Z`);
      expect(isWithinWorkingHours(date)).toBe(true);
    });

    it("returns false for outside working hours", () => {
      const date = new Date(`${monday} 18:00:00Z`);
      expect(isWithinWorkingHours(date)).toBe(false);
    });
  });
});
