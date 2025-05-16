import styles from "./App.module.css";
import React, { useState } from "react";
import { WeekCalendar } from "./Components/Calendar/WeekCalendar/WeekCalendar";
import { EventForm } from "./Components/EventForm/EventForm";

function App() {
  const [events, setEvents] = useState([]);

  const handleAddEvent = (event) => {
    setEvents((prevEvents) => [...prevEvents, event]);
  };

  return (
    <div className={styles.app}>
      <div className={styles.sideBarContainer}>
        <EventForm onAddEvent={handleAddEvent} />
      </div>
      <WeekCalendar events={events} />
    </div>
  );
}
export default App;
