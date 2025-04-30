"use client";

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './profile.module.scss';
import { handleMe, handleUpdateUserProfile, handleChangePassword } from '../actions/serverActions';
import { ArrowLeft, Save, Edit, Lock, User, Mail } from 'lucide-react';

type User = {
  id: string;
  nome: string;
  email: string;
  role: string;
  createdAt: string;
};

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  
  // Estados para o modal de alteração de senha
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  // Carregar dados do usuário
  useEffect(() => {
    async function loadUserProfile() {
      try {
        setLoading(true);
        const response = await handleMe();
        if (response && response.user) {
          setUser(response.user);
          setNome(response.user.nome || '');
          setEmail(response.user.email || '');
        } else {
          throw new Error('Não foi possível obter os dados do usuário');
        }
      } catch (err: any) {
        console.error('Erro ao carregar perfil:', err);
        setError('Não foi possível carregar os dados do seu perfil');
      } finally {
        setLoading(false);
      }
    }

    loadUserProfile();
  }, []);

  // Função para salvar alterações no perfil
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData(e.currentTarget);
      const response = await handleUpdateUserProfile(formData);
      
      setSuccess(response.message || 'Perfil atualizado com sucesso');
      if (response.user) {
        setUser(response.user);
      }
    } catch (err: any) {
      console.error('Erro ao atualizar perfil:', err);
      setError(err.message || 'Erro ao atualizar o perfil');
    } finally {
      setSaving(false);
    }
  }

  // Função para manipular alteração de senha
  async function handlePasswordChange(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setChangingPassword(true);
    setPasswordError('');
    setPasswordSuccess('');

    try {
      const response = await handleChangePassword(senhaAtual, novaSenha, confirmarSenha);
      
      setPasswordSuccess(response.message || 'Senha atualizada com sucesso');
      // Limpar campos após sucesso
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
      
      // Fechar o modal após um pequeno delay
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess('');
      }, 2000);
    } catch (err: any) {
      console.error('Erro ao alterar senha:', err);
      setPasswordError(err.message || 'Erro ao alterar a senha');
    } finally {
      setChangingPassword(false);
    }
  }

  // Gerar iniciais para o avatar
  const getInitials = (name: string) => {
    if (!name) return 'UD';
    
    const nameParts = name.split(' ');
    if (nameParts.length === 1) return nameParts[0].substring(0, 2).toUpperCase();
    
    return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
  };

  // Se estiver carregando, mostrar mensagem de carregamento
  if (loading) {
    return (
      <div className={styles.containerCenter}>
        <h1>Perfil do Usuário</h1>
        <div className={styles.profileCard}>
          <p className={styles.loading}>Carregando dados do perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.containerCenter}>
      <div className={styles.header}>
        <button onClick={() => router.back()} className={styles.backButton}>
          <ArrowLeft size={18} />
          Voltar
        </button>
        <h1 className={styles.title}>Perfil do Usuário</h1>
      </div>
      
      <div className={styles.profileCard}>
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}
        
        <div className={styles.avatarSection}>
          <div className={styles.avatar}>
            {getInitials(nome || user?.nome || '')}
            <button className={styles.editAvatarButton}>
              <Edit size={12} />
            </button>
          </div>
          <h2>Informações do Perfil</h2>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="nome" className={styles.label}>
              <User size={14} className={styles.inputIcon} />
              Nome
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu nome"
              className={styles.input}
              required
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              <Mail size={14} className={styles.inputIcon} />
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          
          <div className={styles.passwordSection}>
            <button 
              type="button" 
              className={styles.changePasswordButton}
              onClick={() => setShowPasswordModal(true)}
            >
              <Lock size={14} className={styles.passwordIcon} />
              Alterar Senha
            </button>
          </div>
          
          <button 
            type="submit" 
            className={styles.saveButton}
            disabled={saving}
          >
            {saving ? 'Salvando...' : (
              <>
                <Save size={16} className={styles.saveIcon} />
                Salvar Alterações
              </>
            )}
          </button>
        </form>
      </div>
      
      {/* Modal de alteração de senha */}
      {showPasswordModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>
              <Lock size={18} className={styles.modalIcon} />
              Alterar Senha
            </h3>
            <button 
              className={styles.closeButton}
              onClick={() => {
                setShowPasswordModal(false);
                setPasswordError('');
                setPasswordSuccess('');
                setSenhaAtual('');
                setNovaSenha('');
                setConfirmarSenha('');
              }}
            >
              Cancelar
            </button>
            
            <form onSubmit={handlePasswordChange}>
              {passwordError && <div className={styles.error}>{passwordError}</div>}
              {passwordSuccess && <div className={styles.success}>{passwordSuccess}</div>}
              
              <div className={styles.inputGroup}>
                <label htmlFor="senhaAtual">
                  <Lock size={14} className={styles.inputIcon} />
                  Senha Atual
                </label>
                <input
                  type="password"
                  id="senhaAtual"
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="novaSenha">
                  <Lock size={14} className={styles.inputIcon} />
                  Nova Senha
                </label>
                <input
                  type="password"
                  id="novaSenha"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  className={styles.input}
                  required
                  minLength={6}
                />
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="confirmarSenha">
                  <Lock size={14} className={styles.inputIcon} />
                  Confirmar Nova Senha
                </label>
                <input
                  type="password"
                  id="confirmarSenha"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  className={styles.input}
                  required
                  minLength={6}
                />
              </div>
              
              <button 
                type="submit" 
                className={styles.saveButton}
                disabled={changingPassword}
              >
                {changingPassword ? 'Atualizando...' : (
                  <>
                    <Save size={16} className={styles.saveIcon} />
                    Atualizar Senha
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 