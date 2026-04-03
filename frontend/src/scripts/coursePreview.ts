import { CourseById } from "./course.js";
import { getData } from "./localstorage.js";
import { getModulesByCourse } from "./modules.js";
import type { User } from "../types/user.js";

const courseId = Number(localStorage.getItem("previewCourseId"));
if(!courseId){
    window.location.href = "../../index.html";
}
const course = CourseById(courseId);
if(!course){
    window.location.href = "../../index.html";
}else{
    const users = getData<User>("users");
    const instructor = users.find(u => u.id === course.instructor_id);
    const instructorName = instructor ? instructor.name : "Arun Senapati";
    const modules = getModulesByCourse(courseId);

    const courseTitle = document.getElementById("courseTitle");
    const courseDescription = document.getElementById("courseDescription");
    const courseFee = document.getElementById("courseFee");
    const courseInstructor = document.getElementById("courseInstructor");
    const courseCreated = document.getElementById("courseCreated");
    const courseRating = document.getElementById("courseRating");
    const modulesList = document.getElementById("modulesList");

    if(courseTitle){
        courseTitle.innerText = course.title;
    } 
    if(courseDescription){
        courseDescription.innerText = course.description;
    } 
    if(courseFee){
        courseFee.innerHTML = `Fee: &#8377; ${course.courses_fee}`;
    } 
    if(courseInstructor){
        courseInstructor.innerText = `Instructor: ${instructorName}`;
    } 
    if(courseCreated){
        courseCreated.innerText = `Created: ${course.created_at}`;
    } 
    if(modulesList){
        modulesList.innerHTML = "";
        if(modules.length === 0){
            modulesList.innerHTML = `<p> No modules added so far</p>`;
        }else{
            modules.forEach((module, index) => {
                modulesList.innerHTML += `
                <div class="flex items-center gap-3 border-b py-3">
                <div class="rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    ${index + 1}
                    </div>
                    <p class="font-semibold">${module.title}</p>
                    </div>
                `
            })
        }
    }

}

const backBtn = document.getElementById("backBtn");
if(backBtn){
    backBtn.addEventListener("click", () => {
        window.location.href = "../../index.html";
    })
}

const enrollNowBtn = document.getElementById("enrollNowBtn");
if(enrollNowBtn) {
    enrollNowBtn.addEventListener("click", () => {
        localStorage.setItem("pendingEnrollCourseId", String(courseId));
        window.location.href = "./login.html";
    })
}

const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const enrollLoginBtn = document.getElementById("enrollLoginBtn");
const enrollRegisterBtn = document.getElementById("enrollRegisterBtn");

if(loginBtn){
    loginBtn.addEventListener("click", () => {
        window.location.href = "./login.html";
    })
}

if(registerBtn){
    registerBtn.addEventListener("click", () => {
        window.location.href = "./register.html";
    })
}

if(enrollLoginBtn){
    enrollLoginBtn.addEventListener("click", () => {
        window.location.href = "./login.html";
    })
}

if(enrollRegisterBtn){
    enrollRegisterBtn.addEventListener("click", () => {
        window.location.href = "./register.html";
    })
}