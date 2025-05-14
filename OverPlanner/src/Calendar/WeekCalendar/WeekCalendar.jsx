import styles from "./WeekCalendar.module.css";

export const WeekCalendar = () => {
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return (
    <div className={styles.calendarContainer}>
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

        {days.map((day, dayIndex) => (
          <div key={day} className={styles.dayColumn}>
            <div className={styles.dayHeader}>
              <div className={styles.dayLabel}>{day}</div>
              <div className={styles.dayDate}>{dayIndex + 1}</div>
            </div>
            <div className={styles.headerGap}></div>
            {hours.map((_, hourIndex) => (
              <div
                key={`${dayIndex}-${hourIndex}`}
                className={styles.timeCell}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
