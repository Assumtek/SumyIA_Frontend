"use client"

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import styles from './page.module.scss'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function LP() {
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLDivElement>(null);
  const menuLinksRef = useRef<HTMLDivElement>(null);
  const ctaButtonRef = useRef<HTMLAnchorElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerTitleRef = useRef<HTMLHeadingElement>(null);
  const headerTextRef = useRef<HTMLParagraphElement>(null);
  const headerButtonsRef = useRef<HTMLDivElement>(null);
  const headerImageRef = useRef<HTMLDivElement>(null);
  const servicosRef = useRef<HTMLDivElement>(null);
  const servicosTitleRef = useRef<HTMLHeadingElement>(null);
  const servicosTextRef = useRef<HTMLParagraphElement>(null);
  const servicosContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Configurar estado inicial dos elementos
      gsap.set([
        navbarRef.current,
        menuLinksRef.current?.querySelectorAll('a'),
        ctaButtonRef.current,
        headerTitleRef.current,
        headerTextRef.current,
        headerButtonsRef.current,
        headerImageRef.current,
        servicosTitleRef.current,
        servicosTextRef.current,
        servicosContainerRef.current?.querySelectorAll(`.${styles.servico}`)
      ], { opacity: 0 });

      // Animação inicial do menu
      gsap.fromTo(navbarRef.current,
        { y: -100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          onComplete: () => {
            if (containerRef.current) {
              containerRef.current.classList.add(styles.visible);
            }
          }
        }
      );

      // Animação dos links do menu
      if (menuLinksRef.current) {
        const links = menuLinksRef.current.querySelectorAll('a');
        gsap.fromTo(links,
          { y: -20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "back.out(1.7)",
            delay: 0.5
          }
        );
      }

      // Animação do botão "Começar agora"
      gsap.fromTo(ctaButtonRef.current,
        { y: -20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
          delay: 0.6
        }
      );

      // Header animations
      const headerTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top center",
        }
      });

      headerTimeline
        .fromTo(headerTitleRef.current,
          { y: 100, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 1 },
          "-=0.2"
        )
        .fromTo(headerTextRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
          "-=0.4"
        )
        .fromTo(headerButtonsRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: "power2.out" },
          "-=0.4"
        )
        .fromTo(headerImageRef.current,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.1, ease: "power2.out" },
          "-=0.6"
        );

      // Serviços animations
      const servicosTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: servicosRef.current,
          start: "top center",
          toggleActions: "play none none reverse"
        }
      });

      servicosTimeline
        .fromTo(servicosTitleRef.current,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
        )
        .fromTo(servicosTextRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
          "-=0.4"
        );

      // Animar cada card individualmente
      const container = servicosContainerRef.current;
      if (container) {
        const cards = Array.from(container.querySelectorAll(`.${styles.servico}`));
        cards.forEach((card) => {
          servicosTimeline.fromTo(card,
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power2.out"
            },
            "-=0.4"
          );
        });
      }
    });

    // Scroll handler para o menu
    const handleScroll = () => {
      if (window.scrollY > 50) {
        gsap.to(navbarRef.current, {
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          duration: 0.3
        });
      } else {
        gsap.to(navbarRef.current, {
          backgroundColor: "transparent",
          boxShadow: "none",
          duration: 0.3
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      ctx.revert();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={styles.container} ref={containerRef}>

      <div className={styles.page}>

        <div className={styles.navbar} ref={navbarRef}>
          <div className={styles.navbar_container}>

            <div className={styles.esquerda}>
              <h1>SUMY<span>IA.</span></h1>
              <div className={styles.divisornav}></div>
              <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menu">
                <span></span>
                <span></span>
                <span></span>
              </button>
              <div className={`${styles.menuLinks} ${menuOpen ? styles.open : ''}`}>
                <a href="#header" onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#header')?.scrollIntoView({ behavior: 'smooth' });
                  setMenuOpen(false);
                }}>Home</a>
                <a href="#servicos" onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#servicos')?.scrollIntoView({ behavior: 'smooth' });
                  setMenuOpen(false);
                }}>Serviços</a>
                <a href="#depoimentos" onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#depoimentos')?.scrollIntoView({ behavior: 'smooth' });
                  setMenuOpen(false);
                }}>Depoimentos</a>
                <a href="#precos" onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#precos')?.scrollIntoView({ behavior: 'smooth' });
                  setMenuOpen(false);
                }}>Preços</a>
              </div>
            </div>

            <div className={styles.direita}>
              <a href="/login" ref={ctaButtonRef}>Começar agora</a>
            </div>
          </div>

        </div>

        <div className={styles.header} id="header" ref={headerRef}>
          <h1 ref={headerTitleRef}>Revolucione suas Especificações Funcionais com IA</h1>
          <p ref={headerTextRef}>A SUMY transforma o modo como consultores SAP criam especificações funcionais, reduzindo horas de trabalho para minutos com inteligência artificial avançada.</p>
          <div ref={headerButtonsRef}>
            <button className={styles.botao1}>Começar agora</button>
            <button className={styles.botao2}>Ver demonstração</button>
          </div>
          <div className={styles.imagem} ref={headerImageRef}>
            <img src="/capaIA.png" alt="imagem1" />
          </div>
        </div>

        <div className={styles.servicos} id="servicos" ref={servicosRef}>
          <h1 ref={servicosTitleRef}>Tudo o que consultores SAP precisam para especificações <span>incríveis.</span></h1>
          <p ref={servicosTextRef}>Nossa plataforma de IA fornece todas as ferramentas necessárias para criar especificações funcionais SAP de forma eficiente e com qualidade superior.</p>
          <div className={styles.containerservicos} ref={servicosContainerRef}>
            <div className={styles.servico}>
              <img src="/IconService01.png" alt="imagem1" />
              <h2>Automatização Inteligente</h2>
              <p>Reduza drasticamente o tempo de criação de especificações funcionais SAP, transformando horas de trabalho em minutos com nossa IA especializada.</p>
            </div>
            <div className={styles.servico}>
              <img src="/IconService02.png" alt="imagem1" />
              <h2>Histórico salvo</h2>
              <p>Você vai ter um histórico das suas conversar para poder modificar ou salvar suas especificações onde e quando quiser</p>
            </div>
            <div className={styles.servico}>
              <img src="/IconService03.png" alt="imagem1" />
              <h2>Conversas seguras</h2>
              <p>So você vai ter acesso as suas conversas, todas as mensagens são criptografadas em nosso banco de dados.</p>
            </div>
          </div>
        </div>

        <div className={styles.depoimentos} id="depoimentos">
          <div className={styles.depoimentoesquerda}>
            <h1>Consultores SAP <span>confiam</span> na SUMYIA.</h1>
            <p>Veja o que nossos usuários estão dizendo sobre como a SUMY transformou seu trabalho.</p>
          </div>
          <div className={styles.depoimentodireita}>
            <div className={styles.depoimento} >
              <div className={styles.depoimentocabecalho}>
                <img src="/fotoavaliacao1.png" alt="imagem1" />
                <div>
                  <h2>Carlos Mendes</h2>
                  <p>Consultor SAP Sênior, TechSAP</p>
                </div>
              </div>
              <div className={styles.depoimentocorpo}>
                <p>"A SUMY revolucionou meu trabalho como consultor SAP. O que antes levava um dia inteiro para criar, agora consigo finalizar em menos de uma hora. A qualidade das especificações funcionais é impressionante."</p>
              </div>
            </div>
            <div className={styles.depoimento} >
              <div className={styles.depoimentocabecalho}>
                <img src="/fotoavaliacao1.png" alt="imagem1" />
                <div>
                  <h2>Ana Santos</h2>
                  <p>Consultora SAP, Consultoria Global</p>
                </div>
              </div>
              <div className={styles.depoimentocorpo}>
                <p>"A SUMY revolucionou meu trabalho como consultor SAP. O que antes levava um dia inteiro para criar, agora co"Como gerente de projetos SAP, a SUMY transformou a produtividade da minha equipe. Conseguimos entregar projetos 40% mais rápido e com maior consistência nas especificações funcionais."
                  nsigo finalizar em menos de uma hora. A qualidade das especificações funcionais é impressionante."</p>
              </div>
            </div>
            <div className={styles.depoimento} >
              <div className={styles.depoimentocabecalho}>
                <img src="/fotoavaliacao1.png" alt="imagem1" />
                <div>
                  <h2>Carlos Mendes</h2>
                  <p>Consultor SAP Sênior, TechSAP</p>
                </div>
              </div>
              <div className={styles.depoimentocorpo}>
                <p>"A SUMY revolucionou meu trabalho como consultor SAP. O que antes levava um dia inteiro para criar, agora consigo finalizar em menos de uma hora. A qualidade das especificações funcionais é impressionante."</p>
              </div>
            </div>
            <div className={styles.depoimento} >
              <div className={styles.depoimentocabecalho}>
                <img src="/fotoavaliacao1.png" alt="imagem1" />
                <div>
                  <h2>Ana Santos</h2>
                  <p>Consultora SAP, Consultoria Global</p>
                </div>
              </div>
              <div className={styles.depoimentocorpo}>
                <p>"A SUMY revolucionou meu trabalho como consultor SAP. O que antes levava um dia inteiro para criar, agora co"Como gerente de projetos SAP, a SUMY transformou a produtividade da minha equipe. Conseguimos entregar projetos 40% mais rápido e com maior consistência nas especificações funcionais."
                  nsigo finalizar em menos de uma hora. A qualidade das especificações funcionais é impressionante."</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.cta} id="precos">
          <h1>Pronto para <span>revolucionar</span> suas especificações SAP?</h1>
          <p>Junte-se a centenas de consultores SAP satisfeitos e comece a transformar seu trabalho hoje mesmo.</p>
          <div>
            <button className={styles.botao1}>Começar agora</button>
          </div>
        </div>
      </div>
      <footer className={styles.footer}>
        <div className={styles.footer_container}>
          <div className={styles.footer_esquerda}>
            <h1>SUMY<span>IA.</span></h1>
            <div className={styles.divisorfooter}></div>
            <div>
              <a href="#header">Home</a>
              <a href="#servicos">Serviços</a>
              <a href="#depoimentos">Depoimentos</a>
              <a href="#precos">Preços</a>
            </div>
          </div>

          <div className={styles.footer_direita}>
            <a href="/login">Instagram</a>
            <a href="/login">Linkedin</a>
          </div>
        </div>
      </footer>
    </div>
  )
}