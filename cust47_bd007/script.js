/* ============================================
   🌹 Romantic Birthday Greeting — script.js
   All Interactivity, Particles, & Effects
   ============================================ */

// ==========================================
// CONFIG — ★ EDIT BAGIAN INI SESUAI KEBUTUHAN ★
// ==========================================
const CONFIG = {
  // Teks ucapan yang akan di-type (typewriter effect)
  loveLetterText: `Happy 19th birthday, sayang! 💐✨

Thank you so much for coming into this world and becoming the most precious part of my life. In this new chapter, I pray that every single good thing you hope for comes true, one by one, and that every step you take moving forward is made easy for you.

Please know that you are more than enough, and I’m incredibly proud of you. Thank you for being so amazing every single day, and thank you for accepting me just as I am. Being with you is truly one of the things I am most grateful for.

Never feel like you are alone, okay? Even when days get heavy, just remember that I’ll always be right here to stand by you and support you through it all. Keep growing and always stay happy. Happy birthday, my love! 🤍`,
  
  // Kecepatan typewriter (ms per karakter)
  typewriterSpeed: 45,
  
  // Jumlah hati yang melayang di background
  heartsCount: 25, // dikurangi di mobile otomatis
};

// ==========================================
// STATE
// ==========================================
const state = {
  currentSection: 0,
  musicPlaying: false,
  candlesLit: 5,
  typewriterDone: false,
  lightboxIndex: 0,
  runawayCount: 0,
};

// Section IDs in order
const SECTIONS = [
  'section-intro',
  'section-love',
  'section-countdown',
  'section-videos',
  'section-stack',
  'section-cake-letter',
  'section-polaroid',
  'section-special-video',
  'section-wish',
];

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
function $(selector) { return document.querySelector(selector); }
function $$(selector) { return document.querySelectorAll(selector); }

function isMobile() {
  return window.innerWidth < 768;
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

// ==========================================
// SECTION MANAGEMENT
// ==========================================
function showSection(index) {
  SECTIONS.forEach((id, i) => {
    const el = document.getElementById(id);
    if (i === index) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });
  state.currentSection = index;
}

// Tambahkan variabel interval di scope yang lebih luas agar bisa dibersihkan
let loveTransitionInterval = null;

function nextSection() {
  // Bersihkan interval jika berpindah dari section love
  if (state.currentSection === 1 && loveTransitionInterval) {
    clearInterval(loveTransitionInterval);
    loveTransitionInterval = null;
  }
  
  const next = state.currentSection + 1;
  if (next < SECTIONS.length) {
    showSection(next);
    // Trigger section-specific init
    onSectionEnter(next);
  }
}

function onSectionEnter(index) {
  switch (index) {
    case 1: // Love Transition
      startLoveTransition();
      break;
    case 2: // Countdown
      startCountdown();
      break;
    case 3: // Videos
      // Play all videos in the video collage
      $$('#section-videos video').forEach(v => v.play().catch(e => console.log('Autoplay prevented:', e)));
      break;
    case 4: // Stack
      break;
    case 5: // Cake & Letter
      state.candlesLit = 5;
      state.typewriterDone = false;
      // Reset flames
      $$('.candle .flame').forEach(f => f.classList.remove('out'));
      $('#cake-message').style.display = 'none';
      $('#btn-after-cake-letter').style.opacity = '0';
      $('#btn-after-cake-letter').style.pointerEvents = 'none';
      $('#typewriter-target').innerHTML = '';
      $('#letter-signature').classList.remove('show');
      setTimeout(startTypewriter, 600);
      break;
    case 6: // Polaroid Gallery
      break;
    case 7: // Special Video
      // Play special video automatically or let user play
      break;
    case 8: // Wish Lantern
      break;
  }
}

// ==========================================
// STARS BACKGROUND
// ==========================================
function createStars() {
  const container = $('#stars-bg');
  const count = isMobile() ? 50 : 100;
  
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.width = randomBetween(1, 3) + 'px';
    star.style.height = star.style.width;
    star.style.setProperty('--duration', randomBetween(2, 5) + 's');
    star.style.animationDelay = randomBetween(0, 3) + 's';
    container.appendChild(star);
  }
}

