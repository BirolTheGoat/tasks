import { useState } from 'react'

import './App.css'

function App() {
 const [tasks, setTasks] = useState([])
 const [tasksInput, setTasksInput] = useState('')

 function handleTaskInputChange(event) {
  setTasksInput(event.target.value)
 }

 function handleAddTask() {
  setTasks([...tasks, tasksInput])
  setTasksInput('')
 }

 return (
  <div> 
    <input value={tasksInput} onChange={handleTaskInputChange} />
    <button onClick={handleAddTask}>Add Task</button>
    <ul>
      {tasks.map((task, index) => (
        <li key={index}>{task}</li>
      ))}
    </ul>
  </div>
 ) 
}
export default App
