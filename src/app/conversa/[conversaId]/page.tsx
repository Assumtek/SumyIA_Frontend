"use client";

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.scss';
import { api } from '../../services/api';
import { getCookiesClient } from '@/lib/cookieClient';
import {
  handleListarMensagensConversa,
  handleListarConversas,
  handleEnviarResposta,
  handleIniciarConversa,
  handleMe,
  handleEditarNomeConversa,
  handleDeletarConversa,
  handleDownloadDocumentoWord
} from '@/app/actions/serverActions';
import { Settings, HelpCircle, LogOut, Plus, Send, Edit2, Trash2, MoreVertical, FileText } from 'lucide-react';
import { logout } from '@/lib/logout';
import { marked } from 'marked';
import { MutatingDots } from 'react-loader-spinner';
import FullScreenLoader from '@/app/components/FullScreenLoader';

// Tipos para mensagens e conversa
type Mensagem = {
  id: string;
  role: string;
  content: string;
  createdAt: string;
};

type Conversa = {
  id: string;
  secao: string;
  mensagens: Mensagem[];
};

type ConversaItem = {
  id: string;
  secao: string;
  createdAt: string;
  updatedAt: string;
  ultimaMensagem?: {
    content: string;
    createdAt: string;
  };
};

type User = {
  id: string;
  nome: string;
  email: string;
  role: string;
};

