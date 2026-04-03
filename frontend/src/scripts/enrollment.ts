import { getData, addItem } from "./localstorage.js";
import type { User } from "../types/user.js";
import type { Enrollment } from "../types/enrollment.js";

export function StudentEnrollment(studentId: number){
    const enrollments = getData<Enrollment>("enrollments");
    return enrollments.filter(e => e.student_id === studentId);
}

export function isAlreadyEnrolled(studentId: number, courseId: number){
    const enrollments = getData<Enrollment>("enrollments");
    const check = enrollments.find(e => e.student_id === studentId && e.course_id === courseId);
    if(check){
        return true;
    }else{
        return false;
    }
}

export function enrollStudent(studentId: number, courseId: number){
    const newEnrollment: Enrollment = {
        id: Date.now(),
        student_id: studentId,
        course_id: courseId,
        enrolled_at: new Date().toDateString()
    }
    addItem<Enrollment>("enrollments", newEnrollment);
}

export function EnrolledStudentByCourse(courseId: number){
    const enrollments = getData<Enrollment>("enrollments");
    const users = getData<User>("users");
    const courseEnrollments = enrollments.filter(e => e.course_id === courseId);
    const students = courseEnrollments.map(e => {
        const student = users.find(u => u.id === e.student_id);
        return student;
    })
    return students;
}

export function deleteEnrollment(courseId: number){
    const enrollments = getData<Enrollment>("enrollments");
    const student = enrollments.filter(e => e.course_id !== courseId);
    localStorage.setItem("enrollments", JSON.stringify(student));
}