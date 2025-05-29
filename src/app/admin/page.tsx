"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.scss';

import {
  handleListarKpi,
  handleListarUsuarios,
  handleMe,
} from '@/app/actions/serverActions';
import { logout } from '@/lib/logout';

import FullScreenLoader from '@/app/components/FullScreenLoader';

type User = {
  id: string;
  nome: string;
  email: string;
  role: string;
};

type KPI = {
  totalUsuarios: number;
  usuariosPorRole: {
    ALUNO: number;
    ADMIN: number;
    FREE: number;
  };
  totalConversas: number;
  totalMensagens: number;
  totalDocumentos: number;
  usuariosAtivos: number;
  conversasRecentes: number;
};

type Users = {
  id: string;
  nome: string;
  email: string;
  role: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  ativo: boolean;
  _count: {
    documentos: number;
    conversas: number;
  };
};

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [kpiData, setKpiData] = useState<KPI | null>(null);
  const [usersData, setUsersData] = useState<Users[] | null>(null);

  const router = useRouter();

  // Carregar dados do usuário
  useEffect(() => {
    setLoading(true);
    async function loadData() {
      try {
        handleResize();
        await Promise.all([
          loadUserData(),
          loadKPIData(),
          listUsersData()
        ]);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Função para carregar dados do usuário
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

  // Função para carregar dados do usuário
  async function loadKPIData() {
    try {
      const response = await handleListarKpi();
      if (response && response) {
        setKpiData(response);
      }
    } catch (err) {
      console.error('Erro ao carregar dados de KPI:', err);
    }
  }

  // Função para carregar dados do usuário
  async function listUsersData() {
    try {
      const response = await handleListarUsuarios();
      if (response && response) {
        setUsersData(response);
      }
    } catch (err) {
      console.error('Erro ao carregar dados dos usuários:', err);
    }
  }

  // Função para lidar com o redimensionamento da tela
  function handleResize() {
    if (window.innerWidth > 800) {
      setSidebarAberta(true); // Em telas grandes, sempre aberta
    } else {
      setSidebarAberta(false); // Em telas pequenas, fechada por padrão
    }
  }

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

  // Gerar iniciais para o avatar
  const getInitials = (name: string) => {
    if (!name) return 'UD';

    const nameParts = name.split(' ');
    if (nameParts.length === 1) return nameParts[0].substring(0, 2).toUpperCase();

    return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
  };

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

        <div className={styles.conversasList}>
          <Link href="/admin/dashboard" className={styles.conversaLink}>
            <img src="/iconDashboard.svg" alt="Home" width={28} height={28} />
            Home
          </Link>
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

      <div className={styles.adminContainer}>
        <div className={styles.adminHeader}>
          <div className={styles.headerContainer}>
            <div>Painel de Administrador</div>
          </div>
        </div>

        <div className={styles.adminContent}>
          {/* Conteúdo do painel administrativo será adicionado aqui */}
          {/* Visão geral de usuários, conversas, etc. */}
          <div className={styles.adminDashboard}>
            <div className={styles.dashboardHeader}>
              <h2>Visão Geral</h2>
            </div>
            <div className={styles.dashboardContent}>
              <div className={styles.dashboardCard}>
                <div className={styles.dashboardCardHeader}>
                  <img src="/iconUsers.svg" alt="Usuários" width={28} height={28} />
                  <h3>Total de Usuários</h3>
                </div>
                <p className={styles.dashboardCardNumber}>{kpiData?.totalUsuarios || 0}</p>
              </div>

              <div className={styles.dashboardCard}>
                <div className={styles.dashboardCardHeader}>
                  <img src="/iconUsers.svg" alt="Usuários Ativos" width={28} height={28} />
                  <h3>Usuários Ativos</h3>
                </div>
                <p className={styles.dashboardCardNumber}>{kpiData?.usuariosAtivos || 0}</p>
              </div>

              <div className={styles.dashboardCard}>
                <div className={styles.dashboardCardHeader}>
                  <img src="/iconChat.svg" alt="Conversas" width={28} height={28} />
                  <h3>Total de Conversas</h3>
                </div>
                <p className={styles.dashboardCardNumber}>{kpiData?.totalConversas || 0}</p>
              </div>

              <div className={styles.dashboardCard}>
                <div className={styles.dashboardCardHeader}>
                  <img src="/iconChat.svg" alt="Mensagens" width={28} height={28} />
                  <h3>Total de Mensagens</h3>
                </div>
                <p className={styles.dashboardCardNumber}>{kpiData?.totalMensagens || 0}</p>
              </div>
              <div className={styles.dashboardCard}>
              <div className={styles.dashboardCardHeader}>
                <img src="/iconDocument.svg" alt="Documentos" width={28} height={28} />
                <h3>Total de Documentos</h3>
              </div>
              <p className={styles.dashboardCardNumber}>{kpiData?.totalDocumentos || 0}</p>
            </div>
            </div>

  
          </div>

          <div className={styles.tableUsers}>
            <h2>Gerenciamento de Usuários</h2>
            <table>
              <thead>
                <tr>
                  <th>Usuário</th>
                  <th>Status</th>
                  <th>Conversas</th>
                  <th>Mensagens</th>
                  <th>Documentos</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usersData?.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className={styles.userCell}>
                        <img
                          src="/avatarDefault.png"
                          alt={user.nome}
                          className={styles.avatar}
                          width={44}
                          height={44}
                        />
                        <div>
                          <div className={styles.userName}>{user.nome}</div>
                          <div className={styles.userEmail}>{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={user.ativo ? styles.statusAtivo : styles.statusDesativo}>
                        {user.ativo ? 'Ativo' : 'Desativo'}
                      </span>
                    </td>
                    <td>{user._count.conversas}</td>
                    <td>{user._count.documentos}</td>
                    <td>{user._count.documentos}</td>
                    <td>
                      <button className={styles.desativarBtn}>
                        Desativar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {loading && <FullScreenLoader texto="Carregando o painel de administrador..." />}

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