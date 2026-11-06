<?php
// index.php — Page d'accueil publique tout-en-un (Présentation + Fonctionnement + Tarif 2 000 FCFA)
require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/functions.php';

if (!empty($_SESSION['user_id'])) {
    header('Location: ' . BASE_URL . '/dashboard.php');
    exit;
}

$titre_page = "Accueil — Tontines digitales au Cameroun";
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';
?>

<!-- HERO BANNER IMMERSIF AVEC VIDÉO EN BOUCLE + SCÈNE 3D INTERACTIVE -->
<section class="hero-video-section mb-5">
    <!-- Vidéo muette en lecture automatique et en boucle infinie -->
    <video class="hero-video-bg" autoplay muted loop playsinline>
        <source src="<?= BASE_URL ?>/assets/video/hero.mp4" type="video/mp4">
    </video>

    <!-- Voile sombre élégant pour faire ressortir le texte et la scène 3D -->
    <div class="hero-video-overlay"></div>

    <!-- Contenu premier plan : Narration FinTech + Composition 3D Tontine & Solidarité -->
    <div class="container hero-video-content py-4">
        <div class="row align-items-center g-5">
            <div class="col-lg-7 text-center text-lg-start">
                <span class="badge bg-success bg-opacity-25 text-white border border-success border-opacity-50 px-3 py-2 rounded-pill fw-semibold mb-3 shadow-sm" data-dj-reveal="blur">
                    <i class="bi bi-shield-check text-warning me-1"></i>FINTECH COMMUNAUTAIRE — CAMEROUN (FCFA)
                </span>
                <h1 class="display-5 fw-bold text-white mb-2" data-dj-text-reveal="word">
                    Gérez votre tontine en toute transparence, sans cahier perdu ni calcul manuel.
                </h1>
                <div class="mb-3" data-dj-reveal="fade-up" style="--dj-stagger-delay: 110ms;">
                    <div class="dj-typewriter-hero-banner">
                        <i class="bi bi-stars text-warning"></i>
                        <span class="fs-5 text-white fw-semibold"
                              data-dj-typewriter
                              data-dj-text-class="dj-typewriter-text--emerald"
                              data-dj-type-speed="45"
                              data-dj-delete-speed="24"
                              data-dj-pause="2500"
                              data-dj-phrases="Votre tontine, autrement.|Épargnez ensemble, en toute confiance.|Construisez vos projets sans cahier perdu.|Grandissez collectivement avec Djangui.">
                            Votre tontine, autrement.
                        </span>
                    </div>
                </div>
                <p class="lead text-white-50 mx-auto mx-lg-0 mb-4" style="max-width: 680px;" data-dj-reveal="fade-up" style="--dj-stagger-delay: 160ms;">
                    Tirage au sort aléatoire verrouillé, suivi en direct du pot du bouffeur de la séance, gestion automatique des retards sur pot et caisse de réserve par cycle.
                </p>
                <div class="d-flex flex-wrap justify-content-center justify-content-lg-start gap-3 mb-4" data-dj-reveal="fade-up" style="--dj-stagger-delay: 240ms;">
                    <a href="<?= BASE_URL ?>/register-tontine.php" class="btn btn-glow-emerald btn-lg px-4">
                        <i class="bi bi-plus-circle-fill me-2"></i>Créer ma tontine (2 mois gratuits)
                    </a>
                    <a href="<?= BASE_URL ?>/join-tontine.php" class="btn btn-outline-light btn-lg px-4 rounded-3">
                        <i class="bi bi-people-fill me-2"></i>Rejoindre avec un code
                    </a>
                    <a href="<?= BASE_URL ?>/login.php" class="btn btn-glow-blue btn-lg px-4">
                        <i class="bi bi-box-arrow-in-right me-2"></i>Se connecter
                    </a>
                </div>

                <!-- Indicateurs clés animés (Number Counter + Stagger) -->
                <div class="row g-3 pt-2 text-start" data-dj-stagger="100">
                    <div class="col-4">
                        <div class="p-3 rounded-4" style="background: rgba(15, 23, 42, 0.58); border: 1px solid rgba(255,255,255,0.12); backdrop-filter: blur(8px);">
                            <div class="fs-4 fw-bold text-white dj-stat-counter">100 %</div>
                            <div class="small text-white-50">Transparent & Traçable</div>
                        </div>
                    </div>
                    <div class="col-4">
                        <div class="p-3 rounded-4" style="background: rgba(15, 23, 42, 0.58); border: 1px solid rgba(16, 185, 129, 0.28); backdrop-filter: blur(8px);">
                            <div class="fs-4 fw-bold text-success dj-stat-counter">0 FCFA</div>
                            <div class="small text-white-50">Pendant 2 mois d'essai</div>
                        </div>
                    </div>
                    <div class="col-4">
                        <div class="p-3 rounded-4" style="background: rgba(15, 23, 42, 0.58); border: 1px solid rgba(212, 175, 55, 0.32); backdrop-filter: blur(8px);">
                            <div class="fs-4 fw-bold text-warning dj-stat-counter">2 000 FCFA</div>
                            <div class="small text-white-50">Forfait mensuel groupe</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Scène 3D Interactive : Cercle de Solidarité, Anneaux Financiers & Jetons FCFA -->
            <div class="col-lg-5" data-dj-reveal="scale" style="--dj-stagger-delay: 200ms;">
                <div class="dj-hero-3d-stage js-tilt-3d" data-dj-parallax="0.08">
                    <div data-dj-3d-scene="hero-tontine" style="position:absolute;inset:0;"></div>
                    <div class="dj-hero-stage-hud d-flex justify-content-between align-items-start">
                        <span class="dj-floating-chip">
                            <i class="bi bi-coin text-warning"></i> Cagnotte & Jetons 3D
                        </span>
                        <span class="dj-floating-chip dj-floating-chip--emerald">
                            <i class="bi bi-people-fill text-success"></i> Solidarité Active
                        </span>
                    </div>
                    <div class="dj-hero-stage-hud mt-auto pt-5">
                        <div class="p-3 rounded-4" style="background: rgba(7, 12, 24, 0.76); border: 1px solid rgba(255,255,255,0.14); backdrop-filter: blur(10px);">
                            <div class="d-flex justify-content-between align-items-center small mb-1">
                                <span class="text-white-50"><i class="bi bi-safe2-fill text-success me-1"></i>Architecture FinTech Djangui</span>
                                <span class="badge bg-success rounded-pill">Temps réel</span>
                            </div>
                            <div class="small text-white fw-semibold">
                                Chaque sphère représente un membre cotisant relié au pot central et à la caisse de réserve.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- COMMENT ÇA MARCHE EN 4 ÉTAPES GUIDÉES (AVEC STICKY REVEAL 3D & CARTES TILT 3D) -->
