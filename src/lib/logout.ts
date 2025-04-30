import { deleteCookie } from "cookies-next";
import { handleLogout } from "@/app/actions/serverActions";

export async function logout() {
  try {
    // Remove o cookie no cliente
    deleteCookie("session");
    
    // Também remove no servidor via server action
    await handleLogout();
    
    return true;
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    return false;
  }
} 