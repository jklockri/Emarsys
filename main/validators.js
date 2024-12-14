import {
  INVALID_START_TIME_FORMAT,
  INVALID_TIMEZONE,
  OUTSIDE_OF_WORKING_HOURS,
  INVALID_WORKING_DAY,
  INVALID_TURNAROUND_HOURS,
  TURNAROUND_HOURS_TOO_LARGE,
  BLANK_START_TIME,
  MAX_TURNAROUND_HOURS,
  START_TIME,
  END_TIME,
  WORKING_DAYS,
  TURNAROUND_CANNOT_BE_NEGATIVE,
} from "./constants.js";

const validateStartTime = (startTime) => {
  const result = {
    isValid: true,
    errors: [],
  };

  if (!startTime || typeof startTime !== "string") {
    return {
      isValid: false,
      errors: [BLANK_START_TIME],
    };
  }

  const parsedDate =
    typeof startTime === "string" ? new Date(startTime) : startTime;

  if (isNaN(parsedDate.getTime())) {
    return {
      isValid: false,
      errors: [INVALID_START_TIME_FORMAT],
    };
  }

  if (typeof startTime === "string" && !startTime.endsWith("Z")) {
    result.isValid = false;
    result.errors.push(INVALID_TIMEZONE);
  }

  if (!isWithinWorkingHours(parsedDate)) {
    result.isValid = false;
    result.errors.push(OUTSIDE_OF_WORKING_HOURS);
  }

  if (!WORKING_DAYS.includes(parsedDate.getUTCDay())) {
    result.isValid = false;
    result.errors.push(INVALID_WORKING_DAY);
  }

  return result;
};

const isWithinWorkingHours = (date) => {
  const hour = date.getUTCHours();
  return hour >= START_TIME && hour < END_TIME;
};

const validateTurnaroundHours = (turnaroundHours) => {
  const result = {
    isValid: true,
    errors: [],
  };

  if (typeof turnaroundHours !== "number" || !isFinite(turnaroundHours)) {
    result.isValid = false;
    result.errors.push(INVALID_TURNAROUND_HOURS);
    return result;
  }

  if (turnaroundHours < 0) {
    result.isValid = false;
    result.errors.push(TURNAROUND_CANNOT_BE_NEGATIVE);
  }

  if (turnaroundHours > MAX_TURNAROUND_HOURS) {
    result.isValid = false;
    result.errors.push(TURNAROUND_HOURS_TOO_LARGE);
  }

  return result;
};

export { validateStartTime, validateTurnaroundHours, isWithinWorkingHours };
