// ========== TEMA ==========

// Sinaliza qual ícone está ativo (versão minimalista)
function setThemeIcons() {
  const isLight = document.body.getAttribute('data-theme') === 'light';
  const sunIcon = document.querySelector('.theme-toggle-minimal .theme-sun');
  const moonIcon = document.querySelector('.theme-toggle-minimal .theme-moon');
  if (sunIcon) sunIcon.classList.toggle('active', isLight);
  if (moonIcon) moonIcon.classList.toggle('active', !isLight);
}

// Alternância de tema ao clicar nos ícones (minimalista)
function setupThemeToggle() {
  const btn = document.querySelector('.theme-toggle-minimal');
  if (!btn) return;
  btn.addEventListener('click', function (e) {
    const sunIcon = btn.querySelector('.theme-sun');
    const moonIcon = btn.querySelector('.theme-moon');
    const sunClicked = e.target.closest('.theme-sun');
    const moonClicked = e.target.closest('.theme-moon');
    if (sunClicked && !sunIcon.classList.contains('active')) {
      document.body.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      setThemeIcons();
      return;
    }
    if (moonClicked && !moonIcon.classList.contains('active')) {
      document.body.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
      setThemeIcons();
      return;
    }
  });
}

// Carrega o tema do localStorage
function loadThemeMinimal() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.setAttribute('data-theme', 'light');
  } else {
    document.body.removeAttribute('data-theme');
  }
  setThemeIcons();
}

// ========== CAROUSEL DE SERVIÇOS ==========

let currentSlide = 0;
let autoPlayInterval = null;

function getSlides() {
  return document.querySelectorAll('.service-card');
}
function getTotalSlides() {
  return getSlides().length;
}

function getTrack() {
  return document.getElementById('carouselTrack');
}
function getNavContainer() {
  return document.getElementById('carouselNav');
}

function createNavDots() {
  const navContainer = getNavContainer();
  if (!navContainer) return;
  navContainer.innerHTML = '';
  for (let i = 0; i < getTotalSlides(); i++) {
    const dot = document.createElement('div');
    dot.classList.add('nav-dot');
    if (i === 0) dot.setAttribute('aria-current', 'true');
    dot.addEventListener('click', () => goToSlide(i));
    navContainer.appendChild(dot);
  }
}

function updateCarousel() {
  const track = getTrack();
  if (!track) return;
  const translateX = -currentSlide * 100;
  track.style.transform = `translateX(${translateX}%)`;
  document.querySelectorAll('.nav-dot').forEach((dot, index) => {
    if (index === currentSlide) {
      dot.setAttribute('aria-current', 'true');
    } else {
      dot.removeAttribute('aria-current');
    }
  });
}

function goToSlide(slideIndex) {
  currentSlide = slideIndex;
  updateCarousel();
}
function nextSlide() {
  currentSlide = (currentSlide + 1) % getTotalSlides();
  updateCarousel();
}
function previousSlide() {
  currentSlide = (currentSlide - 1 + getTotalSlides()) % getTotalSlides();
  updateCarousel();
}
function startAutoPlay() {
  if (autoPlayInterval) clearInterval(autoPlayInterval);
  autoPlayInterval = setInterval(() => {
    nextSlide();
  }, 4000);
}

// Touch/swipe para mobile
function setupTouch() {
  const track = getTrack();
  if (!track) return;
  let startX = 0;
  let endX = 0;
  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });
  track.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    handleSwipe(startX, endX);
  });
}
function handleSwipe(startX, endX) {
  const swipeThreshold = 50;
  const diff = startX - endX;
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      nextSlide();
    } else {
      previousSlide();
    }
  }
}

function setupKeyboardNav() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      previousSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    }
  });
}

// ========== OUTRAS FUNÇÕES ==========

function scheduleConsultation() {
  const message = encodeURIComponent(
    "Olá! Gostaria de agendar uma consulta jurídica. Poderia me informar os horários disponíveis?"
  );
  window.open(`https://wa.me/5511999999999?text=${message}`, '_blank');
}

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

function setupLoading() {
  window.addEventListener('load', function () {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    setTimeout(() => {
      document.body.style.opacity = '1';
    }, 100);
  });
}

function setupIntersectionAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
      }
    });
  }, observerOptions);
  document.querySelectorAll('.contact-links, .social-links').forEach(el => {
    observer.observe(el);
  });
}

// ========== INICIALIZAÇÃO GERAL ==========

document.addEventListener('DOMContentLoaded', () => {
  loadThemeMinimal();
  setupThemeToggle();

  createNavDots();
  updateCarousel();
  startAutoPlay();
  setupTouch();
  setupKeyboardNav();

  setupSmoothScroll();
  setupIntersectionAnimations();
  setupLoading();
});

window.scheduleConsultation = scheduleConsultation;