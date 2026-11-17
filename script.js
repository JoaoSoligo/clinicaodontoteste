/**
 * ODONTO PRIME — Interatividade, Animações 3D, Partículas e Integração WhatsApp
 */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktopPointer = window.matchMedia('(pointer: fine)').matches && window.innerWidth > 1024;

  // Número fictício configurado da clínica para redirecionamento WhatsApp
  const CLINIC_WHATSAPP = '5511998765432';

  /* ========================================================================
     1. HEADER DINÂMICO, SCROLL PROGRESS & MENU MOBILE
     ======================================================================== */
  const header = document.getElementById('header');
  const scrollProgress = document.getElementById('scrollProgress');
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function handleScroll() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Header compacto ao rolar
    if (scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Barra de progresso superior
    if (docHeight > 0 && scrollProgress) {
      const progress = (scrollY / docHeight) * 100;
      scrollProgress.style.width = `${progress}%`;
    }

    // Destaque do link ativo na navegação
    sections.forEach(section => {
      const top = section.offsetTop - 130;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Menu Mobile
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileToggle.classList.toggle('open', isOpen);
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
      mobileDrawer.setAttribute('aria-hidden', String(!isOpen));
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileToggle.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileDrawer.setAttribute('aria-hidden', 'true');
      });
    });
  }

  /* ========================================================================
     2. CURSOR PERSONALIZADO (DESKTOP)
     ======================================================================== */
  if (isDesktopPointer && !prefersReducedMotion) {
    const dot = document.querySelector('.custom-cursor-dot');
    const ring = document.querySelector('.custom-cursor-ring');
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dot) {
        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
      }
    }, { passive: true });

    function animateCursor() {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      if (ring) {
        ring.style.left = `${ringX}px`;
        ring.style.top = `${ringY}px`;
      }
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Efeito de expansão ao passar sobre elementos interativos
    const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, .tilt-card');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  /* ========================================================================
     3. PARALLAX COM MOVIMENTO DO MOUSE (ELEMENTOS FLUTUANTES HERO)
     ======================================================================== */
  if (isDesktopPointer && !prefersReducedMotion) {
    const parallaxItems = document.querySelectorAll('[data-depth]');
    window.addEventListener('mousemove', (e) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      parallaxItems.forEach(item => {
        const depth = parseFloat(item.getAttribute('data-depth')) || 0.05;
        const moveX = deltaX * depth;
        const moveY = deltaY * depth;
        item.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      });
    }, { passive: true });
  }

  /* ========================================================================
     4. PARTÍCULAS E BRILHOS SUTIS NO FUNDO DO HERO (CANVAS)
     ======================================================================== */
  const canvas = document.getElementById('heroParticles');
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let width, height, particles;

    function initCanvas() {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      const count = window.innerWidth < 768 ? 18 : 38;
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2.4 + 0.8,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        alpha: Math.random() * 0.5 + 0.15
      }));
    }

    function drawParticles() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${p.alpha})`;
        ctx.fill();
      });
      requestAnimationFrame(drawParticles);
    }

    initCanvas();
    drawParticles();
    window.addEventListener('resize', initCanvas);
  }

  /* ========================================================================
     5. INTERSECTION OBSERVER (ANIMAÇÕES DE ENTRADA E CONTADORES)
     ======================================================================== */
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');
  const counters = document.querySelectorAll('.counter');
  let countersStarted = false;

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.14,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // Contagem animada dos números
  function animateCounters() {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const duration = 1800;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing easeOutQuart
        const ease = 1 - Math.pow(1 - progress, 4);
        const currentVal = Math.floor(ease * target);

        counter.textContent = currentVal.toLocaleString('pt-BR');

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          counter.textContent = target.toLocaleString('pt-BR');
        }
      }
      requestAnimationFrame(update);
    });
  }

  const metricsSection = document.querySelector('.metrics-bar');
  if (metricsSection) {
    const metricsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !countersStarted) {
        countersStarted = true;
        animateCounters();
      }
    }, { threshold: 0.3 });
    metricsObserver.observe(metricsSection);
  }

  /* ========================================================================
     6. EFEITO 3D TILT NOS CARDS DE ESPECIALIDADES
     ======================================================================== */
  if (isDesktopPointer && !prefersReducedMotion) {
    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
      const glare = card.querySelector('.tilt-glare');

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -7;
        const rotateY = ((x - centerX) / centerX) * 7;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

        if (glare) {
          const percentX = (x / rect.width) * 100;
          const percentY = (y / rect.height) * 100;
          glare.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(59, 130, 246, 0.16), transparent 65%)`;
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  }

  /* ========================================================================
     7. BOTÕES COM EFEITO MAGNÉTICO
     ======================================================================== */
  if (isDesktopPointer && !prefersReducedMotion) {
    const magneticBtns = document.querySelectorAll('.magnetic-btn');

    magneticBtns.forEach(btn => {
      const strength = parseFloat(btn.getAttribute('data-strength')) || 20;

      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${(x / rect.width) * strength}px, ${(y / rect.height) * strength}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
      });
    });
  }

  /* ========================================================================
     8. ACORDEÃO DE DÚVIDAS FREQUENTES (FAQ)
     ======================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      faqItems.forEach(other => {
        other.classList.remove('open');
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        other.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    });
  });

  /* ========================================================================
     9. SELEÇÃO RÁPIDA DE ESPECIALIDADE E FORMULÁRIO WHATSAPP COM VALIDAÇÃO
     ======================================================================== */
  const treatmentSelect = document.getElementById('treatmentSelect');
  const selectTreatmentBtns = document.querySelectorAll('.select-treatment-btn');
  const bookingSection = document.getElementById('agendamento');

  // Preenche o select automaticamente ao clicar em "Agendar avaliação" em um card
  selectTreatmentBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const treatment = btn.getAttribute('data-treatment');
      if (treatmentSelect && treatment) {
        treatmentSelect.value = treatment;
      }
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Máscara de telefone brasileiro
  const phoneInput = document.getElementById('patientPhone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let digits = e.target.value.replace(/\D/g, '').slice(0, 11);
      if (digits.length > 6) {
        digits = digits.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
      } else if (digits.length > 2) {
        digits = digits.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
      } else if (digits.length > 0) {
        digits = digits.replace(/^(\d{0,2})/, '($1');
      }
      e.target.value = digits;
    });
  }

  // Define data mínima de agendamento para hoje
  const dateInput = document.getElementById('preferredDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // Validação e Envio para WhatsApp
  const bookingForm = document.getElementById('bookingForm');
  const formFeedback = document.getElementById('formFeedback');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('patientName');
      const periodInput = document.getElementById('preferredPeriod');
      const notesInput = document.getElementById('patientNotes');

      const nameError = document.getElementById('nameError');
      const phoneError = document.getElementById('phoneError');
      const treatmentError = document.getElementById('treatmentError');

      let isValid = true;

      // Validação Nome
      if (nameInput.value.trim().length < 3) {
        nameError.textContent = 'Por favor, informe seu nome completo.';
        nameInput.classList.add('invalid');
        isValid = false;
      } else {
        nameError.textContent = '';
        nameInput.classList.remove('invalid');
      }

      // Validação Telefone
      const rawPhone = phoneInput.value.replace(/\D/g, '');
      if (rawPhone.length < 10) {
        phoneError.textContent = 'Informe um número de WhatsApp válido com DDD.';
        phoneInput.classList.add('invalid');
        isValid = false;
      } else {
        phoneError.textContent = '';
        phoneInput.classList.remove('invalid');
      }

      // Validação Especialidade
      if (!treatmentSelect.value) {
        treatmentError.textContent = 'Selecione a especialidade desejada.';
        treatmentSelect.classList.add('invalid');
        isValid = false;
      } else {
        treatmentError.textContent = '';
        treatmentSelect.classList.remove('invalid');
      }

      if (!isValid) return;

      // Formatação da data se preenchida
      let formattedDate = 'A combinar';
      if (dateInput.value) {
        const [year, month, day] = dateInput.value.split('-');
        formattedDate = `${day}/${month}/${year}`;
      }

      const notesText = notesInput.value.trim() ? `\n*Observações:* ${notesInput.value.trim()}` : '';

      const message = `Olá, equipe *ODONTO PRIME*! Gostaria de solicitar o agendamento de uma avaliação.\n\n` +
        `*Paciente:* ${nameInput.value.trim()}\n` +
        `*Telefone:* ${phoneInput.value.trim()}\n` +
        `*Especialidade:* ${treatmentSelect.value}\n` +
        `*Período preferido:* ${periodInput.value}\n` +
        `*Data sugerida:* ${formattedDate}` +
        `${notesText}`;

      const whatsappUrl = `https://wa.me/${CLINIC_WHATSAPP}?text=${encodeURIComponent(message)}`;

      formFeedback.textContent = 'Redirecionando para o WhatsApp da Odonto Prime...';
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  }
});

