/**
 * assets/js/script.js — DJANGUI V3 PREMIUM VISUAL EXPERIENCE
 * ============================================================================
 * 1. Bascule Mode Clair <-> Mode Sombre (avec synchronisation 3D)
 * 2. Animation fluide à la Connexion, Création/Adhésion et Déconnexion
 * 3. Copie en 1 clic du code d'invitation
 * 4. Moteur des 10 catégories de Scroll Animations (IntersectionObserver + rAF) :
 *    Fade In Up, Fade In Left, Fade In Right, Scale Reveal, Blur Reveal,
 *    Stagger Animation, Parallax Scrolling, Sticky Reveal, Number Counter, 3D Tilt Reveal
 * 5. Micro-interactions FinTech : Hover 3D, Reflets curseur, Onglets, Tableaux
 * 6. Moteur 3D Immersif Djangui (Three.js WebGL + Fallback 3D Canvas 2D hors-ligne) :
 *    Pièces 3D FCFA, Anneaux financiers, Cercle de solidarité Tontine & Cagnotte
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', function () {
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // =========================================================================
    // 0. BARRE DE PROGRESSION DE DÉFILEMENT EN HAUT DE PAGE
    // =========================================================================
    if (!document.querySelector('.dj-scroll-progress-bar')) {
        const progressBar = document.createElement('div');
        progressBar.className = 'dj-scroll-progress-bar';
        document.body.prepend(progressBar);

        function updateScrollProgress() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
            progressBar.style.width = pct + '%';
        }
        window.addEventListener('scroll', updateScrollProgress, { passive: true });
        updateScrollProgress();
    }

    // =========================================================================
    // 1. BASCULE MODE CLAIR / MODE SOMBRE
    // =========================================================================
    const boutonsTheme = document.querySelectorAll('.js-theme-toggle');

    function majApparenceBoutons(theme) {
        boutonsTheme.forEach(function (btn) {
            const icone = btn.querySelector('.js-theme-icon');
            const texte = btn.querySelector('.js-theme-label');
            if (theme === 'dark') {
                if (icone) icone.className = 'bi bi-sun-fill text-warning js-theme-icon';
                if (texte) texte.textContent = 'Mode Clair';
            } else {
                if (icone) icone.className = 'bi bi-moon-stars-fill text-info js-theme-icon';
                if (texte) texte.textContent = 'Mode Sombre';
            }
        });
    }

    const themeActuel = document.documentElement.getAttribute('data-theme') || 'light';
    majApparenceBoutons(themeActuel);

    boutonsTheme.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const courant = document.documentElement.getAttribute('data-theme') || 'light';
            const suivant = courant === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', suivant);
            document.documentElement.setAttribute('data-bs-theme', suivant);
            localStorage.setItem('djangui_theme', suivant);
            majApparenceBoutons(suivant);
            window.dispatchEvent(new CustomEvent('djangui:themechange', { detail: { theme: suivant } }));
        });
    });

    // =========================================================================
    // 2. ANIMATION CONNEXION / DÉCONNEXION (SPINNER 3D + BARRE DE CHARGEMENT)
    // =========================================================================
    if (!document.getElementById('djanguiLoaderStyle')) {
        const styleTag = document.createElement('style');
        styleTag.id = 'djanguiLoaderStyle';
        styleTag.textContent = `
            .djangui-loader-overlay {
                position: fixed;
                inset: 0;
                z-index: 99999;
                background: rgba(5, 9, 20, 0.86);
                backdrop-filter: blur(16px);
                -webkit-backdrop-filter: blur(16px);
                display: none;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 1.5rem;
                text-align: center;
                perspective: 1000px;
            }
            [data-theme="light"] .djangui-loader-overlay {
                background: rgba(238, 243, 249, 0.88);
            }
            .djangui-loader-overlay.active {
                display: flex !important;
            }
            .djangui-loader-card {
                background: var(--dj-bg-surface-solid, #ffffff);
                color: var(--dj-text-main, #0f172a);
                border: 1px solid var(--dj-border-strong, rgba(37,99,235,0.28));
                border-radius: 1.5rem;
                padding: 2.3rem 2rem;
                max-width: 400px;
                width: 100%;
                box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.45);
                animation: djLoaderCardIn 0.35s cubic-bezier(0.22, 1, 0.36, 1);
            }
            @keyframes djLoaderCardIn {
                from { opacity: 0; transform: translateY(18px) rotateX(10deg) scale(0.95); }
                to { opacity: 1; transform: translateY(0) rotateX(0) scale(1); }
            }
            .djangui-spinner-wrapper {
                position: relative;
                width: 86px;
                height: 86px;
                margin: 0 auto 1.25rem auto;
                display: flex;
                align-items: center;
                justify-content: center;
                transform-style: preserve-3d;
            }
            .djangui-spinner-ring {
                position: absolute;
                inset: 0;
                border-radius: 50%;
                border: 4px solid rgba(37, 99, 235, 0.16);
                border-top-color: #2563eb;
                border-right-color: #10b981;
                animation: djSpin 0.85s linear infinite;
            }
            .djangui-spinner-ring-inner {
                position: absolute;
                inset: 11px;
                border-radius: 50%;
                border: 3px dashed rgba(212, 175, 55, 0.65);
                animation: djSpinRev 1.5s linear infinite;
            }
            .djangui-spinner-icon {
                font-size: 2rem;
            }
            .djangui-progress-track {
                width: 100%;
                height: 8px;
                background: rgba(148, 163, 184, 0.22);
                border-radius: 999px;
                overflow: hidden;
                margin-top: 1.25rem;
            }
            .djangui-progress-fill {
                width: 0%;
                height: 100%;
                border-radius: 999px;
                background: linear-gradient(90deg, #2563eb 0%, #10b981 60%, #d4af37 100%);
                transition: width 1.4s cubic-bezier(0.22, 1, 0.36, 1);
            }
            @keyframes djSpin { to { transform: rotate(360deg); } }
            @keyframes djSpinRev { to { transform: rotate(-360deg); } }
        `;
        document.head.appendChild(styleTag);
    }

    const loaderHTML = `
        <div id="djanguiAuthLoader" class="djangui-loader-overlay">
            <div class="djangui-loader-card">
                <div class="djangui-spinner-wrapper">
                    <div class="djangui-spinner-ring"></div>
                    <div class="djangui-spinner-ring-inner"></div>
                    <i id="djanguiLoaderIcon" class="bi bi-safe2-fill text-primary djangui-spinner-icon"></i>
                </div>
                <h5 id="djanguiLoaderTitle" class="fw-bold mb-1">Connexion sécurisée...</h5>
                <p id="djanguiLoaderSubtitle" class="text-muted small mb-0">
                    Vérification de vos identifiants et ouverture de votre espace
                </p>
                <div class="djangui-progress-track">
                    <div id="djanguiLoaderBar" class="djangui-progress-fill"></div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', loaderHTML);

    const loaderOverlay  = document.getElementById('djanguiAuthLoader');
    const loaderTitle    = document.getElementById('djanguiLoaderTitle');
    const loaderSubtitle = document.getElementById('djanguiLoaderSubtitle');
    const loaderIcon     = document.getElementById('djanguiLoaderIcon');
    const loaderBar      = document.getElementById('djanguiLoaderBar');

    function lancerAnimationEtContinuer(titre, sousTitre, iconeClass, actionFinale) {
        loaderTitle.textContent = titre;
        loaderSubtitle.textContent = sousTitre;
        loaderIcon.className = 'bi ' + iconeClass + ' djangui-spinner-icon';

        loaderBar.style.transition = 'none';
        loaderBar.style.width = '0%';
        loaderOverlay.classList.add('active');

        setTimeout(function () {
            loaderBar.style.transition = 'width 1.35s cubic-bezier(0.22, 1, 0.36, 1)';
            loaderBar.style.width = '100%';
        }, 30);

        setTimeout(function () {
            actionFinale();
        }, 1450);
    }

    // A. Déconnexion : tous les liens pointant vers logout
    document.querySelectorAll('a[href*="logout"]').forEach(function (lien) {
        lien.addEventListener('click', function (e) {
            e.preventDefault();
            const destination = this.href;
            lancerAnimationEtContinuer(
                'Déconnexion en cours...',
                'Fermeture sécurisée de votre session Djangui',
                'bi-power text-danger',
                function () {
                    window.location.href = destination;
                }
            );
        });
    });

    // B. Connexion, Création et Adhésion tontine : interception des formulaires POST
    document.querySelectorAll('form').forEach(function (form) {
        const actionAttr = (form.getAttribute('action') || '').toLowerCase();
        const urlActuelle = window.location.pathname.toLowerCase();

        const estFormAuth =
            actionAttr.includes('login') ||
            actionAttr.includes('register-tontine') ||
            actionAttr.includes('join-tontine') ||
            urlActuelle.includes('login') ||
            urlActuelle.includes('register-tontine') ||
            urlActuelle.includes('join-tontine');

        if (estFormAuth && (form.method || '').toUpperCase() === 'POST') {
            form.addEventListener('submit', function (e) {
                if (form.dataset.djanguiSubmitting === '1') {
                    return;
                }

                const champsVides = Array.from(form.querySelectorAll('[required]')).some(function (champ) {
                    return champ.value.trim() === '';
                });
                if (champsVides) {
                    return;
                }

                e.preventDefault();
                form.dataset.djanguiSubmitting = '1';

                if (e.submitter && e.submitter.name) {
                    const hidden = document.createElement('input');
                    hidden.type = 'hidden';
                    hidden.name = e.submitter.name;
                    hidden.value = e.submitter.value;
                    form.appendChild(hidden);
                }

                let titre = 'Connexion à votre compte...';
                let sousTitre = 'Vérification de vos accès et chargement de votre tontine';
                let icone = 'bi-shield-lock-fill text-primary';

                if (actionAttr.includes('register') || urlActuelle.includes('register')) {
                    titre = 'Création de votre tontine...';
                    sousTitre = 'Initialisation de votre groupe et des 2 mois d\'essai gratuit';
                    icone = 'bi-rocket-takeoff-fill text-success';
                } else if (actionAttr.includes('join') || urlActuelle.includes('join')) {
                    titre = 'Adhésion à la tontine...';
                    sousTitre = 'Validation du code d\'invitation et création de votre espace membre';
                    icone = 'bi-person-check-fill text-primary';
                }

                lancerAnimationEtContinuer(titre, sousTitre, icone, function () {
                    HTMLFormElement.prototype.submit.call(form);
                });
            });
        }
    });

    // =========================================================================
    // 3. MOTEUR DES 10 CATÉGORIES DE SCROLL ANIMATIONS
    // =========================================================================
    // Auto-enrichissement intelligent des composants existants qui n'ont pas encore d'attribut data-dj-reveal
    function autoTagScrollAnimations() {
        // Stepper 4 étapes -> Stagger + Scale Reveal
        document.querySelectorAll('.stepper-djangui .step-item').forEach(function (el, idx) {
            if (!el.hasAttribute('data-dj-reveal')) {
                el.setAttribute('data-dj-reveal', 'scale');
                el.style.setProperty('--dj-stagger-delay', (idx * 85) + 'ms');
            }
        });

        // En-têtes de pages
        document.querySelectorAll('.page-header-dark .container > *').forEach(function (el, idx) {
            if (!el.hasAttribute('data-dj-reveal')) {
                el.setAttribute('data-dj-reveal', 'blur');
                el.style.setProperty('--dj-stagger-delay', (idx * 90) + 'ms');
            }
        });

        // Grilles de cartes (KPI, étapes, colonnes) -> Alternance harmonieuse (tilt-3d, fade-left, fade-right, fade-up)
        document.querySelectorAll('.row').forEach(function (row) {
            const cols = Array.from(row.children).filter(function (c) {
                return c.className && c.className.includes('col');
            });
            cols.forEach(function (col, idx) {
                const card = col.querySelector(':scope > .card-djangui, :scope > .card-accent-djangui');
                if (card && !card.hasAttribute('data-dj-reveal') && !card.closest('.modal')) {
                    if (cols.length === 2) {
                        card.setAttribute('data-dj-reveal', idx === 0 ? 'fade-left' : 'fade-right');
                    } else if (cols.length >= 3) {
                        card.setAttribute('data-dj-reveal', 'tilt-3d');
                    } else {
                        card.setAttribute('data-dj-reveal', 'fade-up');
                    }
                    card.style.setProperty('--dj-stagger-delay', Math.min(idx * 95, 380) + 'ms');
                }
            });
        });

        // Cartes autonomes hors grilles
        document.querySelectorAll('.card-djangui, .card-accent-djangui').forEach(function (card) {
            if (!card.hasAttribute('data-dj-reveal') && !card.closest('.modal')) {
                card.setAttribute('data-dj-reveal', 'fade-up');
            }
        });

        // Conteneurs Stagger explicites
        document.querySelectorAll('[data-dj-stagger]').forEach(function (container) {
            const stepMs = parseInt(container.getAttribute('data-dj-stagger') || '90', 10);
            Array.from(container.children).forEach(function (child, i) {
                if (!child.hasAttribute('data-dj-reveal')) {
                    child.setAttribute('data-dj-reveal', 'fade-up');
                }
                child.style.setProperty('--dj-stagger-delay', (i * stepMs) + 'ms');
            });
        });
    }

    autoTagScrollAnimations();

    // Observation des éléments à révéler au scroll
    const revealElements = document.querySelectorAll('[data-dj-reveal]');
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        revealElements.forEach(function (el) {
            el.classList.add('is-revealed');
        });
    } else {
        const revealObserver = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -32px 0px'
        });

        revealElements.forEach(function (el) {
            revealObserver.observe(el);
        });
    }

    // =========================================================================
    // 4. COMPTEURS NUMÉRIQUES PROGRESSIFS (NUMBER COUNTER ANIMATION)
    // =========================================================================
    function initNumberCounters() {
        // Détection automatique des montants FCFA, pourcentages et compteurs clés dans les cartes KPI
        const candidateSelectors = [
            '[data-dj-counter]',
            '.dj-stat-counter'
        ];
        const elements = document.querySelectorAll(candidateSelectors.join(','));

        function animateCounterElement(el) {
            if (el.dataset.djCounterDone === '1') return;
            const rawText = (el.textContent || '').trim();

            // Ne pas animer les textes contenant plusieurs "/" (ex: dates ou "1 / 4") sauf si c'est un montant FCFA ou % simple
            if (rawText.includes('/') && !rawText.includes('FCFA')) return;

            // Extraction d'un nombre type "150 000 FCFA", "2 000 FCFA", "75 %", "Tour n°3"
            const match = rawText.match(/^([^\d-]*?)(\d[\d\s\u00A0.,]*)(.*)$/);
            if (!match) return;

            const prefix = match[1] || '';
            const numPart = (match[2] || '').replace(/[\s\u00A0]/g, '').replace(',', '.');
            const suffix = match[3] || '';
            const targetVal = parseFloat(numPart);

            if (isNaN(targetVal) || targetVal <= 0 || targetVal > 999999999) return;
            el.dataset.djCounterDone = '1';
            el.classList.add('dj-tabular-nums');

            if (prefersReducedMotion) return;

            const hasDecimals = numPart.includes('.');
            const duration = 1150;
            const startTime = performance.now();

            function formatFrenchNumber(val) {
                if (hasDecimals) {
                    return val.toFixed(1).replace('.', ',');
                }
                return Math.round(val).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
            }

            function step(now) {
                const elapsed = now - startTime;
                const progress = Math.min(1, elapsed / duration);
                // EaseOutExpo pour un ralentissement très naturel en fin de course
                const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                const current = targetVal * eased;

                el.textContent = prefix + formatFrenchNumber(current) + suffix;
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    el.textContent = rawText;
                }
            }
            requestAnimationFrame(step);
        }

        if ('IntersectionObserver' in window && !prefersReducedMotion) {
            const counterObserver = new IntersectionObserver(function (entries, obs) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateCounterElement(entry.target);
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.25 });

            elements.forEach(function (el) {
                counterObserver.observe(el);
            });
        }
    }

    initNumberCounters();

    // =========================================================================
    // 5. PARALLAX SCROLLING & STICKY REVEAL NARRATION
    // =========================================================================
    const parallaxNodes = document.querySelectorAll('[data-dj-parallax]');
    const stickySteps = document.querySelectorAll('[data-dj-sticky-step]');

    if (!prefersReducedMotion && (parallaxNodes.length > 0 || stickySteps.length > 0)) {
        let ticking = false;

        function updateScrollEffects() {
            const viewportCenter = window.innerHeight / 2;

            parallaxNodes.forEach(function (node) {
                const speed = parseFloat(node.getAttribute('data-dj-parallax') || '0.12');
                const rect = node.getBoundingClientRect();
                const nodeCenter = rect.top + rect.height / 2;
                const delta = (viewportCenter - nodeCenter) * speed;
                node.style.transform = 'translate3d(0, ' + delta.toFixed(1) + 'px, 0)';
            });

            if (stickySteps.length > 0) {
                let activePhase = 1;
                stickySteps.forEach(function (stepEl) {
                    const r = stepEl.getBoundingClientRect();
                    if (r.top < window.innerHeight * 0.62) {
                        activePhase = parseInt(stepEl.getAttribute('data-dj-sticky-step') || '1', 10);
                    }
                });
                window.djanguiActiveSolidarityPhase = activePhase;
                document.querySelectorAll('[data-dj-phase-indicator]').forEach(function (badge) {
                    const bPhase = parseInt(badge.getAttribute('data-dj-phase-indicator') || '1', 10);
                    badge.classList.toggle('active', bPhase === activePhase);
                });
            }

            ticking = false;
        }

        window.addEventListener('scroll', function () {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        }, { passive: true });
    }

    // =========================================================================
    // 6. HOVER 3D TILT & REFLET LUMINEUX DYNAMIQUE SUR LES CARTES
    // =========================================================================
    const canHoverDesktop = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (canHoverDesktop && !prefersReducedMotion) {
        const interactiveCards = document.querySelectorAll('.card-djangui, .card-accent-djangui, .js-tilt-3d');

        interactiveCards.forEach(function (card) {
            // Éviter le tilt 3D sur les grandes cartes contenant des tableaux larges ou des formulaires complexes pour garder un confort de saisie optimal
            const hasLargeTable = card.querySelector('table') !== null;
            const isInsideModal = card.closest('.modal') !== null;
            const maxTiltDeg = (hasLargeTable || isInsideModal) ? 0 : 4.2;

            card.addEventListener('mousemove', function (e) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                card.style.setProperty('--mouse-x', x.toFixed(0) + 'px');
                card.style.setProperty('--mouse-y', y.toFixed(0) + 'px');

                if (maxTiltDeg > 0 && card.classList.contains('hover-lift')) {
                    const pctX = (x / rect.width) - 0.5;
                    const pctY = (y / rect.height) - 0.5;
                    const rotX = (-pctY * maxTiltDeg * 2).toFixed(2);
                    const rotY = (pctX * maxTiltDeg * 2).toFixed(2);
                    card.style.transform = 'perspective(1100px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) translateY(-5px)';
                }
            });

            card.addEventListener('mouseleave', function () {
                if (maxTiltDeg > 0 && card.classList.contains('hover-lift')) {
                    card.style.transform = '';
                }
            });
        });
    }

    // =========================================================================
    // 7. ANIMATIONS LORS DU CHANGEMENT D'ONGLETS (RE-TRIGGER COMPTEURS & BARRES)
    // =========================================================================
    document.querySelectorAll('[data-bs-toggle="pill"], [data-bs-toggle="tab"]').forEach(function (tabBtn) {
        tabBtn.addEventListener('shown.bs.tab', function (e) {
            const targetSelector = e.target.getAttribute('data-bs-target');
            if (!targetSelector) return;
            const pane = document.querySelector(targetSelector);
            if (!pane) return;

            pane.querySelectorAll('[data-dj-reveal]').forEach(function (el) {
                el.classList.add('is-revealed');
            });
        });
    });

    // =========================================================================
    // 8. MOTEUR 3D DJANGUI (THREE.JS WEBGL + FALLBACK 3D CANVAS 2D HORS-LIGNE)
    // =========================================================================
    initDjangui3DScenes(prefersReducedMotion);
});

/**
 * Initialise toutes les compositions 3D Djangui présentes sur la page.
 * - Utilise Three.js (WebGL) lorsqu'il est chargé et supporté par la carte graphique.
 * - Bascule automatiquement sur un moteur de projection 3D Canvas 2D natif si WebGL ou le CDN Three.js est indisponible (ex: XAMPP hors connexion).
 * - Met automatiquement en pause le rendu 3D lorsqu'une scène sort de l'écran (IntersectionObserver).
 */
