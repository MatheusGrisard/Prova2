document.addEventListener('DOMContentLoaded', function(){
  const form = document.getElementById('login-form');
  const toggle = document.getElementById('toggle-pass');
  const errorBox = document.getElementById('login-error');

  function getUsers(){ try { return JSON.parse(localStorage.getItem('techzone_users'))||[] } catch(e){return []} }
  function setCurrent(user){ localStorage.setItem('techzone_currentUser', JSON.stringify(user)); window.dispatchEvent(new Event('storage')); }

  toggle && toggle.addEventListener('click', function(){
    const pwd = document.getElementById('login-senha');
    if(!pwd) return;
    if(pwd.type === 'password'){ pwd.type = 'text'; toggle.textContent = 'Ocultar'; }
    else { pwd.type = 'password'; toggle.textContent = 'Mostrar'; }
  });

  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      errorBox.textContent = '';
      const email = document.getElementById('login-email').value.trim();
      const senha = document.getElementById('login-senha').value;
      const lembrar = document.getElementById('login-remember').checked;

      if(!email || !senha){ errorBox.textContent = 'Preencha e-mail e senha.'; return; }

      const users = getUsers();
      const user = users.find(u=>u.email.toLowerCase()===email.toLowerCase() && u.senha===senha);
      if(!user){ errorBox.textContent = 'E-mail ou senha inválidos.'; return; }

      // sucesso
      setCurrent({nome: user.nome, email: user.email});

      // lembrar-me: persist as well, else currentUser still stored
      if(lembrar){ localStorage.setItem('techzone_remember', '1'); }

      // redirect to previous page or index
      const redirect = sessionStorage.getItem('after_login') || 'index.html';
      sessionStorage.removeItem('after_login');
      window.location.href = redirect;
    });
  }
});
