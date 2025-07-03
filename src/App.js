import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const defaultWorkouts = [
  {
    day: "Monday",
    focus: "Upper Body (Push/Pull)",
    exercises: [
      { name: "Barbell Bench Press", sets: 3, reps: "6–8" },
      { name: "Barbell Row", sets: 3, reps: "6–8" },
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
      { name: "Incline Press", sets: 3, reps: "8–10" },
      { name: "DB Rows", sets: 3, reps: "8–10" },
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
      { name: "Front Squat", sets: 3, reps: "6–8" },
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
          if (prev === 1 && Notification.permission === "granted") {
            new Notification("Rest timer complete! Ready for your next set.");