// ==========================================
// FLOATING HEARTS (Canvas)
// ==========================================
class Heart {
  constructor(canvas) {
    this.canvas = canvas;
    this.reset(true);
  }

  reset(initial = false) {
    this.x = Math.random() * this.canvas.width;
    this.y = initial ? Math.random() * this.canvas.height : this.canvas.height + 20;
    this.size = randomBetween(6, 18);
    this.speedY = randomBetween(0.4, 1.2);
    this.speedX = randomBetween(-0.2, 0.2);
    this.opacity = randomBetween(0.15, 0.45);
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = randomBetween(0.008, 0.025);
    this.hue = randomBetween(330, 360);
  }

  update() {
    this.y -= this.speedY;
    this.wobble += this.wobbleSpeed;
    this.x += Math.sin(this.wobble) * 0.6 + this.speedX;

    if (this.y < -30) {
      this.reset();
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = `hsl(${this.hue}, 80%, 72%)`;
    this.drawShape(ctx, this.x, this.y, this.size);
    ctx.fill();
    ctx.restore();
  }

  drawShape(ctx, cx, cy, size) {
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(cx, cy + topCurveHeight);
    // Left curve
    ctx.bezierCurveTo(
      cx, cy,
      cx - size / 2, cy,
      cx - size / 2, cy + topCurveHeight
    );
    ctx.bezierCurveTo(
      cx - size / 2, cy + (size + topCurveHeight) / 2,
      cx, cy + (size + topCurveHeight) / 1.5,
      cx, cy + size
    );
    // Right curve
    ctx.bezierCurveTo(
      cx, cy + (size + topCurveHeight) / 1.5,
      cx + size / 2, cy + (size + topCurveHeight) / 2,
      cx + size / 2, cy + topCurveHeight
    );
    ctx.bezierCurveTo(
      cx + size / 2, cy,
      cx, cy,
      cx, cy + topCurveHeight
    );
    ctx.closePath();
  }
}

function initHeartsCanvas() {
  const canvas = $('#hearts-canvas');
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const count = isMobile() ? Math.floor(CONFIG.heartsCount * 0.6) : CONFIG.heartsCount;
  const hearts = [];
  for (let i = 0; i < count; i++) {
    hearts.push(new Heart(canvas));
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hearts.forEach(h => {
      h.update();
      h.draw(ctx);
    });
    requestAnimationFrame(animate);
  }
  animate();
}

// ==========================================
// SECTION 1 — FLOWER BLOOM & INTRO
// ==========================================
function initIntro() {
  const flower = $('#flower');
  
  // Auto-bloom on load (after a short delay)
  setTimeout(() => {
    flower.classList.add('bloom');
  }, 500);

  // Start button
  $('#btn-start').addEventListener('click', () => {
    startMusic();
    spawnFallingPetals();
    setTimeout(() => {
      nextSection();
    }, 800);
  });
}

function spawnFallingPetals() {
  const count = isMobile() ? 15 : 30;
  for (let i = 0; i < count; i++) {
    const petal = document.createElement('div');
    petal.className = 'falling-petal';
    petal.style.left = randomBetween(5, 95) + '%';
    petal.style.top = randomBetween(-10, 30) + '%';
    petal.style.setProperty('--duration', randomBetween(2, 4.5) + 's');
    petal.style.setProperty('--spin', randomBetween(180, 720) + 'deg');
    petal.style.animationDelay = randomBetween(0, 1.2) + 's';
    petal.style.width = randomBetween(12, 24) + 'px';
    petal.style.height = randomBetween(18, 32) + 'px';
    petal.style.opacity = randomBetween(0.5, 0.9);
    const hue = randomBetween(330, 360);
    petal.style.background = `linear-gradient(to top, hsl(${hue}, 75%, 55%), hsl(${hue}, 80%, 78%))`;
    document.body.appendChild(petal);
    
    // Remove after animation
    const duration = parseFloat(petal.style.getPropertyValue('--duration')) * 1000;
    const delay = parseFloat(petal.style.animationDelay) * 1000;
    setTimeout(() => petal.remove(), duration + delay + 200);
  }
}

// ==========================================
// SECTION 2 — LOVE TRANSITION PAGE
// ==========================================
function startLoveTransition() {
  const container = $('#section-love');
  
  // Hapus elemen transisi lama jika ada
  const existingHearts = container.querySelectorAll('.falling-heart-love, .falling-text-love');
  existingHearts.forEach(h => h.remove());

  // Buat lope-lope dan teks berjatuhan dengan cepat (banyak)
  loveTransitionInterval = setInterval(() => {
    if (state.currentSection !== 1) {
      clearInterval(loveTransitionInterval);
      return;
    }
    
    // 40% kemungkinan buat teks "i love u so much", 60% buat lope-lope
    if (Math.random() < 0.4) {
      createFallingTextLove(container);
    } else {
      createFallingHeartLove(container);
    }
  }, 80); // setiap 80ms agar lebih ramai dan padat

  // Pindah ke halaman berikutnya setelah 5 detik
  setTimeout(() => {
    if (state.currentSection === 1) {
      nextSection();
    }
  }, 5000);
}

function createFallingHeartLove(container) {
  const heart = document.createElement('div');
  heart.className = 'falling-heart-love';
  
  // Variasi warna emoji lope-lope (merah dan pink)
  const hearts = ['❤️', '💖', '💕', '💗', '💓'];
  heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
  
  // Ukuran bervariasi
  const size = randomBetween(20, 45); 
  // Posisi horizontal random (0-100%)
  const left = randomBetween(0, 100);
  // Durasi jatuh acak (3-5 detik)
  const duration = randomBetween(3, 5); 
  // Putaran acak (dari 360 derajat sampai 1080 derajat)
  const spin = randomBetween(360, 1080); 
  
  heart.style.left = left + '%';
  heart.style.fontSize = size + 'px';
  heart.style.setProperty('--duration', duration + 's');
  heart.style.setProperty('--spin', spin + 'deg');
  
  container.appendChild(heart);
  
  // Hapus setelah selesai animasi
  setTimeout(() => {
    heart.remove();
  }, duration * 1000);
}

function createFallingTextLove(container) {
  const textEl = document.createElement('div');
  textEl.className = 'falling-text-love';
  textEl.textContent = 'i love u so much my love';
  
  // Ukuran bervariasi agar menarik (14px - 28px)
  const size = randomBetween(14, 28); 
  // Posisi horizontal random agar tidak meluber keluar layar (0-80%)
  const left = randomBetween(0, 80);
  // Durasi jatuh acak (3-5 detik)
  const duration = randomBetween(3, 5); 
  // Putaran teks yang manis (-180 sampai 180 derajat) agar bergoyang dinamis
  const spin = randomBetween(-180, 180); 
  
  textEl.style.left = left + '%';
  textEl.style.fontSize = size + 'px';
  textEl.style.setProperty('--duration', duration + 's');
  textEl.style.setProperty('--spin', spin + 'deg');
  
  container.appendChild(textEl);
  
  // Hapus setelah selesai animasi
  setTimeout(() => {
    textEl.remove();
  }, duration * 1000);
}

// ==========================================
// SECTION 3 — COUNTDOWN
// ==========================================
function startCountdown() {
  const display = $('#countdown-display');
  const ageReveal = $('#age-reveal');
  let count = 3;

  display.textContent = count;
  display.style.animation = 'none';
  void display.offsetWidth; // force reflow
  display.style.animation = 'countdownPulse 0.8s ease-out';

  const interval = setInterval(() => {
    count--;
    if (count > 0) {
      display.textContent = count;
      display.style.animation = 'none';
      void display.offsetWidth;
      display.style.animation = 'countdownPulse 0.8s ease-out';
    } else {
      clearInterval(interval);
      display.style.display = 'none';
      ageReveal.style.display = 'block';
      // Fire confetti!
      createConfetti();
      // Auto-advance after 3.5 seconds
      setTimeout(() => {
        nextSection();
      }, 3500);
    }
  }, 1000);
}

// ==========================================
// SECTION 4 — TYPEWRITER
// ==========================================
function startTypewriter() {
  const target = $('#typewriter-target');
  const text = CONFIG.loveLetterText;
  let index = 0;

  // Add cursor
  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  target.appendChild(cursor);

  function type() {
    if (index < text.length) {
      const char = text[index];
      // Insert text before cursor
      const textNode = document.createTextNode(char);
      target.insertBefore(textNode, cursor);
      index++;

      // Variable speed: pause longer at newlines and periods
      let delay = CONFIG.typewriterSpeed;
      if (char === '\n') delay = 300;
      else if (char === '.' || char === '!' || char === '?') delay = 250;
      else if (char === ',') delay = 150;

      setTimeout(type, delay);
    } else {
      // Done typing
      state.typewriterDone = true;
      // Show signature
      setTimeout(() => {
        $('#letter-signature').classList.add('show');
      }, 500);
      // Check if cake-letter is completed
      setTimeout(() => {
        checkCakeLetterDone();
      }, 1000);
      // Remove cursor after a bit
      setTimeout(() => {
        cursor.remove();
      }, 3000);
    }
  }

  type();
}

function checkCakeLetterDone() {
  if (state.typewriterDone && state.candlesLit === 0) {
    const btn = $('#btn-after-cake-letter');
    if (btn) {
      btn.style.opacity = '1';
      btn.style.pointerEvents = 'auto';
    }
  }
}

// ==========================================
// SECTION 6 — BIRTHDAY CAKE & LETTER
// ==========================================
function initCake() {
  const candles = $$('.candle');
  
  candles.forEach(candle => {
    candle.addEventListener('click', () => {
      const flame = candle.querySelector('.flame');
      if (flame && !flame.classList.contains('out')) {
        flame.classList.add('out');
        
        // Create smoke effect
        createSmoke(candle);
        
        state.candlesLit--;
        
        if (state.candlesLit === 0) {
          // All candles blown out!
          setTimeout(() => {
            createConfetti();
            document.body.classList.add('shake');
            setTimeout(() => document.body.classList.remove('shake'), 500);
            
            const cakeMsg = $('#cake-message');
            cakeMsg.style.display = 'block';
            checkCakeLetterDone();
          }, 500);
        }
      }
    });
  });

  $('#btn-after-cake-letter').addEventListener('click', () => {
    nextSection();
  });
}

function createSmoke(candle) {
  const flameContainer = candle.querySelector('.flame-container');
  const rect = flameContainer.getBoundingClientRect();

  for (let i = 0; i < 5; i++) {
    const smoke = document.createElement('div');
    smoke.className = 'smoke';
    smoke.style.left = (rect.left + rect.width / 2 + randomBetween(-5, 5)) + 'px';
    smoke.style.top = (rect.top + randomBetween(-5, 5)) + 'px';
    smoke.style.position = 'fixed';
    smoke.style.animationDelay = (i * 0.1) + 's';
    document.body.appendChild(smoke);
    setTimeout(() => smoke.remove(), 1500);
  }
}

// ==========================================
// SECTION 6 — GALLERY & LIGHTBOX
// ==========================================
function initGallery() {
  const polaroids = $$('.polaroid');
  const lightbox = $('#lightbox');
  const lightboxContent = $('#lightbox-content');
  const lightboxCaption = $('#lightbox-caption');
  
  // Collect gallery data
  const galleryData = [];
  polaroids.forEach(p => {
    const imgEl = p.querySelector('.polaroid-img');
    const caption = p.querySelector('.polaroid-caption').textContent;
    const bgStyle = imgEl.getAttribute('style') || '';
    const emoji = imgEl.querySelector('span')?.textContent || '';
    // Check if it has a real image
    const imgTag = imgEl.querySelector('img');
    galleryData.push({ bgStyle, caption, emoji, imgTag: imgTag ? imgTag.src : null });
  });

  // Open lightbox
  polaroids.forEach((p, i) => {
    p.addEventListener('click', () => {
      openLightbox(i, galleryData);
    });
  });

  // Close lightbox
  $('#lightbox-close').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Navigation
  $('#lightbox-prev').addEventListener('click', (e) => {
    e.stopPropagation();
    state.lightboxIndex = (state.lightboxIndex - 1 + galleryData.length) % galleryData.length;
    updateLightbox(galleryData);
  });

  $('#lightbox-next').addEventListener('click', (e) => {
    e.stopPropagation();
    state.lightboxIndex = (state.lightboxIndex + 1) % galleryData.length;
    updateLightbox(galleryData);
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') {
      state.lightboxIndex = (state.lightboxIndex - 1 + galleryData.length) % galleryData.length;
      updateLightbox(galleryData);
    }
    if (e.key === 'ArrowRight') {
      state.lightboxIndex = (state.lightboxIndex + 1) % galleryData.length;
      updateLightbox(galleryData);
    }
  });

