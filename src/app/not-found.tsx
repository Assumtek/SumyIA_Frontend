"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './not-found.module.scss';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className={styles.containerCenter}>
      <h1 className={styles.title}>Sumy IA</h1>
      <h1 className={styles.title404}>404</h1>
      <p className={styles.subtitle}>Página não encontrada</p>
      
      <div className={styles.login} style={{ textAlign: 'center' }}>
        <p className={styles.notFoundText}>
          A página que você está procurando não existe ou foi removida.
        </p>
        
        <button 
          className={styles.loginButton}
          onClick={() => router.push('/')}
          style={{ marginTop: '1.5rem' }}
        >
          Voltar ao Login
        </button>
        
        <div className={styles.registerLink} style={{ marginTop: '1rem' }}>
          <Link href="/">
            Página Inicial
          </Link>
        </div>
      </div>
    </div>
  );
} 