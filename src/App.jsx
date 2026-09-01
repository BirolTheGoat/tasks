import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import './App.css'

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

  async function handleToggleComplete(id, currentStatus) {
    const { error } = await supabase.from('tasks').update({ completed: !currentStatus }).eq('id', id)
    if (error) {
      console.log(error)
    } else {
      setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !currentStatus } : t)))
    }
  }

  return (
    <div className="page">
      {!session ? (
        <div className="auth-card">
          <h1>Tasks</h1>
          <input className="text-input" type="email" value={email} onChange={handleEmailChange} placeholder="Email" />
          <input className="text-input" type="password" value={password} onChange={handlePasswordChange} placeholder="Password" />
          <div className="button-row">
            <button className="btn btn-primary" onClick={handleSignUp}>Sign Up</button>
            <button className="btn btn-secondary" onClick={handleLogIn}>Log In</button>
          </div>
          {authMessage && <p className="auth-message">{authMessage}</p>}
        </div>
      ) : (
        <div className="app-card">
          <div className="app-header">
            <h1>Tasks</h1>
            <button className="btn btn-logout" onClick={handleLogOut}>Log Out</button>
          </div>
          <div className="task-form">
            <input className="text-input" value={tasksInput} onChange={handleTaskInputChange} placeholder="Add a new task..." />
            <button className="btn btn-primary" onClick={handleAddTask}>Add Task</button>
          </div>
          <ul className="task-list">
            {tasks.map((t) => (
              <li key={t.id} className="task-item">
                <input
                  className="task-checkbox"
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => handleToggleComplete(t.id, t.completed)}
                />
                <span className={t.completed ? 'task-text completed' : 'task-text'}>
                  {t.task}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default App
