"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './not-found.module.scss';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log do erro para análise
    console.error('Erro na aplicação:', error);
  }, [error]);

  const router = useRouter();

  return (
    <div className={styles.containerCenter}>
      <h1 className={styles.title} style={{ color: '#ff7700 !important' }}>Oops!</h1>
      <p className={styles.subtitle}>Algo deu errado</p>
      
      <div className={styles.login} style={{ textAlign: 'center' }}>
        <p className={styles.notFoundText}>
          Desculpe, ocorreu um erro ao processar sua solicitação.
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
          <button 
            className={styles.loginButton}
            onClick={() => reset()}
            style={{ background: '#666' }}
          >
            Tentar novamente
          </button>
          
          <button 
            className={styles.loginButton}
            onClick={() => router.push('/')}
          >
            Voltar ao Login
          </button>
        </div>
        
        <div className={styles.registerLink} style={{ marginTop: '1rem' }}>
          <Link href="/">
            Página Inicial
          </Link>
        </div>
      </div>
    </div>
  );
} 