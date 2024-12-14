import { describe, it, expect } from "vitest";
import createDueDateCalculator from "../main/dueDateCalculator.js";
import {
  friday,
  saturday,
  sunday,
  monday,
  tuesday,
  thursday,
} from "./testConstants.js";

const {
  calculateDueDate,
  getNextWorkDay,
  calculateRemainingHours,
  addPreciseHours,
} = createDueDateCalculator();

describe("createDueDateCalculator", () => {
  describe("calculateDueDate", () => {
    it("calculates due date correctly when start time is exactly at START_TIME", () => {
      const startTime = `${monday} 09:00:00Z`; // Start of working hours
      const turnaroundHours = 4;
      const expectedDueDate = new Date(`${monday} 13:00:00Z`); // Same day

      expect(calculateDueDate(startTime, turnaroundHours)).toEqual(
        expectedDueDate
      );
    });

    it("calculates due date correctly when turnaround ends exactly at END_TIME", () => {
      const startTime = `${monday} 13:00:00Z`; // 1 PM UTC
      const turnaroundHours = 4;
      const expectedDueDate = new Date(`${monday} 17:00:00Z`); // Ends at END_TIME

      expect(calculateDueDate(startTime, turnaroundHours)).toEqual(
        expectedDueDate
      );
    });

    it("calculates due date within the same day", () => {
      const startTime = `${monday} 10:00:00Z`;
      const turnaroundHours = 5;
      const expectedDueDate = new Date(`${monday} 15:00:00Z`);
      expect(calculateDueDate(startTime, turnaroundHours)).toEqual(
        expectedDueDate
      );
    });

    it("calculates due date two days later", () => {
      const startTime = `${tuesday} 14:12:00Z`;
      const turnaroundHours = 16;
      const expectedDueDate = new Date(`${thursday} 14:12:00Z`);
      expect(calculateDueDate(startTime, turnaroundHours)).toEqual(
        expectedDueDate
      );
    });

    it("calculates due date to the next working day", () => {
      const startTime = `${monday} 16:00:00Z`;
      const turnaroundHours = 2;
      const expectedDueDate = new Date(`${tuesday} 10:00:00Z`);
      expect(calculateDueDate(startTime, turnaroundHours)).toEqual(
        expectedDueDate
      );
    });

    it("calculates due date over the weekend", () => {
      const startTime = `${friday} 16:00:00Z`;
      const turnaroundHours = 4;
      const expectedDueDate = new Date(`${monday} 12:00:00Z`);
      expect(calculateDueDate(startTime, turnaroundHours)).toEqual(
        expectedDueDate
      );
    });

    it("calculates due date correctly for startTime near year-end", () => {
      const startTime = "2024-12-31T16:00:00Z"; // Tuesday, December 31, 2024, 16:00 UTC
      const turnaroundHours = 2; // Should carry over to next year on Wednesday
      const expectedDueDate = new Date("2025-01-01T10:00:00Z"); // Wednesday, January 1, 2025, 10:00 UTC
      expect(calculateDueDate(startTime, turnaroundHours)).toEqual(
        expectedDueDate
      );
    });

    it("calculates due date with precise hours", () => {
      const startTime = `${monday} 10:30:00Z`;
      const turnaroundHours = 5.5;
      const expectedDueDate = new Date(`${monday} 16:00:00Z`);
      expect(calculateDueDate(startTime, turnaroundHours)).toEqual(
        expectedDueDate
      );
    });

    it("calculates due date with zero turnaround time", () => {
      const startTime = `${monday} 10:00:00Z`;
      const turnaroundHours = 0;
      const expectedDueDate = new Date(`${monday} 10:00:00Z`);
      expect(calculateDueDate(startTime, turnaroundHours)).toEqual(
        expectedDueDate
      );
    });
    it("calculates due date correctly with millisecond precision in startTime", () => {
      const startTime = `${monday} 10:00:30Z`;
      const turnaroundHours = 1.5;
      const expectedDueDate = new Date(`${monday} 11:30:30Z`);

      expect(calculateDueDate(startTime, turnaroundHours)).toEqual(
        expectedDueDate
      );
    });
  });

  describe("getNextWorkDay", () => {
    it("returns next work day", () => {
      const date = new Date(`${friday} 12:00:00Z`);
      const expectedNextWorkDay = new Date(`${monday} 09:00:00Z`);
      expect(getNextWorkDay(date)).toEqual(expectedNextWorkDay);
    });

    it("returns next work day for weekend", () => {
      const date = new Date(`${saturday} 12:00:00Z`);
      const expectedNextWorkDay = new Date(`${monday} 09:00:00Z`);
      expect(getNextWorkDay(date)).toEqual(expectedNextWorkDay);
    });

    it("returns next work day for Monday", () => {
      const date = new Date(`${monday} 12:00:00Z`);
      const expectedNextWorkDay = new Date(`${tuesday} 09:00:00Z`);
      expect(getNextWorkDay(date)).toEqual(expectedNextWorkDay);
    });
  });

  describe("calculateRemainingHours", () => {
    it("calculates remaining hours in the day", () => {
      const date = new Date(`${monday} 12:00:00Z`);
      expect(calculateRemainingHours(date)).toBe(5);
    });

    it("calculates remaining hours at the end of the day", () => {
      const date = new Date(`${monday} 16:00:00Z`);
      expect(calculateRemainingHours(date)).toBe(1);
    });

    it("returns 0 for outside working hours", () => {
      const date = new Date(`${monday} 18:00:00Z`);
      expect(calculateRemainingHours(date)).toBe(0);
    });
  });

  describe("addPreciseHours", () => {
    it("adds precise hours to the date", () => {
      const startTime = new Date(`${monday} 10:00:00Z`);
      const hours = 5.5;
      const expectedTime = new Date(`${monday} 15:30:00Z`);
      expect(addPreciseHours(startTime, hours)).toEqual(expectedTime);
    });

    it("adds precise hours to the date with whole hours", () => {
      const startTime = new Date(`${monday} 10:00:00Z`);
      const hours = 5;
      const expectedTime = new Date(`${monday} 15:00:00Z`);
      expect(addPreciseHours(startTime, hours)).toEqual(expectedTime);
    });

    it("adds precise hours to the date with fractions", () => {
      const startTime = new Date(`${monday} 10:00:00Z`);
      const hours = 5.25;
      const expectedTime = new Date(`${monday} 15:15:00Z`);
      expect(addPreciseHours(startTime, hours)).toEqual(expectedTime);
    });
  });
});
