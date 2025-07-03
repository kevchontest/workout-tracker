import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const defaultWorkouts = [
  {
    day: "Monday",
    focus: "Upper Body (Push/Pull)",
    exercises: [
      { name: "Barbell Bench Press", sets: 4, reps: "6–8" },
      { name: "Barbell Row", sets: 4, reps: "6–8" },
      { name: "Seated DB Overhead Press", sets: 3, reps: "8–12" },
      { name: "Pull-Ups", sets: 3, reps: "6–10" },
      { name: "Hammer Curls", sets: 3, reps: "10–15" },
      { name: "Triceps Extensions", sets: 3, reps: "10–15" },
      { name: "Lateral Raises", sets: 3, reps: "12–15" }
    ]
  },
  {
    day: "Tuesday",
    focus: "Lower Body (Squat Focus)",
    exercises: [
      { name: "Barbell Back Squat", sets: 4, reps: "5–6" },
      { name: "Romanian Deadlift", sets: 3, reps: "8–10" },
      { name: "Bulgarian Split Squat", sets: 3, reps: "10–12" },
      { name: "Planks", sets: 3, reps: "45 sec" },
      { name: "Side Plank Dips", sets: 3, reps: "10–12/side" }
    ]
  },
  {
    day: "Wednesday",
    focus: "Recovery / Optional Cardio",
    exercises: [
      { name: "Zone 2 Treadmill Walk", sets: 1, reps: "30–45 min" },
      { name: "Mobility/Yoga", sets: 1, reps: "20–30 min" }
    ]
  },
  {
    day: "Thursday",
    focus: "Upper Body (Hypertrophy/Volume)",
    exercises: [
      { name: "Incline Press", sets: 4, reps: "8–10" },
      { name: "DB Rows", sets: 4, reps: "8–10" },
      { name: "Seated DB Press", sets: 3, reps: "10–12" },
      { name: "Lateral Raises", sets: 3, reps: "12–15" },
      { name: "Rear Delt Flys", sets: 3, reps: "12–15" },
      { name: "EZ Curls", sets: 3, reps: "10–12" },
      { name: "Overhead Triceps Extensions", sets: 3, reps: "10–12" }
    ]
  },
  {
    day: "Friday",
    focus: "Lower Body (Hinge/Unilateral)",
    exercises: [
      { name: "Deadlift", sets: 4, reps: "3–5" },
      { name: "Front Squat", sets: 4, reps: "6–8" },
      { name: "Step-Ups", sets: 3, reps: "10–12" },
      { name: "Hanging Leg Raise", sets: 3, reps: "12–15" },
      { name: "Side Plank Dips", sets: 3, reps: "10–12/side" }
    ]
  },
  {
    day: "Saturday",
    focus: "Murph Prep Conditioning",
    exercises: [
      { name: "1 Mile Run", sets: 1, reps: "--" },
      { name: "10 Rounds: 5 Pull-Ups, 10 Push-Ups, 15 Air Squats", sets: 10, reps: "--" },
      { name: "20-min EMOM: Pull-Ups, Push-Ups, Air Squats", sets: 1, reps: "20 min" }
    ]
  }
];

const useTimer = (initial = 60) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (
            prev === 1 &&
            typeof window !== "undefined" &&
            "Notification" in window &&
            Notification.permission === "granted"
          ) {
            try {
              new Notification("Rest timer complete! Ready for your next set.");
            } catch (e) {
              console.error("Notification error:", e);
            }
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  return [timeLeft, (newTime) => setTimeLeft(newTime || initial)];
};

function App() {
  const [timeLeft, startTimer] = useTimer();

  const [selectedDay, setSelectedDay] = useState(
    new Date().toLocaleString("en-US", { weekday: "long" })
  );
  const filteredWorkouts = defaultWorkouts.filter((w) => w.day === selectedDay);

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>{selectedDay} Workout</h1>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <label>Choose Day: </label>
        <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
          {defaultWorkouts.map((w) => (
            <option key={w.day} value={w.day}>
              {w.day}
            </option>
          ))}
        </select>
      </div>

      {filteredWorkouts.map((w) => (
        <div key={w.day}>
          <h2>{w.focus}</h2>
          {w.exercises.map((ex, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <strong>
                {ex.name} ({ex.sets}×{ex.reps})
              </strong>
              <div>
                {[...Array(ex.sets)].map((_, setIdx) => (
                  <div key={setIdx} style={{ marginTop: 5 }}>
                    Set {setIdx + 1}: 
                    <input type="number" placeholder="Weight (lbs)" style={{ margin: '0 5px', width: 100 }} onChange={(e) => console.log('Weight:', e.target.value)} />
                    <input type="number" placeholder="Reps" style={{ width: 60 }} onChange={(e) => console.log('Reps:', e.target.value)} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}

      <div style={{ textAlign: "center", marginTop: 30 }}>
        <p>Rest Timer: {timeLeft}s</p>
        <button onClick={() => startTimer(60)}>Start 60s Timer</button>
      </div>
    </div>
  );
}

export default App;;
