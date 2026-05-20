/* ═══════════════════════════════════════════════════════
   NOVA VIDA PET — Scripts unificados
   Seções: Carrossel · Adoção/Apadrinhar · Detalhe Animal · Doação
═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

  /* ─────────────────────────────────────────────────────
     CARROSSEL (index.html)
  ───────────────────────────────────────────────────── */

  const track = document.querySelector('.carousel-track');

  if (track) {
    const originalSlides = Array.from(document.querySelectorAll('.carousel-slide'));
    const dots = document.querySelectorAll('.dot');
    const total = originalSlides.length;

    // Clona o primeiro e o último slide para criar o loop infinito
    const firstClone = originalSlides[0].cloneNode(true);
    const lastClone  = originalSlides[total - 1].cloneNode(true);
    track.appendChild(firstClone);
    track.insertBefore(lastClone, originalSlides[0]);
    // Track final: [clone-último | slide1 | slide2 | slide3 | clone-primeiro]

    let current = 1;
    let timer;
    let transitioning = false;

    function setPosition(animate) {
      track.style.transition = animate ? 'transform 0.6s ease' : 'none';
      track.style.transform  = `translateX(-${current * 100}%)`;
    }

    function updateDots() {
      const i = (current - 1 + total) % total;
      dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
    }

    function goTo(index) {
      if (transitioning) return;
      transitioning = true;
      current = index;
      setPosition(true);
      updateDots();
    }

    track.addEventListener('transitionend', () => {
      if (current === total + 1) { current = 1;     setPosition(false); }
      if (current === 0)         { current = total; setPosition(false); }
      transitioning = false;
    });

    setPosition(false);
    updateDots();

    function startAuto() { timer = setInterval(() => goTo(current + 1), 5000); }
    function resetAuto() { clearInterval(timer); startAuto(); }

    document.querySelector('.carousel-btn.prev').addEventListener('click', () => { goTo(current - 1); resetAuto(); });
    document.querySelector('.carousel-btn.next').addEventListener('click', () => { goTo(current + 1); resetAuto(); });
    dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i + 1); resetAuto(); }));

    // Swipe para mobile
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { goTo(diff > 0 ? current + 1 : current - 1); resetAuto(); }
    }, { passive: true });

    startAuto();
  }

  /* ─────────────────────────────────────────────────────
     FILTROS & ANIMAIS (adocao.html / apadrinhar.html)
  ───────────────────────────────────────────────────── */

  const animaisGrid = document.querySelector('.animais-grid');
  const btnLimpar   = document.querySelector('.btn-limpar');

  if (animaisGrid && btnLimpar) {
    // Toggle tags de filtro
    document.querySelectorAll('.tag').forEach(tag => {
      tag.addEventListener('click', () => tag.classList.toggle('ativo'));
    });

    // Limpar filtros
    btnLimpar.addEventListener('click', () => {
      document.querySelectorAll('.tag').forEach(t => t.classList.remove('ativo'));
      document.querySelectorAll('.checkboxes input').forEach(cb => cb.checked = false);
    });

    // Favoritar
    document.querySelectorAll('.btn-favoritar').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('favoritado');
        btn.textContent = btn.classList.contains('favoritado') ? '♥' : '♡';
      });
    });

    // Navegar para página de detalhe
    const isApadrinhar = document.body.classList.contains('page-apadrinhar');
    const targetPage   = isApadrinhar ? 'apadrinhoanimal.html' : 'adocaoanimal.html';

    document.querySelectorAll('.animal-card').forEach(card => {
      card.querySelector('.btn-adotar').addEventListener('click', () => {
        window.location.href = targetPage + '?id=' + card.dataset.id;
      });
    });
  }

  /* ─────────────────────────────────────────────────────
     DETALHE DO ANIMAL (adocaoanimal.html)
  ───────────────────────────────────────────────────── */

  const fotoPrincipal = document.getElementById('foto-principal');

  if (fotoPrincipal) {
    const animais = {
      zezinho: {
        nome: 'Zézinho',
        foto: 'imagens/cachorro.jpeg',
        genero: '♂',
        tags: ['3 meses', 'Macho', 'Castrado', 'Vacinado', 'Vermifugado'],
        descricao: 'Macho, dócil e brincalhão. Ama carinho e está pronto para encontrar uma família cheia de amor.'
      },
      belinha: {
        nome: 'Belinha',
        foto: 'imagens/coitada.avif',
        genero: '♀',
        tags: ['2 anos', 'Fêmea', 'Castrada', 'Vacinada', 'Vermifugada'],
        descricao: 'Fêmea dócil e carinhosa. Adora brincar e se dá bem com crianças. Está à procura de um lar cheio de amor.'
      },
      batman: {
        nome: 'Batman',
        foto: 'imagens/BLACK-CAT-SITIA-CRETE.jpg',
        genero: '♂',
        tags: ['1 ano', 'Macho', 'Castrado', 'Vacinado'],
        descricao: 'Gato curioso e independente. Adora explorar os cantos da casa e ganhar carinho na hora certa.'
      },
      salem: {
        nome: 'Salém',
        foto: 'imagens/gato gordo.jfif',
        genero: '♀',
        tags: ['3 anos', 'Fêmea', 'Castrada', 'Vacinada'],
        descricao: 'Calma e companheira. Salém adora uma sessão de carinho e é perfeita para quem busca uma companhia tranquila.'
      },
      pitico: {
        nome: 'Pítico',
        foto: 'imagens/pitico.avif',
        genero: '♂',
        tags: ['6 meses', 'Macho', 'Vacinado', 'Vermifugado'],
        descricao: 'Pequeno, mas cheio de energia! Pítico é um filhote animado que vai trazer muita alegria para o seu lar.'
      },
      carmina: {
        nome: 'Carmina',
        foto: 'imagens/talvez.avif',
        genero: '♀',
        tags: ['4 anos', 'Fêmea', 'Castrada', 'Vacinada'],
        descricao: 'Carmina é tranquila e gentil. Ela já passou por muito e merece um lar seguro e cheio de amor.'
      },
      thor: {
        nome: 'Thor',
        foto: 'imagens/thor.png',
        genero: '♂',
        tags: ['2 anos', 'Macho', 'Castrado', 'Vacinado', 'Vermifugado'],
        descricao: 'Forte e leal, Thor é um companheiro fiel. Adora passeios e brincadeiras ao ar livre.'
      },
      safira: {
        nome: 'Safira',
        foto: 'imagens/diva.webp',
        genero: '♀',
        tags: ['5 anos', 'Fêmea', 'Castrada', 'Vacinada'],
        descricao: 'Elegante e carinhosa, Safira sabe exatamente o que quer: um colo quentinho e muito amor.'
      }
    };

    const params = new URLSearchParams(window.location.search);
    const id     = params.get('id') || 'zezinho';
    const animal = animais[id] || animais.zezinho;

    // Preencher dados do animal principal
    document.title = animal.nome + ' - Nova Vida Pet';
    fotoPrincipal.src = animal.foto;
    fotoPrincipal.alt = animal.nome;
    document.getElementById('animal-nome').textContent      = animal.nome;
    document.getElementById('animal-descricao').textContent = animal.descricao;

    const tagsContainer = document.getElementById('animal-tags');
    animal.tags.forEach(tag => {
      const span = document.createElement('span');
      span.className   = 'tag-info';
      span.textContent = tag;
      tagsContainer.appendChild(span);
    });

    // Preencher "Veja também"
    const vejaGrid = document.getElementById('veja-grid');
    const outros   = Object.entries(animais).filter(([key]) => key !== id).slice(0, 3);

    outros.forEach(([key, a]) => {
      const card = document.createElement('div');
      card.className  = 'animal-card';
      card.dataset.id = key;
      card.innerHTML  = `
        <div class="card-img">
          <img src="${a.foto}" alt="${a.nome}">
          <button class="btn-favoritar" aria-label="Favoritar">&#9825;</button>
        </div>
        <div class="animal-rodape">
          <span class="animal-nome">${a.nome}</span>
          <span class="animal-genero">
            <img src="imagens/Heart with dog paw.png" alt=""> ${a.genero}
          </span>
        </div>
        <button class="btn-adotar">Quero adotar!</button>
      `;
      card.querySelector('.btn-favoritar').addEventListener('click', function () {
        this.classList.toggle('favoritado');
        this.textContent = this.classList.contains('favoritado') ? '♥' : '♡';
      });
      card.querySelector('.btn-adotar').addEventListener('click', () => {
        window.location.href = 'adocaoanimal.html?id=' + key;
      });
      vejaGrid.appendChild(card);
    });

    // Botão favoritar principal
    document.getElementById('btn-favoritar').addEventListener('click', function () {
      this.classList.toggle('favoritado');
      this.textContent = this.classList.contains('favoritado') ? '♥' : '♡';
    });
  }

  /* ─────────────────────────────────────────────────────
     DOAÇÃO (doacao.html)
  ───────────────────────────────────────────────────── */

  const valoresGrid = document.querySelector('.valores-grid');

  if (valoresGrid) {
    document.querySelectorAll('.valor-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.valor-card').forEach(c => c.classList.remove('ativo'));
        card.classList.add('ativo');
      });
    });
  }

});
