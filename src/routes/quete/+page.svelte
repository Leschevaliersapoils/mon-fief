<script lang="ts">
    import { base } from '$app/paths';
    import type { PageData } from './$types';

    type Hero = { id_heros: string, id_race: string, nom: string, niveau: number, images_profil?: { url_image?: string } };
    type Defi = { id: string, niveau_requis: number, "type animal": string, frequence: string | null, Type: string, Nomdefis: string, Description: string, defisimage: string, XP: number, visibilite: boolean };
    type Accomplissement = { id_defi: string, id_animal: string, date_demande: string, validation: string };
    type Race = { id_race: string, type: string };

    let { data }: { data: PageData } = $props();

    function getIconPath(type: string) {
        const name = type.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return `${base}/quete/defis/${name}.png`;
    }

    function getNbEnAttente(herosId: string) {
        const accs = (data.accomplissements as Accomplissement[]) || [];
        return accs.filter(a => a.id_animal === herosId && a.validation === 'en_attente').length;
    }

    let defisBase = data.defis.filter((d: Defi) => d.visibilite === true);
    let herosSelectionneId = $state(data.heros.length > 0 ? data.heros[0].id_heros : "");
    let typeSelectionne = $state("Tous");

    let nbEnAttente = $derived(getNbEnAttente(herosSelectionneId));

    $effect(() => {
        if (herosSelectionneId) typeSelectionne = "Tous";
    });

    let herosActif = $derived(data.heros.find((h: Hero) => h.id_heros === herosSelectionneId));

    // Fonctions pour faire défiler les héros via les flèches sur mobile
    function heroSuivant() {
        const index = data.heros.findIndex((h: Hero) => h.id_heros === herosSelectionneId);
        if (index < data.heros.length - 1) {
            herosSelectionneId = data.heros[index + 1].id_heros;
        } else {
            herosSelectionneId = data.heros[0].id_heros; // Boucle vers le premier
        }
    }

    function heroPrecedent() {
        const index = data.heros.findIndex((h: Hero) => h.id_heros === herosSelectionneId);
        if (index > 0) {
            herosSelectionneId = data.heros[index - 1].id_heros;
        } else {
            herosSelectionneId = data.heros[data.heros.length - 1].id_heros; // Boucle vers le dernier
        }
    }

    let defisAccessibles = $derived(() => {
        if (!herosActif) return [];
        
        return defisBase.filter((defi: Defi) => {
            const raceDuHeros = data.races.find((r: Race) => r.id_race === herosActif!.id_race);
            const typeDuHeros = raceDuHeros ? raceDuHeros.type : "";
            const conditionAnimal = defi['type animal'] === "Tous" || defi['type animal'] === typeDuHeros;
            const niveauOk = herosActif!.niveau >= defi.niveau_requis;

            const accomplissementsHero = (data.accomplissements as Accomplissement[])
                .filter(a => a.id_animal === herosActif!.id_heros && a.id_defi === defi.id);

            let frequenceOk = true;
            if (defi.frequence === null) {
                frequenceOk = accomplissementsHero.length === 0;
            } else {
                const uneSemaine = new Date();
                uneSemaine.setDate(uneSemaine.getDate() - 7);
                const recents = accomplissementsHero.filter(a => new Date(a.date_demande) > uneSemaine);
                frequenceOk = recents.length < parseInt(defi.frequence);
            }

            return niveauOk && conditionAnimal && frequenceOk;
        });
    });

    let defisFinals = $derived(() => {
        const listeAccessibles = defisAccessibles();
        if (typeSelectionne === "Tous") return listeAccessibles;
        return listeAccessibles.filter((d: Defi) => d.Type === typeSelectionne);
    });
</script>

