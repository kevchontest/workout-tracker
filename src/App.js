import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const defaultWorkouts = [
  { day: "Monday", focus: "Upper Body Strength", exercises: ["Bench Press", "Barbell Row"] },
  { day: "Tuesday", focus: "Lower Body Strength", exercises: ["Back Squat", "Romanian Deadlift"] },
  { day: "Wednesday", focus: "Recovery / Mobility", exercises: ["Zone 2 walk/jog"] },
  { day: "Thursday", focus: "Upper Hypertrophy", exercises: ["Incline Press", "EZ Curls"] },
  { day: "Friday", focus: "Lower Hinge + Core", exercises: ["Deadlift", "Hanging Leg Raise"] },
  { day: "Saturday", focus: "Murph Prep Conditioning", exercises: ["1 Mile Run"] }
];

const exerciseLibrary = [
  // (same 100-exercise list as previously defined)
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
  const [workouts, setWorkouts] = useState(() => {
    const saved = localStorage.getItem("savedProgram");
    return saved ? JSON.parse(saved) : defaultWorkouts;
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [programName, setProgramName] = useState("My Program");

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

  const addExercise = (day, ex) => {
    const updated = workouts.map(w =>
      w.day === day ? { ...w, exercises: [...w.exercises, ex] } : w
    );
    setWorkouts(updated);
  };

  const removeExercise = (day, ex) => {
    const updated = workouts.map(w =>
      w.day === day ? { ...w, exercises: w.exercises.filter(e => e !== ex) } : w
    );
    setWorkouts(updated);
  };

  const saveProgram = () => {
    localStorage.setItem("savedProgram", JSON.stringify(workouts));
    alert(`Saved program: ${programName}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-2">Workout Builder</h1>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Program Name:</label>
          <Input value={programName} onChange={(e) => setProgramName(e.target.value)} className="w-48" />
          <Button onClick={saveProgram}>Save Program</Button>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Rest Timer (sec):</label>
          <Input type="number" value={restTime} onChange={(e) => setRestTime(Number(e.target.value))} className="w-20" />
        </div>
      </div>
      <Tabs defaultValue="Monday" className="w-full">
        <TabsList className="grid grid-cols-3 gap-1 mb-4 overflow-x-auto">
          {workouts.map((w) => (
            <TabsTrigger key={w.day} value={w.day}>{w.day}</TabsTrigger>
          ))}
        </TabsList>
        {workouts.map((w) => (
          <TabsContent key={w.day} value={w.day}>
            <Card>
              <CardContent className="space-y-4 p-4">
                <h2 className="text-xl font-semibold">{w.focus}</h2>
                {w.exercises.map((ex, i) => {
                  const key = `${w.day}-${ex}`;
                  const lastWeight = recs[key] || "";
                  const chartData = (log[key] || []).map((entry, idx) => ({ session: idx + 1, weight: entry.weight }));
                  return (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="font-medium">{ex}</p>
                        <Button variant="destructive" onClick={() => removeExercise(w.day, ex)} size="sm">Remove</Button>
                      </div>
                      <div className="flex gap-2">
                        <Input placeholder="Weight (lbs)" type="number" id={`${key}-weight`} />
                        <Input placeholder="Reps" type="number" id={`${key}-reps`} />
                        <Button onClick={() => {
                          const wVal = document.getElementById(`${key}-weight`).value;
                          const rVal = document.getElementById(`${key}-reps`).value;
                          handleLog(w.day, ex, wVal, rVal);
                        }}>Log Set</Button>
                      </div>
                      {lastWeight && <p className="text-sm text-gray-500">Suggested next weight: {lastWeight} lbs</p>}
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
                <div className="mt-4">
                  <Input placeholder="Search exercise to add..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  <div className="grid grid-cols-2 gap-2 mt-2 max-h-48 overflow-y-auto">
                    {exerciseLibrary.filter(name => name.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 10).map((name, idx) => (
                      <Button key={idx} onClick={() => addExercise(w.day, name)}>{name}</Button>
                    ))}
                  </div>
                </div>
                {timeLeft > 0 && (
                  <p className="text-red-600 font-semibold text-center">Rest Timer: {timeLeft}s</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
