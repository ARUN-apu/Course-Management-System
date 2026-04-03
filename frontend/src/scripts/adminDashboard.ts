import { isAuthenticated, CurrentUser, logout } from "./auth.js";
import { Courses, deleteCourse } from "./course.js";
import { deleteEnrollment } from "./enrollment.js";
import { getData, deleteItem } from "./localstorage.js";
import { AdminNavbar } from "../components/navbar.js";
import type { User } from "../types/user.js";
import type { Enrollment } from "../types/enrollment.js";
import { loadProfile } from "./profile.js";
declare const Swal: any;

if (!isAuthenticated()) {
    window.location.href = "./login.html";
}

const user = CurrentUser();

if (user.role_id !== 1) {
    window.location.href = "./login.html";
}

const navbar = document.getElementById("navbar");
if (navbar) {
    navbar.innerHTML = AdminNavbar(user.name);
    const Title = document.getElementById("Title");
    if(Title){
        Title.addEventListener("click", () => {
            window.location.href = "../../index.html";
        })
    }
    const hamburgerBtn = document.querySelector("#hamburger") as HTMLButtonElement;
    const mobileMenu = document.querySelector("#Menu") as HTMLUListElement;
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener("click", () => {
            mobileMenu.classList.toggle("hidden");
        })
    }
}
updateStatus();

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        logout();
        window.location.href = "../../index.html";
    })
}

window.addEventListener("storage", (e) => {
    if (e.key === "authToken" && !e.newValue) {
        window.location.href = "../../index.html";
    }
})

const dashboardSection = document.getElementById("dashboardSection");
const usersSection = document.getElementById("usersSection");
const CoursesSection = document.getElementById("coursesSection");
const profileSection = document.getElementById("profileSection");

const dashboardLink = document.getElementById("dashboardLink");
const usersLink = document.getElementById("usersLink");
const coursesLink = document.getElementById("coursesLink");
const profileLink = document.getElementById("profileLink");

if (dashboardLink) {
    dashboardLink.addEventListener("click", () => {
        dashboardSection?.classList.remove("hidden");
        usersSection?.classList.add("hidden");
        CoursesSection?.classList.add("hidden");
        profileSection?.classList.add("hidden");
        updateStatus();
    })
}

if (usersLink) {
    usersLink.addEventListener("click", () => {
        dashboardSection?.classList.add("hidden");
        usersSection?.classList.remove("hidden");
        CoursesSection?.classList.add("hidden");
        profileSection?.classList.add("hidden");
        loadUsers();
    })
}

if (coursesLink) {
    coursesLink.addEventListener("click", () => {
        dashboardSection?.classList.add("hidden");
        usersSection?.classList.add("hidden");
        CoursesSection?.classList.remove("hidden");
        profileSection?.classList.add("hidden");
        loadCourses();
    })
}

if (profileLink) {
    profileLink.addEventListener("click", () => {
        dashboardSection?.classList.add("hidden");
        usersSection?.classList.add("hidden");
        CoursesSection?.classList.add("hidden");
        profileSection?.classList.remove("hidden");
        loadProfile();
    })
}

function loadEnrollments() {
    const enrollmentsList = document.getElementById("enrollmentsList");
    if (!enrollmentsList) return;

    const enrollments = getData<Enrollment>("enrollments");
    const users = getData<User>("users");
    const courses = getData<any>("courses");

    enrollmentsList.innerHTML = "";

    if (enrollments.length === 0) {
        enrollmentsList.innerHTML = `<tr><td colspan="4" class="px-6 py-4 text-gray-500">No enrollments found.</td></tr>`;
        return;
    }

    enrollments.forEach(enrollment => {
        const student = users.find(u => u.id === enrollment.student_id);
        const course = courses.find((c: any) => c.id === enrollment.course_id);

        if (!student || !course) return;

        enrollmentsList.innerHTML += `
        <tr class="enrollmentRow border-t" data-student="${student.name.toLowerCase()}" data-course="${course.title.toLowerCase()}">
            <td class="px-6 py-4">${student.name}</td>
            <td class="px-6 py-4">${student.email}</td>
            <td class="px-6 py-4">${course.title}</td>
            <td class="px-6 py-4">${enrollment.enrolled_at}</td>
        </tr>`
    })

    const enrollmentSearchInput = document.getElementById("enrollmentSearchInput") as HTMLInputElement;
    if (enrollmentSearchInput) {
        enrollmentSearchInput.value = "";
        enrollmentSearchInput.addEventListener("input", () => {
            const searchValue = enrollmentSearchInput.value.trim().toLowerCase();
            const allRows = document.querySelectorAll(".enrollmentRow");
            allRows.forEach(row => {
                const student = row.getAttribute("data-student") || "";
                const course = row.getAttribute("data-course") || "";
                if (student.includes(searchValue) || course.includes(searchValue)) {
                    row.classList.remove("hidden");
                } else {
                    row.classList.add("hidden");
                }
            })
        })
    }
}

function updateStatus() {
    const users = getData<User>("users");
    const courses = Courses();
    const enrollments = getData<Enrollment>("enrollments");

    const totalUsers = document.getElementById("totalUsers");
    const totalCourses = document.getElementById("totalCourses");
    const totalEnrollments = document.getElementById("totalEnrollments");

    const nonAdminUsers = users.filter(u => u.role_id !== 1);

    if (totalUsers) {
        totalUsers.innerText = String(nonAdminUsers.length);
    }
    if (totalCourses) {
        totalCourses.innerText = String(courses.length);
    }
    if (totalEnrollments) {
        totalEnrollments.innerText = String(enrollments.length);
    }
    loadEnrollments();
}

