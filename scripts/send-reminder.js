import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const resend = new Resend(process.env.RESEND_API_KEY)

async function main() {
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('task')
    .eq('completed', false)

  if (error) {
    console.error('Error fetching tasks:', error)
    process.exit(1)
  }

  if (tasks.length === 0) {
    console.log('No unfinished tasks, skipping email.')
    return
  }

  const taskList = tasks.map((t) => `- ${t.task}`).join('\n')

  const { error: emailError } = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: process.env.NOTIFY_EMAIL,
    subject: `You have ${tasks.length} unfinished task(s)`,
    text: `Here's your unfinished to-do list:\n\n${taskList}`,
  })

  if (emailError) {
    console.error('Error sending email:', emailError)
    process.exit(1)
  }

  console.log('Reminder email sent successfully.')
}

main()
