// Simple scroll reveal and lightweight testimonial rotation
document.addEventListener('DOMContentLoaded', function(){
  // Apply reveal effect to hero children on About and on the homepage hero
  const selectors = ['.sobre-hero-inner > *', '.hero-conteudo > *', '.produtos-hero-inner > *'];
  let heroChildren = [];
  selectors.forEach(sel=>{
    document.querySelectorAll(sel).forEach(el=> heroChildren.push(el));
  });

  heroChildren.forEach(el=>{
    el.style.opacity = 0;
    el.style.transform = 'translateY(14px)';
    el.style.transition = 'all 520ms cubic-bezier(.2,.8,.2,1)';
  });

  function revealHero(){
    const bottom = window.innerHeight * 0.9;
    heroChildren.forEach(el=>{
      const rect = el.getBoundingClientRect();
      if(rect.top < bottom){ el.style.opacity = 1; el.style.transform = 'translateY(0)'; }
    });
  }

  window.addEventListener('scroll', revealHero);
  revealHero();

  // testimonials rotation (keep as-is)
  const depoimentos = Array.from(document.querySelectorAll('.depo-card'));
  let depoIndex = 0;
  if(depoimentos.length > 1){
    depoimentos.forEach((d,i)=>{ if(i!==0) d.style.display='none'; });
    setInterval(()=>{
      depoimentos[depoIndex].style.display='none';
      depoIndex = (depoIndex+1) % depoimentos.length;
      depoimentos[depoIndex].style.display='block';
    }, 4200);
  }
});
