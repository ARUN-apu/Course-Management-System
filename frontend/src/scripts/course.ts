import { getData, addItem, updateItem } from "./localstorage.js";
import type { Course } from "../types/course.js";

export function Courses() {
    const courses = getData<Course>("courses")
    return courses.filter(c => c.is_delete === 0);
}

export function CourseById(id: number) {
    const courses = getData<Course>("courses");
    const course = courses.find(c => c.id === id);
    if(!course) {
        return null;
    }else{
        return course;
    }
}

export function CoursesByInstructor(instructorId: number) {
    const courses = getData<Course>("courses");
    return courses.filter(c => c.instructor_id === instructorId && c.is_delete === 0);
}

export function addCourse(course: Course) {
    addItem<Course>("courses", course);
}

export function updateCourse(updateCourse: Course) {
    updateItem<Course>("courses", updateCourse);
}

export function deleteCourse(id: number) {
    const courses = getData<Course>("courses");
    const course = courses.find(c => c.id === id);
    if(!course) {
        return;
    }    
    course.is_delete = 1
    updateItem<Course>("courses", course);
}

export function PredefinedCourses() {
    const courses = getData<Course>("courses");
    if(courses.length > 0) return;

    const defaultCourses: Course[] = [
        {
            id: 1,
            title: "Web Development",
            description: "Learn HTML, CSS, JavaScript and build modern websites.",
            instructor_id: 0,
            created_at: new Date().toDateString(),
            courses_fee: 999,
            is_delete: 0
        },
        {
            id: 2,
            title: "Backend development",
            description: "Learn how to build a backend of a Project.",
            instructor_id: 0,
            created_at: new Date().toDateString(),
            courses_fee: 799,
            is_delete: 0
        },
        {
            id: 3,
            title: "Digital Marketing",
            description: "Learn and grow your online presence.",
            instructor_id: 0,
            created_at: new Date().toDateString(),
            courses_fee: 699,
            is_delete: 0
        }
    ]

    defaultCourses.forEach(course => addItem<Course>("courses", course))
}