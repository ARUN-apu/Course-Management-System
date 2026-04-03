import { getData, addItem, deleteItem, saveData } from "./localstorage.js";
import type { Module } from "../types/module.js";

export function getModulesByCourse(courseId: number){
    const modules = getData<Module>("modules");
    return modules.filter(m => m.course_id === courseId);
}

export function addModule(courseId: number, title: string) {
    const modules = getData<Module>("modules")
    const id = Date.now();
    const newModule: Module = {
        id: id,
        course_id: courseId,
        title: title,
        order_index: modules.length + 1
    }
    addItem<Module>("modules", newModule);
    return id;
}

export function deleteModule(id: number) {
    deleteItem("modules", id)
}

export function updateModule(id: number, title: string) {
    const modules = getData<Module>("modules");
    const module = modules.find(m => m.id === id);
    if(!module) return;
    module.title = title;
    saveData<Module>("modules", modules);
}