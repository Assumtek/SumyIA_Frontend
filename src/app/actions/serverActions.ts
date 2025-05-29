"use server";

import { cookies, headers } from "next/headers";
import { api } from "../services/api";
import { getCookiesServer } from "@/lib/cookieServer";


// ADMIN

export async function handleListarUsuarios() {
  const token = getCookiesServer()
  
  try {
    const response = await api.get("/api/admin/usuarios", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data

  } catch (err: any) {
    console.log("Erro ::::", err.data)
    throw new Error(err.message);
  }
}

export async function handleListarKpi() {
  const token = getCookiesServer()
  
  try {
    const response = await api.get("/api/admin/kpi", {
      headers: { Authorization: `Bearer ${token}` },
    }); 

    return response.data

  } catch (err: any) {
    console.log("Erro ::::", err.data)
    throw new Error(err.message);
  }
}

export async function handleLogin(formData: FormData) {
  const email = formData.get("email");
  const senha = formData.get("senha");

  console.log("aqui", email, senha)

  if (!email || !senha) {
    throw new Error("Preencha todos os campos");
  }

  try {
    const response = await api.post("/api/auth/login", {
      email,
      senha,
    });

    if (!response.data.token) {
      throw new Error("Erro ao obter o token");
    }

    const expressTime = 60 * 60 * 24 * 30 * 1000;

    cookies().set("session", response.data.token, {
      maxAge: expressTime,
      httpOnly: false,
    });
  } catch (err: any) {
    console.log("Erro ::::", err.data)
    throw new Error(err.message);
  }
}

export async function handleCreateUser(formData: FormData) {
  const email = formData.get("email");
  const senha = formData.get("senha");
  const nome = formData.get("nome");

  if (!email || !senha || !nome) {
    throw new Error("Preencha todos os campos");
  }

  try {
    console.log("Enviando requisição para registro de usuário:", { nome, email });
    
    const response = await api.post("/api/usuarios/registro", {
      nome,
      email,
      senha,
      role: "ALUNO"
    });

    console.log("Resposta do servidor:", response.data);
    
    // Se chegou aqui, a requisição foi bem-sucedida
    return { success: true };
  } catch (err: any) {
    console.error("Erro ao criar usuário:", err);
    
    // Verificar se o erro tem uma resposta do servidor
    if (err.response) {
      // O servidor respondeu com um status de erro
      const errorMessage = err.response.data?.error || err.response.data?.message || err.response.data || "Erro ao criar a conta";
      console.error("Mensagem de erro do servidor:", errorMessage);
      throw new Error(errorMessage);
    } else if (err.request) {
      // A requisição foi feita mas não recebeu resposta
      console.error("Sem resposta do servidor");
      throw new Error("Não foi possível conectar ao servidor. Tente novamente mais tarde.");
    } else {
      // Erro na configuração da requisição
      console.error("Erro:", err.message);
      throw new Error(err.message || "Erro ao processar sua solicitação");
    }
  }
}

export async function handleMe() {
  const token = getCookiesServer()

  try {
    const response = await api.get("/api/usuarios", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const user = response.data
    

    return { user }


  } catch (err: any) {
    console.log("Erro ::::", err.data)
    throw new Error(err.message);
  }
}

export async function handleListarConversas() {
  const token = getCookiesServer()

  try { 

    const response = await api.get('/api/conversa', {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data  

  } catch (err: any) {
    console.log("Erro ::::", err.data)
    throw new Error(err.message);
  }
}

export async function handleListarMensagensConversa(conversaId: string) {
  const token = getCookiesServer()

  try { 

    const response = await api.get(`/api/conversa/${conversaId}/mensagens`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data  

  } catch (err: any) {
    console.log("Erro ::::", err.data)
    throw new Error(err.message);
  }
}

export async function handleEnviarResposta(conversaId: string, mensagem: string) {
  const token = getCookiesServer()
  try { 

    const response = await api.post(`/api/conversa/${conversaId}/responder`, {
      resposta: mensagem,
    }, { headers: { Authorization: `Bearer ${token}` } });

    return response.data  

  } catch (err: any) {
    console.log("Erro ::::", err.data)
    throw new Error(err.message);
  }
}

export async function handleIniciarConversa(p0: string) {
  const token = getCookiesServer()
  console.log("Token recebido:", token);
  try { 
    const response = await api.post('/api/conversa/iniciar', {
      secao: p0  
    }, { headers: { Authorization: `Bearer ${token}` } });

    console.log("Resposta da API (NOVA CONVERSA):", response.data);

    return response.data

  } catch (err: any) {
    console.log("Erro ::::", err.data)
    throw new Error(err.message);
  }
}

export async function handleForgotPassword(formData: FormData) {
  const email = formData.get("email");

  if (!email) {
    throw new Error("Preencha o campo de email");
  }

  try {
    // Chama a API para solicitar o reset de senha
    const response = await api.post("/api/usuarios/forgot-password", {
      email,
    });

    return { success: true, message: response.data.message || "Email de recuperação enviado com sucesso" };
  } catch (err: any) {
    console.error("Erro ao solicitar reset de senha:", err);
    
    // Verificar se o erro tem uma resposta do servidor
    if (err.response) {
      const errorMessage = "Erro ao solicitar reset de senha";
      throw new Error(errorMessage);
    } else if (err.request) {
      throw new Error("Não foi possível conectar ao servidor. Tente novamente mais tarde.");
    } else {
      throw new Error( "Erro ao processar sua solicitação");
    }
  }
}

export async function handleResetPassword(token: string, novaSenha: string) {
  if (!token || !novaSenha) {
    throw new Error("Token e nova senha são obrigatórios");
  }

  try {
    // Chama a API para redefinir a senha com o token
    const response = await api.post("/api/usuarios/reset-password", {
      token,
      novaSenha,
    });

    return { success: true, message: response.data.message || "Senha redefinida com sucesso" };
  } catch (err: any) {
    console.error("Erro ao redefinir senha:", err);
    
    // Verificar se o erro tem uma resposta do servidor
    if (err.response) {
      const errorMessage = err.response.data?.error || err.response.data?.message || "Erro ao redefinir a senha";
      throw new Error(errorMessage);
    } else if (err.request) {
      throw new Error("Não foi possível conectar ao servidor. Tente novamente mais tarde.");
    } else {
      throw new Error("Erro ao processar sua solicitação");
    }
  }
}

export async function handleUpdateUserProfile(formData: FormData) {
  try {
    const token = getCookiesServer();
    
    if (!token) {
      throw new Error("Usuário não autenticado");
    }
    
    const nome = formData.get("nome") as string;
    const email = formData.get("email") as string;
    
    const response = await api.put("/api/usuarios", {
      nome,
      email
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    return { success: true, message: "Perfil atualizado com sucesso", user: response.data };
  } catch (err: any) {
    console.error("Erro ao atualizar perfil:", err);
    throw new Error("Não foi possível atualizar os dados do perfil");
  }
}

export async function handleChangePassword(senhaAtual: string, novaSenha: string, confirmarSenha: string) {
  try {
    const token = getCookiesServer();
    
    if (!token) {
      throw new Error("Usuário não autenticado");
    }
    
    if (novaSenha !== confirmarSenha) {
      throw new Error("As senhas não conferem");
    }
    
    if (novaSenha.length < 6) {
      throw new Error("A nova senha deve ter pelo menos 6 caracteres");
    }

    console.log("Token recebido:", token);
    console.log("Chamando handleChangePassword");
    console.log("Senha atual:", senhaAtual);
    console.log("Nova senha:", novaSenha);
    
    const response = await api.put("/api/usuarios/senha", {
      senhaAtual,
      novaSenha
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Resposta da API (ALTERAR SENHA):", response.data);
    
    return { success: true, message: "Senha atualizada com sucesso" };
  } catch (err: any) {
    // console.error("Erro ao alterar senha:", err);
    
    if (err.response && err.response.data) {
      throw new Error(err.response.data.message || "Erro ao alterar senha");
    }
    
    throw new Error("Não foi possível alterar a senha");
  }
}

export async function handleLogout() {
  try {
    // Remove o cookie de sessão
    cookies().delete("session");
    return { success: true };
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    throw new Error("Erro ao fazer logout");
  }
}

export async function handleEditarNomeConversa(conversaId: string, novoNome: string) {
  const token = getCookiesServer();
  
  try {
    if (!token) {
      throw new Error("Usuário não autenticado");
    }
    
    const response = await api.put(`/api/conversa/${conversaId}/editar`, {
      secao: novoNome
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return { 
      success: true, 
      data: response.data,
      message: "Nome da conversa atualizado com sucesso" 
    };
  } catch (err: any) {
    console.error("Erro ao editar nome da conversa:", err);
    
    if (err.response) {
      throw new Error(err.response.data || "Erro ao atualizar o nome da conversa");
    }
    
    throw new Error("Não foi possível editar o nome da conversa");
  }
}

export async function handleDeletarConversa(conversaId: string) {
  const token = getCookiesServer();
  
  try {
    if (!token) {
      throw new Error("Usuário não autenticado");
    }
    
    const response = await api.delete(`/api/conversa/${conversaId}/deletar`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return { 
      success: true, 
      message: "Conversa deletada com sucesso" 
    };
  } catch (err: any) {
    console.error("Erro ao deletar conversa:", err);
    
    if (err.response) {
      throw new Error(err.response.data || "Erro ao deletar a conversa");
    }
    
    throw new Error("Não foi possível deletar a conversa");
  }
}

export async function handleDownloadDocumentoWord(conversaId: string) {
  const token = getCookiesServer();
  
  if (!token) {
    throw new Error("Usuário não autenticado");
  }
  
  // Retornar a URL para download do documento
  return {
    url: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'}/api/documentos/${conversaId}/word`,
    token
  };
}
