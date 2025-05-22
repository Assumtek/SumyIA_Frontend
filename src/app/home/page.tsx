"use client";

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './home.module.scss'
import { handleIniciarConversa, handleListarConversas } from '../actions/serverActions'

export default function Home() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function iniciarNovoChat() {
    setLoading(true)
    try {
      const resultado = await handleIniciarConversa('Nova Conversa');


      const conversas = await handleListarConversas()

      if (conversas && Array.isArray(conversas) && conversas.length > 0) {
        const conversasOrdenadas = [...conversas].sort((a, b) => {
          const dataA = new Date(a.updatedAt).getTime()
          const dataB = new Date(b.updatedAt).getTime()
          return dataB - dataA
        })

        router.push(`/home/${conversasOrdenadas[0].id}`)
      } 
      
    } catch (error) {
      console.error('Erro ao iniciar conversa:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Bem-vindo à Sumy IA</h1>

        <div className={styles.description}>
          <h2>O que a Sumy pode fazer por você?</h2>
          <ul>
            <li>Agiliza as suas atividades repetitivas</li>
            <li>Ela te ajuda a gerar requisitos funcionais para seu projeto</li>
          </ul>
        </div>

        <div className={styles.features}>
          <div className={styles.feature}>
            <h3>Conversas Inteligentes</h3>
            <p>A Sumy mantém o contexto da conversa, permitindo discussões mais naturais e produtivas.</p>
          </div>

          <div className={styles.feature}>
            <h3>Respostas Precisas</h3>
            <p>Utilizando tecnologia avançada de IA para fornecer respostas confiáveis e atualizadas.</p>
          </div>

          <div className={styles.feature}>
            <h3>Interface Amigável</h3>
            <p>Design intuitivo e fácil de usar, tornando a interação com a IA mais agradável.</p>
          </div>
        </div>

        <button
          className={styles.startButton}
          onClick={iniciarNovoChat}
          disabled={loading}
        >
          {loading ? 'Iniciando...' : 'Começar Nova Conversa'}
        </button>
      </div>
    </div>
  )
} 