  // After gallery button
  $('#btn-after-polaroid').addEventListener('click', () => {
    nextSection();
  });
}

function openLightbox(index, data) {
  state.lightboxIndex = index;
  updateLightbox(data);
  $('#lightbox').classList.add('open');
}

function updateLightbox(data) {
  const item = data[state.lightboxIndex];
  const content = $('#lightbox-content');
  const caption = $('#lightbox-caption');

  if (item.imgTag) {
    content.innerHTML = `<img src="${item.imgTag}" alt="${item.caption}">`;
  } else {
    content.innerHTML = `<div class="polaroid-img-large" style="${item.bgStyle} width:300px; height:300px; display:flex; align-items:center; justify-content:center; border-radius:4px;"><span style="font-size:5rem;">${item.emoji}</span></div>`;
  }
  caption.textContent = item.caption;
}

function closeLightbox() {
  $('#lightbox').classList.remove('open');
}

// ==========================================
// SECTION 7 — WISH LANTERN
// ==========================================
function initWish() {
  $('#btn-wish').addEventListener('click', () => {
    const input = $('#wish-input');
    const text = input.value.trim();
    
    if (!text) {
      input.style.borderColor = '#f87171';
      input.placeholder = 'Tulis harapanmu dulu ya... ❤️';
      setTimeout(() => {
        input.style.borderColor = '';
      }, 1500);
      return;
    }

    // Hide the entire wish container (title, text, everything)
    const wishContainer = $('.wish-container');
    wishContainer.style.transition = 'opacity 1s ease';
    wishContainer.style.opacity = '0';

    setTimeout(() => {
      wishContainer.style.display = 'none';

      // Launch the lantern party immediately (full screen)
      createLanternParty();

      // Show final message after the lantern party (10 seconds)
      setTimeout(() => {
        $('#final-message').style.display = 'block';
        // Put final message inside the section
        $('#section-wish').appendChild($('#final-message'));
      }, 10000);
    }, 1000);
  });
}

