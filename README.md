# Phillogix Systems INC. Employee Time Management System (TMS) Monitoring

## What is this?

A web application for managing employee attendance and time tracking. It automates the process of filling out employee attendance sheets by extracting data from uploaded PDF reports, while also providing full CRUD operations for work logs, signature management, and user authentication.

Instead of manually writing time-in, breaks, time-out, destinations, and remarks from Daily Time Records for each 15-day cut-off period, users can upload a PDF report from the company's official website. The app uses AI to extract the data, populate the work logs, and generate completed, signed attendance sheets in seconds.

Additionally, the app allows management of work logs, captures and reuses digital signatures across documents, and provides a secure, authenticated environment for employees.

## Why did I build this?

Every cut-off, employees (including me) had to manually write log data from Daily Time Records into attendance sheets. This was tedious, and time-consuming. This app eliminates that manual work by automating data extraction and sheet generation.

It also centralizes signature management, saving time on future documents and ensuring consistency.

## Features

- **PDF Data Extraction**: Upload PDFs and automatically extract time logs using AI
- **Work Log Management**: Create, read, update, and delete work logs
- **Signature Capture**: Draw and save digital signatures for document signing
- **Attendance Sheet Generation**: View printable attendance sheets with applied signatures
- **User Authentication**: Secure login and user management via Supabase
- **Responsive Design**: Built with modern UI components for desktop and mobile

---

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js Server Actions
- **External API**: Flask REST API with Gemini AI integration (PDF extraction)
- **Database**: PostgreSQL (Supabase) with Drizzle ORM
- **Deployment**: Vercel
