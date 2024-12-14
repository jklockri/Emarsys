import { validateStartTime, validateTurnaroundHours } from "./validators.js";
import { WORKING_DAYS, START_TIME, END_TIME } from "./constants.js";

const createDueDateCalculator = () => {
  const calculateRemainingHours = (date) => {
    const startHour = date.getUTCHours();
    const startMinutes = date.getUTCMinutes();
    const startTimeDecimal = startHour + startMinutes / 60;
    return Math.max(0, END_TIME - startTimeDecimal);
  };

  const getNextWorkDay = (date) => {
    const nextDate = new Date(date);
    do {
      nextDate.setUTCDate(nextDate.getUTCDate() + 1);
    } while (!WORKING_DAYS.includes(nextDate.getUTCDay()));

    nextDate.setUTCHours(START_TIME, 0, 0, 0);
    return nextDate;
  };

  const addPreciseHours = (startTime, hours) => {
    const newTime = new Date(startTime);
    const wholeHours = Math.floor(hours);
    const minuteFraction = hours - wholeHours;
    newTime.setUTCHours(newTime.getUTCHours() + wholeHours);
    const additionalMinutes = Math.round(minuteFraction * 60);
    newTime.setUTCMinutes(newTime.getUTCMinutes() + additionalMinutes);

    return newTime;
  };

  const calculateDueDate = (startTime, turnaroundHours) => {
    const startTimeValidation = validateStartTime(startTime);
    if (!startTimeValidation.isValid) {
      throw new Error(startTimeValidation.errors.join(", "));
    }

    const turnaroundValidation = validateTurnaroundHours(turnaroundHours);
    if (!turnaroundValidation.isValid) {
      throw new Error(turnaroundValidation.errors.join(", "));
    }

    let currentDate = new Date(startTime);
    let remainingTurnaround = turnaroundHours;

    if (remainingTurnaround <= 0) {
      return currentDate;
    }

    while (remainingTurnaround > 0) {
      const remainingHours = calculateRemainingHours(currentDate);
      const hoursWorkedToday = Math.min(remainingHours, remainingTurnaround);

      if (hoursWorkedToday === remainingTurnaround) {
        return addPreciseHours(currentDate, hoursWorkedToday);
      }

      remainingTurnaround -= hoursWorkedToday;
      currentDate = getNextWorkDay(currentDate);
    }

    return currentDate;
  };

  return {
    calculateDueDate,
    getNextWorkDay,
    calculateRemainingHours,
    addPreciseHours,
  };
};

export default createDueDateCalculator;
