// small interactive script: typed words, 3D card tilt and barrage
document.addEventListener('DOMContentLoaded', function(){
  // year
  document.getElementById('year').textContent = new Date().getFullYear();

  // typed effect (VSL rhythm)
  const words = ['que convertem.', 'com resultado.', 'com estratégia.'];
  const typedEl = document.getElementById('typed');
  let w = 0, i = 0;
  function typeLoop(){
    const word = words[w];
    if(!word) return;
    typedEl.textContent = word.slice(0, i);
    i++;
    if(i <= word.length){
      setTimeout(typeLoop, 50 + Math.random()*40);
    } else {
      setTimeout(()=>{ // pause then delete
        let j = word.length;
        function del(){
          j--;
          typedEl.textContent = word.slice(0,j);
          if(j>0) setTimeout(del,30);
          else {
            w = (w+1) % words.length;
            i = 0;
            setTimeout(typeLoop, 200);
          }
        }
        del();
      }, 900);
    }
  }
  typeLoop();

  // 3D card tilt
  const card = document.getElementById('card3d');
  if(card){
    const rect = card.getBoundingClientRect();
    card.addEventListener('mousemove', e=>{
      const r = card.getBoundingClientRect();
      const cx = r.left + r.width/2;
      const cy = r.top + r.height/2;
      const dx = (e.clientX - cx) / r.width;
      const dy = (e.clientY - cy) / r.height;
      const rotateY = dx * 12;
      const rotateX = -dy * 10;
      card.querySelectorAll('.card-layer').forEach((layer, idx)=>{
        const depth = (idx - 1) * 10;
        layer.style.transform = `translateZ(${depth}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1)`;
      });
    });
    card.addEventListener('mouseleave', ()=>{
      card.querySelectorAll('.card-layer').forEach((layer, idx)=>{
        const depth = (idx - 1) * 10;
        layer.style.transition = 'transform 700ms cubic-bezier(.2,.8,.2,1)';
        layer.style.transform = `translateZ(${depth}px) rotateX(0deg) rotateY(0deg) scale(1)`;
        setTimeout(()=>layer.style.transition='',800);
      });
    });
  }

  // small VSL barrage (floating words)
  const barrage = document.getElementById('vsl-barrage');
  const barrageWords = ['Tráfego', 'Conversão', 'Lançamento', 'Alcance', 'Engajamento', 'Resultados'];
  function spawnBarrage(){
    const el = document.createElement('div');
    el.className = 'item';
    el.textContent = barrageWords[Math.floor(Math.random()*barrageWords.length)];
    const startX = Math.random()*60;
    const startY = Math.random()*100 - 10;
    el.style.left = startX + '%';
    el.style.top = startY + '%';
    barrage.appendChild(el);
    const dur = 4200 + Math.random()*2200;
    el.animate([
      { transform: 'translateY(0) scale(0.95)', opacity:1 },
      { transform: 'translateY(-120px) scale(1.02)', opacity:0.06 }
    ], { duration: dur, easing: 'cubic-bezier(.2,.8,.2,1)'});
    setTimeout(()=>{ el.remove(); }, dur+80);
  }
  setInterval(spawnBarrage, 900);

  // parallax background follow mouse
  const bg = document.querySelector('.bg-layer');
  window.addEventListener('mousemove', e=>{
    const x = (e.clientX / window.innerWidth - 0.5) * 18;
    const y = (e.clientY / window.innerHeight - 0.5) * 10;
    bg.style.transform = `translate3d(${x}px, ${y}px, -200px) scale(1.12)`;
  });
});