<div class="page-quete" style="background-image: url('{base}/quete/taverne.png');">
    <div class="container">
        <header class="main-header" style="background-image: url('{base}/quete/panneau_titre.png');">
            <h1>TABLEAU DES QUÊTES</h1>
            <div class="message-chambellan">
                <p>Le Chambellan valide les épreuves le Mardi et Vendredi soir.<br />2 quêtes max par compagnon.</p>
            </div>
        </header>

        {#if data.heros.length > 0}
            <div class="hero-selector-container">
                <!-- Version PC : Grille normale / Version Mobile : Navigation avec flèches -->
                
                <!-- Contrôles mobiles (Flèches + Carte active unique) -->
                <div class="mobile-hero-slider">
                    <button class="slider-arrow" onclick={heroPrecedent}>❮</button>
                    
                    {#if herosActif}
                        <div class="hero-picker-card active mobile-card-solo">
                            <div class="mini-portrait">
                                {#if herosActif.images_profil?.url_image}
                                    <img src={herosActif.images_profil.url_image} alt={herosActif.nom} />
                                {/if}
                            </div>
                            <div class="mini-infos">
                                <span class="name">{herosActif.nom.toUpperCase()}</span>
                                <span class="level">NIV. {herosActif.niveau}</span>
                            </div>
                        </div>
                    {/if}

                    <button class="slider-arrow" onclick={heroSuivant}>❯</button>
                </div>

                <!-- Version PC (inchangée, s'affiche en grille sur grand écran) -->
                <div class="hero-avatar-picker desktop-only">
                    {#each data.heros as hero}
                        <button class="hero-picker-card" class:active={herosSelectionneId === hero.id_heros} onclick={() => herosSelectionneId = hero.id_heros}>
                            <div class="mini-portrait">
                                {#if hero.images_profil?.url_image}
                                    <img src={hero.images_profil.url_image} alt={hero.nom} />
                                {/if}
                            </div>
                            <div class="mini-infos">
                                <span class="name">{hero.nom.toUpperCase()}</span>
                                <span class="level">NIV. {hero.niveau}</span>
                            </div>
                        </button>
                    {/each}
                </div>
            </div>
        {/if}

        <div class="board">
            {#each defisFinals() as defi}
                <div class="parchemin-wrapper" style="background-image: url('{base}/quete/parchemin.png');">
                    <img src={getIconPath(defi.Type)} alt={defi.Type} class="quest-type-medal" />
                    
                    <div class="parchemin-content">
                        <h2 class="quest-name">{defi.Nomdefis}</h2>
                        
                        <div class="quest-image-container">
                            <img src={defi.defisimage} alt={defi.Nomdefis} class="quest-image" />
                        </div>

                        <div class="quest-footer">
                            <div class="quest-reward">
                                <span class="xp-badge">+{defi.XP} XP</span>
                            </div>

                            {#if nbEnAttente >= 2}
                                <button class="btn-jouer" disabled style="background-image: url('{base}/quete/panneau_jouer.png');">LIMITE ATTEINTE</button>
                            {:else}
                                <a href="{base}/quete/jouer?defi={defi.id}&heros={herosSelectionneId}" class="btn-jouer" style="background-image: url('{base}/quete/panneau_jouer.png');">
                                    ACCOMPLIR
                                </a>
                            {/if}
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=MedievalSharp&display=swap');

    .page-quete { min-height: 100vh; background-size: cover; background-position: center; background-attachment: fixed; padding: 40px 20px; position: relative; }
    .container { max-width: 1400px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; }
    
    .main-header { padding-top: 10px; width: 100%; max-width: 650px; height: 140px; background-size: contain; background-repeat: no-repeat; background-position: center; display: flex; flex-direction: column; justify-content: center; align-items: center; margin-bottom: 20px; box-sizing: border-box; }
    .main-header h1 { font-family: 'Cinzel', serif; color: #f4e4bc; font-size: 2rem; text-shadow: 2px 2px 4px #000; margin-top: 0px; margin-bottom: -10px; text-align: center; }
    
    .hero-selector-container { margin-bottom: 25px; width: 100%; max-width: 1000px; display: flex; justify-content: center; }
    
    /* Grille PC classique */
    .hero-avatar-picker { 
        display: flex; 
        justify-content: center; 
        flex-wrap: wrap; 
        gap: 15px; 
    }
    
    .hero-picker-card { 
        background: rgba(40, 25, 15, 0.7); 
        border: 1px solid rgba(238, 186, 47, 0.4); 
        border-radius: 8px; 
        display: flex; 
        align-items: center; 
        padding: 8px 14px; 
        cursor: pointer; 
        transition: all 0.2s ease; 
        min-width: 170px; 
    }
    .hero-picker-card:hover { border-color: #eeba2f; background: rgba(40, 25, 15, 0.9); }
    .hero-picker-card.active { border-color: #ffd700; background: rgba(139, 69, 19, 0.7); box-shadow: 0 0 10px rgba(238, 186, 47, 0.6); }
    
    .mini-portrait { width: 36px; height: 36px; border-radius: 50%; overflow: hidden; margin-right: 10px; border: 1.5px solid #eeba2f; flex-shrink: 0; }
    .mini-portrait img { width: 100%; height: 100%; object-fit: cover; }
    
    .mini-infos { display: flex; flex-direction: column; font-family: 'Cinzel', serif; text-align: left; }
    .mini-infos .name { color: #ffffff; font-weight: bold; font-size: 0.95rem; white-space: nowrap; }
    .mini-infos .level { color: #ccbba2; font-size: 0.75rem; }

    /* Par défaut sur PC, le slider mobile est caché */
    .mobile-hero-slider { display: none; }

    .board { 
        display: flex;            
        flex-wrap: wrap;          
        justify-content: center;   
        gap: 20px;                
        width: 100%; 
        max-width: 1200px;        
        margin: 0 auto;           
    }
    .parchemin-wrapper {
        position: relative;
        width: 320px;
        height: 480px;
        background-size: 100% 100%; 
        background-repeat: no-repeat;
        display: flex;
        flex-direction: column;
        align-items: center;
        box-sizing: border-box; 
        padding: 40px 20px 20px 20px; 
    }
    .parchemin-content {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px 20px 30px 20px; 
        box-sizing: border-box;
    }
    .quest-footer {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-bottom: 50px; 
        gap: 10px;
    }
    .quest-name {
        font-family: 'Cinzel', serif;
        font-size: 1rem;
        color: #4a3728;
        line-height: 1.2;
        margin: 20px 60px 20px 60px; 
        text-align: center;
    }
    .quest-type-medal {
        position: absolute;       
        top: 35px;                    
        right: 30px;                    
        width: 65px;                    
        height: 65px;                   
        z-index: 10;                    
        object-fit: contain;
        filter: drop-shadow(0 2px 3px rgba(0,0,0,0.5));
    }
    .quest-image-container {
        width: 80%;
        margin-top: 10px;
        flex-grow: 1;      
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .quest-image {
        max-width: 100%;  
        max-height: 180px; 
        object-fit: contain;
    }

    .xp-badge { font-weight: bold; color: #2e5a1c; font-size: 1.1rem; }
    .btn-jouer { width: 170px; height: 45px; background-size: 100% 100%; border: none; cursor: pointer; font-family: 'Cinzel', serif; color: #f4e4bc; font-weight: bold; display: flex; justify-content: center; align-items: center; text-decoration: none; }
    .message-chambellan { margin-top: 5px; padding-top: 5px; border-top: 1px solid rgba(255, 255, 255, 0.2); width: 80%; }
    .message-chambellan p { font-size: 0.85rem; color: #e0d0b0; font-style: italic; text-align: center; margin: 0; }
    
    /* --- RESPONSIVE MOBILE : SYSTÈME DE FLÈCHES --- */
    @media (max-width: 768px) {
        .main-header {
            height: auto;
            min-height: 110px;
            padding: 15px 10px;
            background-size: 100% 100%;
        }
        .main-header h1 {
            font-size: 1.25rem;
            margin-bottom: -5px;
        }
        .message-chambellan p {
            font-size: 0.7rem;
        }

        /* Masquer la grille PC sur mobile */
        .desktop-only {
            display: none;
        }

        /* Afficher le sélecteur avec flèches */
        .mobile-hero-slider {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            width: 100%;
        }

        .slider-arrow {
            background: rgba(40, 25, 15, 0.8);
            border: 1px solid #ffd700;
            color: #ffd700;
            font-size: 1.2rem;
            width: 40px;
            height: 45px;
            border-radius: 6px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            box-shadow: 0 2px 5px rgba(0,0,0,0.5);
        }

        .slider-arrow:active {
            background: rgba(139, 69, 19, 0.9);
        }

        .mobile-card-solo {
            flex-grow: 1;
            max-width: 240px;
            justify-content: center;
            margin: 0;
        }
    }
</style>