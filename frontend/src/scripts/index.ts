import { LandingCourseCard } from "../components/CourseCard.js";
import type { User } from "../types/user.js";
import { isAuthenticated, CurrentUser } from "./auth.js";
import { Courses } from "./course.js";
import { getData } from "./localstorage.js";
document.addEventListener("DOMContentLoaded", () => {
    if (isAuthenticated()) {
        const user = CurrentUser();
        if (user.role_id === 1) {
            window.location.href = "./src/pages/adminDashboard.html";
        } else if (user.role_id === 2) {
            window.location.href = "./src/pages/instructorDashboard.html";
        } else {
            window.location.href = "./src/pages/studentDashboard.html";
        }
    }
    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");

    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            window.location.href = "./src/pages/login.html";
        })
    }

    if (registerBtn) {
        registerBtn.addEventListener("click", () => {
            window.location.href = "./src/pages/register.html";
        })
    }

    const coursesList = document.getElementById("coursesList");
    if (coursesList) {
        const courses = Courses();
        const users = getData<User>("users");

        if (courses.length === 0) {
            coursesList.innerHTML = `<p class="text-gray-500 text-center col-span-3">No courses available yet.</p>`;
        } else {
            courses.forEach(course => {
                const instructor = users.find(u => u.id === course.instructor_id);
                const instructorName = instructor ? instructor.name : "Arun Senapati";
                coursesList.innerHTML += LandingCourseCard(course, instructorName);
            })

            const viewCourseBtn = document.querySelectorAll(".viewCourseBtn");
            viewCourseBtn.forEach(btn => {
                btn.addEventListener("click", () => {
                    const courseId = Number(btn.getAttribute("data-id"));
                    localStorage.setItem("previewCourseId", String(courseId));
                    window.location.href = "./src/pages/coursePreview.html";
                })
            })

        }
        const searchInput = document.getElementById("searchInput") as HTMLInputElement;
        if (searchInput) {
            searchInput.addEventListener("input", () => {
                const searchValue = searchInput.value.trim().toLowerCase();
                const allCards = document.querySelectorAll(".landingCard");
                allCards.forEach(card => {
                    const title = card.getAttribute("data-title") || "";
                    if (title.includes(searchValue)) {
                        card.classList.remove("hidden");
                    } else {
                        card.classList.add("hidden");
                    }
                })
            })
        }
    }

})