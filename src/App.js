import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const defaultWorkouts = [
  {
    day: "Monday",
    focus: "Upper Body (Push/Pull)",
    exercises: [
      "Barbell Bench Press",
      "Barbell Row",
      "Superset: Overhead Press + Pull-Ups",
      "Superset: Hammer Curls + Triceps Extensions"
    ]
  },
  {
    day: "Tuesday",
    focus: "Lower Body (Squat Focus)",
    exercises: [
      "Barbell Back Squat",
      "Romanian Deadlift",
      "Superset: Bulgarian Split Squat + Planks"
    ]
  },
  {
    day: "Wednesday",
    focus: "Recovery / Optional Cardio",
    exercises: [
      "30–45 min Zone 2 Treadmill Walk",
      "Mobility/Yoga"
    ]
  },
  {
    day: "Thursday",
    focus: "Upper Body (Hypertrophy/Volume)",
    exercises: [
      "Incline Press",
      "Superset: DB Rows + Seated DB Press",
      "Superset: Lateral Raises + Push-Ups",
      "Superset: EZ Curls + Overhead Triceps"
    ]
  },
  {
    day: "Friday",
    focus: "Lower Body (Hinge/Unilateral)",
    exercises: [
      "Deadlift",
      "Front Squat",
      "Superset: Step-Ups + Hanging Leg Raise"
    ]
  },
  {
    day: "Saturday",
    focus: "Murph Prep Conditioning",
    exercises: [
      "1 Mile Run",
      "10 Rounds: 5 Pull-Ups, 10 Push-Ups, 15 Air Squats",
      "20-min EMOM: Pull-Ups, Push-Ups, Air Squats"
    ]
  }
];

const useTimer = (initial = 60) => {
  const [timeLeft, setTimeLeft] = useState(0);
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 1 && Notification.permission === "granted") {
            new Notification("Rest timer complete! Ready for your next set.");
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);
  return [timeLeft, (newTime) => setTimeLeft(newTime || initial)];
};

export default function MobileWorkoutApp() {
  const [log, setLog] = useState({});
  const [recs, setRecs] = useState({});
  const [restTime, setRestTime] = useState(60);
  const [timeLeft, startTimer] = useTimer(restTime);
  const [workouts, setWorkouts] = useState(defaultWorkouts);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const handleLog = (day, ex, weight, reps) => {
    const key = `${day}-${ex}`;
    const prev = log[key] || [];
    const newLog = [...prev, { weight: parseFloat(weight), reps: parseInt(reps), session: prev.length + 1 }];
    setLog({ ...log, [key]: newLog });
    const avg = newLog.reduce((sum, r) => sum + r.weight, 0) / newLog.length;
    setRecs({ ...recs, [key]: Math.round(avg * 1.025 * 10) / 10 });
    startTimer(restTime);
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>Workout Tracker</h1>

      <div style={{ marginBottom: 20 }}>
        <label>Rest Timer (seconds): </label>
        <input
          type="number"
          value={restTime}
          onChange={(e) => setRestTime(Number(e.target.value))}
          style={{ width: 60 }}
        />
      </div>

      {workouts.map((w, wi) => (
        <div key={wi} style={{ marginBottom: 40 }}>
          <h2>{w.day} – {w.focus}</h2>
          {w.exercises.map((ex, ei) => {
            const key = `${w.day}-${ex}`;
            const lastWeight = recs[key] || "";
            const chartData = (log[key] || []).map((entry, idx) => ({ session: idx + 1, weight: entry.weight }));
            return (
              <div key={ei} style={{ marginBottom: 20, paddingLeft: 10 }}>
                <strong>{ex}</strong>
                <div style={{ display: "flex", gap: 8, marginTop: 5 }}>
                  <input id={`${key}-weight`} placeholder="Weight (lbs)" type="number" style={{ width: 100 }} />
                  <input id={`${key}-reps`} placeholder="Reps" type="number" style={{ width: 60 }} />
                  <button onClick={() => {
                    const wVal = document.getElementById(`${key}-weight`).value;
                    const rVal = document.getElementById(`${key}-reps`).value;
                    handleLog(w.day, ex, wVal, rVal);
                  }}>Log Set</button>
                </div>
                {lastWeight && <p style={{ fontSize: "0.8em", color: "gray" }}>Suggested next weight: {lastWeight} lbs</p>}
                {chartData.length > 1 && (
                  <ResponsiveContainer width="100%" height={150}>
                    <LineChart data={chartData}>
                      <XAxis dataKey="session" hide />
                      <YAxis domain={['auto', 'auto']} width={30} />
                      <Tooltip />
                      <Line type="monotone" dataKey="weight" stroke="#8884d8" strokeWidth={2} dot />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            );
          })}
        </div>
      ))}

      {timeLeft > 0 && (
        <p style={{ textAlign: "center", color: "red" }}>Rest Timer: {timeLeft}s</p>
      )}
    </div>
  );
}
