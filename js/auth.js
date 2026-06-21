document.addEventListener('DOMContentLoaded', function(){
  const nav = document.querySelector('.container-header nav');
  if(!nav) return;

  // create profile button wrapper
  const profileWrap = document.createElement('div');
  profileWrap.className = 'nav-profile';

  const btn = document.createElement('button');
  btn.className = 'profile-btn';
  btn.setAttribute('aria-label','Perfil do usuário');
  btn.title = 'Entrar / Perfil';

  const avatar = document.createElement('span');
  avatar.className = 'profile-avatar';
  // simple white user icon (head + shoulders)
  avatar.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="12" cy="7.5" r="3.2" fill="#ffffff"/><path d="M3 20c0-3.3 4.8-5.5 9-5.5s9 2.2 9 5.5v0.5H3v-0.5z" fill="#ffffff"/></svg>';
  // add a visible label to increase discoverability
  const label = document.createElement('span');
  label.className = 'profile-label';
  label.textContent = 'Entrar';

  btn.appendChild(avatar);
  btn.appendChild(label);
  profileWrap.appendChild(btn);

  // dropdown
  const dd = document.createElement('div');
  dd.className = 'profile-dropdown';
  dd.innerHTML = '<div class="item nome-usuario"></div><hr style="border:0;border-top:1px solid rgba(255,255,255,0.04);margin:8px 0;"/><div class="item perfil">Meu Perfil</div><div class="item pedidos">Meus Pedidos</div><div class="item favoritos">Favoritos</div><div class="item configuracoes">Configurações</div><div class="item sair">Sair</div>';

  // insert into header (after nav)
  const headerContainer = document.querySelector('.container-header');
  headerContainer.appendChild(profileWrap);
  headerContainer.appendChild(dd);

  function getCurrentUser(){
    try{ return JSON.parse(localStorage.getItem('techzone_currentUser')) || null; }catch(e){return null;}
  }

  function updateProfileUI(){
    const user = getCurrentUser();
    if(user){
      // set accessible label with initials and show first name
      const initials = (user.nome || user.email || 'U').split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase();
      avatar.setAttribute('aria-label', initials);
      const firstName = (user.nome || user.email).split(' ')[0];
      label.textContent = firstName;
      dd.querySelector('.nome-usuario').textContent = user.nome || user.email;
    } else {
      avatar.setAttribute('aria-label','Usuário');
      label.textContent = 'Entrar';
      dd.querySelector('.nome-usuario').textContent = '';
      closeDropdown();
    }
  }

  function openDropdown(){ dd.classList.add('open'); }
  function closeDropdown(){ dd.classList.remove('open'); }

  btn.addEventListener('click', function(e){
    const user = getCurrentUser();
    if(!user){
      // go to login
      window.location.href = 'login.html';
      return;
    }
    // toggle dropdown
    dd.classList.toggle('open');
  });

  // dropdown actions
  dd.addEventListener('click', function(e){
    const target = e.target.closest('.item');
    if(!target) return;
    if(target.classList.contains('sair')){
      localStorage.removeItem('techzone_currentUser');
      updateProfileUI();
      // optional: redirect
      window.location.href = 'index.html';
      return;
    }
    if(target.classList.contains('perfil')){ window.location.href = 'perfil.html'; }
    if(target.classList.contains('pedidos')){ window.location.href = 'pedidos.html'; }
    if(target.classList.contains('favoritos')){ window.location.href = 'favoritos.html'; }
    if(target.classList.contains('configuracoes')){ window.location.href = 'configuracoes.html'; }
  });

  // close on outside click
  document.addEventListener('click', function(e){
    if(!dd.contains(e.target) && !profileWrap.contains(e.target)){
      closeDropdown();
    }
  });

  // respond to storage events (login/logout)
  window.addEventListener('storage', function(){ updateProfileUI(); });

  // initial
  updateProfileUI();
});
