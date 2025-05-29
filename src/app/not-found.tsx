"use client";

import Link from 'next/link';
import styles from './not-found.module.scss';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>404</h1>
        <h2 className={styles.subtitle}>Página não encontrada</h2>
        <p className={styles.description}>
          Ops! Parece que você se perdeu. A página que você está procurando não existe ou foi movida.
        </p>
        <Link href="/conversa" className={styles.backButton}>
          Voltar para o início
        </Link>
      </div>
    </div>
  );
} 