// ==========================================
// LANTERN PARTY
// ==========================================
function createLanternParty() {
  const count = isMobile() ? 30 : 60;
  
  for (let i = 0; i < count; i++) {
    const lantern = document.createElement('div');
    lantern.className = 'mini-lantern';
    
    // Create the body structure similar to the main lantern
    const body = document.createElement('div');
    body.className = 'lantern-body';
    lantern.appendChild(body);

    const scale = randomBetween(0.2, 0.6);
    const left = randomBetween(-5, 105);
    const duration = randomBetween(7, 12);
    const delay = randomBetween(0, 5);
    const tx = randomBetween(-150, 150);

    lantern.style.left = left + '%';
    lantern.style.setProperty('--scale', scale);
    lantern.style.setProperty('--duration', duration + 's');
    lantern.style.setProperty('--delay', delay + 's');
    lantern.style.setProperty('--tx', tx + 'px');

    document.body.appendChild(lantern);

    setTimeout(() => lantern.remove(), (duration + delay) * 1000 + 500);
  }
}

// ==========================================
// CONFETTI BURST
// ==========================================
function createConfetti() {
  const colors = ['#ff6b8a', '#ffd700', '#ff8fa3', '#e8a87c', '#ffc2d1', '#fff', '#a78bfa', '#4ade80'];
  const shapes = ['❤️', '⭐', '🌸', '✨'];
  const count = isMobile() ? 50 : 80;

  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    
    // Mix of colored squares and emoji
    if (Math.random() > 0.3) {
      // Colored rectangle
      piece.style.width = randomBetween(6, 12) + 'px';
      piece.style.height = randomBetween(6, 14) + 'px';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    } else {
      // Emoji
      piece.textContent = shapes[Math.floor(Math.random() * shapes.length)];
      piece.style.fontSize = randomBetween(10, 20) + 'px';
    }

    piece.style.left = randomBetween(30, 70) + '%';
    piece.style.top = randomBetween(30, 50) + '%';
    piece.style.setProperty('--tx', randomBetween(-window.innerWidth * 0.45, window.innerWidth * 0.45) + 'px');
    piece.style.setProperty('--ty', randomBetween(-window.innerHeight * 0.5, window.innerHeight * 0.4) + 'px');
    piece.style.setProperty('--r', randomBetween(-720, 720) + 'deg');
    piece.style.animationDelay = randomBetween(0, 0.4) + 's';

    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 3500);
  }
}

