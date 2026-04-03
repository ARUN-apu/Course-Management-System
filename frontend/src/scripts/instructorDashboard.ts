import { isAuthenticated, CurrentUser, logout } from "./auth.js";
import { CoursesByInstructor, addCourse, updateCourse, deleteCourse } from "./course.js";
import { EnrolledStudentByCourse, deleteEnrollment } from "./enrollment.js";
import { InstructorNavbar } from "../components/navbar.js";
import { InstructorCourseCard } from "../components/CourseCard.js";
import { getData } from "./localstorage.js";
import type { Course } from "../types/course.js";
import { loadProfile } from "./profile.js";

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

const courses = CoursesByInstructor(user.id);
const totalCourses = document.getElementById("totalCourses");
if (totalCourses) {
    totalCourses.innerText = String(courses.length);
}

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
const profileSection = document.getElementById("profileSection");

const dashboardLink = document.getElementById("dashboardLink");
const addCourseLink = document.getElementById("addCourseLink");
const profileLink = document.getElementById("profileLink");

if (dashboardLink) {
    dashboardLink.addEventListener("click", () => {
        dashboardSection?.classList.remove("hidden");
        profileSection?.classList.add("hidden");
        const searchInput = document.getElementById("searchInput") as HTMLInputElement;
        if (searchInput) {
            searchInput.value = "";
        }
        updateCourses();
    })
}



if (addCourseLink) {
    addCourseLink.addEventListener("click", () => {
        openAddModal();
    })
}

if (profileLink) {
    profileLink.addEventListener("click", () => {
        dashboardSection?.classList.add("hidden");
        profileSection?.classList.remove("hidden");
        loadProfile();
    })
}

const courseModal = document.getElementById("courseModal");
const modalTitle = document.getElementById("modalTitle");
const courseTitle = document.getElementById("courseTitle") as HTMLInputElement;
const courseDescription = document.getElementById("courseDescription") as HTMLTextAreaElement;
const courseFee = document.getElementById("courseFee") as HTMLInputElement;
const saveCourseBtn = document.getElementById("saveCourseBtn");
const cancelModalBtn = document.getElementById("cancelModalBtn");

let editingCourseId: number | null = null;

if (cancelModalBtn) {
    cancelModalBtn.addEventListener("click", () => {
        courseModal!.classList.add("hidden");
        editingCourseId = null;
        clearModal();
    })
}

function clearModal() {
    courseTitle.value = "";
    courseDescription.value = "";
    courseFee.value = "";
}

function openAddModal() {
    editingCourseId = null;
    clearModal();
    if (modalTitle) modalTitle.innerText = "Add Course";
    courseModal?.classList.remove("hidden");
}

if (saveCourseBtn) {
    saveCourseBtn.addEventListener("click", () => {
        const title = courseTitle.value.trim();
        const description = courseDescription.value.trim();
        const fee = Number(courseFee.value);

        if (!title) {
            Swal.fire({ icon: "error", title: "Please enter course title", confirmButtonColor: "red" });
            return;
        }

        if (!description) {
            Swal.fire({ icon: "error", title: "Please enter course description", confirmButtonColor: "red" });
            return;
        }

        if (!fee || fee <= 0) {
            Swal.fire({ icon: "error", title: "Please enter valid fee", confirmButtonColor: "red" });
            return;
        }

        if (editingCourseId !== null) {
            const updatedCourse: Course = {
                id: editingCourseId,
                title,
                description,
                courses_fee: fee,
                instructor_id: user.id,
                created_at: new Date().toDateString(),
                is_delete: 0
            }
            updateCourse(updatedCourse)
            Swal.fire({ icon: "success", title: "Course Updated!", confirmButtonColor: "green" }).then(() => {
                courseModal!.classList.add("hidden");
                editingCourseId = null;
                clearModal();
                MyCourses();
                updateCourses();
            })
        } else {
            const newCourse: Course = {
                id: Date.now(),
                title,
                description,
                courses_fee: fee,
                instructor_id: user.id,
                created_at: new Date().toISOString(),
                is_delete: 0
            }
            addCourse(newCourse)
            Swal.fire({ icon: "success", title: "Course Added!", confirmButtonColor: "green" }).then(() => {
                courseModal!.classList.add("hidden");
                clearModal();
                MyCourses();
                updateCourses();
            })
        }
    })
}

function updateCourses() {
    const updated = CoursesByInstructor(user.id);
    const totalCourses = document.getElementById("totalCourses");
    if (totalCourses) {
        totalCourses.innerText = String(updated.length);
    }
}

