
import { format, parseISO } from "date-fns";

/**
 * Formats a date to a short date string (e.g., "Jan 1")
 */
export const formatShortDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, "MMM d");
};

/**
 * Formats a date to a medium date string (e.g., "January 1, 2025")
 */
export const formatMediumDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, "MMMM d, yyyy");
};

/**
 * Calculates the number of weeks between two dates
 */
export const getWeeksBetweenDates = (startDate: Date, endDate: Date): number => {
  const msInWeek = 7 * 24 * 60 * 60 * 1000;
  return Math.ceil((endDate.getTime() - startDate.getTime()) / msInWeek);
};

/**
 * Adds weeks to a date
 */
export const addWeeksToDate = (date: Date, weeks: number): Date => {
  const msInWeek = 7 * 24 * 60 * 60 * 1000;
  return new Date(date.getTime() + (weeks * msInWeek));
};