// ==========================================
// MUSIC CONTROL
// ==========================================
function startMusic() {
  const audio = $('#bg-music');
  const btn = $('#music-toggle');

  audio.play().then(() => {
    state.musicPlaying = true;
    btn.classList.add('playing', 'visible');
  }).catch(() => {
    // Autoplay blocked, show button anyway
    btn.classList.add('visible');
  });
}

function initMusicToggle() {
  const audio = $('#bg-music');
  const btn = $('#music-toggle');

  btn.addEventListener('click', () => {
    if (state.musicPlaying) {
      audio.pause();
      state.musicPlaying = false;
      btn.classList.remove('playing');
    } else {
      audio.play().then(() => {
        state.musicPlaying = true;
        btn.classList.add('playing');
      }).catch(() => {});
    }
  });
}

function pauseAllVideos() {
  $$('video').forEach(v => v.pause());
}

function initVideos() {
  $('#btn-after-videos').addEventListener('click', () => {
    pauseAllVideos();
    nextSection();
  });
}

function initPhotoStack() {
  const stack = $('#photo-stack');
  if (!stack) return;
  const photos = stack.querySelectorAll('.stacked-photo');

  photos.forEach(photo => {
    photo.addEventListener('click', () => {
      // Swipe animation direction (can be randomized)
      const isRight = Math.random() > 0.5;
      const transX = isRight ? 180 : -180;
      const rotate = randomBetween(10, 25) * (isRight ? 1 : -1);

      // Slide out card
      photo.style.transform = `translateX(${transX}px) rotate(${rotate}deg) scale(0.95)`;
      photo.style.opacity = '0.5';
      
      setTimeout(() => {
        // Find current z-indices of all stack items
        const currentZIndices = Array.from(photos).map(p => parseInt(p.style.zIndex || 1));
        const minZIndex = Math.min(...currentZIndices);

        // Put this card to the back of the stack (1 lower than min)
        photo.style.zIndex = minZIndex - 1;
        
        // Slide it back in
        const currentRotate = photo.getAttribute('style').match(/--rotate:\s*([^;]+)/)?.[1] || '0deg';
        photo.style.transform = `translateX(0) rotate(${currentRotate}) scale(0.95)`;
        photo.style.opacity = '1';
      }, 300);
    });
  });

  $('#btn-after-stack').addEventListener('click', () => {
    nextSection();
  });
}

