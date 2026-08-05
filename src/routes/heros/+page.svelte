<script lang="ts">
    import { base } from '$app/paths';
    let { data, form } = $props();

    let showForm = $state(false);
    let sexeSelectionne = $state("");
    let especeSelectionnee = $state(""); 
    let raceSelectionneeId = $state("");
    let imageSelectionneeId = $state("");
    
    let imagesDisponibles = $derived(
        raceSelectionneeId 
            ? data.images.filter((img: any) => 
                String(img.id_race) === String(raceSelectionneeId) && !img.id_heros
              ) 
            : []
    );

    function handleError(event: any) {
        event.target.style.display = 'none';
    }

     function calculerProgression(hero: any, niveaux: any[]) {
        if (!niveaux || niveaux.length === 0) return { pourcentage: 0, xpActuelle: 0, xpCible: 0 };

        const nivActuel = Number(hero.niveau || 1);
        
        const lvlActuel = niveaux.find((n: any) => Number(n.niveau) === nivActuel);
        const lvlSuivant = niveaux.find((n: any) => Number(n.niveau) === nivActuel + 1);

        const getXp = (obj: any) => {
            if (!obj) return 0;
            return Number(obj['nombre xp'] ?? obj.nombre_xp ?? 0);
        };

        const xpActuelle = Number(hero.experience || 0);
        const xpPalierActuel = getXp(lvlActuel);
        const xpCible = lvlSuivant ? getXp(lvlSuivant) : xpPalierActuel;
        
        const diff = xpCible - xpPalierActuel;
        const progression = (diff > 0) 
            ? ((xpActuelle - xpPalierActuel) / diff) * 100 
            : 100;

        return {
            pourcentage: Math.min(Math.max(progression, 0), 100),
            xpActuelle: xpActuelle,
            xpCible: xpCible
        };
    }
</script>

