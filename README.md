# Course Management System Frontend Project

## Project Overview

A frontend-Only Course Management System built with Typescript, Tailwind CSS, HTML and LocalStorage for data persistence. Supports three roles - Admin, Instructor, and Student -- each with their own dashboard and features.

## Live Preview

 Open Index.html in your browser after following the setup steps below:

## Prequisites

Make Sure you have these installed before starting:
- Node.js
- npm(comes with Node.js)

Check if Already installed

- node --version
- npm --version

If not Installed

- use this URL to install:
  -- https://nodejs.org/en/download

 ## Tech Stack

 Technology | Version | Purpose 

 TypeScript | ^5.9.3 | All application logic 
 HTML5      |    —   | Page structure 
 Tailwind CSS | ^4.2.1 | Styling and responsive design 
 localStorage |  —     | Data storage (no backend) 
 SweetAlert2 |   CDN   | Alert and confirmation dialogs 
 Font Awesome |  CDN   | Icons (hamburger menu etc.) 

 ## Project Structure

backend design
|- API.yaml
database
|- EER-Diagram.png
|- Course management system.sql
docs
|- SRS Documentn CMS
frontend/
|---assets
|     |--avatar.png 
├── index.html                  
├── dist/
│   ├-- output.css              
│   └-- scripts/                
│       ├-- main.js
│       ├-- auth.js
│       ├-- login.js
│       └-- localstorage.js
|       |-- course.js
|       |-- enrollment.js
|       |-- modules.js
|       |-- lesson.js
|       |-- profile.js
|       |-- register.js
|       |-- studentDashboard.js
|       |-- instructorDashboard.js
|       |-- adminDashboard.ts
|       |-- courseDetail.js
|       |-- coursePreview.js
|       |-- manageModules.js
|       |-- index.js        
├── src/
│   ├── components/
│   │   ├-- navbar.ts           
│   │   └-- CourseCard.ts       
│   ├── pages/
│   │   ├-- login.html
│   │   ├-- register.html
│   │   ├-- studentDashboard.html
│   │   ├-- instructorDashboard.html
│   │   ├-- adminDashboard.html
│   │   ├-- courseDetail.html
│   │   ├-- coursePreview.html
│   │   └---Modules.html
│   ├── scripts/
│   │   ├-- main.ts             
│   │   ├-- auth.ts             
│   │   ├-- localstorage.ts     
│   │   ├-- course.ts           
│   │   ├-- enrollment.ts      
│   │   ├-- modules.ts          
│   │   ├-- lesson.ts           
│   │   ├-- profile.ts         
│   │   ├-- login.ts            
│   │   ├-- register.ts         
│   │   ├-- studentDashboard.ts
│   │   ├-- instructorDashboard.ts
│   │   ├-- adminDashboard.ts
│   │   ├-- courseDetail.ts
│   │   ├-- coursePreview.ts
│   │   ├-- manageModules.ts
│   │   └-- index.ts           
│   ├-- styles/
│   │   └── input.css           
│   └-- types/
│       ├- user.ts
│       ├- course.ts
│       ├- enrollment.ts
│       ├- module.ts
│       ├- lesson.ts
│       |-- assignment.ts
        |-- lessonProgress.ts
        |-- review.ts
        |-- role.ts  

## Setup The Project

Step 1: Clone the Project

 - git clone git@github.com:asenapati-techrayslabs/Course-Management-System-Capstone-Frontend-Project.git
 - cd Course-Management-System-Capstone-Frontend-Project

Step 2: Install Dependencies

- `npm install`

-- This install: 
     Typescript
     Tailwind CSS
     Concurrently

Step 3: Verify Installations

- `npx tsc --version`
- `npx tailwindcss --version`

step 4: Run the Project

- `npm run dev`

   This runs Typescript complier and TailwindCSS Watcher at the same time in same terminal.

step 5: Open in Browser

- go to `index.html`
     right click on it and go to `open with live server` it will show the project in browser.


## Default Admin Account

An admin account is automatically created when the app loads for the first time.

- Credentials are hardcoded in email: admin@cms.com password: admin@cms1

## Roles & Features

### Admin

- View total users, courses, and enrollments on dashboard
- View and delete users
- View and delete courses
- View all enrollments with search

### Instructor

- Create, edit, and delete their own courses
- Add, edit, and delete modules inside courses
- Add, edit, and delete lessons inside modules
- View enrolled students per course
- Update profile (name and password)

### Student

- Browse and search all available courses
- Enroll in courses
- View enrolled courses and continue learning
- View lessons and module content
- Update profile (name and password)


## Other Dependencies (CDN)

These are loaded automatically via CDN — no installation needed:
LibraryPurposeSweetAlert2Popup alerts and confirmationsFont AwesomeIcons in navbar and UI

Internet connection required for these to work.


## Data Storage
All data is stored in the browser's localStorage. 

Data is saved between page refreshes 
Data is specific for each browser 
Clearing browser data will reset the project 
Data is not shared between different browsers or devices 


## Notes

This is a frontend-only project — there is no backend or database
All data resets if you clear your browser's localStorage
The project uses ES Modules (type="module") so it must be served from a local server or opened as a file directly — do not rename or move HTML files without updating the script paths
