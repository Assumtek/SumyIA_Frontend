"use client";

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import styles from './page.module.scss'
import { useRouter } from 'next/navigation'
import { handleForgotPassword } from '../actions/serverActions'

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Obtém os dados do formulário diretamente
      const formData = new FormData(event.currentTarget)

      // Verificação básica do campo de email
      const email = formData.get('email') as string

      if (!email) {
        setError('Preencha o campo de email')
        setLoading(false)
        return
      }

      // Chama a server action handleResetPassword passando o FormData
      const response = await handleForgotPassword(formData)

      // Exibe mensagem de sucesso
      setSuccess(response.message || 'Email de recuperação enviado com sucesso')

      // Limpa o formulário
      event.currentTarget.reset()
    } catch (err: any) {
      console.error('Erro ao solicitar recuperação de senha:', err)
      setError(err.message || 'Ocorreu um erro ao solicitar a recuperação de senha')
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
        <p className={styles.subtitle}>Informe seu email para receber instruções de recuperação</p>

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

            {/* {error && (
            <div className={styles.error}>
              {error}
            </div>
          )} */}

            <button
              type="submit"
              className={styles.loginButton}
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Recuperar Senha'}
            </button>
          </form>

          <div className={styles.registerLink}>
            Lembrou sua senha?
            <Link href="/login">
              Voltar ao login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 