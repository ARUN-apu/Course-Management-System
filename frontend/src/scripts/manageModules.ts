import { isAuthenticated, CurrentUser, logout } from "./auth.js";
import { CourseById } from "./course.js";
import { getModulesByCourse, addModule, deleteModule, updateModule } from "./modules.js";
import { getLessonsByModule, addLesson, updateLesson, deleteLesson } from "./lesson.js";
import { InstructorNavbar } from "../components/navbar.js";

declare const Swal: any;

if (!isAuthenticated()) {
    window.location.href = "./login.html";
}

const user = CurrentUser();
if (user.role_id !== 2) {
    window.location.href = "./login.html";
}

const navbar = document.getElementById("navbar");
if (navbar) {
    navbar.innerHTML = InstructorNavbar(user.name);
    const hamburgerBtn = document.querySelector("#hamburger") as HTMLButtonElement;
    const mobileMenu = document.querySelector("#Menu") as HTMLUListElement;
    hamburgerBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("hidden");
    })
}

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        logout();
        window.location.href = "../../index.html";
    })
}

const dashboardLink = document.getElementById("dashboardLink");
const addCourseLink = document.getElementById("addCourseLink");
const profileLink = document.getElementById("profileLink");

if (dashboardLink) {
    dashboardLink.addEventListener("click", () => {
        window.location.href = "./instructorDashboard.html";
    })
}

if (addCourseLink) {
    addCourseLink.addEventListener("click", () => {
        window.location.href = "./instructorDashboard.html";
    })
}

if (profileLink) {
    profileLink.addEventListener("click", () => {
        window.location.href = "./instructorDashboard.html";
    })
}

const courseId = Number(localStorage.getItem("manageCourseId"));
if (!courseId) {
    window.location.href = "./instructorDashboard.html";
}

const course = CourseById(courseId);
if (!course) {
    window.location.href = "./instructorDashboard.html";
}

const courseName = document.getElementById("courseName");
if (courseName && course) courseName.innerText = course.title;

const backBtn = document.getElementById("backBtn");
if (backBtn) {
    backBtn.addEventListener("click", () => {
        window.location.href = "./instructorDashboard.html";
    })
}

const addModuleBtn = document.getElementById("addModuleBtn");
if (addModuleBtn) {
    addModuleBtn.addEventListener("click", () => {
        const moduleTitle = document.getElementById("moduleTitle") as HTMLInputElement;
        const title = moduleTitle.value.trim();

        if (!title) {
            Swal.fire({ icon: "error", title: "Please enter module title", confirmButtonColor: "red" });
            return;
        }

        addModule(courseId, title);
        moduleTitle.value = "";
        loadModules();

        Swal.fire({ icon: "success", title: "Module Added!", confirmButtonColor: "green" });
    })
}

// edit modal elements
const editModuleModal = document.getElementById("editModuleModal");
const editModuleTitle = document.getElementById("editModuleTitle") as HTMLInputElement;
const cancelEditBtn = document.getElementById("cancelEditBtn");

if (cancelEditBtn) {
    cancelEditBtn.addEventListener("click", () => {
        editModuleModal?.classList.add("hidden");
        editModuleTitle.value = "";
    })
}

let editingModuleId: number | null = null;

const saveEditBtn = document.getElementById("saveEditBtn");
if (saveEditBtn) {
    saveEditBtn.addEventListener("click", () => {
        const newTitle = editModuleTitle.value.trim();

        if (!newTitle) {
            Swal.fire({
                icon: "error",
                title: "Please enter module title",
                confirmButtonColor: "red"
            });
            return;
        }

        if (editingModuleId === null) return;

        updateModule(editingModuleId, newTitle);
        editModuleModal?.classList.add("hidden");
        editModuleTitle.value = "";
        editingModuleId = null;
        loadModules();

        Swal.fire({
            icon: "success",
            title: "Module Updated!",
            confirmButtonColor: "green"
        });
        return;
    })
}

const lessonModal = document.getElementById("lessonModal");
const cancelLessonBtn = document.getElementById("cancelLessonBtn");
const saveLessonBtn = document.getElementById("saveLessonBtn");
const lessonTitle = document.getElementById("lessonTitle") as HTMLInputElement;
const lessonContent = document.getElementById("lessonContent") as HTMLTextAreaElement;

let currentModuleId: number | null = null;
let editingLessonId: number | null = null;

if (cancelLessonBtn) {
    cancelLessonBtn.addEventListener("click", () => {
        lessonModal?.classList.add("hidden");
        lessonTitle.value = "";
        lessonContent.value = "";
        currentModuleId = null;
        editingLessonId = null;
    })
}

