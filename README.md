# AI Recruiter Assistant - Frontend 🚀

Modern Web Dashboard for **AI-Powered Candidate Ranking** and **CV Management**. This frontend connects to an Advanced RAG backend (FastAPI + LlamaIndex) to help recruiters find the best candidates using semantic search and AI reranking.

![Preview Dashboard](/public/screenshots/preview-1.png)
![Preview Detail](/public//screenshots/preview-2.png)

## ✨ Features

- **📊 Recruiter Dashboard:** Overview of total CVs, search activity, and average candidate scores.
- **📁 CV Management:** Upload multiple files (PDF/Docx), view indexed candidates, and delete records.
- **🎯 AI Ranking:** Start ranking candidates against a custom Job Description using Advanced RAG (Hybrid Search + RRF + Cross-Encoder Reranking).
- **🔄 Session-based Isolation:** Automatically generates a unique `user_id` per browser session to isolate candidate data.
- **⚡ Real-time Feedback:** Upload progress tracking and interactive ranking analysis.
- **📱 Responsive Design:** Built with Tailwind CSS and DaisyUI for a seamless experience on all devices.

## 🛠️ Tech Stack

- **Framework:** [Next.js 15+](https://nextjs.org) (App Router)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com), [DaisyUI](https://daisyui.com)
- **Icons:** [Lucide React](https://lucide.dev)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Components:** Radix UI primitives
- **API Client:** Axios
- **State Management:** React Context API

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 20+ installed
- A running instance of the [AI Recruiter Backend](project-req.md) (FastAPI)

### 2. Environment Setup
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Installation
```bash
npm install
# or
yarn install
```

### 4. Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## 📁 Project Structure

```text
app/
├── candidates/     # CV Listing and Management
├── context/        # Global State (AppsContext)
├── hooks/          # Custom Hooks (useApps)
├── ranking/        # AI Ranking Page
├── upload/         # File Upload Center
├── page.tsx        # Dashboard Overview
components/         # Reusable UI Components
services/           # API Service Layer (Axios)
types/              # TypeScript Interfaces
utils/              # Helpers (Date formatting, etc.)
```

## 🔒 Data Isolation
This project implements a frontend-generated `user_id` stored in `localStorage`. Every browser session is treated as a unique user, ensuring that CVs uploaded by one recruiter are not visible to others unless they share the same backend database configuration.

---
Built with ❤️ for Modern HR Teams.
