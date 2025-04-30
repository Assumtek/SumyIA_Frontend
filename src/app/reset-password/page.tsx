"use client";

import { useState, FormEvent, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import styles from '../page.module.scss'
import { handleResetPassword } from '../actions/serverActions'

export default function ResetPassword() {
  const [loading, setLoading] = useState(false)
  const [validatingToken, setValidatingToken] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [token, setToken] = useState('')
  
  const router = useRouter()
  const searchParams = useSearchParams()

  // Verificar o token da URL quando a página carregar
  useEffect(() => {
    const tokenFromUrl = searchParams.get('token')
    
    if (!tokenFromUrl) {
      setError('Token de recuperação não encontrado. Verifique o link enviado por email.')
      setValidatingToken(false)
      return
    }
    
    setToken(tokenFromUrl)
    setValidatingToken(false)
  }, [searchParams])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Verificar se as senhas conferem
      if (password !== confirmPassword) {
        setError('As senhas não conferem')
        setLoading(false)
        return
      }
      
      // Verificar requisitos de segurança da senha
      if (password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres')
        setLoading(false)
        return
      }
      
      // Enviar a nova senha com o token
      const response = await handleResetPassword(token, password)
      
      // Mostrar mensagem de sucesso
      setSuccess(response.message || 'Senha redefinida com sucesso!')
      
      // Limpar o formulário
      setPassword('')
      setConfirmPassword('')
      
      // Redirecionar para o login após 3 segundos
      setTimeout(() => {
        router.push('/')
      }, 3000)
    } catch (err: any) {
      console.error('Erro ao redefinir senha:', err)
      setError(err.message || 'Ocorreu um erro ao redefinir sua senha')
    } finally {
      setLoading(false)
    }
  }

  // Se estiver validando o token, mostrar carregando
  if (validatingToken) {
    return (
      <div className={styles.containerCenter}>
        <h1 className={styles.title}>Sumy IA</h1>
        <div className={styles.login}>
          <p className={styles.carregando}>Verificando token de recuperação...</p>
        </div>
      </div>
    )
  }

  // Se houver erro no token, mostrar mensagem
  if (!token) {
    return (
      <div className={styles.containerCenter}>
        <h1 className={styles.title}>Sumy IA</h1>
        <div className={styles.login}>
          <div className={styles.error}>{error}</div>
          <div className={styles.registerLink}>
            <Link href="/forgot-password">
              Solicitar novo link de recuperação
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.containerCenter}>
      <h1 className={styles.title}>Sumy IA</h1>
      <p className={styles.subtitle}>Digite e confirme sua nova senha</p>
      
      <div className={styles.login}>
        <form onSubmit={onSubmit}>
          
          {success && (
            <div className={styles.success}>
              {success}
              <p className={styles.redirectMessage}>Redirecionando para a página de login...</p>
            </div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Nova Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Digite sua nova senha"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>Confirme a Senha</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirme sua nova senha"
              className={styles.input}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className={styles.loginButton}
            disabled={loading || !password || !confirmPassword}
          >
            {loading ? 'Processando...' : 'Redefinir Senha'}
          </button>
        </form>

        <div className={styles.registerLink}>
          <Link href="/">
            Voltar ao login
          </Link>
        </div>
      </div>
    </div>
  )
} 