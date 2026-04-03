import type { Course } from "../types/course.js";

export function CourseCard(course: Course, isEnrolled: boolean, instructorName: string): string{
    return`
    <div class="courseCard bg-white rounded-lg shadow overflow-hidden" data-title="${course.title.toLowerCase()}">
        <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80" class="w-full h-48 object-cover">
        <div class="p-4">
            <h3 class="font-bold text-lg mb-1">${course.title}</h3>
            <p class="text-sm mb-2">${course.description}</p>
            <p class="text-sm font-semibold mb-3">Fee: &#8377;${course.courses_fee}</p>
            <p class="text-sm"> Created by: <span class="font-semibold">${instructorName}</span></p>
            ${isEnrolled ? `<button class="continueBtn bg-blue-400 text-white px-4 py-2 rounded w-full cursor-pointer" data-id="${course.id}">Continue</button>`
            : `<button class="enrollBtn bg-black text-white px-4 py-2 rounded w-full cursor-pointer" data-id="${course.id}">Enroll</button>`
            }
        </div>
    </div>`
}

export function InstructorCourseCard(course: Course, studentsCount: number): string{
    return`
    <div class="instructorCourseCard bg-white rounded-lg shadow overflow-hidden" data-title="${course.title.toLowerCase()}">
        <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80"
        class="w-full h-48 object-cover">
        <div class="p-4">
            <h3 class="font-bold text-lg mb-1">${course.title}</h3>
            <p class="text-sm mb-2">${course.description}</p>
            <p class="text-sm font-semibold mb-3">Fee: &#8377;${course.courses_fee}</p>
            <p class="text-sm mb-3">Enrolled Students: ${studentsCount}</p>
            <div class="flex gap-2">
                <button class="editBtn bg-blue-500 text-white px-3 py-1 rounded text-sm w-full" data-id="${course.id}">Edit</button>
                <button class="deleteBtn bg-red-500 text-white px-3 py-1 rounded text-sm w-full" data-id="${course.id}">Delete</button>
            </div>
            <button class="modulesBtn bg-blue-500 text-white px-3 py-2 rounded text-sm w-full mt-2" data-id="${course.id}">Manage Modules</button>
            <button class="viewStudentBtn text-blue-500 text-sm underline mt-2" data-id="${course.id}">View Students</button>
        </div>
    </div>`
}

export function LandingCourseCard(course: Course, instructorName: string): string{
     return `
    <div class="landingCard bg-white rounded-lg shadow overflow-hidden" data-title="${course.title.toLowerCase()}">
        <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80" class="w-full h-48 object-cover">
        <div class="p-4">
            <h3 class="font-bold text-lg mb-1">${course.title}</h3>
            <p class="text-sm mb-2">${course.description}</p>
            <p class="text-sm font-semibold mb-3">Fee: &#8377;${course.courses_fee}</p>
            <p class="text-sm"> Created by: <span class="font-semibold">${instructorName}</span></p>
            <button class="viewCourseBtn bg-gray-500 text-white px-4 py-2 rounded w-full cursor-pointer" data-id="${course.id}">View Course</button>
        </div>
    </div>`
}