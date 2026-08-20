import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

function App() {
 const [tasks, setTasks] = useState([])
 const [tasksInput, setTasksInput] = useState('')

 useEffect(() => {
  fetchTasks()
}, [])

 async function fetchTasks() {
  const { data, error } = await supabase.from('tasks').select('*')
  if (error) {
    console.error('Error fetching tasks:', error)
  } else {
    setTasks(data)
  }
 }

 function handleTaskInputChange(event) {
  setTasksInput(event.target.value)
 }

 async function handleAddTask() {
  const { data, error } = await supabase.from('tasks').insert([{ task: tasksInput }]).select()
  if (error) {
    console.log(error)
  } else {
    setTasks([...tasks, ...data])
    setTasksInput('')
  }
}

 return (
  <div> 
    <input value={tasksInput} onChange={handleTaskInputChange} />
    <button onClick={handleAddTask}>Add Task</button>
    <ul>
      {tasks.map((t) => (
       <li key={t.id}>{t.task}</li>
      ))}
    </ul>
  </div>
 ) 
}
export default App
