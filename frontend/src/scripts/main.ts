import { Admin } from "./auth.js";
import { PredefinedCourses } from "./course.js";
import { getModulesByCourse } from "./modules.js";
import { addLesson} from "./lesson.js";
import type { Module } from "../types/module.js";
import { getData, addItem } from "./localstorage.js";
document.addEventListener("DOMContentLoaded", async() =>{
    await Admin();
    PredefinedCourses();
    PredefinedModulesAndLessons();
})

function addModule(id: number, courseId: number, title: string, orderIndex: number) {
    const modules = getData<Module>("modules");
    const already = modules.find(m => m.id === id);
    if (already) return;
     const newModule: Module = {
        id,            
        course_id: courseId,
        title,
        order_index: orderIndex
    };
    addItem<Module>("modules", newModule);
}

function PredefinedModulesAndLessons() {
    const existing = getModulesByCourse(1);
    if(existing.length > 0) return;

    addModule(101, 1, "Introduction to HTML", 1);
    addModule(102, 1, "Introduction to CSS", 2);

    addModule(201, 2, "Introduction to Node.js", 1);
    addModule(202, 2, "Introduction to SQL", 2);

    addModule(301, 3, "SEO Fundamentals", 1);
    addModule(302, 3, "Social Media Marketing", 2);



    addLesson(101, "What is HTML?", "HTML stands for HyperText Markup Language. It is the standard language used to create and structure content on the web. HTML uses elements represented by tags to define the structure of a web page.");
    addLesson(102, "What is CSS?", "CSS is the language we use to style an HTML document.CSS describes how HTML elements should be displayed.This tutorial will teach you CSS from basic to advanced.");

    addLesson(201, "What is Node.js?", "Node.js is a JavaScript runtime built on Chrome's V8 engine. It allows you to run JavaScript on the server side. Node.js is used to build fast and scalable backend applications.");
    addLesson(202, "What is SQL?", "SQL is a standard language for storing, manipulating and retrieving data in databases.Our SQL tutorial will teach you how to use SQL in: MySQL, SQL Server, MS Access, Oracle, Sybase, Informix, PostgreSQL, and other database systems.");

    addLesson(301, "What is SEO?", "SEO stands for Search Engine Optimization. It is the practice of improving a website so it ranks higher in search engine results. Good SEO involves using the right keywords, having quality content, and getting backlinks.");
    addLesson(302, "What is Social Media Marketing?", "Social media marketing involves using platforms like Facebook, Instagram, Twitter, and LinkedIn to promote products, engage with customers, and build brand awareness.");

}