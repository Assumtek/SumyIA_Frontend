"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.scss'
import { handleCriarFeedback } from '../actions/serverActions';

const perguntas = [
  {
    tipo: "escala",
    texto: "De 1 a 10, quanto você acha que a SUMY IA pode ajudar os consultores a gerar especificações funcionais?",
  },
  {
    tipo: "escala",
    texto: "De 1 a 10, quão fácil foi usar a SUMY do início ao fim?",
  },
  {
    tipo: "escala",
    texto: "De 1 a 10, qual é sua satisfação com o design e a usabilidade das páginas da SUMY?",
  },
  {
    tipo: "escala",
    texto: "De 1 a 10, quão confiável você sentiu que foram as decisões/sugestões da IA durante o processo?",
  },
  {
    tipo: "escala",
    texto: "De 1 a 10, qual a chance de você recomendar no futuro a SUMY para outro consultor?",
  },
  {
    tipo: "numero",
    texto: "Qual você imagina ser um valor justo para se cobrar pela SUMY?",
  },
  {
    tipo: "texto",
    texto: "Você sentiu falta de algum recurso ou funcionalidade? Qual?",
  },
];

export default function Feedback() {
  const router = useRouter();
  const [perguntaAtual, setPerguntaAtual] = useState(-1);
  const [respostas, setRespostas] = useState<{ [key: number]: number | string }>({});
  const [finalizado, setFinalizado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);

  const handleRespostaEscala = (valor: number) => {
    setRespostas(prev => ({
      ...prev,
      [perguntaAtual]: valor
    }));
    avancarPergunta();
  };

  const handleRespostaTexto = (valor: string | number) => {
    setRespostas(prev => ({
      ...prev,
      [perguntaAtual]: valor
    }));
  };

  const avancarPergunta = () => {
    if (perguntaAtual < perguntas.length - 1) {
      setPerguntaAtual(prev => prev + 1);
    } else {
      setFinalizado(true);
    }
  };

  const iniciarFeedback = () => {
    setPerguntaAtual(0);
  };

  useEffect(() => {
    const enviarFeedback = async () => {
      if (finalizado && !enviando) {
        setEnviando(true);
        setErroEnvio(null);
        
        try {
          const feedbackData = {
            utilidade: Number(respostas[0]),
            facilidade: Number(respostas[1]),
            design: Number(respostas[2]),
            confiabilidade: Number(respostas[3]),
            recomendacao: Number(respostas[4]),
            valorJusto: Number(respostas[5]),
            recursoFaltando: String(respostas[6] || '')
          };

          const formData = new FormData();
          formData.append('data', JSON.stringify(feedbackData));
          
          await handleCriarFeedback(formData);
          setFinalizado(true);
        } catch (err) {
          console.error('Erro ao enviar feedback:', err);
          setErroEnvio('Ocorreu um erro ao enviar seu feedback. Tente novamente.');
          setFinalizado(false);
        } finally {
          setEnviando(false);
        }
      }
    };

    if (finalizado) {
      enviarFeedback();
    }
  }, [finalizado]);

  // Tela inicial
  if (perguntaAtual === -1) {
    return (
      <div className={styles.container}>
        <div className={styles.feedbackContainer}>
          <div className={styles.inicialContainer}>
            <h2 className={styles.inicialTitulo}>Feedback SUMY IA</h2>
            <div className={styles.inicialTexto}>
              <p>
                Olá! Estamos muito felizes em ter você como um dos primeiros usuários da SUMY IA.
              </p>
              <p>
                Sua opinião é fundamental para o desenvolvimento do nosso produto. Todas as respostas são anônimas e a sinceridade é essencial para que possamos trazer uma qualidade ainda melhor para o lançamento oficial.
              </p>
              <p>
                O questionário é rápido e leva menos de 2 minutos para ser respondido. Agradecemos desde já sua colaboração!
              </p>
            </div>
            <button 
              className={styles.inicialBtn}
              onClick={iniciarFeedback}
            >
              Começar Feedback
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tela de envio
  if (enviando) {
    return (
      <div className={styles.container}>
        <div className={styles.feedbackContainer}>
          <div className={styles.finalizadoContainer}>
            <h2 className={styles.finalizadoTitulo}>Enviando seu feedback...</h2>
            <p className={styles.finalizadoTexto}>
              Por favor, aguarde um momento enquanto processamos suas respostas.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Tela final
  if (finalizado && !enviando && !erroEnvio) {
    return (
      <div className={styles.container}>
        <div className={styles.feedbackContainer}>
          <div className={styles.finalizadoContainer}>
            <h2 className={styles.finalizadoTitulo}>Obrigado pelo seu feedback!</h2>
            <p className={styles.finalizadoTexto}>
              Sua opinião é muito importante para continuarmos melhorando a SUMY IA.
            </p>
            <button 
              className={styles.finalizadoBtn}
              onClick={() => router.push('/conversa')}
            >
              Voltar para Conversas
            </button>
          </div>
        </div>
      </div>
    );
  }

  const pergunta = perguntas[perguntaAtual];

  return (
    <div className={styles.container}>
      <div className={styles.feedbackContainer}>
        {erroEnvio && (
          <div style={{ color: 'red', textAlign: 'center', marginBottom: 24 }}>
            {erroEnvio}
          </div>
        )}
        <div className={styles.progressBar}>
          <div 
            className={styles.progress} 
            style={{ width: `${((perguntaAtual + 1) / perguntas.length) * 100}%` }}
          />
        </div>

        <div className={styles.perguntaContainer}>
          <h2 className={styles.pergunta}>{pergunta.texto}</h2>

          {pergunta.tipo === "escala" ? (
            <div className={styles.escalaContainer}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((valor) => (
                <button
                  key={valor}
                  className={`${styles.escalaBtn} ${respostas[perguntaAtual] === valor ? styles.selecionado : ''}`}
                  onClick={() => handleRespostaEscala(valor)}
                >
                  {valor}
                </button>
              ))}
            </div>
          ) : pergunta.tipo === "numero" ? (
            <div className={styles.textoContainer}>
              <input
                type="number"
                className={styles.numberInput}
                placeholder="Digite um valor..."
                value={respostas[perguntaAtual] as number || ''}
                onChange={(e) => handleRespostaTexto(Number(e.target.value))}
                min="0"
              />
              <button 
                className={styles.avancarBtn}
                onClick={avancarPergunta}
                disabled={!respostas[perguntaAtual]}
              >
                Avançar
              </button>
            </div>
          ) : (
            <div className={styles.textoContainer}>
              <textarea
                className={styles.textoInput}
                placeholder="Digite sua resposta..."
                value={respostas[perguntaAtual] as string || ''}
                onChange={(e) => handleRespostaTexto(e.target.value)}
              />
              <button 
                className={styles.avancarBtn}
                onClick={avancarPergunta}
                disabled={!respostas[perguntaAtual]}
              >
                Avançar
              </button>
            </div>
          )}
        </div>

        <div className={styles.progressText}>
          Pergunta {perguntaAtual + 1} de {perguntas.length}
        </div>
      </div>
    </div>
  )
}