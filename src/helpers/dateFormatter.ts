export function dateFormatter(date: Date | string): any {
  return {
    "12hformat": formatAMPM(new Date(date)),
    normalFormat: normalFormat(new Date(date)),
    obj: dateObject(new Date(date)),
    withNames: `${dateObject(new Date(date)).dayName} ${
      dateObject(new Date(date)).monthName
    } ${normalFormat(new Date(date))}`,
  };
}

function formatAMPM(date: Date) {
  let normal = normalFormat(date);
  let hours = date.getHours();
  let minutes: number | string = date.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  const strTime = hours + ":" + minutes + " " + ampm;
  return {
    format: normal + " " + strTime,
    ampm: strTime,
  };
}

function normalFormat(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function dateObject(date: Date) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    date: date.getDate(),
    dayName: days[date.getDay()],
    monthName: monthNames[date.getMonth() + 1],
    hours: date.getHours(),
    minutes: date.getMinutes(),
  };
}
