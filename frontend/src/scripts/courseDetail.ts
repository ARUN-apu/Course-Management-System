import { isAuthenticated, CurrentUser, logout } from "./auth.js";
import { CourseById } from "./course.js";
import { getModulesByCourse } from "./modules.js";
import { getLessonsByModule } from "./lesson.js";
import { isAlreadyEnrolled } from "./enrollment.js";
import { StudentNavbar } from "../components/navbar.js";

declare const Swal: any;
if(!isAuthenticated()) {
    window.location.href = "./login.html";
}
const user = CurrentUser();

const navbar = document.getElementById("navbar");
if(navbar) {
    navbar.innerHTML = StudentNavbar(user.name);
    const hamburgerBtn = document.querySelector("#hamburger") as HTMLButtonElement;
    const mobileMenu = document.querySelector("#Menu") as HTMLUListElement;
    if(hamburgerBtn) {
        hamburgerBtn.addEventListener("click", () => {
            mobileMenu.classList.toggle("hidden");
        })
    }
}

const dashboardLink = document.getElementById("dashboardLink");
if(dashboardLink) {
    dashboardLink.addEventListener("click", () => {
        window.location.href = "./studentDashboard.html";
    })
}

const enrolledLink = document.getElementById("enrolledLink");
if(enrolledLink) {
    enrolledLink.addEventListener("click", () => {
        window.location.href = "./studentDashboard.html";
    })
}

const profileLink = document.getElementById("profileLink");
if(profileLink) {
    profileLink.addEventListener("click", () => {
        window.location.href = "./studentDashboard.html";
    })
}

const logoutBtn = document.getElementById("logoutBtn");
if(logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        logout();
        window.location.href = "../../index.html";
    })
}

const courseId = Number(localStorage.getItem("selectedCourseId"));

if(!courseId) {
    window.location.href = "./studentDashboard.html";
}

const enrolled = isAlreadyEnrolled(user.id, courseId);

if(!enrolled) {
    Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "Please enroll in this course first!",
        confirmButtonColor: "red"
    }).then(() => {
        window.location.href = "./studentDashboard.html";
    })
}

const course = CourseById(courseId);

if(!course) {
    window.location.href = "./studentDashboard.html";
} else {
    const courseTitle = document.getElementById("courseTitle");
    const courseDescription = document.getElementById("courseDescription");
    const courseFee = document.getElementById("courseFee");

    if(courseTitle){
        courseTitle.innerText = course.title;
    } 
    if(courseDescription) courseDescription.innerText = course.description;
    if(courseFee) courseFee.innerHTML = `Fee: &#8377;${course.courses_fee}`;

    const modulesList = document.getElementById("modulesList");
    if(modulesList) {
        const modules = getModulesByCourse(courseId);

        if(modules.length === 0) {
            modulesList.innerHTML = `<p>No modules added till now.</p>`;
        } else {
            modules.forEach((module, index) => {
                const lessons = getLessonsByModule(module.id);
                let lessonsHTML = "";
                if(lessons.length === 0){
                    lessonsHTML = `<p class="text-gray-400 text-sm mt-2">No lessons added yet.</p>`;
                } else {
                    lessons.forEach((lesson, i) => {
                        lessonsHTML += `
                        <div class="lessonItem border rounded-lg p-4 mt-2 cursor-pointer bg-gray-50" data-content="${lesson.content_url}">
                            <p class="font-medium text-sm">${i + 1}. ${lesson.title}</p>
                            <p class="lessonContent hidden text-sm text-gray-600 mt-2 break-all">${lesson.content_url}</p>
                        </div>`
                    })
                }
                modulesList.innerHTML += `
                <div class="border rounded-lg mb-4">
                <div class="moduleHeader cursor-pointer flex items-center gap-4 border-b py-3">
                    <div class="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                        ${index + 1}
                    </div>
                    <p class="font-semibold">${module.title}</p>
                </div>
                
                <div class="lessonsContainer hidden p-4">
                ${lessonsHTML}
                </div>
                </div>
                `
            })
            const moduleHeaders = document.querySelectorAll(".moduleHeader");
            moduleHeaders.forEach(header => {
                header.addEventListener("click", () => {
                    const lessonsContainer = header.nextElementSibling;
                    if(lessonsContainer) {
                        lessonsContainer.classList.toggle("hidden");
                    }
                })
            })

            const lessonItems = document.querySelectorAll(".lessonItem");
            lessonItems.forEach(item => {
                item.addEventListener("click", () => {
                    const content = item.querySelector(".lessonContent");
                    if(content) {
                        content.classList.toggle("hidden");
                    }
                })
            })
        }
    }
}
