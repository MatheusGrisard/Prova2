document.addEventListener('DOMContentLoaded', function(){
  const busca = document.getElementById('busca-produtos');
  const filtros = Array.from(document.querySelectorAll('.filtro-btn'));
  const cards = Array.from(document.querySelectorAll('.grid-produtos .card-produto'));

  function normalize(str){ return (str||'').toString().toLowerCase(); }

  function aplicarFiltro(cat, termo){
    cards.forEach(card=>{
      const nome = normalize(card.dataset.nome || card.querySelector('h3')?.textContent);
      const categoria = normalize(card.dataset.cat || card.querySelector('.categoria')?.textContent);
      const buscaMatch = termo ? (nome.includes(termo) || categoria.includes(termo)) : true;
      const catMatch = !cat || cat === 'all' ? true : (categoria === cat.toLowerCase() || (card.dataset.cat && card.dataset.cat.toLowerCase() === cat.toLowerCase()));
      card.style.display = (buscaMatch && catMatch) ? 'flex' : 'none';
    });
  }

  if(busca){
    busca.addEventListener('input', function(e){
      const termo = normalize(e.target.value);
      const active = filtros.find(f=>f.classList.contains('active'))?.dataset.cat || 'all';
      aplicarFiltro(active, termo);
    });
  }

  filtros.forEach(btn=>{
    btn.addEventListener('click', function(){
      filtros.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      const termo = normalize(busca?.value || '');
      aplicarFiltro(cat, termo);
    });
  });

  // Floating cart
  const floatingBtn = document.getElementById('floating-cart-btn');
  const floatingSummary = document.getElementById('floating-summary');
  const floatingItems = document.getElementById('floating-items');
  const floatingCount = document.getElementById('floating-count');

  function obterCarrinho(){ return JSON.parse(localStorage.getItem('carrinhoTechZone')) || []; }

  function renderFloating(){
    const carrinho = obterCarrinho();
    floatingItems.innerHTML = '';
    if(carrinho.length === 0){
      floatingItems.innerHTML = '<div style="color:var(--cor-texto-suave)">Seu carrinho está vazio.</div>';
    } else {
      carrinho.forEach(item=>{
        const div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = `<img src="${item.foto}" onerror="this.src='https://us.maxgaming.com/bilder/artiklar/21321.jpg?m=1648810460'" /><div style="flex:1"><div class="nome">${item.nome}</div><div class="qtd">Qtd: ${item.qtd} • R$ ${Number(item.preco).toFixed(2)}</div></div>`;
        floatingItems.appendChild(div);
      });
    }
    floatingCount.textContent = carrinho.reduce((s,i)=>s+ (i.qtd||0),0);
  }

  if(floatingBtn){
    floatingBtn.addEventListener('click', function(){
      if(floatingSummary.classList.contains('escondido')){
        renderFloating();
        floatingSummary.classList.remove('escondido');
      } else {
        floatingSummary.classList.add('escondido');
      }
    });
  }

  // update on storage changes
  window.addEventListener('storage', function(){ renderFloating(); });
  // initial
  renderFloating();
});
