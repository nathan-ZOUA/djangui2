/**
 * assets/js/djangui-typewriter.js — MODULE D'ANIMATIONS TYPOGRAPHIQUES PREMIUM DJANGUI
 * ====================================================================================
 * Architecture 100 % JavaScript natif — Zéro dépendance externe
 *
 * Effets supportés :
 *  1. Typewriter Effect ('typewriter') :
 *     - Apparition progressive lettre par lettre avec cadence humaine naturelle
 *     - Curseur vertical clignotant vert émeraude (.dj-typewriter-cursor)
 *     - Pause configurable en fin de phrase
 *     - Effacement progressif caractère par caractère
 *     - Passage fluide à la phrase suivante (Text Cycling)
 *  2. Typewriter + Blur Out ('typewriter-blur') :
 *     - Frappe lettre par lettre, pause, puis effacement fluide avec flou (Blur Out)
 *  3. Text Cycling Fade/Blur ('blur-cycle' / 'fade-up-cycle') :
 *     - Transition douce entre expressions avec Fade In + déplacement vertical et Blur Out
 *  4. Text Reveal ('char-reveal', 'word-reveal', 'mask-reveal') :
 *     - Révélation progressive lettre par lettre, mot par mot ou avec masque au scroll
 *  5. Assistant Conversationnel ('streamAssistantResponse') :
 *     - Animation de frappe en temps réel lorsqu'une réponse dynamique est produite par
 *       un assistant conversationnel (sans jamais inventer de faux messages automatiques).
 *
 * Respecte strictement prefers-reduced-motion, met en pause hors-écran (IntersectionObserver)
 * et préserve la stabilité des dimensions (aucun décalage de mise en page).
 * ====================================================================================
 */

