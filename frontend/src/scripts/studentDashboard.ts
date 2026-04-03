import { isAuthenticated, CurrentUser, logout } from "./auth.js";
import { Courses, CourseById } from "./course.js";
import { isAlreadyEnrolled, enrollStudent, StudentEnrollment } from "./enrollment.js";
import { StudentNavbar } from "../components/navbar.js";
import { CourseCard } from "../components/CourseCard.js";
import { getData } from "./localstorage.js";
import type { User } from "../types/user.js";
import { loadProfile } from "./profile.js";
declare const Swal: any

if(!isAuthenticated()) {
    window.location.href = "./login.html";
}

const user = CurrentUser();
if(user.role_id !== 3){
    window.location.href = "./login.html";
}

const navbar = document.getElementById("navbar");
if(navbar) {
    navbar.innerHTML = StudentNavbar(user.name);
    const hamburgerBtn = document.querySelector("#hamburger") as HTMLButtonElement;
    const mobileMenu = document.querySelector("#Menu") as HTMLUListElement;
    hamburgerBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("hidden"); 
    })
}
const enrollments = StudentEnrollment(user.id);
const totalEnrolled = document.getElementById("totalEnrolled");
if(totalEnrolled) {
    totalEnrolled.innerText = String(enrollments.length);
}

const logoutBtn = document.getElementById("logoutBtn");
if(logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        logout();
        window.location.href = "../../index.html";
    })
}

window.addEventListener("storage", (e) => {
    if(e.key === "authToken" && !e.newValue){
        window.location.href = "../../index.html";
    }
})

const dashboardSection = document.getElementById("dashboardSection");
const enrolledSection = document.getElementById("enrolledSection");
const profileSection = document.getElementById("profileSection");

const dashboardLink = document.getElementById("dashboardLink");
const enrolledLink = document.getElementById("enrolledLink");
const profileLink = document.getElementById("profileLink");

if(dashboardLink) {
    dashboardLink.addEventListener("click", () => {
        dashboardSection?.classList.remove("hidden");
        enrolledSection?.classList.add("hidden");
        profileSection?.classList.add("hidden");
        const searchInput = document.getElementById("searchInput") as HTMLInputElement;
        if(searchInput){
            searchInput.value = "";
            getCourses();
        }
    })
}

if(enrolledLink) {
    enrolledLink.addEventListener("click", () => {
        dashboardSection?.classList.add("hidden");
        enrolledSection?.classList.remove("hidden");
        profileSection?.classList.add("hidden");
        getEnrolledCourses();
    })
}

if(profileLink) {
    profileLink.addEventListener("click", () => {
        dashboardSection?.classList.add("hidden");
        enrolledSection?.classList.add("hidden");
        profileSection?.classList.remove("hidden");
        loadProfile();
    })
}

function getInstructorName(instructorId: number): string {
    const users = getData<User>("users");
    const instructor = users.find(u => u.id === instructorId);
    return instructor ? instructor.name : "Arun Senapati";
}

getCourses();
upddateEnrollmentCount();
function getCourses() {
    const coursesList = document.getElementById("coursesList");
    if(!coursesList) 
        {
            return;
        }
    const allcourses = Courses(); 

    const courses = allcourses.filter(course => {
        return !isAlreadyEnrolled(user.id, course.id);
    })
    
    coursesList.innerHTML = "";

    if(courses.length === 0) {
        coursesList.innerHTML = `<p class="text-gray-500">No new courses available.</p>`;
        return;
    }

    courses.forEach(course => {
        const instructorName = getInstructorName(course.instructor_id);
        coursesList.innerHTML += CourseCard(course, false, instructorName);
    })

    const enrollBtns = document.querySelectorAll(".enrollBtn");
    enrollBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const courseId = Number(btn.getAttribute("data-id"));
            const course = CourseById(courseId);
            if (!course) return;

            Swal.fire({
                title: "Complete Payment",
                html: `
                    <p class="text-gray-600 mb-2">You are enrolling in:</p>
                    <p class="font-bold text-lg mb-3">${course.title}</p>
                    <p class="text-2xl font-bold text-green-600">&#8377; ${course.courses_fee}</p>
                    <p class="text-sm text-gray-400 mt-2"> Pay Now to confirm enrollment</p>
                `,
                icon: "info",
                showCancelButton: true,
                confirmButtonText: "Pay Now",
                cancelButtonText: "Cancel",
                confirmButtonColor: "green",
                cancelButtonColor: "red"
            }).then((result: any) => {
                if (result.isConfirmed) {
                    enrollStudent(user.id, courseId);
                    Swal.fire({
                        icon: "success",
                        title: "Payment Successful!",
                        text: "You are now enrolled in " + course.title,
                        confirmButtonColor: "green"
                    }).then(() => {
                        getCourses();
                        upddateEnrollmentCount();
                    })
                }
            })
        }) 
    })

    const continueBtns = document.querySelectorAll(".continueBtn")
    continueBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const courseId = btn.getAttribute("data-id");
            localStorage.setItem("selectedCourseId", String(courseId));
            window.location.href = "./courseDetail.html";
        })
    })

    const searchInput = document.getElementById("searchInput") as HTMLInputElement;
    if(searchInput) {
        searchInput.addEventListener("input", () => {
            const searchValue = searchInput.value.trim().toLowerCase();
            const allCards = document.querySelectorAll(".courseCard");
            allCards.forEach(card => {
                const title = card.getAttribute("data-title") || "";
                if(title.includes(searchValue)) {
                    card.classList.remove("hidden")
                } else {
                    card.classList.add("hidden")
                }
            })
        })
    }
}

function getEnrolledCourses() {
    const enrolledList = document.getElementById("enrolledList");
    if(!enrolledList) 
        {
            return;
        }
    const enrollments = StudentEnrollment(user.id);
    enrolledList.innerHTML = "";

    if(enrollments.length === 0) {
        enrolledList.innerHTML = `<p class="text-gray-500">You have not enrolled in any course yet.</p>`;
        return;
    }

    enrollments.forEach(enrollment => {
        const course = CourseById(enrollment.course_id);
        if(!course) {
            return;
        }
        const instructorName = getInstructorName(course.instructor_id);
        enrolledList.innerHTML += `
         <div class="bg-white rounded-lg shadow overflow-hidden">
            <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80" alt="course" class="w-full h-40 object-cover">
            <div class="p-4">
                <h3 class="font-bold text-lg mb-1">${course.title}</h3>
                <p class="text-gray-500 text-sm mb-2">${course.description}</p>
                <p class="text-sm font-semibold mb-3">Fee: &#8377; ${course.courses_fee}</p>
                <p class="text-sm"> Created by: <span class="font-semibold">${instructorName}</span></p>
                <button class="enrolledContinueBtn bg-blue-400 text-white px-4 py-2 rounded w-full cursor-pointer" data-id="${course.id}">Continue</button>
            </div>
        </div>`
    })

     const enrolledContinueBtns = document.querySelectorAll(".enrolledContinueBtn");
    enrolledContinueBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const courseId = btn.getAttribute("data-id");
            localStorage.setItem("selectedCourseId", String(courseId));
            window.location.href = `./courseDetail.html?courseId=${courseId}`;
        })
    }) 
}

function upddateEnrollmentCount(){
    const updateEnrollments = StudentEnrollment(user.id);
    const totalEnrolled = document.getElementById("totalEnrolled");
    if(totalEnrolled){
        totalEnrolled.innerText = String(updateEnrollments.length);
    }
}