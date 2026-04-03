export function StudentNavbar(userName: string): string {
    return `
    <nav class="bg-amber-200 shadow px-8 py-4 flex justify-between items-center flex-wrap">
        <h1 id="Title" class="text-2xl font-bold text-blue-950">Course Management System</h1>
        <button id="hamburger" class="md:hidden flex flex-col gap-1 cursor-pointer"><i class="fa-solid fa-bars"></i></button>
        <ul id="Menu" class="hidden w-full md:flex md:w-auto md:flex-row md:items-center gap-4 md:gap-6 flex-col mt-4 md:mt-0 md:bg-transparent bg-amber-200">
            <li id="dashboardLink" class="cursor-pointer hover:text-blue-400 font-medium">Dashboard</li>
            <li id="enrolledLink" class="cursor-pointer hover:text-blue-400 font-medium">My Enrollments</li>
            <li id="profileLink" class="cursor-pointer  hover:text-blue-400 font-medium flex items-center gap-2">
            <img src="../../assets/avatar.png" class="w-7 h-7 rounded-full object-cover">Profile</li>   
            <li class="text-lg font-semibold text-blue-950">${userName}</li>
            <li><button id="logoutBtn" class="bg-black text-white px-4 py-2 rounded-lg text-sm cursor-pointer">Logout</button></li>
        </ul>
    </nav>`
}

export function InstructorNavbar(userName: string): string {
    return `
    <nav class="bg-amber-200  shadow px-8 py-4 flex justify-between items-center flex-wrap">
        <h1 id="Title" class="text-2xl font-bold text-blue-950">Course Management System</h1>
        <button id="hamburger" class="md:hidden flex flex-col gap-1 cursor-pointer"><i class="fa-solid fa-bars"></i></button>
        <ul id="Menu" class="hidden w-full md:flex md:w-auto md:flex-row md:items-center gap-4 md:gap-6 flex-col mt-4 md:mt-0 md:bg-transparent bg-amber-200">
            <li id="dashboardLink" class="cursor-pointer hover:text-blue-400 font-medium">Dashboard</li>
            <li id="addCourseLink" class="cursor-pointer hover:text-blue-400 font-medium">Add Course</li>
            <li id="profileLink" class="cursor-pointer hover:text-blue-400 font-medium flex items-center gap-2">
            <img src="../../assets/avatar.png" class="w-7 h-7 rounded-full object-cover">Profile</li> 
            <li class="text-lg font-semibold text-blue-950">${userName}</li>
            <li><button id="logoutBtn" class="bg-black text-white px-4 py-2 rounded-lg text-sm cursor-pointer">Logout</button></li>
        </ul>
    </nav>`
}

export function AdminNavbar(userName: string): string {
    return `
    <nav class="bg-amber-200 shadow px-8 py-4 flex justify-between items-center flex-wrap">
        <h1 id="Title" class="text-2xl font-bold text-blue-950">Course Management System</h1>
        <button id="hamburger" class="md:hidden flex flex-col gap-1 cursor-pointer"><i class="fa-solid fa-bars"></i></button>
        <ul id="Menu" class="hidden w-full md:flex md:w-auto md:flex-row md:items-center gap-4 md:gap-6 flex-col mt-4 md:mt-0 md:bg-transparent bg-amber-200">
            <li id="dashboardLink" class="cursor-pointer hover:text-blue-400 font-medium">Dashboard</li>
            <li id="usersLink" class="cursor-pointer hover:text-blue-400 font-medium">Users</li>
            <li id="coursesLink" class="cursor-pointer hover:text-blue-400 font-medium">Courses</li>
            <li id="profileLink" class="cursor-pointer hover:text-blue-400 font-medium flex items-center gap-2">
            <img src="../../assets/avatar.png" class="w-7 h-7 rounded-full object-cover">Profile</li> 
            <li class="text-lg font-semibold text-blue-950">${userName}</li>
            <li><button id="logoutBtn" class="bg-black text-white px-4 py-2 rounded-lg text-sm cursor-pointer">Logout</button></li>
        </ul>
    </nav>`
}