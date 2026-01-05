'use client';

import { useState } from 'react';

type Priority = 'high' | 'medium' | 'low';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
}

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, {
        id: Date.now().toString(),
        text: newTask,
        completed: false,
        priority: 'medium'
      }]);
      setNewTask('');
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const changePriority = (id: string, priority: Priority) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, priority } : task
    ));
  };

  const startTimer = () => {
    if (!isTimerRunning) {
      setIsTimerRunning(true);
      const interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev === 0) {
            setTimerMinutes(prevMin => {
              if (prevMin === 0) {
                stopTimer();
                return 0;
              }
              return prevMin - 1;
            });
            return 59;
          }
          return prev - 1;
        });
      }, 1000);
      setTimerInterval(interval);
    }
  };

  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    stopTimer();
    setTimerMinutes(25);
    setTimerSeconds(0);
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
    }
  };

  return (
    <div className="min-h-screen bg-white p-8 md:p-16">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-5xl font-bold text-black tracking-tight">Tasks</h1>
          <div className="h-px bg-black"></div>
        </div>

        {/* Timer Section */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-black">Timer</h2>
          <div className="border border-black p-8 space-y-6">
            <div className="text-7xl font-light text-black text-center tabular-nums">
              {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={startTimer}
                disabled={isTimerRunning}
                className="px-8 py-3 border border-black text-black hover:bg-black hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Start
              </button>
              <button
                onClick={stopTimer}
                disabled={!isTimerRunning}
                className="px-8 py-3 border border-black text-black hover:bg-black hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Pause
              </button>
              <button
                onClick={resetTimer}
                className="px-8 py-3 border border-black text-black hover:bg-black hover:text-white transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Task Input */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-black">Add Task</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              placeholder="What needs to be done?"
              className="flex-1 px-4 py-3 border border-black text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              onClick={addTask}
              className="px-8 py-3 bg-black text-white hover:bg-gray-800 transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-black">Today</h2>
          <div className="space-y-px">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-4 p-4 border-t border-black first:border-t-0"
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="w-6 h-6 border-2 border-black cursor-pointer accent-black"
                />
                <span className={`flex-1 text-lg ${task.completed ? 'line-through text-gray-400' : 'text-black'}`}>
                  {task.text}
                </span>
                <select
                  value={task.priority}
                  onChange={(e) => changePriority(task.id, e.target.value as Priority)}
                  className={`px-3 py-1 border border-black text-sm font-medium ${getPriorityColor(task.priority)} focus:outline-none focus:ring-2 focus:ring-black`}
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="px-4 py-1 text-sm border border-black text-black hover:bg-black hover:text-white transition-colors"
                >
                  Delete
                </button>
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="text-center py-12 text-gray-400 text-lg">
                No tasks yet. Add one above to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

