// Error Messages
const INVALID_START_TIME_FORMAT = 'Invalid start time format'
const INVALID_TIMEZONE = 'Start time must be in UTC timezone'
const OUTSIDE_OF_WORKING_HOURS = 'Start time must be between 9:00 and 17:00 UTC'
const INVALID_WORKING_DAY = 'Start time must be on a working day (Monday-Friday)'
const INVALID_TURNAROUND_HOURS = 'Turnaround hours must be a finite non-negative number'
const TURNAROUND_HOURS_TOO_LARGE = 'Turnaround hours exceed the maximum allowed limit'
const BLANK_START_TIME = 'Start time must be a non-empty string'
const TURNAROUND_CANNOT_BE_NEGATIVE = 'Turnaround hours cannot be negative'

// Other Constants
const START_TIME =  9
const END_TIME = 17
const WORKING_DAYS = [1, 2, 3, 4, 5]
const MAX_TURNAROUND_HOURS = 1000

export {
  INVALID_START_TIME_FORMAT,
  INVALID_TIMEZONE,
  OUTSIDE_OF_WORKING_HOURS,
  INVALID_WORKING_DAY,
  INVALID_TURNAROUND_HOURS,
  TURNAROUND_HOURS_TOO_LARGE,
  BLANK_START_TIME,
  TURNAROUND_CANNOT_BE_NEGATIVE,
  START_TIME,
  END_TIME,
  WORKING_DAYS,
  MAX_TURNAROUND_HOURS,
}