function initDjangui3DScenes(prefersReducedMotion) {
    const containers = document.querySelectorAll('[data-dj-3d-scene]');
    if (containers.length === 0) return;

    function isWebGLAvailable() {
        try {
            const c = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }

    const useThreeWebGL = (typeof window.THREE !== 'undefined') && isWebGLAvailable();

    containers.forEach(function (container) {
        const sceneType = container.getAttribute('data-dj-3d-scene') || 'hero-tontine';
        if (useThreeWebGL) {
            mountThreeScene(container, sceneType, prefersReducedMotion);
        } else {
            mountFallback3DCanvas(container, sceneType, prefersReducedMotion);
        }
    });
}

/**
 * SCÈNE THREE.JS WEBGL HAUTE QUALITÉ :
 * - 'hero-tontine' : Cagnotte centrale dorée/émeraude, anneaux financiers orbitaux, pièces 3D FCFA & cercle de solidarité des membres
 * - 'solidarity-cycle' : Composition 3D narrative illustrant les 4 étapes de la tontine
 * - 'pot-orb' : Jeton 3D FCFA & anneau de progression pour le tableau de bord
 * - 'auth-vault' : Coffre géométrique 3D & anneaux de sécurité pour les pages de connexion/inscription
 */
function mountThreeScene(container, sceneType, prefersReducedMotion) {
    const THREE = window.THREE;
    let width = container.clientWidth || 320;
    let height = container.clientHeight || 280;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / Math.max(height, 1), 0.1, 100);
    camera.position.set(0, 0.4, sceneType === 'pot-orb' ? 5.2 : 7.4);

    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch (err) {
        mountFallback3DCanvas(container, sceneType, prefersReducedMotion);
        return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Éclairage FinTech (Bleu nuit, Émeraude & Or chaud)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.78);
    scene.add(ambientLight);

    const dirLightGold = new THREE.DirectionalLight(0xfbbf24, 1.35);
    dirLightGold.position.set(5, 6, 5);
    scene.add(dirLightGold);

    const pointLightEmerald = new THREE.PointLight(0x10b981, 1.6, 18);
    pointLightEmerald.position.set(-4, -3, 4);
    scene.add(pointLightEmerald);

    const pointLightBlue = new THREE.PointLight(0x3b82f6, 1.4, 18);
    pointLightBlue.position.set(0, 4, -4);
    scene.add(pointLightBlue);

    // Matériaux partagés
    const matGold = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        metalness: 0.78,
        roughness: 0.22
    });
    const matEmerald = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        metalness: 0.45,
        roughness: 0.25
    });
    const matNavyGlass = new THREE.MeshStandardMaterial({
        color: 0x1e3a8a,
        metalness: 0.35,
        roughness: 0.18,
        transparent: true,
        opacity: 0.86
    });
    const matWireEmerald = new THREE.MeshBasicMaterial({
        color: 0x34d399,
        wireframe: true,
        transparent: true,
        opacity: 0.28
    });

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const coins = [];
    const memberNodes = [];
    const rings = [];

    // Fonction utilitaire pour créer une Pièce 3D Djangui (Jeton FCFA avec tranche et cœur)
    function create3DCoin(radius, thickness) {
        const coinGroup = new THREE.Group();
        const cylGeo = new THREE.CylinderGeometry(radius, radius, thickness, 28);
        const cylMesh = new THREE.Mesh(cylGeo, matGold);
        cylMesh.rotation.x = Math.PI / 2;
        coinGroup.add(cylMesh);

        const rimGeo = new THREE.TorusGeometry(radius * 0.78, thickness * 0.28, 12, 28);
        const rimMesh = new THREE.Mesh(rimGeo, matEmerald);
        coinGroup.add(rimMesh);
        return coinGroup;
    }

    if (sceneType === 'hero-tontine' || sceneType === 'solidarity-cycle') {
        // 1. Noyau central : La Cagnotte / Le Pot de la Tontine (Dodécaèdre facetté + sphère émeraude)
        const coreGeo = new THREE.IcosahedronGeometry(1.05, 1);
        const coreMesh = new THREE.Mesh(coreGeo, matEmerald);
        rootGroup.add(coreMesh);

        const wireGeo = new THREE.IcosahedronGeometry(1.26, 1);
        const wireMesh = new THREE.Mesh(wireGeo, matWireEmerald);
        rootGroup.add(wireMesh);

        // 2. Anneaux financiers orbitaux
        const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.045, 16, 80), matGold);
        ring1.rotation.x = Math.PI / 2.6;
        rootGroup.add(ring1);
        rings.push(ring1);

        const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.65, 0.032, 16, 80), matEmerald);
        ring2.rotation.x = -Math.PI / 3.2;
        ring2.rotation.y = Math.PI / 5;
        rootGroup.add(ring2);
        rings.push(ring2);

        // 3. Cercle de solidarité : 8 sphères représentant les membres réunis autour du pot
        const nbMembers = 8;
        const memberGeo = new THREE.SphereGeometry(0.22, 20, 20);
        for (let i = 0; i < nbMembers; i++) {
            const angle = (i / nbMembers) * Math.PI * 2;
            const node = new THREE.Mesh(memberGeo, i % 2 === 0 ? matGold : matNavyGlass);
            node.position.set(Math.cos(angle) * 2.1, Math.sin(angle) * 2.1 * 0.45, Math.sin(angle) * 1.4);
            node.userData = { baseAngle: angle, radius: 2.15, speed: 0.35 };
            rootGroup.add(node);
            memberNodes.push(node);
        }

        // 4. Pièces de cotisation 3D flottantes
        for (let c = 0; c < 5; c++) {
            const coin = create3DCoin(0.38, 0.1);
            const a = (c / 5) * Math.PI * 2 + 0.4;
            coin.position.set(Math.cos(a) * 2.85, Math.sin(a * 2) * 0.9, Math.sin(a) * 1.6);
            coin.userData = { angle: a, dist: 2.75 + (c % 2) * 0.35, rotSpeed: 0.8 + c * 0.15, yOffset: c * 1.1 };
            rootGroup.add(coin);
            coins.push(coin);
        }
    } else if (sceneType === 'pot-orb') {
        // Pile de pièces 3D + Anneau de séance pour le Dashboard / En-têtes internes
        for (let i = 0; i < 4; i++) {
            const coin = create3DCoin(0.72, 0.16);
            coin.rotation.x = 0.35;
            coin.position.y = (i - 1.5) * 0.24;
            coin.userData = { angle: i * 0.5, dist: 0, rotSpeed: 0.6, yOffset: i, isStack: true, baseY: coin.position.y };
            rootGroup.add(coin);
            coins.push(coin);
        }
        const orbitRing = new THREE.Mesh(new THREE.TorusGeometry(1.42, 0.055, 16, 64), matEmerald);
        orbitRing.rotation.x = Math.PI / 2.8;
        rootGroup.add(orbitRing);
        rings.push(orbitRing);
    } else {
        // 'auth-vault' : Bouclier / Coffre géométrique 3D + Anneau doré
        const vaultCore = new THREE.Mesh(new THREE.OctahedronGeometry(1.15, 0), matNavyGlass);
        rootGroup.add(vaultCore);
        const vaultWire = new THREE.Mesh(new THREE.IcosahedronGeometry(1.45, 1), matWireEmerald);
        rootGroup.add(vaultWire);

        const goldRing = new THREE.Mesh(new THREE.TorusGeometry(1.95, 0.045, 16, 72), matGold);
        goldRing.rotation.x = Math.PI / 3;
        rootGroup.add(goldRing);
        rings.push(goldRing);

        for (let c = 0; c < 3; c++) {
            const coin = create3DCoin(0.32, 0.09);
            const a = (c / 3) * Math.PI * 2;
            coin.userData = { angle: a, dist: 2.35, rotSpeed: 0.9, yOffset: c * 2 };
            rootGroup.add(coin);
            coins.push(coin);
        }
    }

    // Interaction douce avec le curseur
    let targetRotX = 0;
    let targetRotY = 0;

    window.addEventListener('mousemove', function (e) {
        const nx = (e.clientX / Math.max(window.innerWidth, 1)) * 2 - 1;
        const ny = (e.clientY / Math.max(window.innerHeight, 1)) * 2 - 1;
        targetRotY = nx * 0.38;
        targetRotX = ny * 0.22;
    }, { passive: true });

    let isVisible = true;
    let rafId = null;

    function renderFrame(timeMs) {
        const t = (timeMs || 0) * 0.001;

        rootGroup.rotation.y += ((t * 0.28 + targetRotY) - rootGroup.rotation.y) * 0.06;
        rootGroup.rotation.x += ((targetRotX) - rootGroup.rotation.x) * 0.06;

        rings.forEach(function (r, idx) {
            r.rotation.z = t * (idx % 2 === 0 ? 0.45 : -0.35);
        });

        memberNodes.forEach(function (node, idx) {
            const a = node.userData.baseAngle + t * node.userData.speed;
            const pulse = (window.djanguiActiveSolidarityPhase === 4) ? 1.45 : node.userData.radius;
            node.position.x = Math.cos(a) * pulse;
            node.position.z = Math.sin(a) * (pulse * 0.72);
            node.position.y = Math.sin(a * 2 + idx) * 0.45;
        });

        coins.forEach(function (coin, idx) {
            if (coin.userData.isStack) {
                coin.rotation.y = t * 0.8 + idx * 0.35;
                coin.position.y = coin.userData.baseY + Math.sin(t * 2.2 + idx * 0.6) * 0.06;
            } else {
                const a = coin.userData.angle + t * 0.32;
                coin.position.x = Math.cos(a) * coin.userData.dist;
                coin.position.z = Math.sin(a) * (coin.userData.dist * 0.65);
                coin.position.y = Math.sin(t * 1.4 + coin.userData.yOffset) * 0.65;
                coin.rotation.y = t * coin.userData.rotSpeed;
                coin.rotation.x = t * 0.5;
            }
        });

        renderer.render(scene, camera);

        if (isVisible && !prefersReducedMotion && !document.hidden) {
            rafId = requestAnimationFrame(renderFrame);
        } else {
            rafId = null;
        }
    }

    function startLoop() {
        if (!rafId && isVisible && !prefersReducedMotion && !document.hidden) {
            rafId = requestAnimationFrame(renderFrame);
        }
    }

    // Rendu initial
    renderFrame(0);

    // Pause automatique lorsque la scène 3D n'est pas visible à l'écran
    if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                isVisible = entry.isIntersecting;
                if (isVisible) {
                    startLoop();
                } else if (rafId) {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                }
            });
        }, { threshold: 0.02 });
        obs.observe(container);
    }

    document.addEventListener('visibilitychange', function () {
        if (!document.hidden && isVisible) startLoop();
    });

    window.addEventListener('resize', function () {
        const nw = container.clientWidth;
        const nh = container.clientHeight;
        if (nw > 0 && nh > 0) {
            width = nw;
            height = nh;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
            if (prefersReducedMotion) renderFrame(0);
        }
    });
}

