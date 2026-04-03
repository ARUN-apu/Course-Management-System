import { CurrentUser } from "./auth.js";
import { getData, updateItem } from "./localstorage.js";
import type { User } from "../types/user.js";

declare const Swal: any;

async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

function getRoleName(role_id: number): string {
    if (role_id === 1) return "Admin";
    if (role_id === 2) return "Instructor";
    return "Student";
}

export function loadProfile() {
    const user = CurrentUser();
    if (!user) return;

    const profileName = document.getElementById("profileName") as HTMLInputElement;
    const profileEmail = document.getElementById("profileEmail") as HTMLInputElement;
    const profileRole = document.getElementById("profileRole") as HTMLInputElement;
    const profileCreated = document.getElementById("profileCreated") as HTMLInputElement;

    if (profileName) {
        profileName.value = user.name;
    }
    if (profileEmail) {
        profileEmail.value = user.email;
    }
    if (profileRole) {
        profileRole.value = getRoleName(user.role_id);
    }
    if (profileCreated) {
        profileCreated.value = user.created_at;
    }

    const profileAvatarName = document.getElementById("profileAvatarName");
    const profileAvatarRole = document.getElementById("profileAvatarRole");

    if (profileAvatarName) profileAvatarName.innerText = user.name;
    if (profileAvatarRole) profileAvatarRole.innerText = getRoleName(user.role_id);

    const saveProfileBtn = document.getElementById("saveProfileBtn");
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener("click", async () => {
            const newName = profileName.value.trim();
            const newPassword = (document.getElementById("profileNewPassword") as HTMLInputElement).value.trim();
            const confirmPassword = (document.getElementById("profileConfirmPassword") as HTMLInputElement).value.trim();

            if (newName.length < 2) {
                Swal.fire({ 
                    icon: "error", 
                    title: "Invalid Name", 
                    text: "Name must be at least 2 characters", 
                    confirmButtonColor: "red" 
                    
                });
                return;
            }

            if (!/^[A-Za-z\s]+$/.test(newName)) {
                Swal.fire({ 
                    icon: "error", 
                    title: "Invalid Name", 
                    text: "Name should contain only letters", 
                    confirmButtonColor: "red" 
                    
                });
                return;
            }

            // Validate the password
            if (newPassword || confirmPassword) {
                const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
                if (!passwordRegex.test(newPassword)) {
                    Swal.fire({ 
                        icon: "error", 
                        title: "Invalid Password", 
                        text: "Password must be at least 6 characters and contain at least one letter, one number, and one special character", 
                        confirmButtonColor: "red" 
                        
                    });
                    return;
                }
                if (newPassword !== confirmPassword) {
                    Swal.fire({ icon: "error", title: "Passwords do not match", confirmButtonColor: "red" });
                    return;
                }
            }

            const users = getData<User>("users");
            const existingUser = users.find(u => u.id === user.id);
            if (!existingUser) return;

            const updatedUser: User = {
                ...existingUser,
                name: newName,
                password: newPassword ? await hashPassword(newPassword) : existingUser.password
            }

            updateItem<User>("users", updatedUser);

            // update currentUser in localStorage 
            localStorage.setItem("currentUser", JSON.stringify(updatedUser));

            Swal.fire({ 
                icon: "success", 
                title: "Profile Updated!", 
                confirmButtonColor: "green" 
                
            }).then(() => {
                window.location.reload();
            })
        })
    }
}
