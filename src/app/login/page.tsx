"use client"

import { useState, FormEvent, useEffect, Suspense } from 'react'
import Link from 'next/link'
import styles from './page.module.scss'
import { toast } from 'react-toastify'
import { useRouter, useSearchParams } from 'next/navigation'
import { handleLogin, handleListarConversas } from '../actions/serverActions'

// Componente que usa useSearchParams
function LoginContent() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  // Verifica se o usuário acabou de se registrar
  useEffect(() => {
    const registered = searchParams.get('registered')
    if (registered === 'true') {
      setSuccess('Conta criada com sucesso! Faça login para continuar.')
    }
  }, [searchParams])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Obtém os dados do formulário diretamente
      const formData = new FormData(event.currentTarget)

      // Verificação básica dos campos
      const email = formData.get('email') as string
      const senha = formData.get('senha') as string

      if (!email || !senha) {
        setError('Preencha todos os campos')
        setLoading(false)
        return
      }

      // Chama a server action handleLogin passando o FormData
      await handleLogin(formData)

      // Busca as conversas do usuário para encontrar a mais recente
      try {
        const conversas = await handleListarConversas()

        if (conversas && Array.isArray(conversas) && conversas.length > 0) {
          const conversasOrdenadas = [...conversas].sort((a, b) => {
            const dataA = new Date(a.updatedAt).getTime()
            const dataB = new Date(b.updatedAt).getTime()
            return dataB - dataA
          })

          if (conversasOrdenadas.length > 0) {
            router.push(`/conversa/${conversasOrdenadas[0].id}`)
          } else {
            router.push('/conversa')
          }
        } else {
          router.push('/conversa')
        }
      } catch (err) {
        console.error('Erro ao buscar conversas:', err)
        router.push('/conversa')
      }
    } catch (err) {
      console.error('Erro ao fazer login:', err)
      setError('Ocorreu um erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.containerCenter}>
      <div className={styles.equerda}>
        <img src="/CapaForms.png" alt="Login" />
      </div>

      <div className={styles.direita}>
        <h1 className={styles.title}>SUMY<span>IA.</span></h1>
        <p className={styles.subtitle}>Faça login para começar a conversar</p>

        <div className={styles.login}>
          <form onSubmit={onSubmit}>

            {success && (
              <div className={styles.success}>
                {success}
              </div>
            )}

            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Digite seu email"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="senha" className={styles.label}>Senha</label>
                <Link href="/forgot-password" className={styles.forgotPassword}>
                  Esqueceu a senha?
                </Link>
              </div>
              <input
                type="password"
                id="senha"
                name="senha"
                placeholder="Digite sua senha"
                className={styles.input}
                required
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
              disabled={loading}
            >
              {loading ? 'Carregando...' : 'Entrar'}
            </button>
          </form>

          <div className={styles.registerLink}>
            Não tem uma conta?
            <Link href="/register">
              Registre-se
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente principal que envolve o conteúdo em Suspense
export default function LoginForm() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <LoginContent />
    </Suspense>
  )
}