import { getData, addItem } from "./localstorage.js";
import type { User } from "../types/user.js";

async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}
export function generateToken(user: User) {
    const payload = {
        id: user.id,
        name: user.name,
        role: user.role_id,
        email: user.email
    }
    const token = btoa(JSON.stringify(payload));
    localStorage.setItem("authToken", token);
    localStorage.setItem("currentUser", JSON.stringify(user));
}

export function CurrentUser() {
    const user = localStorage.getItem("currentUser");
    if(!user) {
        return null;
    }else{
        return JSON.parse(user);
    }
}

export function isAuthenticated() {
    const token = localStorage.getItem("authToken");
    if(token){
        return true;
    }else{
        return false;
    } 
}

export function logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
}

export async function Admin() {
    const users = getData<User>("users");
    const adminExists = users.find(u => u.email === "admin@cms.com");
    if(adminExists){
        return;
    }
    const admin: User = {
        id: 1,
        name: "Admin",
        email: "admin@cms.com",
        password: await hashPassword("admin@cms1"),
        role_id: 1,
        created_at: new Date().toDateString()
    }
    addItem<User>("users", admin);
}