/**
 * MOTEUR DE REPLI 3D CANVAS 2D (100% AUTONOME HORS-LIGNE / SANS WEBGL)
 * Projette en 3D temps réel des pièces FCFA dorées, des anneaux financiers émeraude
 * et les nœuds de solidarité de la tontine avec perspective mathématique.
 */
function mountFallback3DCanvas(container, sceneType, prefersReducedMotion) {
    const canvas = document.createElement('canvas');
    container.innerHTML = '';
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let width = 300;
    let height = 250;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
        width = container.clientWidth || 300;
        height = container.clientHeight || 250;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    let mouseX = 0;
    let mouseY = 0;
    window.addEventListener('mousemove', function (e) {
        mouseX = (e.clientX / Math.max(window.innerWidth, 1) - 0.5) * 2;
        mouseY = (e.clientY / Math.max(window.innerHeight, 1) - 0.5) * 2;
    }, { passive: true });

    const nodes = [];
    const count = sceneType === 'pot-orb' ? 5 : 8;
    for (let i = 0; i < count; i++) {
        nodes.push({
            angle: (i / count) * Math.PI * 2,
            radius: sceneType === 'pot-orb' ? 38 : 88,
            yPhase: i * 0.9,
            isGold: i % 2 === 0
        });
    }

    let isVisible = true;
    let rafId = null;

    function draw(timeMs) {
        const t = (timeMs || 0) * 0.001;
        ctx.clearRect(0, 0, width, height);

        const cx = width / 2 + mouseX * 10;
        const cy = height / 2 + mouseY * 8;
        const baseScale = Math.min(width, height) / (sceneType === 'pot-orb' ? 120 : 280);

        // Halo central émeraude & or
        const halo = ctx.createRadialGradient(cx, cy, 4, cx, cy, 95 * baseScale);
        halo.addColorStop(0, 'rgba(16, 185, 129, 0.36)');
        halo.addColorStop(0.55, 'rgba(37, 99, 235, 0.16)');
        halo.addColorStop(1, 'rgba(15, 23, 42, 0)');
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(cx, cy, 95 * baseScale, 0, Math.PI * 2);
        ctx.fill();

        // Anneaux financiers 3D inclinés
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(t * 0.35 + mouseX * 0.2);
        ctx.scale(1, 0.46);
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.65)';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.arc(0, 0, 74 * baseScale, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(-t * 0.28 + 0.8);
        ctx.scale(1, 0.52);
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.58)';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(0, 0, 92 * baseScale, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // Noyau central (Cagnotte / Jeton Djangui 3D)
        const coreR = (sceneType === 'pot-orb' ? 24 : 32) * baseScale;
        const coreGrad = ctx.createLinearGradient(cx - coreR, cy - coreR, cx + coreR, cy + coreR);
        coreGrad.addColorStop(0, '#fbbf24');
        coreGrad.addColorStop(0.5, '#10b981');
        coreGrad.addColorStop(1, '#1d4ed8');
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Pièces / Membres en orbite 3D avec tri de profondeur Z
        const projected = nodes.map(function (n, idx) {
            const a = n.angle + t * 0.55;
            const x3d = Math.cos(a) * n.radius * baseScale;
            const z3d = Math.sin(a) * n.radius * baseScale;
            const y3d = Math.sin(t * 1.5 + n.yPhase) * 14 * baseScale + z3d * 0.35;
            const scale = 260 / (260 - z3d);
            return {
                x: cx + x3d * scale,
                y: cy + y3d * scale,
                z: z3d,
                r: (n.isGold ? 9 : 7) * baseScale * scale,
                isGold: n.isGold,
                idx: idx
            };
        }).sort(function (a, b) { return a.z - b.z; });

        projected.forEach(function (p) {
            // Ligne de solidarité reliant chaque membre à la cagnotte centrale
            ctx.strokeStyle = 'rgba(52, 211, 153, 0.22)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();

            ctx.fillStyle = p.isGold ? '#f59e0b' : '#10b981';
            ctx.beginPath();
            ctx.ellipse(p.x, p.y, p.r, p.r * 0.82, t + p.idx, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.lineWidth = 1;
            ctx.stroke();
        });

        if (isVisible && !prefersReducedMotion && !document.hidden) {
            rafId = requestAnimationFrame(draw);
        } else {
            rafId = null;
        }
    }

    draw(0);

    if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                isVisible = entry.isIntersecting;
                if (isVisible && !rafId && !prefersReducedMotion) {
                    rafId = requestAnimationFrame(draw);
                } else if (!isVisible && rafId) {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                }
            });
        }, { threshold: 0.02 });
        obs.observe(container);
    }

    window.addEventListener('resize', function () {
        resize();
        if (prefersReducedMotion) draw(0);
    });
}

// =========================================================================
// 9. COPIE RAPIDE DU CODE D'INVITATION DANS LE PRESSE-PAPIERS
// =========================================================================
function copierCodeInvitation(code, btn) {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(code).then(function () {
        const htmlInitial = btn.innerHTML;
        btn.innerHTML = '<i class="bi bi-check2 me-1"></i>Copié !';
        setTimeout(function () {
            btn.innerHTML = htmlInitial;
        }, 1800);
    });
}
