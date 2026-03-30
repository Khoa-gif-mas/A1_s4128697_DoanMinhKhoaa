window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('fade-out');
  }, 1500);
});
let soundOn = false;
const audios = {}; 

// ──  KHỞI TẠO SAO TRỜI (INTRO) ──────────────
const introStars = document.getElementById('intro-stars');
if (introStars) {
  for (let i = 0; i < 120; i++) {
    const s = document.createElement('div');
    s.className = 'intro-star';
    const size = Math.random() * 2.5 + 0.5;
    s.style.cssText = `
      width:${size}px; height:${size}px;
      top:${Math.random()*100}%;
      left:${50 + Math.random()*50}%;
      --d:${2+Math.random()*4}s;
      --delay:${Math.random()*4}s;
    `;
    introStars.appendChild(s);
  }
}


const soundBtn = document.getElementById('sound-btn');
if (soundBtn) {
  soundBtn.addEventListener('click', () => {
    soundOn = !soundOn;
    if (soundOn) {
      soundBtn.textContent = '♪';
      soundBtn.classList.remove('muted');
  
      checkAndPlayCurrentAudio();
    } else {
      soundBtn.textContent = '♩';
      soundBtn.classList.add('muted');
      stopAllAudio();
    }
  });
}

function stopAllAudio() {
  Object.values(audios).forEach(a => {
    if (a) {
      a.pause();
      a.currentTime = 0;
    }
  });
}

const beginBtn = document.getElementById('begin-btn');
if (beginBtn) {
  beginBtn.addEventListener('click', () => {
    const content = document.querySelector('.intro-content');
    if (content) {
      content.style.transition = 'opacity 0.8s';
      content.style.opacity = '0';
      setTimeout(() => {
        content.style.visibility = 'hidden';
        document.getElementById('main-page').classList.remove('hidden');
        initPage();
        document.getElementById('s1').scrollIntoView({ behavior: 'smooth' });
      }, 800);
    }
  });
}

document.getElementById('restart-btn')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


function initPage() {
  initAudio();
  createRain();
  createStars();
  startThread(); 
  initScrollObserver();
  initParallax();
  initClickZone();
  initHandsS2();
  initBoatS3();
  initCometS4();
}



