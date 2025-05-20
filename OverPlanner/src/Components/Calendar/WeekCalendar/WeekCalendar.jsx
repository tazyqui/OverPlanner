import styles from "./WeekCalendar.module.css";
import { vars } from "../../../vars.jsx";
import React, { useState } from "react";

// ------Functions to handle date calculations-------
const getStartOfWeek = (date) => {
  const day = date.getDay();
  const diff = date.getDate() - day;
  return new Date(date.setDate(diff));
};
const addDays = (date, days) => {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + days);
  return newDate;
};

const getWeekHeader = (weekDates) => {
  const firstDate = weekDates[0];
  const lastDate = weekDates[6];

  const firstMonth = firstDate.toLocaleString("default", { month: "long" });
  const firstYear = firstDate.getFullYear();

  const lastMonth = lastDate.toLocaleString("default", { month: "long" });
  const lastYear = lastDate.getFullYear();

  if (firstMonth === lastMonth && firstYear === lastYear) {
    // Same month and year
    return `${firstMonth} ${firstYear}`;
  } else if (firstYear === lastYear) {
    // Different months, same year
    const shortFirstMonth = firstDate.toLocaleString("default", {
      month: "short",
    });
    const shortLastMonth = lastDate.toLocaleString("default", {
      month: "short",
    });
    return `${shortFirstMonth} - ${shortLastMonth} ${firstYear}`;
  } else {
    // Different years too
    const shortFirstMonth = firstDate.toLocaleString("default", {
      month: "short",
    });
    const shortLastMonth = lastDate.toLocaleString("default", {
      month: "short",
    });
    return `${shortFirstMonth} ${firstYear} - ${shortLastMonth} ${lastYear}`;
  }
};

// Function to get the position of the event in the grid
const getEventPosition = (event) => {
  const date = new Date(event.start);
  const day = date.getDay(); // 0 (Sun) - 6 (Sat)
  const hour = date.getHours(); // 0 - 23
  const minute = date.getMinutes(); // 0 - 59
  return { day, hour, minute };
};

export const WeekCalendar = ({ events }) => {
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  const [startOfWeek, setStartOfWeek] = useState(getStartOfWeek(new Date()));

  // Current week dates
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });


  return (
    <div className={styles.calendarContainer}>
      <div className={styles.calendarHeader}>
        <div className={styles.calendarHeaderButtons}>
          <button
            className={styles.previousButton}
            onClick={() => setStartOfWeek(addDays(startOfWeek, -7))}
          >
            Prev
          </button>
          <button
            className={styles.todayButton}
            onClick={() => setStartOfWeek(getStartOfWeek(new Date()))}
          >
            Today
          </button>
          <button
            className={styles.nextButton}
            onClick={() => setStartOfWeek(addDays(startOfWeek, 7))}
          >
            Next
          </button>
        </div>

        <h2 className={styles.calendarMonth}>{getWeekHeader(weekDates)}</h2>
      </div>
      <div className={styles.calendarGrid}>
        <div className={styles.timeColumn}>
          <div className={styles.timeHeader}>UTC</div>
          <div className={styles.headerGap}></div>
          {hours.map((hour) => (
            <div key={hour} className={styles.timeLabel}>
              {hour}
            </div>
          ))}
        </div>

        {weekDates.map((date, dayIndex) => (
          <div
            key={date}
            className={`${styles.dayColumn} ${
              date.toDateString() === new Date().toDateString() ? styles.todayColumn : ""
            }`}
          >
            <div className={styles.dayHeader}>
              <div className={styles.dayLabel}>
                {weekDates[dayIndex].toLocaleDateString("en-US", {
                  weekday: "short",
                })}
              </div>
              <div className={styles.dayDate}>
                {weekDates[dayIndex].getDate()}
              </div>
            </div>
            <div className={styles.headerGap}></div>

            <div className={styles.timeCellsContainer}>
              {hours.map(() => (
                <div key={date} className={styles.timeCell}></div>
              ))}

              {/* ---------------Fill in Events--------------- */}
              {/*One day Event*/}
              {events
                .filter((e) => new Date(e.start).getDay() === dayIndex)
                .map((event) => {
                  const start = new Date(event.start);
                  //console.log("start", start);
                  const end = new Date(event.end);
                  //console.log("end", end);
                  const startHour = start.getHours() + start.getMinutes() / 60;
                  //console.log("startHour", startHour);
                  const duration = (end - start) / (1000 * 60 * 60);
                  //console.log("duration", duration);
                  const top = startHour * vars.rowHeight; // 100px per hour
                  //console.log("top", top);
                  const height = duration * vars.rowHeight; // 100px per hour
                  //console.log("height", height);

                  return (
                    <div
                      key={event.id}
                      className={styles.eventBlock}
                      style={{
                        top: `${top}px`,
                        height: `${height}px`,
                      }}
                    >
                      {event.title}
                    </div>
                  );
                })}

              {/*Daily Event*/}
              {events
                .filter((e) => new Date(e.start).getDay() === dayIndex)
                .map((event) => {
                  const { day, hour, minute } = getEventPosition(event);
                  const top =
                    hour * vars.rowHeight + (minute / 60) * vars.rowHeight;
                  const height = vars.rowHeight; // 100px per hour

                  return (
                    <div
                      key={event.id}
                      className={styles.eventBlock}
                      style={{
                        top: `${top}px`,
                        height: `${height}px`,
                      }}
                    >
                      {event.title}
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
