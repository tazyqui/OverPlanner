import styles from './WeekCalendar.module.css';
import { vars } from '../../../vars.jsx';
import { DateTime } from 'luxon';
import { useState } from 'react';

// U.S. Time Zones
const US_TIMEZONES = [
  { label: 'ET', value: 'America/New_York' },
  { label: 'CT', value: 'America/Chicago' },
  { label: 'MT', value: 'America/Denver' },
  { label: 'PT', value: 'America/Los_Angeles' },
  { label: 'AKT', value: 'America/Anchorage' },
  { label: 'HST', value: 'Pacific/Honolulu' }
];

// ------Functions to handle date calculations-------
const getWeekHeader = weekDates => {
  const firstDate = weekDates[0];
  const lastDate = weekDates[6];

  if (firstDate.hasSame(lastDate, 'month') && firstDate.hasSame(lastDate, 'year')) {
    return `${firstDate.toFormat('LLLL yyyy')}`;
  } else if (firstDate.hasSame(lastDate, 'year')) {
    return `${firstDate.toFormat('LLL')} - ${lastDate.toFormat('LLL yyyy')}`;
  } else {
    return `${firstDate.toFormat('LLL yyyy')} - ${lastDate.toFormat('LLL yyyy')}`;
  }
};

// Function to get the position of the event in the grid
const getEventPosition = event => {
  const date = new Date(event.start);
  const day = date.getDay(); // 0 (Sun) - 6 (Sat)
  const hour = date.getHours(); // 0 - 23
  const minute = date.getMinutes(); // 0 - 59
  return { day, hour, minute };
};

export const WeekCalendar = ({ events }) => {
  const [timeZone, setTimeZone] = useState(DateTime.now().zoneName);
  const [startOfWeek, setStartOfWeek] = useState(DateTime.now().setZone(timeZone).startOf('week'));
  const hours = Array.from({ length: 24 }, (_, i) => DateTime.fromObject({ hour: i }, { timeZone }).toFormat('h:mm a'));

  // Current week dates
  const weekDates = Array.from({ length: 7 }, (_, i) => startOfWeek.plus({ days: i }));
  const today = DateTime.now().setZone(timeZone);

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.calendarHeader}>
        <div className={styles.calendarHeaderButtons}>
          <button className={styles.previousButton} onClick={() => setStartOfWeek(startOfWeek.minus({ weeks: 1 }))}>
            Prev
          </button>
          <button className={styles.todayButton} onClick={() => setStartOfWeek(setStartOfWeek(DateTime.now().startOf('week')))}>
            Today
          </button>
          <button className={styles.nextButton} onClick={() => setStartOfWeek(startOfWeek.plus({ weeks: 1 }))}>
            Next
          </button>
        </div>

        <h2 className={styles.calendarMonth}>{getWeekHeader(weekDates)}</h2>
      </div>
      <div className={styles.calendarGrid}>
        <div className={styles.timeColumn}>
          <div className={styles.timeZoneContainer}>
            <select className={styles.timeZone} value={timeZone} onChange={e => setTimeZone(e.target.value)}>
              {US_TIMEZONES.map(tz => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.headerGap}></div>
         
          {hours.map(hour => (
            <div key={hour} className={styles.timeLabel}>
              {hour}
            </div>
          ))}
        </div>

        {weekDates.map(dt => (
          <div key={dt.toISODate()} className={`${styles.dayColumn} ${dt.hasSame(today, 'day') ? styles.todayColumn : ''}`}>
            <div className={styles.dayHeader}>
              <div className={styles.dayLabel}>{dt.toFormat('ccc')}</div>
              <div className={styles.dayDate}>{dt.day}</div>
            </div>
            <div className={styles.headerGap}></div>

            {/* ---------------Time Cells--------------- */}
            <div className={styles.timeCellsContainer}>
              {hours.map(hour => (
                <div key={hour} className={styles.timeCell}></div>
              ))}

              {/* ---------------Fill in Events--------------- */}
              {/*One day Event*/}
              {events
                .filter(e => DateTime.fromISO(e.start).hasSame(date, 'day'))
                .map(event => {
                  const start = DateTime.fromISO(event.start);
                  const end = DateTime.fromISO(event.end);
                  const startHour = start.hour + start.minute / 60;
                  const duration = end.diff(start, 'hours').hours;
                  const top = startHour * vars.rowHeight;
                  const height = duration * vars.rowHeight;

                  return (
                    <div key={event.id} className={styles.eventBlock} style={{ top: `${top}px`, height: `${height}px` }}>
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
