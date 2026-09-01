# Tasks

A full-stack to-do list app with user accounts and a daily email reminder for unfinished tasks.

**Live app:** https://birolthegoat.github.io/tasks/

## Features

- Sign up / log in with email and password
- Each user only sees their own tasks (enforced at the database level, not just in the app)
- Mark tasks as complete
- A scheduled job checks for unfinished tasks once a day and emails a summary automatically

## Built with

- **React** + **Vite** — frontend
- **Supabase** — Postgres database, authentication, and Row Level Security
- **Resend** — sending the reminder emails
- **GitHub Actions** — automatic deployment on every push, and the daily scheduled reminder job
- **GitHub Pages** — hosting

## About this project

This was built while learning web development and automation from scratch, using [Claude Code](https://claude.com/claude-code) as a hands-on teaching tool — going from HTML/CSS basics through React, a real database with authentication, deployment, and backend automation.
