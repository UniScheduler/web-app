# 🦃 UniScheduler

A modern, intelligent course scheduling platform built for students. This project is developed by combining an intuitive React-based frontend, a robust Flask backend, and smart scheduling logic powered by Google's Gemini API.
---


## 🎯 Overview

UniScheduler helps students create optimal class schedules based on personal preferences like class codes, professor choices, and custom time constraints. With natural language support, students can simply type requests like:

> "Don't give me too many classes on Monday"  
> "Prefer no morning classes before 10am"  

and the system will intelligently generate a personalized schedule using Gemini.

---

## ⚙️ Tech Stack

**Frontend**  
- React.js  
- Tailwind CSS *(for UI styling)*  
- Axios *(API integration)*

**Backend**  
- Flask (Python)  
- SQLite / PostgreSQL *(configurable)*  
- Flask-CORS  
- Gemini API *(natural language scheduling)*

---

## 🚀 Features

- 🔍 **Course Search with Optional Filters**  
  Add courses using class codes or professors — both fields are optional for flexibility.

- 💬 **Natural Language Schedule Optimization**  
  Enter plain English prompts (powered by Gemini) to generate an ideal schedule.

- 🔄 **Real-Time Conflict Detection**  
  Instantly spot and resolve overlapping class timings.

- 💾 **Save and Compare Schedules**  
  Store multiple variations of your schedule for review.

- 📱 **Fully Responsive UI**  
  Works across desktop, tablet, and mobile devices.

---

## 📦 Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/AnjanB3012/UniScheduler
cd UniScheduler
```
2. Frontend Setup
```bash
cd frontend
npm install
npm start
```
3. Backend Setup
```bash
pip install -r requirements.txt
python app.py
```

---

### 🧠 Sample Gemini Prompts

You can use natural language in the AI assistant textbox:

“Avoid classes on Fridays”
“I want only Tuesday/Thursday lectures”
“Keep mornings free before 10am”
“Don’t overload Mondays with too many classes”
Gemini will interpret your input and intelligently select the best-fitting schedule from available courses.

---

### 👨‍💻 Authors

Laksh Bharani <br>
Computer Science @ Virginia Tech <br>
📧 laksh.bharani@gmail.com <br>

Anjan Bellamkonda <br>
Computer Science @ Virginia Tech <br>
📧 bellamkonda.anjan.usa@gmail.com <br>

