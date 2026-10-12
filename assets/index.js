// ====================================================
// iOS 27 LIQUID GLASS INTERACTIVE ENGINE
// ====================================================

// --- 1. Procedural Ambient Liquid Stardust / Bokeh Canvas ---
(function initLiquidParticles() {
  const canvas = document.createElement("canvas");
  canvas.id = "liquid_canvas";
  canvas.setAttribute(
    "style",
    "position: fixed; left: 0; top: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 2;"
  );
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let width, height;
  let particles = [];
  const PARTICLE_COUNT = 38;

  const colors = [
    "rgba(0, 242, 254, ", // Cyan
    "rgba(121, 40, 202, ", // Violet
    "rgba(247, 37, 133, ", // Pink
    "rgba(255, 255, 255, "  // White
  ];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  function Particle() {
    this.reset();
  }

  Particle.prototype.reset = function () {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.radius = Math.random() * 2.2 + 0.8;
    this.speedX = (Math.random() - 0.5) * 0.45;
    this.speedY = -Math.random() * 0.6 - 0.15;
    this.alpha = Math.random() * 0.55 + 0.15;
    this.fade = (Math.random() * 0.008 + 0.003) * (Math.random() > 0.5 ? 1 : -1);
    this.color = colors[Math.floor(Math.random() * colors.length)];
  };

  Particle.prototype.update = function () {
    this.x += this.speedX;
    this.y += this.speedY;
    this.alpha += this.fade;

    if (this.alpha <= 0.08 || this.alpha >= 0.75) {
      this.fade = -this.fade;
    }

    if (this.y < -10 || this.x < -10 || this.x > width + 10) {
      this.reset();
      this.y = height + 10;
    }
  };

  Particle.prototype.draw = function () {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color + this.alpha + ")";
    ctx.shadowColor = this.color + "0.8)";
    ctx.shadowBlur = this.radius * 6;
    ctx.fill();
    ctx.restore();
  };

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    requestAnimationFrame(animate);
  }
  animate();
})();

// --- 2. Dynamic Specular Light Reflection (No Tilt / Flat Card) ---
(function initSpecularTracking() {
  const card = document.getElementById("profileCard");
  if (!card) return;

  // Track light reflection position across card without tilting or rotating
  window.addEventListener("mousemove", (e) => {
    const bounds = card.getBoundingClientRect();
    if (!bounds || bounds.width === 0) return;

    const localX = e.clientX - bounds.left;
    const localY = e.clientY - bounds.top;
    const xPercent = Math.max(0, Math.min(100, (localX / bounds.width) * 100));
    const yPercent = Math.max(0, Math.min(100, (localY / bounds.height) * 100));

    card.style.setProperty("--mouse-x", `${xPercent.toFixed(1)}%`);
    card.style.setProperty("--mouse-y", `${yPercent.toFixed(1)}%`);
  });

  // Close message modal on Escape key
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (typeof closeMessageModal === "function") {
        closeMessageModal();
      }
    }
  });
})();

// --- 3. iOS 27 Segmented Control Tab Switcher ---
function initTabs() {
  const navtabs = document.querySelectorAll(".sliderTab");

  navtabs.forEach((item) => {
    const bgActive = item.querySelector(".bg-active");
    const activeItem = item.querySelector("li.active");

    function syncPill(targetItem) {
      if (!bgActive || !targetItem) return;
      bgActive.style.left = targetItem.offsetLeft + "px";
      bgActive.style.width = targetItem.offsetWidth + "px";
    }

    // Initial position
    if (activeItem) {
      // Delay slightly for font & layout settlement
      setTimeout(() => syncPill(activeItem), 50);
      window.addEventListener("resize", () => {
        const currentActive = item.querySelector("li.active");
        if (currentActive) syncPill(currentActive);
      });
    }

    item.addEventListener("click", function (event) {
      const target = event.target.closest(".nav-item");
      if (!target) return;

      const lastActive = item.querySelector("li.active");
      if (lastActive) lastActive.classList.remove("active");

      target.classList.add("active");
      syncPill(target);

      const targetId = target.dataset.target;
      const lastContentActive = item.querySelector(".tab.active");
      const newContentActive = document.getElementById(targetId);

      if (lastContentActive) lastContentActive.classList.remove("active");
      if (newContentActive) newContentActive.classList.add("active");
    });
  });
}

document.addEventListener("DOMContentLoaded", initTabs);
// In case script runs after DOM is ready:
if (document.readyState === "interactive" || document.readyState === "complete") {
  initTabs();
}
