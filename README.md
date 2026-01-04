# Phillogix Systems INC. Employee Time Management System (TMS) Monitoring

## What is this?

A web application for managing employee attendance and time tracking. It automates the process of filling out employee attendance sheets by extracting data from uploaded PDF reports, while also providing full CRUD operations for work logs, signature management, and user authentication.

Instead of manually writing time-in, breaks, time-out, destinations, and remarks from Daily Time Records for each 15-day cut-off period, users can upload a PDF report from the company's official website. The app uses AI to extract the data, populate the work logs, and generate completed, signed attendance sheets in seconds.

Additionally, the app allows manual management of work logs, captures and reuses digital signatures across documents, and provides a secure, authenticated environment for employees.

## Why did I build this?

Every cut-off, employees (including me) had to manually write log data from Daily Time Records into attendance sheets. This was tedious, and time-consuming. This app eliminates that manual work by automating data extraction and sheet generation.

It also centralizes signature management, saving time on future documents and ensuring consistency.

## How does it work?

1. **Upload** the PDF attendance report or Daily Time Records from the company's official website
2. **Extract** - The app uses Google's Gemini AI (via a Flask API) to read and extract all the employee data
3. **Populate** - Extracted data is automatically saved as work logs in the database
4. **Manage** - View, edit, or delete work logs as needed
5. **Generate** - Access individual attendance sheets, automatically signed with your saved signature
6. **Sign** - Capture your signature once and reuse it across all logs and future documents

## Features

- **PDF Data Extraction**: Upload PDFs and automatically extract time logs using AI
- **Work Log Management**: Create, read, update, and delete work logs
- **Signature Capture**: Draw and save digital signatures for document signing
- **Attendance Sheet Generation**: View printable attendance sheets with applied signatures
- **User Authentication**: Secure login and user management via Supabase
- **Responsive Design**: Built with modern UI components for desktop and mobile

Built with **Next.js** (TypeScript + Tailwind CSS) for the frontend, **Flask + Gemini** for PDF processing, **PostgreSQL** (Supabase) for data storage and authentication, and **Drizzle ORM** for database management.

---

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js Server Actions
- **External API**: Flask REST API with Gemini AI integration (PDF extraction)
- **Database**: PostgreSQL (Supabase) with Drizzle ORM
- **Deployment**: Vercel