<section class="container py-4 dj-sticky-narrative">
    <div class="text-center mb-5" data-dj-reveal="blur">
        <span class="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-semibold mb-2">
            EXPÉRIENCE GUIDÉE & AUTOMATISÉE
        </span>
        <h2 class="fw-bold h3" data-dj-text-reveal="mask">Une interface guidée en 4 écrans simples</h2>
        <p class="text-muted small mx-auto" style="max-width: 600px;">
            Tout est conçu pour être pris en main immédiatement par la secrétaire et tous les membres, sur ordinateur, tablette et smartphone.
        </p>
    </div>

    <div class="row g-4 align-items-start mb-5">
        <!-- Colonne Sticky Reveal 3D sur grand écran -->
        <div class="col-lg-5 dj-sticky-visual-col" data-dj-reveal="fade-left">
            <div class="dj-solidarity-3d-card hover-lift">
                <div data-dj-3d-scene="solidarity-cycle" style="position:absolute;inset:0;"></div>
                <div class="dj-solidarity-overlay-content">
                    <span class="badge bg-warning text-dark rounded-pill px-3 py-1 fw-bold mb-2">
                        <i class="bi bi-stars me-1"></i>CYCLE DE SOLIDARITÉ 3D
                    </span>
                    <h4 class="fw-bold text-white mb-1">L'épargne collective réinventée</h4>
                    <p class="small text-white-50 mb-0">
                        Les cotisations convergent vers le bénéficiaire du tour (« Bouffeur »), tandis que les pénalités alimentent la caisse de réserve du cycle.
                    </p>
                </div>
                <div class="dj-solidarity-overlay-content mt-auto pt-4">
                    <div class="d-flex flex-wrap gap-2">
                        <span class="badge bg-primary bg-opacity-75 rounded-pill px-3 py-2">1. Séance</span>
                        <span class="badge bg-success bg-opacity-75 rounded-pill px-3 py-2">2. Tirage</span>
                        <span class="badge bg-warning text-dark rounded-pill px-3 py-2">3. Caisse</span>
                        <span class="badge bg-info text-dark rounded-pill px-3 py-2">4. Groupe</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Colonne des 4 étapes avec Stagger + 3D Tilt Reveal -->
        <div class="col-lg-7">
            <div class="row g-4" data-dj-stagger="110">
                <div class="col-md-6" data-dj-sticky-step="1">
                    <div class="card card-djangui hover-lift js-tilt-3d p-4 h-100 border-left-navy" data-dj-reveal="tilt-3d">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div class="fs-2 text-primary"><i class="bi bi-1-circle-fill"></i></div>
                            <span class="badge bg-primary-subtle text-primary rounded-pill">Pôle 1</span>
                        </div>
                        <h5 class="fw-bold">Accueil & Séance</h5>
                        <p class="text-muted small mb-0">Visualisez immédiatement qui est le bouffeur de la séance actuelle, la progression de son pot et vos réunions Zoom.</p>
                    </div>
                </div>
                <div class="col-md-6" data-dj-sticky-step="2">
                    <div class="card card-djangui hover-lift js-tilt-3d p-4 h-100 border-left-emerald" data-dj-reveal="tilt-3d">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div class="fs-2 text-success"><i class="bi bi-2-circle-fill"></i></div>
                            <span class="badge bg-success-subtle text-success rounded-pill">Pôle 2</span>
                        </div>
                        <h5 class="fw-bold">Cycles & Tirage</h5>
                        <p class="text-muted small mb-0">Tirage au sort aléatoire en 1 clic et verrouillage des séances tant que la séance précédente n'est pas clôturée.</p>
                    </div>
                </div>
                <div class="col-md-6" data-dj-sticky-step="3">
                    <div class="card card-djangui hover-lift js-tilt-3d p-4 h-100 border-left-warning" data-dj-reveal="tilt-3d">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div class="fs-2 text-warning"><i class="bi bi-3-circle-fill"></i></div>
                            <span class="badge bg-warning-subtle text-warning-emphasis rounded-pill">Pôle 3</span>
                        </div>
                        <h5 class="fw-bold">Cotisations & Caisse</h5>
                        <p class="text-muted small mb-0">Choisissez le montant exact à verser, suivez vos reçus ventilés et consultez la caisse de réserve alimentée par les pénalités (%).</p>
                    </div>
                </div>
                <div class="col-md-6" data-dj-sticky-step="4">
                    <div class="card card-djangui hover-lift js-tilt-3d p-4 h-100 border-left-navy" data-dj-reveal="tilt-3d">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div class="fs-2 text-info"><i class="bi bi-4-circle-fill"></i></div>
                            <span class="badge bg-info-subtle text-info rounded-pill">Pôle 4</span>
                        </div>
                        <h5 class="fw-bold">Groupe & Profil</h5>
                        <p class="text-muted small mb-0">Validation des adhésions avec CNI, suivi des membres actifs/inactifs et passation d'administration en 1 clic.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- TARIF UNIQUE TRANSPARENT (SCALE REVEAL + PROFONDEUR) -->
    <div class="card card-accent-djangui hover-lift p-4 p-md-5 mb-4" data-dj-reveal="scale">
        <div class="row align-items-center g-4">
            <div class="col-lg-8">
                <span class="badge bg-success mb-2"><i class="bi bi-award-fill text-warning me-1"></i>TARIF UNIQUE PAR GROUPE</span>
                <h3 class="fw-bold mb-2">2 mois d'essai gratuit, puis 2 000 FCFA / mois par tontine</h3>
                <p class="text-muted mb-0">
                    L'accès est <strong>100 % gratuit pour tous les membres cotisants</strong>. Seule la tontine règle 2 000 FCFA par mois après les 2 premiers mois d'essai offerts, quel que soit le nombre de participants.
                </p>
            </div>
            <div class="col-lg-4 text-lg-end">
                <a href="<?= BASE_URL ?>/register-tontine.php" class="btn btn-glow-emerald btn-lg px-4">
                    <i class="bi bi-rocket-takeoff-fill me-2"></i>Démarrer gratuitement
                </a>
            </div>
        </div>
    </div>
</section>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