function startThread() {
  const canvas = document.getElementById('thread-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let targetProgress = 0;   
  let currentProgress = 0;  


  function resize() {
    width = canvas.width = 80;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  
  const anchors = [
    { x: 40, y: 0 },              
    { x: 65, y: height * 0.12 },  
    { x: 15, y: height * 0.22 },   
    { x: 60, y: height * 0.32 },  
    { x: 40, y: height * 0.65 }         
  ];

  const points = [];
  const stepsPerSegment = 200;

  for (let i = 0; i < anchors.length - 1; i++) {
    const p0 = anchors[i];
    const p1 = anchors[i + 1];
    
    const cp1 = { x: p0.x, y: p0.y + (p1.y - p0.y) / 2 };
    const cp2 = { x: p1.x, y: p0.y + (p1.y - p0.y) / 2 };

    for (let t = 0; t <= 1; t += 1 / stepsPerSegment) {
      const x = Math.pow(1 - t, 3) * p0.x +
                3 * Math.pow(1 - t, 2) * t * cp1.x +
                3 * (1 - t) * Math.pow(t, 2) * cp2.x +
                Math.pow(t, 3) * p1.x;
      const y = Math.pow(1 - t, 3) * p0.y +
                3 * Math.pow(1 - t, 2) * t * cp1.y +
                3 * (1 - t) * Math.pow(t, 2) * cp2.y +
                Math.pow(t, 3) * p1.y;
      points.push({ x, y });
    }
  }

 
  function draw() {
   
    const scrolled = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    targetProgress = maxScroll > 0 ? Math.min(scrolled / maxScroll, 1) : 0;

 
    currentProgress += (targetProgress - currentProgress) * 0.07;

    ctx.clearRect(0, 0, width, height);

    if (currentProgress > 0.005) {
      ctx.strokeStyle = '#c0392b';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = 'rgba(192, 57, 43, 0.5)';
      ctx.shadowBlur = 8;

      const drawLimit = Math.floor(currentProgress * points.length);
      
      if (drawLimit >= 2) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < drawLimit; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();

  
        const lastPt = points[drawLimit - 1];
        ctx.beginPath();
        ctx.arc(lastPt.x, lastPt.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#c0392b';
        ctx.fill();
        
     
        if (currentProgress > 0.99) {
            ctx.beginPath();
            ctx.arc(points[points.length-1].x, points[points.length-1].y, 6, 0, Math.PI*2);
            ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
}
// ──  CÁC HIỆU ỨNG MÔI TRƯỜNG ────────────────
function createRain() {
  const wrap = document.getElementById('rain-wrap');
  if (!wrap) return;
  wrap.innerHTML = ''; // Clear cũ nếu có
  for (let i = 0; i < 120; i++) {
    const d = document.createElement('div');
    d.className = 'rain-drop';
    d.style.cssText = `
      left:${(i / 120) * 100 + Math.random() * 2}%;
      top:${Math.random() * 30}%;
      height:${20 + Math.random() * 40}px;
      animation-duration:${0.5+Math.random()*0.6}s;
      animation-delay:${Math.random()*1.5}s;
      opacity:${0.6+Math.random()*0.4};
    `;
    wrap.appendChild(d);
  }
}

function createStars() {
  const wrap = document.getElementById('stars-wrap');
  if (!wrap) return;
  wrap.innerHTML = '';
  for (let i = 0; i < 100; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const size = Math.random() * 2.5 + 0.5;
    s.style.cssText = `
      width:${size}px; height:${size}px;
      top:${Math.random()*100}%;
      left:${Math.random()*100}%;
      --d:${2+Math.random()*4}s;
      --delay:${Math.random()*4}s;
    `;
    wrap.appendChild(s);
  }
}

// ──  TƯƠNG TÁC TỪNG PHẦN ────────────────────
function initClickZone() {
  const flower = document.getElementById('flower-btn');
  const lines = document.querySelectorAll('.line-float');
  const thread = document.getElementById('thread-canvas');
  if (!flower) return;

  flower.addEventListener('click', () => {
    flower.classList.add('bloomed');
    if (thread) thread.classList.add('thread-active');
    lines.forEach((line, index) => {
      setTimeout(() => line.classList.add('show'), index * 500);
    });
    const hint = flower.querySelector('.flower-hint');
    if (hint) hint.style.opacity = '0';
  }, { once: true });
}

function initHandsS2() {
  const hands = document.querySelector('.hands-together');
  const lines = document.querySelectorAll('.line-float-s2');
  const hint = document.getElementById('s2-hint');
  if (!hands) return;

  hands.addEventListener('click', () => {
    hands.style.filter = 'drop-shadow(0 0 20px rgba(200,220,255,0.8))';
    if (hint) hint.style.opacity = '0';
    lines.forEach((line, i) => {
      setTimeout(() => line.classList.add('show'), i * 800);
    });
  }, { once: true });
}

function initBoatS3() {
  const boat = document.getElementById('boat-s3');
  const wrap = document.getElementById('boat-wrap');
  const lines = document.querySelectorAll('.line-float-s3');
  const hint = document.querySelector('.boat-hint');
  if (!wrap) return;

  wrap.addEventListener('click', () => {
    if (boat) {
      boat.style.filter = 'drop-shadow(0 0 20px rgba(255,220,100,0.9))';
      boat.style.animation = 'boatFloat 1.5s ease-in-out infinite';
    }
    if (hint) hint.style.opacity = '0';
    lines.forEach((line, i) => {
      setTimeout(() => line.classList.add('show'), i * 800);
    });
  }, { once: true });
}

function initCometS4() {
  const canvas = document.getElementById('comet-canvas');
  const s4 = document.getElementById('s4');
  const lines = document.querySelectorAll('.line-float-s4');
  const hint = document.getElementById('s4-hint');
  if (!canvas || !s4) return;

  const ctx = canvas.getContext('2d');
  let caught = false;
  let comets = [];

  canvas.width = s4.offsetWidth;
  canvas.height = s4.offsetHeight;

  function spawnComet() {
    if (caught) return;
    comets.push({
      x: -100,
      y: Math.random() * canvas.height * 0.6,
      speed: 3 + Math.random() * 3,
      length: 80 + Math.random() * 60,
      opacity: 1,
      width: 2 + Math.random(),
    });
    setTimeout(spawnComet, 2000 + Math.random() * 2000);
  }

  function animate() {
    if (caught) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    comets.forEach((c, i) => {
      const grad = ctx.createLinearGradient(c.x - c.length, c.y, c.x, c.y);
      grad.addColorStop(0, `rgba(100,180,255,0)`);
      grad.addColorStop(1, `rgba(200,230,255,${c.opacity})`);
      ctx.beginPath();
      ctx.moveTo(c.x - c.length, c.y);
      ctx.lineTo(c.x, c.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = c.width;
      ctx.stroke();
      c.x += c.speed;
      if (c.x > canvas.width + 100) comets.splice(i, 1);
    });
    requestAnimationFrame(animate);
  }

  canvas.addEventListener('click', (e) => {
    if (caught) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const hit = comets.find(c => mx >= c.x - c.length && mx <= c.x + 10 && Math.abs(my - c.y) < 20);

    if (hit) {
      caught = true;
      if (hint) hint.style.opacity = '0';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      lines.forEach((line, i) => setTimeout(() => line.classList.add('show'), i * 800));
    }
  });

  spawnComet();
  animate();
}

// ── HỆ THỐNG ÂM THANH THEO SECTION ──────────
function initAudio() {
  audios.s1 = document.getElementById('audio-wind');
  audios.s2 = document.getElementById('audio-rain');
  audios.s3 = document.getElementById('audio-river');
  audios.s4 = document.getElementById('audio-night');

  const audioObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && soundOn) {
        playAudio(entry.target.id);
      }
    });
  }, { threshold: 0.5 });

  ['s1', 's2', 's3', 's4'].forEach(id => {
    const el = document.getElementById(id);
    if (el) audioObserver.observe(el);
  });
}

function playAudio(id) {
  if (!soundOn) return;
  stopAllAudio();
  const a = audios[id];
  if (a) {
    a.volume = 0;
    a.play().catch(() => {});
    // Fade in
    let vol = 0;
    const interval = setInterval(() => {
      vol += 0.05;
      if (vol >= 0.3) { a.volume = 0.3; clearInterval(interval); }
      else a.volume = vol;
    }, 100);
  }
}

function checkAndPlayCurrentAudio() {
  ['s1', 's2', 's3', 's4'].forEach(id => {
    const rect = document.getElementById(id)?.getBoundingClientRect();
    if (rect && rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
      playAudio(id);
    }
  });
}

// ──  QUAN SÁT CUỘN TRANG (FADE IN) ───────────
function initScrollObserver() {
  const blocks = document.querySelectorAll('.fade-block');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.1 });
  blocks.forEach(b => obs.observe(b));

  const endObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        setTimeout(() => document.querySelector('.ending-title')?.classList.add('visible'), 800);
        setTimeout(() => document.querySelector('.ending-author')?.classList.add('visible'), 1400);
      }
    });
  }, { threshold: 0.3 });
  const ending = document.getElementById('ending');
  if (ending) endObs.observe(ending);
}

function initParallax() {
  window.addEventListener('scroll', () => {
    ['s1', 's2', 's3', 's4'].forEach(id => {
      const section = document.getElementById(id);
      const bg = section?.querySelector('.section-bg');
      if (section && bg) {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          bg.style.transform = `translateY(${-rect.top * 0.2}px)`;
        }
      }
    });
  });
}
document.addEventListener('mousemove', (e) => {
  const x = (window.innerWidth / 2 - e.pageX) / 50;
  const y = (window.innerHeight / 2 - e.pageY) / 50;


  const elements = document.querySelectorAll('.flower-img, .hands-together, .boat');
  elements.forEach(el => {
    el.style.transform = `translate(${x}px, ${y}px)`;
  });
});
const cursor = document.getElementById('custom-cursor');

document.addEventListener('mousemove', (e) => {
 
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});


const interactiveElements = document.querySelectorAll('button, .flower-btn, .hands-together, .boat, #comet-canvas, .control-btn');

interactiveElements.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('active');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('active');
  });
});


document.addEventListener('mouseleave', () => {
  cursor.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  cursor.style.opacity = '1';
});