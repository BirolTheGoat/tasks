import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

function App() {
 const [tasks, setTasks] = useState([])
 const [tasksInput, setTasksInput] = useState('')
 const [session, setSession] = useState(null)
 const [email, setEmail] = useState('')
 const [password, setPassword] = useState('')
 const [authMessage, setAuthMessage] = useState('')

useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session)
  })

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    setSession(session)
  })

  return () => subscription.unsubscribe()
}, [])

useEffect(() => {
  if (session) {
    fetchTasks()
  } else {
    setTasks([])
  }
}, [session])

async function handleSignUp() {
  const { error } = await supabase.auth.signUp({ email, password })
  if (error) {
    setAuthMessage(error.message)
  } else {
    setAuthMessage('Check your email to confirm your account!')
  }
}

async function handleLogIn() {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    setAuthMessage(error.message)
  } else {
    setSession(data.session)
  }
}

 async function handleLogOut() {
  await supabase.auth.signOut()
 }

 function handleEmailChange(event) {
   setEmail(event.target.value)
 }

 function handlePasswordChange(event) {
   setPassword(event.target.value)
 }





 async function fetchTasks() {
  const { data, error } = await supabase.from('tasks').select('*').eq('user_id', session.user.id)
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
  const { data, error } = await supabase.from('tasks').insert([{ task: tasksInput, user_id: session.user.id }]).select()
  if (error) {
    console.log(error)
  } else {
    setTasks([...tasks, ...data])
    setTasksInput('')
  }
}

 return (
  <div>
    {!session ? (
      <div>
        <input type="email" value={email} onChange={handleEmailChange} placeholder="Email" />
        <input type="password" value={password} onChange={handlePasswordChange} placeholder="Password" />
        <button onClick={handleSignUp}>Sign Up</button>
        <button onClick={handleLogIn}>Log In</button>
        <p>{authMessage}</p>
      </div>
    ) : (
      <div>
        <input value={tasksInput} onChange={handleTaskInputChange} />
        <button onClick={handleAddTask}>Add Task</button>
        <button onClick={handleLogOut}>Log Out</button>
        <ul>
          {tasks.map((t) => (
            <li key={t.id}>{t.task}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
)
}
export default App
