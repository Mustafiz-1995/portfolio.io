const slides = Array.from(document.querySelectorAll(".slide"));
const pageNo = document.getElementById("pageNo");
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");
const btnMenu = document.getElementById("btnMenu");
const menuGrid = document.getElementById("menuGrid");

let current = 0; // slide index

function pad2(n){ return String(n).padStart(2, "0"); }

function updatePageNo(){
  const total = slides.length;
  pageNo.textContent = `${pad2(current+1)} / ${pad2(total)}`;
}

function buildMenu(){
  // Menu from slide titles (skip Home itself)
  const items = slides.map((s, idx) => ({ idx, title: s.dataset.title || `Slide ${idx+1}` }));
  const menuItems = items.filter(x => x.idx !== 0);

  menuGrid.innerHTML = "";
  menuItems.forEach(x => {
    const b = document.createElement("button");
    b.className = "menu-btn";
    b.innerHTML = `<div style="font-weight:700">${x.title}</div><div class="muted small">Go to page ${pad2(x.idx+1)}</div>`;
    b.addEventListener("click", () => goTo(x.idx));
    menuGrid.appendChild(b);
  });
}

function goTo(idx){
  if (idx < 0 || idx >= slides.length || idx === current) return;

  const oldSlide = slides[current];
  const newSlide = slides[idx];

  // Leave animation
  oldSlide.classList.remove("enter");
  oldSlide.classList.add("leave");

  // After leave, switch
  setTimeout(() => {
    oldSlide.classList.remove("active", "leave");

    current = idx;

    newSlide.classList.add("active", "enter");
    setTimeout(() => newSlide.classList.remove("enter"), 950);

    updatePageNo();
    // keep URL hash for direct jump
    location.hash = `#p${current+1}`;
  }, 920);
}

function next(){ goTo(current + 1); }
function prev(){ goTo(current - 1); }
function menu(){ goTo(0); }

btnNext.addEventListener("click", next);
btnPrev.addEventListener("click", prev);
btnMenu.addEventListener("click", menu);

// Keyboard navigation
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") next();
  if (e.key === "ArrowLeft") prev();
  if (e.key.toLowerCase() === "m") menu();
});

// Swipe (mobile)
let startX = 0;
window.addEventListener("touchstart", e => { startX = e.touches[0].clientX; }, {passive:true});
window.addEventListener("touchend", e => {
  const endX = e.changedTouches[0].clientX;
  const dx = endX - startX;
  if (Math.abs(dx) > 50){
    if (dx < 0) next();
    else prev();
  }
}, {passive:true});

// Direct open by hash (example: #p5)
function initFromHash(){
  const h = location.hash || "";
  const m = h.match(/^#p(\d+)$/);
  if (!m) return;
  const p = parseInt(m[1], 10);
  if (!Number.isFinite(p)) return;
  const idx = p - 1;
  // jump without animation on load
  slides[current].classList.remove("active");
  current = Math.max(0, Math.min(slides.length - 1, idx));
  slides[current].classList.add("active");
  updatePageNo();
}

buildMenu();
updatePageNo();
initFromHash();
