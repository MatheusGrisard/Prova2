document.addEventListener('DOMContentLoaded', function(){
  const form = document.getElementById('register-form');
  const toggle = document.getElementById('toggle-reg-pass');
  const errorBox = document.getElementById('reg-error');

  function getUsers(){ try { return JSON.parse(localStorage.getItem('techzone_users'))||[] } catch(e){return []} }
  function saveUsers(u){ localStorage.setItem('techzone_users', JSON.stringify(u)); }
  function setCurrent(user){ localStorage.setItem('techzone_currentUser', JSON.stringify(user)); window.dispatchEvent(new Event('storage')); }

  toggle && toggle.addEventListener('click', function(){
    const pwd = document.getElementById('reg-senha');
    if(!pwd) return;
    if(pwd.type === 'password'){ pwd.type = 'text'; toggle.textContent = 'Ocultar'; }
    else { pwd.type = 'password'; toggle.textContent = 'Mostrar'; }
  });

  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      errorBox.textContent = '';
      const nome = document.getElementById('reg-nome').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const senha = document.getElementById('reg-senha').value;
      const senhaConf = document.getElementById('reg-senha-conf').value;
      const termos = document.getElementById('reg-termos').checked;

      if(!nome || !email || !senha || !senhaConf){ errorBox.textContent = 'Preencha todos os campos.'; return; }
      if(senha !== senhaConf){ errorBox.textContent = 'As senhas não conferem.'; return; }
      if(!termos){ errorBox.textContent = 'Você precisa aceitar os termos.'; return; }
      if(senha.length < 6){ errorBox.textContent = 'Senha deve ter ao menos 6 caracteres.'; return; }

      const users = getUsers();
      if(users.find(u=>u.email.toLowerCase()===email.toLowerCase())){ errorBox.textContent = 'Este e-mail já está cadastrado.'; return; }

      users.push({ nome: nome, email: email, senha: senha });
      saveUsers(users);
      setCurrent({ nome: nome, email: email });

      // redirect to index or profile
      window.location.href = 'index.html';
    });
  }
});
