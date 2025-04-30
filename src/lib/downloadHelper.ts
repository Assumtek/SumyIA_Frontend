import { getCookiesClient } from './cookieClient';

export async function downloadFile(url: string, token?: string) {
  try {
    const authToken = token || getCookiesClient();
    
    if (!authToken) {
      throw new Error('Usuário não autenticado');
    }

    console.log("Token de autenticação:", authToken);
    console.log("URL base:", url);
    
    // Construir URL com o token como parâmetro de consulta
    const downloadUrl = `${url}?token=${encodeURIComponent(authToken)}`;
    console.log("URL completa:", downloadUrl);
    
    // Criar um link temporário para download
    const link = document.createElement('a');
    link.href = downloadUrl;
    
    // Tornar o link invisível
    link.style.display = 'none';
    
    // Adicionar ao DOM
    document.body.appendChild(link);
    
    // Clicar no link para iniciar o download
    link.click();
    
    // Remover o link após o download ser iniciado
    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);
    
    return true;
  } catch (error) {
    console.error('Erro ao baixar arquivo:', error);
    throw error;
  }
} 