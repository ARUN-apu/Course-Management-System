import { getData, addItem } from "./localstorage.js";
import type { User } from "../types/user.js";
import { isAuthenticated } from "./auth.js";

async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}
declare let Swal: any;

function redirectByRole() {
    const user = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (!user) return;
    if (user.role_id === 1) {
        window.location.href = "./adminDashboard.html";
    } else if (user.role_id === 2) {
        window.location.href = "./instructorDashboard.html";
    } else {
        window.location.href = "./studentDashboard.html";
    }
}
if(isAuthenticated()){
    redirectByRole();
}

window.addEventListener("storage", (e)=>{
    if(e.key === "authToken" && e.newValue){
        redirectByRole();
    }
})
const registerform = document.getElementById("registerForm") as HTMLFormElement;
const loginLink = document.getElementById("login");

if (loginLink) {
    loginLink.addEventListener("click", () => {
        window.location.href = "./login.html";
    })
}

if (registerform) {
    registerform.addEventListener("submit", async (e) => {
        e.preventDefault();

        if(isAuthenticated()){
            redirectByRole();
            return;
        }

        const name = (document.getElementById("name") as HTMLInputElement).value.trim();
        const email = (document.getElementById("email") as HTMLInputElement).value.trim().toLocaleLowerCase();
        const password = (document.getElementById("password") as HTMLInputElement).value.trim();
        const role_id = Number((document.getElementById("role") as HTMLSelectElement).value);

        const users = getData<User>("users");

        if (users.some(u => u.email === email)) {
            Swal.fire({
                icon: "error",
                title: "User already exists",
                confirmButtonColor: "red"
            });
            return
        }

        if (name.length < 2) {
            Swal.fire({
                icon: "error",
                title: "Invalid Name",
                text: "Name must be at least 2 characters",
                confirmButtonColor: "red"
            });
            return;
        }

        if (!/^[A-Za-z\s]+$/.test(name)) {
            Swal.fire({
                icon: "error",
                title: "Invalid Name",
                text: "Name should contain minimum letters",
                confirmButtonColor: "red"
            });
            return;
        }

        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/.test(email)) {
            Swal.fire({
                icon: "error",
                title: "Invalid Email",
                text: "Please enter a valid email address",
                confirmButtonColor: "red"
            });
            return;
        }
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        if (!passwordRegex.test(password)) {
            Swal.fire({
                icon: "error",
                title: "Invalid Password",
                text: "Password must be at least 6 characters and contain at least one letter, one number, and one special character",
                confirmButtonColor: "red"
            });
            return;
        }
        if (!role_id) {
            Swal.fire({
                icon: "error",
                title: "Please select a role",
                confirmButtonColor: "red"
            });
            return;
        }

        const newUser: User = {
            id: Date.now(),
            name,
            email,
            password: await hashPassword(password),
            role_id,
            created_at: new Date().toDateString()
        }

        addItem<User>("users", newUser);

        Swal.fire({
            icon: "success",
            title: "Registration Successful!",
            confirmButtonColor: "green"
        }).then(() => {
            window.location.href = "./login.html";
        })
    })
}