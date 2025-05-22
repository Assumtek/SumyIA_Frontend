"use client";

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { handleCreateUser } from '../actions/serverActions'
import styles from './page.module.scss'

export default function Register() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Obtém os dados do formulário
      const formData = new FormData(event.currentTarget)
      
      // Verificações básicas
      const nome = formData.get('nome') as string
      const email = formData.get('email') as string
      const senha = formData.get('senha') as string
      
      if (!nome || !email || !senha) {
        setError('Preencha todos os campos')
        setLoading(false)
        return
      }
      
      if (senha.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres')
        setLoading(false)
        return
      }
      
      console.log("Enviando dados para registro:", { nome, email });
      
      // Chama a server action - note que agora esperamos um objeto retornado
      const result = await handleCreateUser(formData);
      
      console.log("Resultado do registro:", result);
      
      // Verifica se o registro foi bem-sucedido
      if (result && result.success) {
        console.log("Registro bem-sucedido, redirecionando...");
        router.push('/?registered=true');
      } else {
        // Se não tiver a propriedade success, trata como erro
        console.error("Resposta inesperada:", result);
        setError('Não foi possível completar o registro. Tente novamente.');
      }
    } catch (err) {
      console.error('Erro detalhado ao registrar:', err);
      
      // Extrair a mensagem de erro mais útil
      let errorMessage = 'Ocorreu um erro ao criar sua conta';
      
      if (err instanceof Error) {
        // Verifica se a mensagem de erro é específica
        errorMessage = err.message;
        
        // Caso especial para email já em uso
        if (err.message.includes('já está em uso') || 
            err.message.includes('already in use') || 
            err.message.includes('already exists')) {
          errorMessage = 'Este email já está cadastrado. Tente fazer login ou recuperar sua senha.';
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.containerCenter}>
      <h1 className={styles.title}>Sumy IA</h1>
      <p className={styles.subtitle}>Crie sua conta para começar a conversar</p>
      
      <div className={styles.registerBox}>
        <form onSubmit={onSubmit}>
          
          <div className={styles.inputGroup}>
            <label htmlFor="nome" className={styles.label}>Nome</label>
            <input
              type="text"
              id="nome"
              name="nome"
              placeholder="Digite seu nome completo"
              className={styles.input}
              required
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Digite seu melhor email"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="senha" className={styles.label}>Senha</label>
            <input
              type="password"
              id="senha"
              name="senha"
              placeholder="Sua senha (mínimo 6 caracteres)"
              className={styles.input}
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
            disabled={loading}
          >
            {loading ? 'Carregando...' : 'Criar Conta'}
          </button>
        </form>

        <div className={styles.loginLink}>
          Já tem uma conta?
          <Link href="/">
            Faça login
          </Link>
        </div>
      </div>
    </div>
  )
} 