<div class="page-background" style="background-image: url('{base}/heros/grange.png');">
    <div class="overlay">
        {#if form?.message}
            <div class="banner {form.success ? 'success' : 'error'}">{form.message}</div>
        {/if}

        <header class="chenil-header">
            <!-- Bannière du haut -->
            <img src="{base}/heros/banniereheros.png" alt="Le Chenil des Héros" class="banner-title-img" />
            
            <!-- Bouton image compagnon avec espacement -->
            <button onclick={() => showForm = true} class="btn-inscription-img">
                <img src="{base}/heros/compagnon.png" alt="Inscrire un Compagnon" />
            </button>
        </header>

        <div class="grille">
            {#each data.heros as hero}
                {@const prog = calculerProgression(hero, data.niveaux)}
                
                <a href="{base}/heros/{hero.id_heros}" class="hero-card-link">
                    <div class="hero-card" style="background-image: url('{base}/heros/cadre_or.png');">
                        
                        <!-- Badge Niveau -->
                        <div class="level-badge">
                            <img src="{base}/chronique/{hero.niveau}.png" 
                                   alt="Niveau {hero.niveau}" 
                                   style="width: 100%; height: 100%; object-fit: contain;" 
                                   onerror={handleError} />
                        </div>

                        <!-- Portrait -->
                        <div class="portrait-container">
                            {#if hero.images_profil?.url_image}
                                <img src={hero.images_profil.url_image} alt="" class="hero-img" />
                            {/if}
                        </div>

                        <!-- Infos -->
                        <div class="info-container">
                            <h3 class="hero-name">{hero.nom.toUpperCase()}</h3>
                            
                            <div class="xp-bar-container">
                                <div class="xp-fill" style="width: {prog.pourcentage}%;"></div>
                            </div>
                            
                        </div>
                    </div>
                </a>
            {/each}
        </div>
    </div>
</div>

{#if showForm}
    <div class="modal-overlay">
        <div class="parchment-form">
            <button class="close-btn" onclick={() => showForm = false}>×</button>
            <h2 class="form-title">NOUVEAU COMPAGNON</h2>
            
            <form method="POST" action="?/ajouterHeros" onsubmit={() => { if(form?.success) showForm = false; }}>
                <div class="field">
                    <label for="nom">NOM DU HÉROS</label>
                    <input type="text" name="nom" id="nom" placeholder="Ex: Rex..." required />
                </div>

                <div class="field">
                    <label>SEXE</label>
                    <div class="species-selector">
                         <label class="species-card" class:active={sexeSelectionne === 'Mâle'}>
                            <input type="radio" name="sexe" bind:group={sexeSelectionne} value="Mâle" required />
                            <span>♂ MÂLE</span>
                        </label>
                        <label class="species-card" class:active={sexeSelectionne === 'Femelle'}>
                            <input type="radio" name="sexe" bind:group={sexeSelectionne} value="Femelle" required />
                            <span>♀ FEMELLE</span>
                        </label>
                    </div>
                </div>

                <div class="field">
                    <label>ESPÈCE</label>
                    <div class="species-selector">
                        <label class="species-card" class:active={especeSelectionnee === 'Chien'}>
                            <input type="radio" bind:group={especeSelectionnee} value="Chien" />
                            <span class="icon">🐕</span>
                            <span class="label">CHIEN</span>
                        </label>
                        <label class="species-card" class:active={especeSelectionnee === 'Chat'}>
                            <input type="radio" bind:group={especeSelectionnee} value="Chat" />
                            <span class="icon">🐈</span>
                            <span class="label">CHAT</span>
                        </label>
                    </div>
                </div>

                {#if especeSelectionnee === 'Chien'}
                    <div class="field">
                        <label for="id_race">RACE</label>
                        <select name="id_race" id="id_race" bind:value={raceSelectionneeId} required>
                            <option value="">-- Sélectionner une lignée --</option>
                            {#each data.races.filter(r => r.type === 'Chien') as r}
                                <option value={r.id_race}>{r.nom_race}</option>
                            {/each}
                        </select>
                    </div>

                    {#if raceSelectionneeId}
                        <div class="field">
                            <label>APPARENCE</label>
                            <div class="avatar-grid">
                                {#each imagesDisponibles as img}
                                    <label class="avatar-option">
                                        <input type="radio" name="id_image" value={img.id_image} bind:group={imageSelectionneeId} required />
                                        <div class="avatar-wrapper" class:selected={imageSelectionneeId === img.id_image}>
                                            <img src={img.url_image} alt="Portrait" />
                                        </div>
                                    </label>
                                {/each}
                            </div>
                        </div>
                    {/if}

                {:else if especeSelectionnee === 'Chat'}
                    <div class="field" style="text-align: center; color: #b28543; font-family: 'Cinzel', serif; font-style: italic; margin-top: 10px; padding: 20px; border: 1px dashed #b28543;">
                        <p>🐾 Les lignées félines arriveront bientôt dans le royaume...</p>
                    </div>
                {/if}

                <button type="submit" class="btn-submit-rpg">
                    GRAVER DANS LE REGISTRE
                </button>
            </form>
        </div>
    </div>
{/if}

<style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Poppins:wght@300;400;600&display=swap');

    .page-background { min-height: 100vh; background-size: cover; background-position: center; background-attachment: fixed; position: relative; }
    .overlay { min-height: 100vh; background: rgba(0, 0, 0, 0.4); padding: 30px 20px; box-sizing: border-box; }
    
    .btn-retour { position: absolute; top: 25px; left: 25px; z-index: 100; text-decoration: none; font-family: 'Cinzel', serif; color: #ffd700; font-size: 1.1rem; text-shadow: 2px 2px 4px #000; display: flex; align-items: center; gap: 8px; transition: transform 0.2s; }
    .btn-retour:hover { transform: scale(1.1); color: #fff; }
    
    .chenil-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 50px; /* Ajout d'un grand écart avec la grille des chiens */
    }

    .banner-title-img {
        max-width: 750px;
        width: 100%;
        height: auto;
        object-fit: contain;
        filter: drop-shadow(3px 3px 6px rgba(0,0,0,0.8));
    }

    .btn-inscription-img {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        margin: 15px auto 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: transform 0.2s ease;
        filter: drop-shadow(0 4px 6px rgba(0,0,0,0.5));
    }

    .btn-inscription-img img {
        width: 420px;
        max-width: 100%;
        height: auto;
        object-fit: contain;
        display: block;
    }

    .btn-inscription-img:hover { 
        transform: scale(1.05); 
    }

    .grille { display: flex; flex-wrap: wrap; justify-content: center; gap: 40px; max-width: 1400px; margin: 0 auto; }
    .hero-card-link { text-decoration: none; color: inherit; }

    .hero-card { width: 300px; height: 400px; background-size: 100% 100%; background-repeat: no-repeat; position: relative; transition: transform 0.2s; }
    .hero-card:hover { transform: scale(1.05); }

    .portrait-container { position: absolute; top: -2%; left: 50%; transform: translateX(-50%); width: 175px; height: 175px; z-index: 5; overflow: visible; display: flex; justify-content: center; }
    .hero-img { width: 100%; height: 100%; object-fit: contain; margin-top: -25px; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.6)); }

    .info-container { position: absolute; bottom: 40%; left: 0; right: 0; text-align: center; display: flex; flex-direction: column; align-items: center; z-index: 10; }
    .hero-name { color: white; font-size: 1.5rem; margin: 0; text-shadow: 2px 2px 4px #000; font-family: 'Cinzel', serif; }
    .xp-bar-container { width: 60%; height: 10px; background: rgba(0,0,0,0.8); border: 1px solid #d4af37; border-radius: 5px; margin-top: 6px; overflow: hidden; }
    .xp-fill { height: 100%; background: linear-gradient(90deg, #d4af37, #f2d379); }

    .level-badge { position: absolute; top: -5px; left: -5px; width: 75px; height: 75px; z-index: 20; pointer-events: none; }
    .level-badge img { width: 100%; height: 100%; display: block; }

    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); display: flex; justify-content: center; align-items: center; z-index: 9999; }
    .parchment-form { background: #f4e4bc; padding: 40px; border: 10px solid #4a3728; width: 500px; max-height: 90vh; overflow-y: auto; position: relative; }
    .form-title { font-family: 'Cinzel', serif; color: #4a3728; text-align: center; margin-bottom: 20px; }
    .field { margin-bottom: 20px; display: flex; flex-direction: column; }
    .species-selector { display: flex; gap: 10px; }
    .species-card { flex: 1; border: 2px solid #4a3728; padding: 10px; cursor: pointer; text-align: center; border-radius: 8px; font-weight: bold; }
    .species-card.active { background: #4a3728; color: #f4e4bc; }
    .avatar-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
    .avatar-wrapper { aspect-ratio: 1; border: 3px solid transparent; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
    .avatar-wrapper.selected { border-color: #d4af37; background: rgba(212, 175, 55, 0.2); }
    .avatar-wrapper img { width: 90%; }
    .btn-submit-rpg { padding: 15px; background: #4a3728; color: #f4e4bc; border: 2px solid #d4af37; font-family: 'Cinzel', serif; cursor: pointer; font-size: 1.1rem; width: 100%; }
    .close-btn { position: absolute; top: 10px; right: 15px; font-size: 2rem; background: none; border: none; cursor: pointer; color: #4a3728; }

    /* --- RESPONSIVE MOBILE --- */
    @media (max-width: 768px) {
        .banner-title-img {
            max-width: 95%;
        }
        .chenil-header {
            margin-bottom: 35px;
        }
        .btn-inscription-img {
            margin-top: 10px;
        }
        .btn-inscription-img img {
            width: 320px;
        }
    }
</style>