(function (window, document) {
    'use strict';

    const prefersReducedMotion =
        window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSmallMobile =
        window.matchMedia && window.matchMedia('(max-width: 575.98px)').matches;

    /**
     * Classe principale gérant une instance Typewriter / Text Cycling
     */
    function DjanguiTypewriterInstance(el, customOptions) {
        this.el = el;
        const dataset = el.dataset || {};

        // Récupération de la liste de phrases (JSON ou séparées par "|")
        let parsedPhrases = [];
        if (customOptions && Array.isArray(customOptions.phrases)) {
            parsedPhrases = customOptions.phrases;
        } else if (dataset.djPhrases) {
            const raw = dataset.djPhrases.trim();
            if (raw.startsWith('[')) {
                try {
                    parsedPhrases = JSON.parse(raw);
                } catch (e) {
                    parsedPhrases = [raw];
                }
            } else {
                parsedPhrases = raw.split('|').map(function (s) { return s.trim(); }).filter(Boolean);
            }
        }

        const initialText = (el.textContent || '').trim();
        if (parsedPhrases.length === 0 && initialText !== '') {
            parsedPhrases = [initialText];
        }

        this.options = Object.assign({
            phrases: parsedPhrases,
            typeSpeed: parseInt(dataset.djTypeSpeed || '46', 10),
            deleteSpeed: parseInt(dataset.djDeleteSpeed || '24', 10),
            pauseDuration: parseInt(dataset.djPause || '2600', 10),
            pauseBeforeNext: parseInt(dataset.djPauseNext || '360', 10),
            cursor: dataset.djCursor !== 'false',
            loop: dataset.djLoop !== 'false',
            transition: dataset.djTransition || 'typewriter', // 'typewriter' | 'typewriter-blur' | 'blur-cycle'
            textClass: dataset.djTextClass || ''
        }, customOptions || {});

        // Sur mobile, espacer légèrement les pauses pour économiser la batterie tout en restant fluide
        if (isSmallMobile) {
            this.options.pauseDuration = Math.max(this.options.pauseDuration, 3100);
        }

        this.phraseIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.isPaused = false;
        this.isVisible = true;
        this.timerId = null;

        this.setupDOM(initialText);
    }

    DjanguiTypewriterInstance.prototype.setupDOM = function (fallbackText) {
        const phrases = this.options.phrases;
        const firstPhrase = phrases.length > 0 ? phrases[0] : fallbackText;

        // Accessibilité : conserver le texte complet lisible par les lecteurs d'écran
        if (!this.el.getAttribute('aria-label') && firstPhrase) {
            this.el.setAttribute('aria-label', firstPhrase);
        }

        this.el.innerHTML = '';
        this.el.classList.add('dj-typewriter-box');

        this.textNode = document.createElement('span');
        this.textNode.className = 'dj-typewriter-text ' + (this.options.textClass || '');
        this.textNode.setAttribute('aria-hidden', 'true');
        this.el.appendChild(this.textNode);

        if (this.options.cursor) {
            this.cursorNode = document.createElement('span');
            this.cursorNode.className = 'dj-typewriter-cursor';
            this.cursorNode.setAttribute('aria-hidden', 'true');
            this.el.appendChild(this.cursorNode);
        }

        // Si prefers-reduced-motion est actif, afficher immédiatement la première phrase sans animation
        if (prefersReducedMotion || phrases.length === 0) {
            this.textNode.textContent = firstPhrase;
            return;
        }

        if (this.options.transition === 'blur-cycle') {
            this.textNode.textContent = firstPhrase;
            this.startBlurCycle();
        } else {
            // Démarrer l'écriture progressive depuis 0 caractère
            this.textNode.textContent = '';
            this.charIndex = 0;
            this.scheduleNextTick(280);
        }
    };

    DjanguiTypewriterInstance.prototype.setCursorActive = function (active) {
        if (!this.cursorNode) return;
        this.cursorNode.classList.toggle('is-active-typing', !!active);
    };

    DjanguiTypewriterInstance.prototype.scheduleNextTick = function (delayMs) {
        const self = this;
        if (this.timerId) {
            clearTimeout(this.timerId);
        }
        this.timerId = setTimeout(function () {
            self.tick();
        }, delayMs);
    };

    DjanguiTypewriterInstance.prototype.tick = function () {
        if (prefersReducedMotion) return;
        if (!this.isVisible || document.hidden) {
            // En veille tant que l'élément est hors de l'écran ou l'onglet inactif
            this.scheduleNextTick(600);
            return;
        }

        const phrases = this.options.phrases;
        if (phrases.length === 0) return;

        const currentPhrase = phrases[this.phraseIndex] || '';

        // CAS 1 : Écriture progressive lettre par lettre
        if (!this.isDeleting) {
            this.setCursorActive(true);
            this.charIndex = Math.min(currentPhrase.length, this.charIndex + 1);
            this.textNode.textContent = currentPhrase.slice(0, this.charIndex);

            if (this.charIndex >= currentPhrase.length) {
                // Phrase complète : le curseur clignote pendant la pause
                this.setCursorActive(false);
                this.el.setAttribute('aria-label', currentPhrase);

                // Si une seule phrase et loop=false, on s'arrête proprement
                if (!this.options.loop && this.phraseIndex >= phrases.length - 1) {
                    return;
                }

                this.isDeleting = true;
                this.scheduleNextTick(this.options.pauseDuration);
                return;
            }

            // Légère variation naturelle de vitesse de frappe (+0 à +22ms)
            const naturalVariance = Math.floor(Math.random() * 22);
            const charJustTyped = currentPhrase.charAt(this.charIndex - 1);
            const punctuationPause = (charJustTyped === ',' || charJustTyped === '—' || charJustTyped === ':') ? 95 : 0;
            this.scheduleNextTick(this.options.typeSpeed + naturalVariance + punctuationPause);
            return;
        }

        // CAS 2 : Effacement progressif (ou Blur Out si configuré)
        if (this.options.transition === 'typewriter-blur') {
            const self = this;
            this.setCursorActive(false);
            this.textNode.classList.add('is-blurring-out');
            this.timerId = setTimeout(function () {
                self.textNode.textContent = '';
                self.textNode.classList.remove('is-blurring-out');
                self.charIndex = 0;
                self.isDeleting = false;
                self.phraseIndex = (self.phraseIndex + 1) % phrases.length;
                self.scheduleNextTick(self.options.pauseBeforeNext);
            }, 380);
            return;
        }

        // Effacement caractère par caractère
        this.setCursorActive(true);
        this.charIndex = Math.max(0, this.charIndex - 1);
        this.textNode.textContent = currentPhrase.slice(0, this.charIndex);

        if (this.charIndex === 0) {
            this.setCursorActive(false);
            this.isDeleting = false;
            this.phraseIndex = (this.phraseIndex + 1) % phrases.length;
            this.scheduleNextTick(this.options.pauseBeforeNext);
            return;
        }

        this.scheduleNextTick(this.options.deleteSpeed);
    };

    /**
     * Mode 'blur-cycle' : Transition douce entre expressions avec Blur Out + Fade In Up
     */
    DjanguiTypewriterInstance.prototype.startBlurCycle = function () {
        const self = this;
        const phrases = this.options.phrases;
        if (phrases.length <= 1) return;

        function cycleStep() {
            if (!self.isVisible || document.hidden) {
                self.timerId = setTimeout(cycleStep, 800);
                return;
            }
            self.textNode.classList.remove('is-fading-in');
            self.textNode.classList.add('is-blurring-out');

            setTimeout(function () {
                self.phraseIndex = (self.phraseIndex + 1) % phrases.length;
                const nextText = phrases[self.phraseIndex];
                self.textNode.textContent = nextText;
                self.el.setAttribute('aria-label', nextText);
                self.textNode.classList.remove('is-blurring-out');
                self.textNode.classList.add('is-fading-in');

                if (self.options.loop || self.phraseIndex < phrases.length - 1) {
                    self.timerId = setTimeout(cycleStep, self.options.pauseDuration);
                }
            }, 380);
        }

        this.timerId = setTimeout(cycleStep, this.options.pauseDuration);
    };

    /**
     * Initialise les effets de Text Reveal (char-reveal, word-reveal, mask-reveal)
     */
    function initTextRevealElements() {
        const revealNodes = document.querySelectorAll('[data-dj-text-reveal]');
        if (revealNodes.length === 0) return;

        revealNodes.forEach(function (node) {
            if (node.dataset.djRevealPrepared === '1') return;
            node.dataset.djRevealPrepared = '1';

            const mode = node.getAttribute('data-dj-text-reveal') || 'word'; // 'char' | 'word' | 'mask'
            const originalText = (node.textContent || '').trim();
            if (!originalText) return;

            node.setAttribute('aria-label', originalText);

            if (prefersReducedMotion) {
                node.classList.add('is-text-revealed');
                return;
            }

            node.innerHTML = '';

            if (mode === 'char') {
                const words = originalText.split(/\s+/);
                let charGlobalIdx = 0;
                words.forEach(function (word, wIdx) {
                    const wordSpan = document.createElement('span');
                    wordSpan.style.display = 'inline-block';
                    wordSpan.style.whiteSpace = 'nowrap';
                    wordSpan.setAttribute('aria-hidden', 'true');

                    Array.from(word).forEach(function (ch) {
                        const chSpan = document.createElement('span');
                        chSpan.className = 'dj-reveal-char';
                        chSpan.style.setProperty('--char-delay', Math.min(charGlobalIdx * 22, 650) + 'ms');
                        chSpan.textContent = ch;
                        wordSpan.appendChild(chSpan);
                        charGlobalIdx++;
                    });

                    node.appendChild(wordSpan);
                    if (wIdx < words.length - 1) {
                        node.appendChild(document.createTextNode(' '));
                    }
                });
            } else if (mode === 'mask') {
                const words = originalText.split(/\s+/);
                words.forEach(function (word, wIdx) {
                    const wrap = document.createElement('span');
                    wrap.className = 'dj-reveal-mask-wrap';
                    wrap.setAttribute('aria-hidden', 'true');

                    const inner = document.createElement('span');
                    inner.className = 'dj-reveal-mask-inner';
                    inner.style.setProperty('--mask-delay', Math.min(wIdx * 65, 600) + 'ms');
                    inner.textContent = word;

                    wrap.appendChild(inner);
                    node.appendChild(wrap);
                    if (wIdx < words.length - 1) {
                        node.appendChild(document.createTextNode(' '));
                    }
                });
            } else {
                // Par défaut : 'word' (mot par mot avec léger déplacement vertical)
                const words = originalText.split(/\s+/);
                words.forEach(function (word, wIdx) {
                    const wSpan = document.createElement('span');
                    wSpan.className = 'dj-reveal-word';
                    wSpan.setAttribute('aria-hidden', 'true');
                    wSpan.style.setProperty('--word-delay', Math.min(wIdx * 55, 600) + 'ms');
                    wSpan.textContent = word;
                    node.appendChild(wSpan);
                    if (wIdx < words.length - 1) {
                        node.appendChild(document.createTextNode(' '));
                    }
                });
            }
        });

        if ('IntersectionObserver' in window && !prefersReducedMotion) {
            const obs = new IntersectionObserver(function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-text-revealed');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15 });

            revealNodes.forEach(function (n) { obs.observe(n); });
        } else {
            revealNodes.forEach(function (n) { n.classList.add('is-text-revealed'); });
        }
    }

    /**
     * 7. ASSISTANT CONVERSATIONNEL : Animation de frappe progressive lorsqu'une
     * véritable réponse est générée dynamiquement (sans créer de faux messages).
     */
    function streamAssistantResponse(target, responseText, options) {
        const el = typeof target === 'string' ? document.querySelector(target) : target;
        if (!el) return null;

        const textToStream = typeof responseText === 'string' ? responseText : (el.textContent || '').trim();
        if (!textToStream) return null;

        const cfg = Object.assign({
            typeSpeed: 22,
            cursor: true,
            hideCursorOnComplete: true,
            onComplete: null
        }, options || {});

        if (prefersReducedMotion) {
            el.textContent = textToStream;
            if (typeof cfg.onComplete === 'function') cfg.onComplete(el);
            return el;
        }

        el.innerHTML = '';
        const textSpan = document.createElement('span');
        textSpan.className = 'dj-typewriter-text';
        el.appendChild(textSpan);

        let cursorSpan = null;
        if (cfg.cursor) {
            cursorSpan = document.createElement('span');
            cursorSpan.className = 'dj-typewriter-cursor is-active-typing';
            el.appendChild(cursorSpan);
        }

        let idx = 0;
        function typeNextChar() {
            idx++;
            textSpan.textContent = textToStream.slice(0, idx);
            if (idx < textToStream.length) {
                const ch = textToStream.charAt(idx - 1);
                const delay = (ch === '.' || ch === '!' || ch === '?') ? cfg.typeSpeed * 4 : cfg.typeSpeed;
                setTimeout(typeNextChar, delay);
            } else {
                if (cursorSpan) {
                    cursorSpan.classList.remove('is-active-typing');
                    if (cfg.hideCursorOnComplete) {
                        setTimeout(function () {
                            cursorSpan.classList.add('is-hidden');
                        }, 1800);
                    }
                }
                if (typeof cfg.onComplete === 'function') cfg.onComplete(el);
            }
        }

        typeNextChar();
        return el;
    }

    /**
     * Surveille automatiquement tout conteneur d'assistant conversationnel
     * ([data-dj-assistant-log], .js-assistant-messages) pour animer en temps réel
     * chaque nouvelle réponse dynamique produite par l'assistant.
     */
    function observeDynamicAssistantContainers() {
        const containers = document.querySelectorAll('[data-dj-assistant-log], .js-assistant-messages');
        if (containers.length === 0 || !('MutationObserver' in window)) return;

        containers.forEach(function (container) {
            const observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (m) {
                    m.addedNodes.forEach(function (node) {
                        if (node.nodeType === 1) {
                            const msgTarget = node.matches('[data-dj-assistant-reply], .js-assistant-reply')
                                ? node
                                : node.querySelector('[data-dj-assistant-reply], .js-assistant-reply');
                            if (msgTarget && msgTarget.dataset.djStreamed !== '1') {
                                msgTarget.dataset.djStreamed = '1';
                                streamAssistantResponse(msgTarget, msgTarget.textContent);
                            }
                        }
                    });
                });
            });
            observer.observe(container, { childList: true, subtree: true });
        });
    }

    /**
     * Initialisation globale de toutes les instances [data-dj-typewriter] et [data-dj-text-reveal]
     */
    const instances = [];

    function initAll() {
        const twNodes = document.querySelectorAll('[data-dj-typewriter]');
        twNodes.forEach(function (node) {
            if (node.dataset.djTwInitialized === '1') return;
            node.dataset.djTwInitialized = '1';
            const inst = new DjanguiTypewriterInstance(node);
            instances.push(inst);
        });

        // Pause automatique hors écran via IntersectionObserver
        if ('IntersectionObserver' in window && instances.length > 0) {
            const visibilityObs = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    const target = entry.target;
                    instances.forEach(function (inst) {
                        if (inst.el === target) {
                            inst.isVisible = entry.isIntersecting;
                        }
                    });
                });
            }, { threshold: 0.05 });

            instances.forEach(function (inst) {
                visibilityObs.observe(inst.el);
            });
        }

        initTextRevealElements();
        observeDynamicAssistantContainers();
    }

    // Exposition du module réutilisable global DjanguiTypo
    window.DjanguiTypo = {
        Instance: DjanguiTypewriterInstance,
        initAll: initAll,
        initTextReveal: initTextRevealElements,
        streamAssistantResponse: streamAssistantResponse
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
})(window, document);