if (saveLessonBtn) {
    saveLessonBtn.addEventListener("click", () => {
        const title = lessonTitle.value.trim();
        const content = lessonContent.value.trim();
        if (!title) {
            alert("Please Enter the Lesson Title");
            return;
        }
        if (!content) {
            alert("Please Enter the Lesson Content");
            return;
        }

        if (editingLessonId !== null) {
            updateLesson(editingLessonId, title, content);
            Swal.fire({
                icon: "success",
                title: "Lesson Updated!",
                confirmButtonColor: "green"
            });
        } else {
            addLesson(currentModuleId!, title, content);
            Swal.fire({
                icon: "success",
                title: "Lesson Added!",
                confirmButtonColor: "green"
            });
        }

        lessonModal?.classList.add("hidden");
        lessonTitle.value = "";
        lessonContent.value = "";
        editingLessonId = null;
        currentModuleId = null;
        loadModules();
    })
}

loadModules();

function loadModules() {
    const modulesList = document.getElementById("modulesList");
    if (!modulesList) return;

    const modules = getModulesByCourse(courseId);
    modulesList.innerHTML = "";

    if (modules.length === 0) {
        modulesList.innerHTML = `<p class="text-gray-500">No modules added yet.</p>`;
        return;
    }

    modules.forEach((module, index) => {
        const lessons = getLessonsByModule(module.id);

        let lessonsHTML = "";
        if (lessons.length === 0) {
            lessonsHTML = `<p></p>`;
        } else {
            lessons.forEach((lesson, i) => {
                lessonsHTML += `
                <div class="flex items-center justify-between border-b py-2">
                    <p class="text-sm">${i + 1}. ${lesson.title}</p>
                    <div class="flex gap-2">
                        <button class="editLessonBtn text-blue-500 text-sm underline" data-id="${lesson.id}" data-title="${lesson.title}" data-content="${lesson.content_url}">Edit</button>
                        <button class="deleteLessonBtn text-red-500 text-sm underline" data-id="${lesson.id}">Delete</button>
                    </div>
                </div>`
            })
        }

        modulesList.innerHTML += `
        <div class="border rounded-lg mb-4">
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-t-lg">
                <div class="flex items-center gap-3">
                    <div class="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                        ${index + 1}
                    </div>
                    <p class="font-semibold">${module.title}</p>
                </div>
                <div class="flex gap-2">
                    <button class="addLessonBtn px-3 py-1 rounded text-sm" data-id="${module.id}"> Add Lesson</button>
                    <button class="editModuleBtn text-blue-500 text-sm underline" data-id="${module.id}" data-title="${module.title}">Edit</button>
                    <button class="deleteModuleBtn text-red-500 text-sm underline" data-id="${module.id}">Delete</button>
                </div>
            </div>
            <div class="p-4">
                ${lessonsHTML}
            </div>

        </div>`
    })
    const editModuleBtns = document.querySelectorAll(".editModuleBtn");
    editModuleBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            editingModuleId = Number(btn.getAttribute("data-id"));
            const title = btn.getAttribute("data-title") || "";
            editModuleTitle.value = title;
            editModuleModal?.classList.remove("hidden");
        })
    })

    const deleteModuleBtns = document.querySelectorAll(".deleteModuleBtn");
    deleteModuleBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const moduleId = Number(btn.getAttribute("data-id"));
            Swal.fire({
                icon: "warning",
                title: "Are you sure?",
                text: "This will delete the module",
                showCancelButton: true,
                confirmButtonColor: "green",
                cancelButtonColor: "red",
                confirmButtonText: "Yes, delete it"
            }).then((result: any) => {
                if (result.isConfirmed) {
                    deleteModule(moduleId);
                    loadModules();
                }
            })
        })
    })

    const addLessonBtns = document.querySelectorAll(".addLessonBtn");
    addLessonBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            currentModuleId = Number(btn.getAttribute("data-id"));
            editingLessonId = null;
            lessonTitle.value = "";
            lessonContent.value = "";
            lessonModal?.classList.remove("hidden");
        })
    })

    const editLessonBtns = document.querySelectorAll(".editLessonBtn");
    editLessonBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            editingLessonId = Number(btn.getAttribute("data-id"));
            lessonTitle.value = btn.getAttribute("data-title") || "";
            lessonContent.value = btn.getAttribute("data-content") || "";
            lessonModal?.classList.remove("hidden");
        })
    })

    const deleteLessonBtns = document.querySelectorAll(".deleteLessonBtn");
    deleteLessonBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const lessonId = Number(btn.getAttribute("data-id"));
            Swal.fire({
                icon: "warning",
                title: "Are you sure?",
                text: "This will delete the lesson",
                showCancelButton: true,
                confirmButtonColor: "green",
                cancelButtonColor: "red",
                confirmButtonText: "Yes, delete it"
            }).then((result: any) => {
                if (result.isConfirmed) {
                    deleteLesson(lessonId);
                    loadModules();
                }
            })
        })
    })
}