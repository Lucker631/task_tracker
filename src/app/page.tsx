// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Goal } from "./types";

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [earnedPlayTime, setEarnedPlayTime] = useState<number>(0);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalReward, setNewGoalReward] = useState(15);

  // Client-side initialization
  useEffect(() => {
    setIsClient(true);
    const savedGoals = localStorage.getItem("goals");
    const savedPlayTime = localStorage.getItem("playTime");
    if (savedGoals) setGoals(JSON.parse(savedGoals));
    if (savedPlayTime) setEarnedPlayTime(Number(savedPlayTime));
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isClient) {
      localStorage.setItem("goals", JSON.stringify(goals));
      localStorage.setItem("playTime", String(earnedPlayTime));
    }
  }, [isClient, goals, earnedPlayTime]);

  const addGoal = () => {
    if (newGoalTitle.trim() === "") return;
    const newGoal: Goal = {
      id: Date.now().toString(),
      title: newGoalTitle,
      completed: false,
      playTimeReward: newGoalReward,
    };
    setGoals([...goals, newGoal]);
    setNewGoalTitle("");
    setNewGoalReward(15);
  };

  const toggleGoal = (id: string) => {
    setGoals(
      goals.map((goal) => {
        if (goal.id === id) {
          if (!goal.completed) {
            setEarnedPlayTime((prev) => prev + goal.playTimeReward);
          } else {
            setEarnedPlayTime((prev) =>
              Math.max(0, prev - goal.playTimeReward)
            );
          }
          return { ...goal, completed: !goal.completed };
        }
        return goal;
      })
    );
  };

  const deleteGoal = (id: string) => {
    const goal = goals.find((g) => g.id === id);
    if (goal?.completed) {
      setEarnedPlayTime((prev) => Math.max(0, prev - goal.playTimeReward));
    }
    setGoals(goals.filter((goal) => goal.id !== id));
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      {/* Main Container */}
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">
          Goal Tracker
        </h1>

        {/* Play Time Section */}
        <div className="bg-green-50 rounded-lg p-4 mb-6">
          <h2 className="text-black font-semibold mb-2">Earned Play Time</h2>
          <div className="flex justify-between items-center">
            <p className="text-3xl font-bold text-green-600">
              {earnedPlayTime} minutes
            </p>
            <button
              onClick={() => setEarnedPlayTime(0)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Reset Time
            </button>
          </div>
        </div>

        {/* Add Goal Form */}
        <div className="mb-6">
          <input
            type="text"
            value={newGoalTitle}
            onChange={(e) => setNewGoalTitle(e.target.value)}
            placeholder="What's your next goal?"
            className="w-full p-2 border rounded mb-2 text-black"
          />
          <div className="flex gap-2 mb-2">
            <input
              type="number"
              value={newGoalReward}
              onChange={(e) => setNewGoalReward(Number(e.target.value))}
              min="1"
              className="w-20 p-2 border rounded text-black"
            />
            <span className="flex items-center text-black">minutes reward</span>
          </div>
          <button
            onClick={addGoal}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Add Goal
          </button>
        </div>

        {/* Goals List */}
        <div className="space-y-2">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className="flex items-center justify-between border rounded p-3 hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={goal.completed}
                  onChange={() => toggleGoal(goal.id)}
                  className="w-5 h-5"
                />
                <span
                  className={
                    goal.completed
                      ? "line-through opacity-50 text-black"
                      : "text-black"
                  }
                >
                  {goal.title} (+{goal.playTimeReward}min)
                </span>
              </div>
              <button
                onClick={() => deleteGoal(goal.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          ))}
          {goals.length === 0 && (
            <p className="text-center text-black py-4">
              No goals yet. Add your first goal above!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
