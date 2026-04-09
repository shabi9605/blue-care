/* ================================================================
   BlueCare — Animations & Interactivity v4
   ================================================================ */

(function () {
    'use strict';

    /* ── SCROLL PROGRESS BAR ── */
    function initScrollProgress() {
        const bar = document.createElement('div');
        bar.id = 'scroll-progress';
        document.body.prepend(bar);
        window.addEventListener('scroll', () => {
            const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            bar.style.width = Math.min(pct, 100) + '%';
        }, { passive: true });
    }

    /* ── CUSTOM CURSOR ── */
    function initCursor() {
        if (window.matchMedia('(pointer: coarse)').matches) return; // skip on touch devices
        const dot   = document.createElement('div');
        const ring  = document.createElement('div');
        dot.id  = 'cursor-dot';
        ring.id = 'cursor-ring';
        document.body.appendChild(dot);
        document.body.appendChild(ring);

        let mx = -100, my = -100, rx = -100, ry = -100;

        window.addEventListener('mousemove', e => {
            mx = e.clientX; my = e.clientY;
            dot.style.transform  = `translate(${mx}px,${my}px)`;
        }, { passive: true });

        // Ring follows with lerp
        (function loop() {
            rx += (mx - rx) * 0.12;
            ry += (my - ry) * 0.12;
            ring.style.transform = `translate(${rx}px,${ry}px)`;
            requestAnimationFrame(loop);
        })();

        // Grow ring on interactive elements (delegated so it works on all elements)
        const hoverSelector = 'a, button, .btn-style, .nav-cta-btn, .grids5-info, .address-grid, .servicecard-single, .feature-card, .service-step-card, input, textarea, select';
        document.addEventListener('mouseover', e => {
            if (e.target.closest(hoverSelector)) ring.classList.add('cursor-hover');
        });
        document.addEventListener('mouseout', e => {
            if (e.target.closest(hoverSelector)) ring.classList.remove('cursor-hover');
        });

        document.addEventListener('mousedown', () => dot.classList.add('cursor-click'));
        document.addEventListener('mouseup',   () => dot.classList.remove('cursor-click'));
    }

    /* ── MOUSE PARALLAX (hero section) ── */
    function initMouseParallax() {
        const hero = document.querySelector('.banner-19');
        if (!hero) return;
        const layers = [
            { el: hero.querySelector('video, .banner-layer'), depth: 0.015 },
            { el: hero.querySelector('.main-content'),        depth: 0.03  },
        ].filter(l => l.el);

        let cx = 0, cy = 0;
        window.addEventListener('mousemove', e => {
            cx = (e.clientX / window.innerWidth  - 0.5);
            cy = (e.clientY / window.innerHeight - 0.5);
        }, { passive: true });

        (function loop() {
            layers.forEach(({ el, depth }) => {
                const tx = cx * depth * window.innerWidth;
                const ty = cy * depth * window.innerHeight;
                el.style.transform = `translate(${tx}px, ${ty}px)`;
            });
            requestAnimationFrame(loop);
        })();
    }

    /* ── MAGNETIC BUTTONS ── */
    function initMagneticBtns() {
        if (window.matchMedia('(pointer: coarse)').matches) return;
        document.querySelectorAll('.btn-style, .nav-cta-btn, .navbar-brand').forEach(btn => {
            btn.addEventListener('mousemove', e => {
                const rect = btn.getBoundingClientRect();
                const cx   = rect.left + rect.width  / 2;
                const cy   = rect.top  + rect.height / 2;
                const dx   = (e.clientX - cx) * 0.28;
                const dy   = (e.clientY - cy) * 0.28;
                btn.style.transform = `translate(${dx}px, ${dy}px) scale(1.04)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    /* ── SCROLL REVEAL (AOS-style) ── */
    function initScrollReveal() {
        const targets = document.querySelectorAll(
            '.grids5-info, .address-grid, .count-master, .testimonial-content,' +
            '.accordion-item, .service-step-card, .feature-card, .abt-style,' +
            '.step-icon-wrapper, .image-box__static, .image-box__float,' +
            'h2.title-style, h3.title-style, .title-w3, .w3l-call-to-action-6,' +
            '.w3l-footer-text-style > *, .nav-item-footer, .phone-sec,' +
            '.footer-top-29 > div'
        );

        const dirs = ['up', 'up', 'left', 'right', 'up'];
        targets.forEach((el, i) => {
            const colIdx = [...(el.parentElement?.children || [])].indexOf(el);
            const dir    = dirs[colIdx % dirs.length] || 'up';
            el.dataset.reveal = dir;
            el.dataset.delay  = String((colIdx % 4) * 100);
            el.classList.add('sr');
        });

        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el    = entry.target;
                const delay = parseInt(el.dataset.delay || '0', 10);
                setTimeout(() => el.classList.add('sr-visible'), delay);
                io.unobserve(el);
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        targets.forEach(el => io.observe(el));
    }

    /* ── COUNTER ANIMATION ── */
    function initCounters() {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting || entry.target.dataset.counted) return;
                entry.target.dataset.counted = '1';
                const el     = entry.target;
                const text   = el.textContent.trim();
                const num    = parseInt(text.replace(/\D/g, ''), 10);
                const suffix = text.replace(/[\d,]/g, '');
                if (!num) return;
                const dur = 1800;
                const t0  = performance.now();
                (function tick(now) {
                    const p = Math.min((now - t0) / dur, 1);
                    const v = Math.floor(num * (1 - Math.pow(1 - p, 3)));
                    el.textContent = v.toLocaleString() + suffix;
                    if (p < 1) requestAnimationFrame(tick);
                    else el.textContent = num.toLocaleString() + suffix;
                })(t0);
                io.unobserve(el);
            });
        }, { threshold: 0.7 });

        document.querySelectorAll('.timer, .counter-number, [data-counter]').forEach(el => io.observe(el));
    }

    /* ── BUTTON RIPPLE ── */
    function initRipple() {
        document.addEventListener('pointerdown', e => {
            const btn = e.target.closest('.btn-style,.btn-outline-style,.nav-cta-btn,.btn-ripple');
            if (!btn) return;
            const r    = document.createElement('span');
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height) * 2;
            r.className = 'ripple-fx';
            r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size/2}px;top:${e.clientY - rect.top - size/2}px`;
            btn.appendChild(r);
            r.addEventListener('animationend', () => r.remove());
        });
    }

    /* ── 3-D CARD TILT ── */
    function initTilt() {
        document.querySelectorAll('.grids5-info, .address-grid, .service-step-card, .feature-card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const { left, top, width, height } = card.getBoundingClientRect();
                const x = ((e.clientX - left) / width  - 0.5) * 14;
                const y = ((e.clientY - top)  / height - 0.5) * 14;
                card.style.transform = `perspective(700px) rotateX(${-y}deg) rotateY(${x}deg) translateY(-6px) scale(1.02)`;
            });
            card.addEventListener('mouseleave', () => { card.style.transform = ''; });
        });
    }

    /* ── SCROLL-DRIVEN PARALLAX ── */
    function initParallax() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const hero = document.querySelector('.banner-19 .banner-layer, .inner-banner');
        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            if (hero) hero.style.backgroundPositionY = `calc(50% + ${y * 0.35}px)`;

            // Parallax on section backgrounds
            document.querySelectorAll('.w3l-call-to-action-6, .grids-one').forEach(sec => {
                const rect = sec.getBoundingClientRect();
                const offset = (rect.top / window.innerHeight) * 20;
                sec.style.backgroundPositionY = `calc(50% + ${offset}px)`;
            });
        }, { passive: true });
    }

    /* ── FLOATING PARTICLES (hero section) ── */
    function initParticles() {
        const hero = document.querySelector('.banner-19');
        if (!hero) return;
        const canvas = document.createElement('canvas');
        canvas.id = 'particle-canvas';
        canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1;opacity:0.35';
        hero.style.position = 'relative';
        hero.prepend(canvas);

        const ctx = canvas.getContext('2d');
        let W, H, dots;

        function resize() {
            W = canvas.width  = hero.offsetWidth;
            H = canvas.height = hero.offsetHeight;
        }
        resize();
        window.addEventListener('resize', resize, { passive: true });

        const N = Math.floor((W * H) / 18000);
        dots = Array.from({ length: N }, () => ({
            x: Math.random() * W, y: Math.random() * H,
            r: Math.random() * 2 + 1,
            vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
        }));

        function draw() {
            ctx.clearRect(0, 0, W, H);
            dots.forEach(d => {
                d.x += d.vx; d.y += d.vy;
                if (d.x < 0) d.x = W; if (d.x > W) d.x = 0;
                if (d.y < 0) d.y = H; if (d.y > H) d.y = 0;
                ctx.beginPath();
                ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255,255,255,0.7)';
                ctx.fill();
            });
            for (let i = 0; i < dots.length; i++) {
                for (let j = i + 1; j < dots.length; j++) {
                    const dx = dots[i].x - dots[j].x, dy = dots[i].y - dots[j].y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(255,255,255,${0.15 * (1 - dist/100)})`;
                        ctx.lineWidth = 0.6;
                        ctx.moveTo(dots[i].x, dots[i].y);
                        ctx.lineTo(dots[j].x, dots[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(draw);
        }
        draw();
    }

    /* ── MOUSE-REACTIVE PARTICLES (follows cursor on hero) ── */
    function initMouseParticles() {
        const hero = document.querySelector('.banner-19');
        if (!hero || window.matchMedia('(pointer: coarse)').matches) return;

        hero.addEventListener('mousemove', e => {
            for (let i = 0; i < 3; i++) {
                const p = document.createElement('span');
                p.className = 'mouse-particle';
                const size = Math.random() * 8 + 4;
                p.style.cssText = `
                    left:${e.clientX - hero.getBoundingClientRect().left}px;
                    top:${e.clientY - hero.getBoundingClientRect().top}px;
                    width:${size}px; height:${size}px;
                    animation-duration:${Math.random() * 0.6 + 0.6}s;
                `;
                hero.appendChild(p);
                p.addEventListener('animationend', () => p.remove());
            }
        }, { passive: true });
    }

    /* ── SCROLL-TRIGGERED SECTION HIGHLIGHT ── */
    function initSectionHighlight() {
        const sections = document.querySelectorAll('section, .grids-one, .w3l-call-to-action-6');
        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                entry.target.classList.toggle('section-active', entry.isIntersecting);
            });
        }, { threshold: 0.15 });
        sections.forEach(s => io.observe(s));
    }

    /* ── STAGGERED LIST REVEAL ── */
    function initListReveal() {
        const lists = document.querySelectorAll('.navbar-nav.ms-auto, .w3l-footer-text-style ul, .breadcrumbs-custom-path');
        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                [...entry.target.children].forEach((child, i) => {
                    setTimeout(() => child.classList.add('list-item-visible'), i * 80);
                });
                io.unobserve(entry.target);
            });
        }, { threshold: 0.2 });
        lists.forEach(l => {
            [...l.children].forEach(child => child.classList.add('list-item-hidden'));
            io.observe(l);
        });
    }

    /* ── SCROLL DIRECTION INDICATOR ── */
    function initScrollIndicator() {
        const hero = document.querySelector('.banner-19 .main-content-top');
        if (!hero) return;
        const ind = document.createElement('div');
        ind.id = 'scroll-indicator';
        ind.innerHTML = '<span></span><span></span><span></span>';
        hero.appendChild(ind);
        window.addEventListener('scroll', () => {
            ind.style.opacity = window.scrollY > 80 ? '0' : '1';
        }, { passive: true });
    }

    /* ── NAVBAR SCROLL EFFECT ── */
    function initNavbar() {
        const header = document.getElementById('site-header');
        if (!header) return;
        window.addEventListener('scroll', () => {
            header.classList.toggle('nav-fixed', window.scrollY > 60);
        }, { passive: true });
    }

    /* ── TYPED TEXT EFFECT (hero subtitle) ── */
    function initTyped() {
        const el = document.querySelector('.hero-subtitle');
        if (!el) return;
        const original = el.textContent;
        const parts = original.split('|').map(s => s.trim()).filter(Boolean);
        if (parts.length < 2) return;
        el.textContent = '';
        let pi = 0, ci = 0, deleting = false;
        function type() {
            const current = parts[pi];
            if (!deleting) {
                el.textContent = current.slice(0, ++ci);
                if (ci === current.length) { deleting = true; return setTimeout(type, 1800); }
            } else {
                el.textContent = current.slice(0, --ci);
                if (ci === 0) { deleting = false; pi = (pi + 1) % parts.length; }
            }
            setTimeout(type, deleting ? 45 : 75);
        }
        setTimeout(type, 900);
    }

    /* ── SMOOTH SECTION LINKS ── */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', e => {
                const id  = a.getAttribute('href').slice(1);
                const tgt = document.getElementById(id);
                if (!tgt) return;
                e.preventDefault();
                tgt.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    }

    /* ── PAGE FADE IN ── */
    function initPageFade() {
        document.body.classList.add('page-ready');
    }

    /* ── INIT ALL ── */
    document.addEventListener('DOMContentLoaded', () => {
        initScrollProgress();
        initCursor();
        initMouseParallax();
        initMagneticBtns();
        initScrollReveal();
        initCounters();
        initRipple();
        initTilt();
        initParallax();
        initParticles();
        initMouseParticles();
        initSectionHighlight();
        initListReveal();
        initScrollIndicator();
        initNavbar();
        initTyped();
        initSmoothScroll();
        initPageFade();
    });

})();
