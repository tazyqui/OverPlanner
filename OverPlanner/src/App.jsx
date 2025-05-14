import styles from "./App.module.css";
import { WeekCalendar } from "./Components/Calendar/WeekCalendar/WeekCalendar";
function App() {
  return (
    <div className={styles.App}>
      <WeekCalendar></WeekCalendar>
    </div>
  );
}
export default App;