function initSpecialVideo() {
  const specialVideo = $('#section-special-video video');
  const bgMusic = $('#bg-music');
  const musicBtn = $('#music-toggle');
  let musicPausedByVideo = false;

  if (specialVideo) {
    specialVideo.addEventListener('play', () => {
      // Pause background music if it was playing
      if (state.musicPlaying) {
        bgMusic.pause();
        musicBtn.classList.remove('playing');
        musicPausedByVideo = true;
      }
    });

    // Handle both manual pause and video ending
    const resumeMusic = () => {
      if (musicPausedByVideo && state.musicPlaying) {
        bgMusic.play().catch(() => {});
        musicBtn.classList.add('playing');
        musicPausedByVideo = false;
      }
    };

    specialVideo.addEventListener('pause', resumeMusic);
    specialVideo.addEventListener('ended', resumeMusic);
  }

  $('#btn-after-special-video').addEventListener('click', () => {
    pauseAllVideos();
    // Resume music if user skips while video is playing
    if (musicPausedByVideo && state.musicPlaying) {
      bgMusic.play().catch(() => {});
      musicBtn.classList.add('playing');
      musicPausedByVideo = false;
    }
    nextSection();
  });
}

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  createStars();
  initHeartsCanvas();
  initIntro();
  initVideos();
  initPhotoStack();
  initCake();
  initGallery();
  initSpecialVideo();
  initWish();
  initMusicToggle();
});
