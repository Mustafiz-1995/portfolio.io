// Active nav link by page
(function(){
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".nav-links a").forEach(a=>{
    if ((a.getAttribute("href")||"").toLowerCase() === path) a.classList.add("active");
  });
})();

// Scroll reveal
const reveals = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting) e.target.classList.add("show");
  });
},{threshold:0.15});
reveals.forEach(el=>io.observe(el));

// Top progress bar
const bar = document.querySelector(".progress");
function updateProgress(){
  const h = document.documentElement;
  const max = h.scrollHeight - h.clientHeight;
  const p = max > 0 ? (h.scrollTop / max) : 0;
  if(bar) bar.style.transform = `scaleX(${p})`;
}
document.addEventListener("scroll", updateProgress, {passive:true});
updateProgress();

// Count-up numbers (data-count)
function countUp(el){
  const target = Number(el.dataset.count || "0");
  let cur = 0;
  const dur = 900;
  const start = performance.now();
  function tick(t){
    const k = Math.min(1,(t-start)/dur);
    cur = Math.floor(target * k);
    el.textContent = cur + (el.dataset.suffix || "");
    if(k<1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const counters = document.querySelectorAll("[data-count]");
const io2 = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting && !e.target.dataset.done){
      e.target.dataset.done="1";
      countUp(e.target);
    }
  });
},{threshold:0.4});
counters.forEach(el=>io2.observe(el));

// Simple tilt on cards
document.querySelectorAll(".tilt").forEach(card=>{
  card.addEventListener("mousemove",(e)=>{
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left)/r.width - 0.5;
    const y = (e.clientY - r.top)/r.height - 0.5;
    card.style.transform = `translateY(-3px) rotateX(${(-y*6).toFixed(2)}deg) rotateY(${(x*6).toFixed(2)}deg)`;
  });
  card.addEventListener("mouseleave",()=>{
    card.style.transform = "";
  });
});

// Footer year
const y = document.getElementById("year");
if(y) y.textContent = new Date().getFullYear();
/* =========================
   1) Page transition on link click
   ========================= */
document.addEventListener("click", (e) => {
  const a = e.target.closest("a");
  if (!a) return;

  const href = a.getAttribute("href");
  if (!href) return;

  // Only internal html pages (your portfolio pages)
  const isInternalPage =
    href.endsWith(".html") &&
    !href.startsWith("http") &&
    !href.startsWith("#") &&
    !href.startsWith("mailto:") &&
    !href.startsWith("tel:");

  if (!isInternalPage) return;

  e.preventDefault();
  document.body.classList.add("page-leave");

  setTimeout(() => {
    window.location.href = href;
  }, 220);
});

/* =========================
   2) Scroll reveal animation
   ========================= */
const revealItems = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("active");
    });
  },
  { threshold: 0.12 }
);

revealItems.forEach((el) => revealObserver.observe(el));