function getRoleName(role_id: Number): string {
    if (role_id === 1) {
        return "Admin";
    } else if (role_id === 2) {
        return "Instructor";
    } else {
        return "Student";
    }
}

function loadUsers() {
    const usersList = document.getElementById("usersList");
    if (!usersList) {
        return;
    }
    const users = getData<User>("users");
    const nonAdminUsers = users.filter(u => u.role_id !== 1);
    usersList.innerHTML = "";

    if (nonAdminUsers.length === 0) {
        usersList.innerHTML = `<tr><td colspan="4" class="px-6 py-4 text-gray-500">No users found.</td></tr>`;
        return;
    }

    nonAdminUsers.forEach(u => {
        usersList.innerHTML += `
        <tr class="userRow border-t" data-name="${u.name.toLowerCase()}" data-email="${u.email.toLowerCase()}">
            <td class="px-6 py-4">${u.name}</td>
            <td class="px-6 py-4">${u.email}</td>
            <td class="px-6 py-4">${getRoleName(u.role_id)}</td>
            <td class="px-6 py-4">
                <button class="deleteUserBtn bg-red-500 text-white px-3 py-1 rounded text-sm" data-id="${u.id}">Delete</button>
            </td>
        </tr>`
    })

    const deleteUserBtn = document.querySelectorAll(".deleteUserBtn");
    deleteUserBtn.forEach(btn => {
        btn.addEventListener("click", () => {
            const userId = Number(btn.getAttribute("data-id"));
            Swal.fire({
                icon: "warning",
                title: "Are you sure?",
                text: "This will permanently delete the user",
                showCancelButton: true,
                confirmButtonColor: "green",
                cancelButtonColor: "red",
                confirmButtonText: "Yes, delete"
            }).then((result: any) => {
                if (result.isConfirmed) {
                    deleteItem("users", userId);
                    deleteStudentEnrollments(userId);
                    const courses = getData<any>("courses");
                    const instructorCourses = courses.filter((c: any) => c.instructor_id === userId);
                    instructorCourses.forEach((course: any) => {
                        deleteCourse(course.id);
                        deleteEnrollment(course.id);
                    })
                    Swal.fire({ icon: "success", title: "User Deleted!", confirmButtonColor: "green" }).then(() => {
                        loadUsers();
                        updateStatus();
                    })
                }
            })
        })
    })

    const userSearchInput = document.getElementById("userSearchInput") as HTMLInputElement;
    if (userSearchInput) {
        userSearchInput.value = "";
        userSearchInput.addEventListener("input", () => {
            const searchValue = userSearchInput.value.trim().toLowerCase();
            const allRows = document.querySelectorAll(".userRow");
            allRows.forEach(row => {
                const name = row.getAttribute("data-name") || "";
                const email = row.getAttribute("data-email") || "";
                if (name.includes(searchValue) || email.includes(searchValue)) {
                    row.classList.remove("hidden");
                } else {
                    row.classList.add("hidden");
                }
            })
        })
    }
}

function loadCourses() {
    const coursesList = document.getElementById("coursesList");
    if (!coursesList) return;
    const courses = Courses();
    coursesList.innerHTML = "";
    if (courses.length === 0) {
        coursesList.innerHTML = `<tr><td colspan="4" class="px-6 py-4 text-gray-500">No courses found.</td></tr>`;
        return;
    }

    courses.forEach(course => {
        coursesList.innerHTML += `
        <tr class="courseRow border-t" data-title="${course.title.toLowerCase()}">
            <td class="px-6 py-4">${course.title}</td>
            <td class="px-6 py-4">${course.description}</td>
            <td class="px-6 py-4">&#8377;${course.courses_fee}</td>
            <td class="px-6 py-4">
                <button class="deleteCourseBtn bg-red-500 text-white px-3 py-1 rounded text-sm" data-id="${course.id}">Delete</button>
            </td>
        </tr>`
    })

    const deleteCourseBtn = document.querySelectorAll(".deleteCourseBtn");
    deleteCourseBtn.forEach(btn => {
        btn.addEventListener("click", () => {
            const courseId = Number(btn.getAttribute("data-id"));
            Swal.fire({
                icon: "warning",
                title: "Are you sure?",
                text: "This will delete the course and all enrollments!",
                showCancelButton: true,
                confirmButtonColor: "green",
                cancelButtonColor: "red",
                confirmButtonText: "Yes, delete"
            }).then((result: any) => {
                if (result.isConfirmed) {
                    deleteCourse(courseId);
                    deleteEnrollment(courseId);
                    Swal.fire({ icon: "success", title: "Course Deleted!", confirmButtonColor: "green" }).then(() => {
                        loadCourses();
                        updateStatus();
                    })
                }
            })
        })
    })
    const courseSearchInput = document.getElementById("courseSearchInput") as HTMLInputElement;
    if (courseSearchInput) {
        courseSearchInput.value = "";
        courseSearchInput.addEventListener("input", () => {
            const searchValue = courseSearchInput.value.trim().toLowerCase();
            const allRows = document.querySelectorAll(".courseRow");
            allRows.forEach(row => {
                const title = row.getAttribute("data-title") || "";
                if (title.includes(searchValue)) {
                    row.classList.remove("hidden");
                } else {
                    row.classList.add("hidden");
                }
            })
        })
    }

}


function deleteStudentEnrollments(userId: number): void {
    const enrollments = getData<Enrollment>("enrollments");
    const remaining = enrollments.filter(e => e.student_id !== userId);
    localStorage.setItem("enrollments", JSON.stringify(remaining));
}