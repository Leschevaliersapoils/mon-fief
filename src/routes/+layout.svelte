<script>
    import '../app.css';
    import './layout.css';
    import favicon from '$lib/assets/favicon.svg';
    import { goto, invalidateAll } from '$app/navigation';
    import { page } from '$app/stores';

    let { data, children } = $props();

    const routesSansHud = ['/', '/inscription', '/connexion'];

    // Pages qui doivent afficher le bouton "Retour à la cour"
    const pagesAvecRetour = ['/heros', '/quete', '/chronique', '/pantheon', '/forge', '/regles', '/joueur'];

    const estSurRouteSansHud = $derived(
        routesSansHud.includes($page.url.pathname) || 
        $page.url.pathname.startsWith('/ficheheros')
    );

    const afficherRetourCour = $derived(
        pagesAvecRetour.includes($page.url.pathname)
    );

    async function handleLogout() {
        console.log("Tentative de déconnexion forcée...");
        
        try {
            await data.supabase.auth.signOut({ scope: 'global' });

            if (typeof window !== 'undefined') {
                window.localStorage.clear(); 
            }

            console.log("Session vidée, redirection...");
            await invalidateAll();
            window.location.replace('/');
            
        } catch (err) {
            console.error("Erreur critique déconnexion:", err);
            window.location.replace('/');
        }
    }

    const estVisible = $derived(data?.session && !estSurRouteSansHud);
    
    let hasMessages = $derived((data?.nbMessagesNonLus || 0) > 0);
    let countMessages = $derived(data?.nbMessagesNonLus || 0);
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
</svelte:head>

<div class="layout-container">
    {#if estVisible}
        <div class="hud-layer">
            <!-- Bouton Retour à la cour -->
            <div class="hud-left">
                {#if afficherRetourCour}
                    <a href="/cour" class="btn-retour-cour" title="Retour à la cour">
                        ↩ RETOUR À LA COUR
                    </a>
                {/if}
            </div>

            <!-- Icônes du HUD à droite -->
            <div class="hud-pure">
                <!-- Bouton Règles -->
                <a href="/regles" class="hud-item" title="Règles">
                    <img src="/icons/mention.png" alt="Règles" class="logo-img icon-mention" />
                </a>

                <!-- Bouton Messagerie et Compte avec Notification -->
                <a href="/joueur" class="hud-item {hasMessages ? 'has-notification' : ''}" title="Messagerie et Compte">
                    <div class="icon-wrapper">
                        <img src="/icons/user-crown.png" alt="Messagerie et Compte" class="logo-img {hasMessages ? 'icon-bounce' : ''}" />
                        {#if hasMessages}
                            <span class="badge-notification">{countMessages}</span>
                        {/if}
                    </div>
                </a>

                <!-- Bouton Déconnexion -->
                <button class="hud-item btn-deconnexion" onclick={handleLogout} title="Déconnexion">
                    <img src="/icons/logout-door.png" alt="Déconnexion" class="logo-img" />
                </button>
            </div>
        </div>
    {/if}

    <div class="content-wrapper">
        {@render children()}
    </div>
</div>

<style>
    .layout-container {
        width: 100%;
        min-height: 100vh;
        position: relative;
    }

    /* Par défaut (petits écrans / fenêtres réduites) : Le bandeau a son propre espace avec fond opaque pour ne pas masquer le contenu */
    .hud-layer {
        position: relative;
        z-index: 99999;
        padding: 8px 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        box-sizing: border-box;
        background: rgba(26, 17, 11, 0.95);
        border-bottom: 2px solid #8b4513;
        backdrop-filter: blur(4px);
    }

    .hud-left {
        pointer-events: auto;
    }

    .btn-retour-cour {
        font-family: 'Cinzel', serif;
        font-size: 0.7rem;
        font-weight: bold;
        color: #ffd700;
        background: rgba(26, 17, 11, 0.85);
        border: 2px solid #8b4513;
        padding: 6px 10px;
        border-radius: 6px;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.8);
        transition: all 0.2s ease;
    }

    .btn-retour-cour:hover {
        background: rgba(139, 69, 19, 0.4);
        transform: scale(1.05);
        border-color: #ffd700;
    }

    .hud-pure {
        pointer-events: auto;
        display: flex;
        gap: 10px;
    }

    .hud-item {
        width: 42px;
        height: 42px;
        background: none;
        border: none;
        padding: 0;
        margin: 0;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        outline: none;
        transition: transform 0.2s ease;
        filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.8));
        position: relative;
    }

    .icon-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
    }

    .logo-img {
        width: 42px;
        height: 42px;
        object-fit: contain;
        pointer-events: none; 
    }

    .icon-mention {
        transform: scale(1.2); 
    }

    @keyframes bounceIcon {
        0%, 100% {
            transform: translateY(0) scale(1);
        }
        50% {
            transform: translateY(-4px) scale(1.08);
        }
    }

    .icon-bounce {
        animation: bounceIcon 1.5s infinite ease-in-out;
    }

    .badge-notification {
        position: absolute;
        top: 2px;
        right: 2px;
        background-color: #dc2626;
        color: white;
        font-family: 'Cinzel', serif;
        font-size: 0.75rem;
        font-weight: bold;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #1a110b;
        box-shadow: 0 2px 4px rgba(0,0,0,0.5);
        z-index: 10;
    }

    .hud-item:hover {
        transform: scale(1.1);
        filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.6)) brightness(1.2);
    }
    
    a[href="/regles"]:hover {
        transform: scale(1.15); 
    }

    .btn-deconnexion {
        min-width: 42px;
        min-height: 42px;
    }

    /* Grands écrans (> 850px) : Le bandeau devient transparent et se superpose par-dessus le contenu */
    @media (min-width: 851px) {
        .hud-layer {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            background: transparent;
            border: none;
            backdrop-filter: none;
            padding: 15px 20px;
            pointer-events: none;
        }

        .hud-left {
            pointer-events: auto;
        }

        .btn-retour-cour {
            font-size: 0.95rem;
            padding: 10px 16px;
        }

        .hud-pure {
            pointer-events: auto;
            gap: 20px;
        }

        .hud-item {
            width: 55px;
            height: 55px;
        }

        .logo-img {
            width: 55px;
            height: 55px;
        }

        .btn-deconnexion {
            min-width: 55px;
            min-height: 55px;
        }
    }
</style>