MyCourses();
updateCourses();
function MyCourses() {
    const myCoursesList = document.getElementById("CoursesList");
    if (!myCoursesList) {
        return;
    }
    const courses = CoursesByInstructor(user.id);
    myCoursesList.innerHTML = "";
    if (courses.length === 0) {
        myCoursesList.innerHTML = `<p>No Courses Create till now. Create Your first Course</p>`;
    } else {

        courses.forEach(course => {
            const students = EnrolledStudentByCourse(course.id);
            myCoursesList.innerHTML += InstructorCourseCard(course, students.length);
        })

        // edit button

        const editBtn = document.querySelectorAll(".editBtn");
        editBtn.forEach(btn => {
            btn.addEventListener("click", () => {
                const courseId = Number(btn.getAttribute("data-id"));
                const courses = CoursesByInstructor(user.id);
                const course = courses.find(c => c.id === courseId);
                if (!course) {
                    return;
                }
                editingCourseId = courseId;
                courseTitle.value = course.title;
                courseDescription.value = course.description;
                courseFee.value = String(course.courses_fee);
                if (modalTitle) modalTitle.innerText = "Edit Course";
                courseModal!.classList.remove("hidden");
            })
        })

        // delete button

        const deleteBtn = document.querySelectorAll(".deleteBtn");
        deleteBtn.forEach(btn => {
            btn.addEventListener("click", () => {
                const courseId = Number(btn.getAttribute("data-id"));
                Swal.fire({
                    icon: "warning",
                    title: "Are you sure?",
                    text: "This will delete the course and all enrollments",
                    showCancelButton: true,
                    confirmButtonColor: "green",
                    cancelButtonColor: "red",
                    confirmButtonText: "Yes, delete it"
                }).then((result: any) => {
                    if (result.isConfirmed) {
                        deleteCourse(courseId);
                        deleteEnrollment(courseId);
                        Swal.fire({ icon: "success", title: "Course Deleted!", confirmButtonColor: "green" })
                            .then(() => {
                                MyCourses();
                                updateCourses();
                            })
                    }
                })
            })
        })
        const modulesBtns = document.querySelectorAll(".modulesBtn");
        modulesBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const courseId = Number(btn.getAttribute("data-id"));
                localStorage.setItem("manageCourseId", String(courseId));
                window.location.href = "./Modules.html";
            })
        })

        const viewStudentsBtns = document.querySelectorAll(".viewStudentBtn");
        viewStudentsBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const courseId = Number(btn.getAttribute("data-id"));
                const students = EnrolledStudentByCourse(courseId);

                const studentsList = document.getElementById("studentsList");
                if (!studentsList) {
                    return;
                }

                studentsList.innerHTML = ""

                if (students.length === 0) {
                    studentsList.innerHTML = `<p class="text-gray-500">No students enrolled yet.</p>`
                } else {
                    students.forEach(student => {
                        if (!student) return;
                        studentsList.innerHTML += `
                    <div class="border rounded-lg p-3">
                        <p class="font-semibold">${student.name}</p>
                        <p class="text-sm">${student.email}</p>
                    </div>`
                    })
                }

                const studentsModal = document.getElementById("studentsModal");
                if (studentsModal) studentsModal.classList.remove("hidden");
            })
        })
    }
   const allCourses = getData<Course>("courses");
const unclaimedCourses = allCourses.filter(c => c.instructor_id === 0 && c.is_delete === 0);

const unclaimedSection = document.getElementById("unclaimedSection");
if (unclaimedSection) {
    unclaimedSection.innerHTML = ""; 

    if (unclaimedCourses.length > 0) {
        unclaimedSection.innerHTML = `<h3 class="font-bold text-lg mb-3">Available Courses to Claim</h3>`;

        unclaimedCourses.forEach(course => {
            unclaimedSection.innerHTML += `
            <div class="border rounded-lg p-4 mb-3 flex justify-between items-center bg-white">
                <div>
                    <h3 class="font-semibold">${course.title}</h3>
                    <p class="text-sm text-gray-500">${course.description}</p>
                </div>
                <button class="claimBtn bg-green-500 text-white px-3 py-1 rounded text-sm"
                    data-id="${course.id}">Claim Course</button>
            </div>`
        })

        const claimBtns = unclaimedSection.querySelectorAll(".claimBtn");
        claimBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const courseId = Number(btn.getAttribute("data-id"));
                const courses = getData<Course>("courses");
                const course = courses.find(c => c.id === courseId);
                if (!course) return;

                const updatedCourse: Course = { ...course, instructor_id: user.id };
                updateCourse(updatedCourse);

                Swal.fire({
                    icon: "success",
                    title: "Course Claimed!",
                    confirmButtonColor: "green"
                }).then(() => {
                    MyCourses();
                    updateCourses();
                });
            })
        })
    }
}
       

}

const closeStudentsModal = document.getElementById("closeStudentsModal");
if (closeStudentsModal) {
    closeStudentsModal.addEventListener("click", () => {
        document.getElementById("studentsModal")?.classList.add("hidden");
    })
}

const searchInput = document.getElementById("searchInput") as HTMLInputElement;
if (searchInput) {
    searchInput.addEventListener("input", () => {
        const searchValue = searchInput.value.trim().toLowerCase();
        const allCards = document.querySelectorAll(".instructorCourseCard");
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




