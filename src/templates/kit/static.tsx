import type { CSSProperties } from "react";
import type { MotionKit, ParallaxProps, RevealProps } from "../types";

/**
 * Framework-free motion for exported sites. Elements are tagged here and
 * animated by `STATIC_MOTION_SCRIPT` / `STATIC_MOTION_CSS`, which mirror the
 * live Framer Motion kit: 16px fade-up reveals and a light hero parallax.
 */
function Reveal({ children, className, delay = 0 }: RevealProps) {
  const style = delay ? ({ "--sf-delay": `${delay}s` } as CSSProperties) : undefined;
  return (
    <div className={className} data-sf-reveal="" style={style}>
      {children}
    </div>
  );
}

function Parallax({ children, className, distance = 40 }: ParallaxProps) {
  return (
    <div className={className} data-sf-parallax={distance}>
      {children}
    </div>
  );
}

export const staticKit: MotionKit = { Reveal, Parallax };

export const STATIC_MOTION_CSS = `
[data-sf-reveal]{opacity:0;transform:translateY(16px);transition:opacity .6s cubic-bezier(.22,1,.36,1) var(--sf-delay,0s),transform .6s cubic-bezier(.22,1,.36,1) var(--sf-delay,0s)}
[data-sf-reveal].sf-in{opacity:1;transform:none}
[data-sf-parallax]{will-change:transform}
@media (prefers-reduced-motion:reduce){[data-sf-reveal]{opacity:1;transform:none;transition:none}[data-sf-parallax]{transform:none!important}}
`.trim();

export const STATIC_MOTION_SCRIPT = `
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var reveals = document.querySelectorAll('[data-sf-reveal]');
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function(el){ el.classList.add('sf-in'); });
    return;
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if (e.isIntersecting) { e.target.classList.add('sf-in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -10% 0px' });
  reveals.forEach(function(el){ io.observe(el); });
  var layers = document.querySelectorAll('[data-sf-parallax]');
  var ticking = false;
  function update(){
    var vh = window.innerHeight;
    layers.forEach(function(el){
      var r = el.getBoundingClientRect();
      var progress = (vh - r.top) / (vh + r.height);
      var d = Number(el.getAttribute('data-sf-parallax')) || 40;
      el.style.transform = 'translate3d(0,' + ((0.5 - Math.min(Math.max(progress, 0), 1)) * d).toFixed(1) + 'px,0)';
    });
    ticking = false;
  }
  window.addEventListener('scroll', function(){ if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
})();
`.trim();
