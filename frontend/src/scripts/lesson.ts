import { getData, addItem, deleteItem, saveData } from "./localstorage.js";
import type { Lesson } from "../types/lesson.js";

export function getLessonsByModule(moduleId: number) {
    const lessons = getData<Lesson>("lessons");
    return lessons.filter(l => l.module_id === moduleId);
}

let lessonIdCounter = 0;

export function addLesson(moduleId: number, title: string, content: string) {
    const lessons = getData<Lesson>("lessons");
    const moduleLessons = lessons.filter(l => l.module_id === moduleId);
    lessonIdCounter++;
    const newLesson: Lesson = {
        id: Date.now() + lessonIdCounter,
        module_id: moduleId,
        title,
        content_type: "text",
        content_url: content,
        order_index: moduleLessons.length + 1
    }
    addItem<Lesson>("lessons", newLesson);
}

export function updateLesson(id: number, title: string, content: string) {
    const lessons = getData<Lesson>("lessons");
    const lesson = lessons.find(l => l.id === id);
    if(!lesson) return;
    lesson.title = title;
    lesson.content_url = content;
    saveData<Lesson>("lessons", lessons);
}

export function deleteLesson(id: number) {
    deleteItem("lessons", id);
}