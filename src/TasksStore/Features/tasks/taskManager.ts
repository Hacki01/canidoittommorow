"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface Task {
  id: number;
  title: string,
  desc: string,
  isHighPriority: boolean,
  isCompleted: boolean,
  completedDate: Date | null;
  time: string  | null;
  location: string | null;
  plannedDate: Date,
} 

export interface TasksSlice {
  list: {[key:number]:Task};
  nextTaskID: number;
  selectedDate: Date;
}

const initialState: TasksSlice = {
  list: {},
  nextTaskID: 0,
  selectedDate: new Date(),
};


function createID() {
  const date = new Date()
  const dateTimestamp = Math.floor(date.getTime() + parseInt((Math.floor(Math.random() * 100)).toString().padStart(3,"0")));
  return dateTimestamp
}

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export const TasksSlice = createSlice({
  name: "Tasks",
  initialState,
  reducers: {
    setSelectedDate: (state,action: PayloadAction<{date: Date}>) => {
      state.selectedDate = action.payload.date
      return state
    },
    setTasks: (state,action: PayloadAction<{tasks: TasksSlice}>) => {
      state = action.payload.tasks
      state.selectedDate = new Date()
      console.log('Loaded tasks from LocalStorage')
      return state
    },
    moveExpiredTasks: (state) => {
      const todayDate = new Date();
      todayDate.setHours(0,0,0,0)
      for (const id of Object.keys(state.list)) {
        const task = state.list[parseInt(id)]
        if (task.plannedDate < todayDate) {
          task.isHighPriority = true;
          task.plannedDate = new Date()
        }
      }
    },
    addTask:  (state,action: PayloadAction<{title: string, desc?: string, isHighPriority?:boolean, plannedDate?: Date, time?: string, location?: string}>) => {
      const { title, desc = "", plannedDate = addDays(new Date(),1), isHighPriority = false, time = null, location = null} = action.payload
      const id = createID()
      state.list[id] = {
        id,
        title: title || 'No Title Provided',
        desc,
        isHighPriority,
        isCompleted: false,
        completedDate: null,
        time,
        location,
        plannedDate,
      };
      return state
    },
    editTask: (state,action: PayloadAction<{id:number, title: string, desc?: string, isHighPriority?:boolean, time?: string, location?: string}>) => {
      const {id, title, desc = "", isHighPriority = false, time = null, location = null} = action.payload
      if (!id ||!state.list[id]) return state
      state.list[id].title = title
      state.list[id].desc = desc
      state.list[id].isHighPriority = isHighPriority
      state.list[id].time = time
      state.list[id].location = location
      return state
    },
    updatePlannedDate: (state,action: PayloadAction<{id:number, date:Date}>) => {
      const { id, date } = action.payload
      if (!id || !state.list[id]) return state
      state.list[id].plannedDate = date
      return state
    },
    setCompleted: (state,action: PayloadAction<{id:number, status?: boolean}>) => {
      const { id, status = true } = action.payload
      if (!id || !state.list[id]) return state
      state.list[id].completedDate = status ? new Date() : null 
      state.list[id].isCompleted = status
      return state
    },
    setHighPriority: (state, action: PayloadAction<{id:number, status?: boolean}>) => {
      const { id, status = true } = action.payload
      if (!id || !state.list[id]) return state
      state.list[id].isHighPriority = status
      return state
    },
    removeTask: (state,action: PayloadAction<{id:number}>) => {
      const { id } = action.payload
      if (!id || !state.list[id]) return state
      delete state.list[id]
      return state
    }
  },
})

export const { addTask,editTask, moveExpiredTasks, removeTask, setCompleted, setTasks, setSelectedDate, setHighPriority, updatePlannedDate } = TasksSlice.actions;

export default TasksSlice.reducer;