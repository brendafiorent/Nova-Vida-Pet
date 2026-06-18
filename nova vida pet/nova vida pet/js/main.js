

document.addEventListener('DOMContentLoaded', function () {

  

  const track = document.querySelector('.carousel-track');

  if (track) {
    const originalSlides = Array.from(document.querySelectorAll('.carousel-slide'));
    const dots = document.querySelectorAll('.dot');
    const total = originalSlides.length;

    
    const firstClone = originalSlides[0].cloneNode(true);
    const lastClone  = originalSlides[total - 1].cloneNode(true);
    track.appendChild(firstClone);
    track.insertBefore(lastClone, originalSlides[0]);
    

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

    
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { goTo(diff > 0 ? current + 1 : current - 1); resetAuto(); }
    }, { passive: true });

    startAuto();
  }

  

  function getFavoritos() {
    try { return JSON.parse(localStorage.getItem('nvp_favoritos') || '[]'); }
    catch (e) { return []; }
  }

  function setFavoritos(lista) {
    localStorage.setItem('nvp_favoritos', JSON.stringify(lista));
  }

  

  const animaisGrid = document.querySelector('.animais-grid');
  const btnLimpar   = document.querySelector('.btn-limpar');

  if (animaisGrid && btnLimpar) {
    const isApadrinhar = document.body.classList.contains('page-apadrinhar');
    const tipoAtual    = isApadrinhar ? 'apadrinhar' : 'adocao';

    
    document.querySelectorAll('.tag').forEach(tag => {
      tag.addEventListener('click', () => tag.classList.toggle('ativo'));
    });

    
    btnLimpar.addEventListener('click', () => {
      document.querySelectorAll('.tag').forEach(t => t.classList.remove('ativo'));
      document.querySelectorAll('.checkboxes input').forEach(cb => cb.checked = false);
    });

    
    const favSalvos = getFavoritos();
    document.querySelectorAll('.animal-card').forEach(card => {
      const chave = tipoAtual + '_' + card.dataset.id;
      if (favSalvos.find(f => f.chave === chave)) {
        const btn = card.querySelector('.btn-favoritar');
        btn.classList.add('favoritado');
        btn.textContent = '♥';
      }
    });

    
    document.querySelectorAll('.btn-favoritar').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        btn.classList.toggle('favoritado');
        const isFav = btn.classList.contains('favoritado');
        btn.textContent = isFav ? '♥' : '♡';

        const card  = btn.closest('.animal-card');
        const id    = card.dataset.id;
        const chave = tipoAtual + '_' + id;
        let lista   = getFavoritos();

        if (isFav) {
          if (!lista.find(f => f.chave === chave)) {
            lista.push({
              chave,
              id,
              nome:   card.querySelector('.animal-nome').textContent.trim(),
              foto:   card.querySelector('.card-img img').getAttribute('src'),
              genero: card.querySelector('.animal-genero').textContent.trim(),
              tipo:   tipoAtual
            });
          }
        } else {
          lista = lista.filter(f => f.chave !== chave);
        }
        setFavoritos(lista);
      });
    });

    
    const targetPage = isApadrinhar ? 'apadrinharanimal.html' : 'adocaoanimal.html';

    document.querySelectorAll('.animal-card').forEach(card => {
      card.querySelector('.btn-adotar').addEventListener('click', () => {
        window.location.href = targetPage + '?id=' + card.dataset.id;
      });
    });
  }

  

  const favoritosGrid = document.getElementById('favoritos-grid');

  if (favoritosGrid) {
    const vazioEl     = document.getElementById('favoritos-vazio');
    const searchInput = document.querySelector('.search-bar input');

    function renderFavoritos() {
      const lista = getFavoritos();
      favoritosGrid.innerHTML = '';

      if (lista.length === 0) {
        vazioEl.style.display   = 'flex';
        favoritosGrid.style.display = 'none';
        return;
      }

      vazioEl.style.display       = 'none';
      favoritosGrid.style.display = 'grid';

      lista.forEach(animal => {
        const card    = document.createElement('div');
        card.className    = 'animal-card';
        card.dataset.id   = animal.id;
        card.dataset.chave = animal.chave;
        const btnLabel = animal.tipo === 'apadrinhar' ? 'Apadrinhar!' : 'Quero adotar!';

        card.innerHTML = `
          <div class="card-img">
            <img src="${animal.foto}" alt="${animal.nome}">
            <button class="btn-favoritar favoritado" aria-label="Desfavoritar">&#9829;</button>
          </div>
          <div class="animal-rodape">
            <span class="animal-nome">${animal.nome}</span>
            <span class="animal-genero">
              <img src="imagens/Heart with dog paw.png" alt=""> ${animal.genero}
            </span>
          </div>
          <button class="btn-adotar">${btnLabel}</button>
        `;

        card.querySelector('.btn-favoritar').addEventListener('click', function () {
          let l = getFavoritos();
          l = l.filter(f => f.chave !== animal.chave);
          setFavoritos(l);

          card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          card.style.opacity    = '0';
          card.style.transform  = 'scale(0.9)';
          setTimeout(() => {
            card.remove();
            if (favoritosGrid.querySelectorAll('.animal-card').length === 0) {
              vazioEl.style.display       = 'flex';
              favoritosGrid.style.display = 'none';
            }
          }, 300);
        });

        card.querySelector('.btn-adotar').addEventListener('click', () => {
          const pagina = animal.tipo === 'apadrinhar' ? 'apadrinharanimal.html' : 'adocaoanimal.html';
          window.location.href = pagina + '?id=' + animal.id;
        });

        favoritosGrid.appendChild(card);
      });
    }

    renderFavoritos();

    
    document.querySelectorAll('.tag').forEach(tag => {
      tag.addEventListener('click', () => tag.classList.toggle('ativo'));
    });
    const btnLimparFav = document.querySelector('.btn-limpar');
    if (btnLimparFav) {
      btnLimparFav.addEventListener('click', () => {
        document.querySelectorAll('.tag').forEach(t => t.classList.remove('ativo'));
        document.querySelectorAll('.checkboxes input').forEach(cb => cb.checked = false);
      });
    }

    
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        const q = this.value.toLowerCase().trim();
        favoritosGrid.querySelectorAll('.animal-card').forEach(card => {
          const nome = card.querySelector('.animal-nome').textContent.toLowerCase();
          card.style.display = nome.includes(q) ? '' : 'none';
        });
      });
    }
  }

  

  const fotoPrincipal = document.getElementById('foto-principal');

  if (fotoPrincipal) {
    const isApadrinharAnimal = document.body.classList.contains('page-apadrinharanimal');
    const tipoDetalhe        = isApadrinharAnimal ? 'apadrinhar' : 'adocao';
    const detalheTargetPage  = isApadrinharAnimal ? 'apadrinharanimal.html' : 'adocaoanimal.html';
    const detalheBtnLabel    = isApadrinharAnimal ? 'Apadrinhar!' : 'Quero adotar!';
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
        <button class="btn-adotar">${detalheBtnLabel}</button>
      `;
      const chaveVeja  = tipoDetalhe + '_' + key;
      const btnFavVeja = card.querySelector('.btn-favoritar');
      if (getFavoritos().find(f => f.chave === chaveVeja)) {
        btnFavVeja.classList.add('favoritado');
        btnFavVeja.innerHTML = '&#9829;';
      }
      btnFavVeja.addEventListener('click', function () {
        this.classList.toggle('favoritado');
        const isFav = this.classList.contains('favoritado');
        this.textContent = isFav ? '♥' : '♡';
        let lista = getFavoritos();
        if (isFav) {
          if (!lista.find(f => f.chave === chaveVeja)) {
            lista.push({ chave: chaveVeja, id: key, nome: a.nome, foto: a.foto, genero: a.genero, tipo: tipoDetalhe });
          }
        } else {
          lista = lista.filter(f => f.chave !== chaveVeja);
        }
        setFavoritos(lista);
      });
      card.querySelector('.btn-adotar').addEventListener('click', () => {
        window.location.href = detalheTargetPage + '?id=' + key;
      });
      vejaGrid.appendChild(card);
    });

    
    const chaveDetalhe = tipoDetalhe + '_' + id;
    const btnFavMain   = document.getElementById('btn-favoritar');

    if (getFavoritos().find(f => f.chave === chaveDetalhe)) {
      btnFavMain.classList.add('favoritado');
      btnFavMain.textContent = '♥';
    }

    btnFavMain.addEventListener('click', function () {
      this.classList.toggle('favoritado');
      const isFav = this.classList.contains('favoritado');
      this.textContent = isFav ? '♥' : '♡';
      let lista = getFavoritos();
      if (isFav) {
        if (!lista.find(f => f.chave === chaveDetalhe)) {
          lista.push({ chave: chaveDetalhe, id, nome: animal.nome, foto: animal.foto, genero: animal.genero, tipo: tipoDetalhe });
        }
      } else {
        lista = lista.filter(f => f.chave !== chaveDetalhe);
      }
      setFavoritos(lista);
    });

    
    const btnAcaoDetalhe = document.querySelector('.btn-adotar-detalhe');
    if (btnAcaoDetalhe) {
      btnAcaoDetalhe.addEventListener('click', () => {
        if (document.body.classList.contains('page-adocaoanimal')) {
          const params  = new URLSearchParams(window.location.search);
          const id      = params.get('id') || '';
          const nome    = document.getElementById('animal-nome')?.textContent?.trim() || '';
          window.location.href = 'adocao-intro.html?id=' + encodeURIComponent(id) + '&nome=' + encodeURIComponent(nome);
        } else {
          window.location.href = 'pagamento.html';
        }
      });
    }
  }

  

  const valoresGrid = document.querySelector('.valores-grid');

  if (valoresGrid) {
    document.querySelectorAll('.valor-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.valor-card').forEach(c => c.classList.remove('ativo'));
        card.classList.add('ativo');
        window.location.href = 'pagamento.html?valor=' + card.dataset.valor;
      });
    });

    const btnDoareOutros = document.querySelector('.btn-doar-outros');
    if (btnDoareOutros) {
      btnDoareOutros.addEventListener('click', () => {
        window.location.href = 'pagamento.html';
      });
    }
  }

  

  const valorInput = document.getElementById('valor-doacao');

  if (valorInput) {
    const params = new URLSearchParams(window.location.search);
    const valor  = params.get('valor');

    if (valor) {
      const num = parseFloat(valor);
      valorInput.value = 'R$ ' + num.toFixed(2).replace('.', ',');
    }

    valorInput.addEventListener('input', function () {
      let raw = this.value.replace(/\D/g, '');
      if (raw === '') { this.value = ''; return; }
      const num = (parseInt(raw, 10) / 100).toFixed(2);
      this.value = 'R$ ' + num.replace('.', ',');
    });
  }

});
