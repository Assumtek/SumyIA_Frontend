"use client";

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.scss'
import { handleIniciarConversa, handleListarConversas } from '../actions/serverActions'
import FullScreenLoader from '../components/FullScreenLoader'

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const router = useRouter()

  // Verifica todas as conversas e manda o user para a conversa mais recente
  useEffect(() => {
    setLoading2(true)
    async function verificarConversas() {
      try {
        const conversas = await handleListarConversas()
        if (conversas && Array.isArray(conversas) && conversas.length > 0) {
          // Ordena as conversas por data de atualização (mais recente primeiro)
          const conversasOrdenadas = [...conversas].sort((a, b) => {
            const dataA = new Date(a.updatedAt).getTime()
            const dataB = new Date(b.updatedAt).getTime()
            return dataB - dataA
          })
          // Não desativa o loading aqui, apenas redireciona
          router.push(`/conversa/${conversasOrdenadas[0].id}`)
          return // Retorna sem desativar o loading
        }
        // Se não houver conversas, aí sim desativa o loading
        setLoading2(false)
      } catch (error) {
        console.error('Erro ao verificar conversas:', error)
        setLoading2(false)
      }
    }

    verificarConversas()
  }, [router])

  async function iniciarNovoChat() {
    setLoading(true)
    try {
      const resultado = await handleIniciarConversa('Nova Conversa');
      if (resultado && resultado.conversaId) {
        router.push(`/conversa/${resultado.conversaId}`)
      }
    } catch (error) {
      console.error('Erro ao iniciar conversa:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <FullScreenLoader texto="Iniciando nova conversa..." />
  }

  if (loading2) {
    return <FullScreenLoader texto="Buscando conversas..." />
  }

  if (!loading2) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>SUMY<span>IA</span></h1>

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

  return null
} 