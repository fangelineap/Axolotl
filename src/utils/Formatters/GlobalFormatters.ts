/**
 * * Export all formatters
 */
export const globalFormatDate = (
  date: Date,
  formatter: "dateTime" | "longDate" | "shortDate" | "veryShortDate"
) => {
  switch (formatter) {
    case "dateTime":
      return dateTimeFormatter.format(new Date(date)).toString();
    case "longDate":
      return longDateFormatter.format(new Date(date)).toString();
    case "shortDate":
      return shortDateFormatter.format(new Date(date)).toString();
    case "veryShortDate":
      return veryShortDateFormatter.format(new Date(date)).toString();
  }
};

export const globalFormatPrice = (price: number) =>
  priceFormatter.format(price);

export const globalFormatTime = (
  date: Date | string,
  formatter: "longTime" | "shortTime" | "veryShortTime" | "stringTime"
) => {
  switch (formatter) {
    case "longTime":
      return longTimeFormatter.format(date as Date).toString();
    case "shortTime":
      return shortTimeFormatter.format(date as Date).toString();
    case "veryShortTime":
      return veryShortTimeFormatter.format(date as Date).toString();
    case "stringTime":
      return stringTimeFormatter(date as string).toString();
  }
};

/**
 * * Date Formatters
 */
const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit"
});

const longDateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric"
});

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric"
});

const veryShortDateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "Asia/Jakarta"
});

/**
 * * Price Formatters
 */
const priceFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR"
});

/**
 * * Time Formatters
 */
const longTimeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  timeZone: "Asia/Jakarta"
});

const shortTimeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Jakarta"
});

const veryShortTimeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "numeric",
  hour12: false,
  timeZone: "Asia/Jakarta"
});

const stringTimeFormatter = (time: string) => {
  const [hours, minutes] = time.split(":");

  return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
};