export default function ChatConversa() {
  const [loading, setLoading] = useState(false);
  const [loadingNewConversa, setLoadingNewConversa] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [conversa, setConversa] = useState<Conversa | null>(null);
  const [novaMsg, setNovaMsg] = useState('');
  const [conversas, setConversas] = useState<ConversaItem[]>([]);
  const [carregandoConversas, setCarregandoConversas] = useState(true);
  const [enviandoMensagem, setEnviandoMensagem] = useState(false);
  const [processandoResposta, setProcessandoResposta] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);

  // Estados para gerenciar edição e exclusão
  const [conversaEditando, setConversaEditando] = useState<string | null>(null);
  const [novoNomeConversa, setNovoNomeConversa] = useState('');
  const [mostrarModalExclusao, setMostrarModalExclusao] = useState<string | null>(null);
  const [processandoAcao, setProcessandoAcao] = useState(false);

  const params = useParams();
  const router = useRouter();
  const mensagensRef = useRef<HTMLDivElement>(null);
  const conversaId = params.conversaId as string;


  const [sidebarAberta, setSidebarAberta] = useState(false);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 800) {
        setSidebarAberta(true); // Em telas grandes, sempre aberta
      } else {
        setSidebarAberta(false); // Em telas pequenas, fechada por padrão
      }
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Carregar dados do usuário
  useEffect(() => {
    async function loadUserData() {
      try {
        const response = await handleMe();
        if (response && response.user) {
          setUserData(response.user);
        }
      } catch (err) {
        console.error('Erro ao carregar dados do usuário:', err);
      }
    }
    loadUserData();
  }, []);

  // Função para buscar mensagens da conversa
  useEffect(() => {

    async function fetchMensagens() {
      if (!conversaId) return;

      setLoading(true);
      setError(null);

      try {
        const token = getCookiesClient()

        if (!token) {
          router.push('/login'); // Redirecionar para login se não estiver autenticado
          return;
        }

        // Buscar as mensagens da conversa
        const response = await handleListarMensagensConversa(conversaId)

        // Verificar se a API retornou as mensagens
        if (response && response.mensagens) {
          // Filtrar as duas primeiras mensagens automáticas do sistema
          const mensagensFiltradas = response.mensagens.filter((msg: Mensagem, index: number) => {
            // Se for uma das duas primeiras mensagens e for do sistema, não incluir
            if (index < 1) {
              return false;
            }
            return true;
          });

          setMensagens(mensagensFiltradas);
          setConversa({
            id: conversaId,
            secao: response.secao || 'Conversa',
            mensagens: mensagensFiltradas
          });
        } else {
          setError('Não foi possível carregar as mensagens');
          router.push('/conversa'); // Redirecionar para a página principal de conversas se não houver mensagens
        }
      } catch (err: any) {
        console.error('Erro ao buscar mensagens:', err);
        setError(err.response?.data?.message || 'Erro ao carregar a conversa');

        // Se for erro 401 (não autorizado), redirecionar para login
        if (err.response?.status === 401) {
          router.push('/login');
        } else {
          router.push('/conversa'); // Redirecionar para a página principal em caso de outros erros
        }
      } finally {
        setLoading(false);
      }
    }

    fetchMensagens();
  }, [conversaId, router]);

  // Função para buscar todas as conversas
  useEffect(() => {
    // Função para buscar todas as conversas
    async function fetchConversas() {
      setCarregandoConversas(true);

      try {
        const response = await handleListarConversas();

        if (response && Array.isArray(response)) {
          setConversas(response);
        }
      } catch (err) {
        console.error('Erro ao buscar lista de conversas:', err);
      } finally {
        setCarregandoConversas(false);
      }
    }

    fetchConversas();
  }, []);

  // Rolar para a última mensagem quando as mensagens mudarem
  useEffect(() => {
    if (mensagensRef.current) {
      mensagensRef.current.scrollTop = mensagensRef.current.scrollHeight;
    }
  }, [mensagens]);

  // Função para enviar nova mensagem
  const enviarMensagem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!novaMsg.trim() || enviandoMensagem) return;

    const mensagemTexto = novaMsg.trim();
    setNovaMsg(''); // Limpar o campo imediatamente
    setEnviandoMensagem(true);
    setProcessandoResposta(true); // Iniciar processamento da resposta

    // Adicionar mensagem do usuário ao estado local imediatamente (UI otimista)
    const novaMensagemUsuario: Mensagem = {
      id: `temp-${Date.now()}`, // ID temporário
      role: 'user',
      content: mensagemTexto,
      createdAt: new Date().toISOString()
    };

    setMensagens(mensagensAtuais => [...mensagensAtuais, novaMensagemUsuario]);

    try {
      // Obter o token de autenticação
      const token = getCookiesClient();

      if (!token) {
        router.push('/');
        return;
      }

      // Enviar a mensagem para a API
      const response = await handleEnviarResposta(conversaId, mensagemTexto);

      console.log('Resposta da API:', response);

      if (response && response.pergunta) {
        // Se a API retornar a resposta da IA no campo 'pergunta'
        const novaMensagemIA: Mensagem = {
          id: `ia-${Date.now()}`, // ID temporário para a resposta da IA
          role: 'assistant',
          content: response.pergunta,
          createdAt: new Date().toISOString()
        };

        // Adicionar a resposta da IA às mensagens existentes
        setMensagens(mensagensAtuais => [...mensagensAtuais, novaMensagemIA]);
      }

      // Atualizar a lista de conversas para mostrar a última mensagem
      atualizarListaConversas();
    } catch (err: any) {
      console.error('Erro ao enviar mensagem:', err);
      alert('Não foi possível enviar a mensagem');

      // Remover a mensagem temporária em caso de erro
      setMensagens(mensagensAtuais =>
        mensagensAtuais.filter(m => m.id !== novaMensagemUsuario.id)
      );
    } finally {
      setEnviandoMensagem(false);
      setProcessandoResposta(false); // Finalizar processamento
    }
  };

  // Função para atualizar a lista de conversas após enviar uma mensagem
  const atualizarListaConversas = async () => {
    try {
      const response = await handleListarConversas();

      if (response && Array.isArray(response)) {
        setConversas(response);
      }
    } catch (err) {
      console.error('Erro ao atualizar lista de conversas:', err);
    }
  };

  // Iniciar uma nova conversa
  const iniciarNovaConversa = async () => {
    try {
      setLoadingNewConversa(true); // Ativa o loading
      const token = getCookiesClient();

      if (!token) {
        router.push('/');
        setLoadingNewConversa(false);
        return;
      }

      const response = await handleIniciarConversa("Nova Conversa");

      if (response && response.conversaId) {
        router.push(`/conversa/${response.conversaId}`);
        return; // Retorna sem desativar o loading
      }

      // Se não conseguir criar a conversa, desativa o loading
      setLoadingNewConversa(false);
    } catch (err) {
      alert('Não foi possível criar uma nova conversa');
      setLoadingNewConversa(false);
    }
  };

  // Função para lidar com o logout
  const handleLogoutClick = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Mesmo se ocorrer um erro, tentamos redirecionar para a página de login
      router.push('/');
    }
  };

  // Formatar a data de uma mensagem
  const formatarData = (dataString: string) => {
    try {
      const data = new Date(dataString);
      return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  // Gerar iniciais para o avatar
  const getInitials = (name: string) => {
    if (!name) return 'UD';

    const nameParts = name.split(' ');
    if (nameParts.length === 1) return nameParts[0].substring(0, 2).toUpperCase();

    return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
  };

  // Função para editar o nome da conversa
  const editarNomeConversa = async (conversaId: string) => {
    if (!novoNomeConversa.trim() || processandoAcao) return;

    setProcessandoAcao(true);

    try {
      await handleEditarNomeConversa(conversaId, novoNomeConversa);

      // Atualizar o estado local para refletir a mudança
      setConversas(conversasAtuais =>
        conversasAtuais.map(c =>
          c.id === conversaId ? { ...c, secao: novoNomeConversa } : c
        )
      );

      // Se estiver editando a conversa atual, atualizar o título
      if (conversaId === params.conversaId) {
        setConversa(conversaAtual =>
          conversaAtual ? { ...conversaAtual, secao: novoNomeConversa } : null
        );
      }

      // Limpar estado de edição
      setConversaEditando(null);
      setNovoNomeConversa('');
    } catch (err) {
      console.error('Erro ao editar nome da conversa:', err);
      alert('Não foi possível editar o nome da conversa');
    } finally {
      setProcessandoAcao(false);
    }
  };

  // Função para excluir a conversa
  const excluirConversa = async (conversaId: string) => {
    if (processandoAcao) return;

    setProcessandoAcao(true);

    try {
      await handleDeletarConversa(conversaId);

      // Atualizar a lista de conversas
      setConversas(conversasAtuais =>
        conversasAtuais.filter(c => c.id !== conversaId)
      );

      // Se a conversa excluída for a atual, redirecionar para outra
      if (conversaId === params.conversaId) {
        // Verificar se há outras conversas
        const outrasConversas = conversas.filter(c => c.id !== conversaId);

        if (outrasConversas.length > 0) {
          // Redirecionar para a primeira conversa disponível
          router.push(`/conversa/${outrasConversas[0].id}`);
        } else {
          // Se não houver outras conversas, criar uma nova
          const response = await handleIniciarConversa("Nova Conversa");
          if (response && response.conversaId) {
            router.push(`/conversa/${response.conversaId}`);
          }
        }
      }

      // Fechar o modal
      setMostrarModalExclusao(null);
    } catch (err) {
      console.error('Erro ao excluir conversa:', err);
      alert('Não foi possível excluir a conversa');
    } finally {
      setProcessandoAcao(false);
    }
  };

  useEffect(() => {
    function setRealVH() {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vr', `${vh}px`);
    }
    setRealVH();
    window.addEventListener('resize', setRealVH);
    return () => window.removeEventListener('resize', setRealVH);
  }, []);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.navMobile}>
        <h1 className={styles.title2}>SUMY<span>IA.</span></h1>
        <button
          className={styles.menuButton}
          onClick={() => setSidebarAberta((prev) => !prev)}
          aria-label={sidebarAberta ? 'Fechar menu' : 'Abrir menu'}
        >
          {sidebarAberta ? '✖' : '☰'}
        </button>
      </div>
      <div className={`${styles.sidebar} ${sidebarAberta ? styles.aberta : ''}`}>
        <div className={styles.logoContainer}>
          <div className={styles.sidebarLogo}>
            <h1 className={styles.title}>SUMY<span>IA.</span></h1>
          </div>
        </div>

        {/* Informações do usuário no topo da sidebar */}
        <div className={styles.userInfoContainer} onClick={() => router.push('/profile')}>
          <div className={styles.userAvatar}>
            {userData ? getInitials(userData.nome) : 'UD'}
          </div>
          <div className={styles.userInfo}>
            <h4>{userData?.nome || 'Usuário Demo'}</h4>
            <p>{userData?.email || 'usuario@exemplo.com'}</p>
          </div>
        </div>

        <div className={styles.sidebarHeader}>
          <h3>Conversas</h3>
          <button onClick={iniciarNovaConversa} className={styles.novaConversaBtn}>
            <img src="/iconplus.svg" alt="Nova Conversa" width={18} height={18} />
            <span className={styles.btnText}>Nova</span>
          </button>
        </div>

        <div className={styles.conversasList}>
          {carregandoConversas ? (
            <div className={styles.carregando}>Carregando...</div>
          ) : conversas.length === 0 ? (
            <div className={styles.semConversas}>Nenhuma conversa encontrada</div>
          ) : (
            conversas.map((item) => (
              <div
                key={item.id}
                className={`${styles.conversaItem} ${item.id === conversaId ? styles.ativo : ''}`}
              >
                {conversaEditando === item.id ? (
                  // Modo de edição
                  <div className={styles.editarConversa}>
                    <input
                      type="text"
                      value={novoNomeConversa}
                      onChange={(e) => setNovoNomeConversa(e.target.value)}
                      className={styles.inputEditarConversa}
                      placeholder="Nome da conversa"
                      autoFocus
                    />
                    <div className={styles.editarBotoes}>
                      <button
                        onClick={() => editarNomeConversa(item.id)}
                        className={styles.botaoSalvar}
                        disabled={processandoAcao || !novoNomeConversa.trim()}
                      >
                        Salvar
                      </button>
                      <button
                        onClick={() => {
                          setConversaEditando(null);
                          setNovoNomeConversa('');
                        }}
                        className={styles.botaoCancelar}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Link
                      href={`/conversa/${item.id}`}
                      className={styles.conversaLink}
                    >
                      <div className={styles.conversaInfo}>
                        <h4>{item.secao}</h4>
                        <p>{item.ultimaMensagem?.content?.substring(0, 30) || 'Sem mensagens'}</p>
                      </div>
                    </Link>
                    <div className={styles.conversaAcoes}>
                      <button
                        onClick={() => {
                          setConversaEditando(item.id);
                          setNovoNomeConversa(item.secao);
                        }}
                        className={styles.botaoEditar}
                        aria-label="Editar conversa"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => setMostrarModalExclusao(item.id)}
                        className={styles.botaoExcluir}
                        aria-label="Excluir conversa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        {/* Botões de navegação no rodapé da sidebar */}
        <div className={styles.sidebarFooter}>
          <button className={styles.footerButton} onClick={() => router.push('/profile')}>
            <img src="/iconConfigurate.svg" alt="Configurações" width={28} height={28} />
            Configurações
          </button>
          <button className={styles.footerButton} onClick={handleLogoutClick}>
            <img src="/iconDoor.svg" alt="Sair" width={25} height={25} />
            Sair
          </button>
        </div>
      </div>

      <div className={styles.chatContainer}>
        <div className={styles.tituloAtualChat}>
          <div className={styles.tituloContainer}>
            <div>{conversa?.secao || 'Carregando...'}</div>

          </div>
        </div>

        <div className={styles.mensagens} ref={mensagensRef}>
          {loading ? (
            <div className={styles.carregando}>Carregando mensagens...</div>
          ) : error ? (
            <div className={styles.erro}>{error}</div>
          ) : mensagens.length === 0 ? (
            <div className={styles.semMensagens}>Nenhuma mensagem encontrada</div>
          ) : (
            <>
              {mensagens.map((msg) => (
                <div
                  key={msg.id}
                  className={msg.role === 'user' ? styles.mensagemUser : styles.mensagemIA}
                  data-author={msg.role === 'user' ? userData?.nome || 'Usuário Demo' : 'Assistente IA'}
                >
                  {msg.role === 'user' ? (
                    <p>{msg.content}</p>
                  ) : (
                    // Renderiza a resposta da IA como HTML
                    <div dangerouslySetInnerHTML={{ __html: marked.parse(msg.content) }} />
                  )}
                  <span className={styles.horario}>{formatarData(msg.createdAt)}</span>
                </div>
              ))}

              {processandoResposta && (
                <div className={styles.digitando}>
                  <div className={styles.bolinha}></div>
                  <div className={styles.bolinha}></div>
                  <div className={styles.bolinha}></div>
                </div>
              )}
            </>
          )}
        </div>

        <form onSubmit={enviarMensagem} className={styles.enviarMensagem}>
          <input
            type="text"
            value={novaMsg}
            onChange={(e) => setNovaMsg(e.target.value)}
            placeholder="Digite sua mensagem..."
            className={styles.inputMensagem}
            disabled={loading || enviandoMensagem}
          />
          <button
            type="submit"
            className={styles.botaoEnviar}
            disabled={loading || enviandoMensagem || !novaMsg.trim()}
          >
            {enviandoMensagem ? 'Enviando...' : <Send size={22} />}
          </button>
        </form>
      </div>

      {/* Modal de confirmação de exclusão */}
      {mostrarModalExclusao && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Confirmar exclusão</h3>
            <p>Tem certeza que deseja excluir esta conversa? Esta ação não pode ser desfeita.</p>
            <div className={styles.modalBotoes}>
              <button
                onClick={() => excluirConversa(mostrarModalExclusao)}
                className={styles.botaoConfirmarExclusao}
                disabled={processandoAcao}
              >
                {processandoAcao ? 'Excluindo...' : 'Sim, excluir'}
              </button>
              <button
                onClick={() => setMostrarModalExclusao(null)}
                className={styles.botaoCancelar}
                disabled={processandoAcao}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && <FullScreenLoader texto="Carregando mensagens..." />}
      {loadingNewConversa && <FullScreenLoader texto="Sua nova conversa está sendo criada..." />}

      {sidebarAberta && (
        <div
          className={styles.overlay}
          onClick={() => setSidebarAberta(false)}
          aria-label="Fechar menu"
        />
      )}
    </div>
  );
} 