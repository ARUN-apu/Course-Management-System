import { getData } from "./localstorage.js";
import { generateToken, isAuthenticated } from "./auth.js";
import type { User } from "../types/user.js";

async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}
declare const Swal: any;

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

if(isAuthenticated()) {
   redirectByRole();
}

window.addEventListener("storage", (e) =>{
    if(e.key === "authToken" && e.newValue){
        redirectByRole();
    }
})

const loginform = document.getElementById("loginForm") as HTMLFormElement;
const registerLink = document.getElementById("register");

if(registerLink) {
    registerLink.addEventListener("click", () => {
        window.location.href = "./register.html";
    })
}

if(loginform) {
    loginform.addEventListener("submit", async(e) => {
        e.preventDefault();

        const email = (document.getElementById("email") as HTMLInputElement).value.trim().toLocaleLowerCase();
        const password = (document.getElementById("password") as HTMLInputElement).value.trim();

        if(!email || !password) {
            Swal.fire({ 
                icon: "error", 
                title: "Please fill all fields", 
                confirmButtonColor: "red" 
            });
            return;
        }

        const users = getData<User>("users")
        const user = users.find(u => u.email === email);

        if(!user) {
            Swal.fire({ 
                icon: "error", 
                title: "User not found", 
                text: "Please register first", 
                confirmButtonColor: "red" 
            });
            return;
        }

        const hashedInput = await hashPassword(password);

        if(user.password !== hashedInput) {
            Swal.fire({ 
                icon: "error", 
                title: "Invalid Password", 
                text: "Please try again",
                 confirmButtonColor: "red" 
                });
                return;
        }

        generateToken(user);

        Swal.fire({
            icon: "success",
            title: "Login Successful",
            confirmButtonColor: "green"
        }).then(() => {
            if(user.role_id === 1) {
                window.location.href = "./adminDashboard.html";
            } else if(user.role_id === 2) {
                window.location.href = "./instructorDashboard.html";
            } else {
                window.location.href = "./studentDashboard.html";
            }
        })
    })
}