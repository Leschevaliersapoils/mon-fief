<script lang="ts">
    import { base } from '$app/paths';
    import { supabase } from '$lib/supabase';
    let { data } = $props();

    let hero = $state({ 
        ...data.hero,
        id_prefixe: data.hero?.id_prefixe ?? null,
        id_suffixe: data.hero?.id_suffixe ?? null
    });
    let niveaux = $derived(data.niveaux || []);
    let menuOuvert = $state(false);
    let sexeSelectionne = $state(hero.sexe);
    let imageSelectionneeId = $state(hero.id_image);
    let imagesDisponibles = $derived(
    Array.isArray(data.images) 
        ? data.images.filter((img: any) => {
            const estAvatarDeBase = String(img.id_race) === String(hero.race?.id_race) && !img.id_heros;
            const estMonAvatarPerso = Number(img.id_heros) === Number(hero.id_heros);
            return estAvatarDeBase || estMonAvatarPerso;
         }) 
        : []
);

    let prefixesDisponibles = $derived(data.disponiblePrefixes || []);

    let prefSelectionne = $state(hero.id_prefixe); 
    let suffixeSelectionne = $state(hero.id_suffixe);

    // URL publique ciblée : /ficheheros/[id_du_heros] avec le même ID à la fin
    let urlPartage = $derived(`${window.location.origin}${base}/ficheheros/${hero.id_heros}`);

function ouvrirMenu() {
    sexeSelectionne = hero.sexe;
    menuOuvert = true;
}

function fermerMenu() {
    menuOuvert = false;
}

async function validerModifications() {
    const { error } = await supabase
        .from('heros')
        .update({ 
            sexe: sexeSelectionne,
            id_image: imageSelectionneeId,
            id_prefixe: hero.id_prefixe,
            id_suffixe: hero.id_suffixe})
        .eq('id_heros', hero.id_heros);

    if (error) {
        console.error("Erreur lors de la mise à jour :", error);
    } else {
        fermerMenu();
        window.location.reload();  
    }
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

    function validerMiseAuRepos(event: SubmitEvent) {
        const nomAffichage = hero.nom ? hero.nom.toUpperCase() : "ce compagnon";
        const message = `Voulez-vous mettre ${nomAffichage} au repos ?\n\nIl quittera l'équipe active mais restera conservé dans le chenil.`;
        if (!confirm(message)) {
            event.preventDefault();
        }
    }
</script>

<div class="page-detail" style="background-image: url('{base}/heros/grange.png');">
    <div class="overlay">
        <a href="{base}/heros" class="btn-back">↩ Retour au Chenil</a>

        {#if hero && hero.nom}
            {@const prog = calculerProgression(hero, niveaux)}
            
            <div class="fiche-parchemin">
                <div class="portrait-container">
                    {#if hero.images_profil?.url_image}
                        <img src={hero.images_profil.url_image} alt={hero.nom} class="hero-img-float" />
                    {/if}
                </div>

                <h1 class="hero-title">
                    <span class="titre-prefixe">
                        {hero.sexe === 'Femelle' ? (hero.pref?.texte_feminin || '') : (hero.pref?.texte_masculin || '')}
                    </span>
                    <span class="nom-principal">{hero.nom.toUpperCase()}</span>
                    <span class="titre-suffixe">
                        {hero.sexe === 'Femelle' ? (hero.suffixes?.texte_feminin || '') : (hero.suffixes?.texte_masculin || '')}
                    </span>
                </h1>
                
                <p class="sexe-tag">{hero.sexe || 'Inconnu'}</p>
                <p class="race-type">
                    {hero.race?.nom_race || 'Race inconnue'} • Niveau {hero.niveau || 1}
                </p>

                <div class="xp-section">
                    <div class="xp-text">Expérience : {prog.xpActuelle} / {prog.xpCible} XP</div>
                    
                    <div class="bar-bg">
                        <div class="bar-fill" style="width: {prog.pourcentage}%"></div>
                    </div>
                </div>

                <button class="btn-modifier" onclick={ouvrirMenu}>Modifier le compagnon</button>

                <!-- RÉSEAUX SOCIAUX EN BAS À GAUCHE (Pointent vers /ficheheros/[id]) -->
                <div class="partage-reseaux-coins">
                    <!-- Facebook -->
                    <a href="https://www.facebook.com/sharer/sharer.php?u={encodeURIComponent(urlPartage)}" target="_blank" class="reseau-btn" title="Partager sur Facebook">
                        <img src="{base}/heros/facebook.png" alt="Facebook" />
                    </a>

                    <!-- Twitter / X -->
                    <a href="https://twitter.com/intent/tweet?url={encodeURIComponent(urlPartage)}&text=Viens%20d%C3%A9couvrir%20mon%20compagnon%20sur%20le%20jeu%20!" target="_blank" class="reseau-btn" title="Partager sur Twitter / X">
                        <img src="{base}/heros/twitter.png" alt="Twitter" />
                    </a>

                    <!-- Instagram -->
                    <button type="button" onclick={() => { navigator.clipboard.writeText(urlPartage); alert("Lien public copié ! Tu peux le coller sur Instagram."); }} class="reseau-btn" title="Copier le lien pour Instagram">
                        <img src="{base}/heros/instagram.png" alt="Instagram" />
                    </button>

                    <!-- TikTok -->
                    <button type="button" onclick={() => { navigator.clipboard.writeText(urlPartage); alert("Lien public copié ! Tu peux le partager sur TikTok."); }} class="reseau-btn" title="Copier le lien pour TikTok">
                        <img src="{base}/heros/tiktok.png" alt="TikTok" />
                    </button>
                </div>

                <!-- BOUTON POUBELLE DANS LE COIN INFÉRIEUR DROIT -->
                <form method="POST" onsubmit={validerMiseAuRepos}>
                    <button type="submit" class="btn-delete-corner" title="Mettre au repos">
                        <span class="icon">🗑️</span>
                    </button>
                </form>

                {#if menuOuvert}
                    <div class="modal-overlay">
                        <div class="modal-content">
                            <h3>Modifier les informations</h3>
                    
                            <label>Nom et Titres :</label>

                            <div class="nom-preview-container">
                                <select bind:value={hero.id_prefixe}> 
                                    <option value={null}>Aucun préfixe</option>
                                    {#each prefixesDisponibles as prefItem}
                                        <option value={prefItem.id_pre}>
                                            {sexeSelectionne === 'Femelle' ? prefItem.texte_feminin : prefItem.texte_masculin}
                                        </option>
                                    {/each}
                                </select>
                                
                                <span class="nom-hero">{hero.nom}</span>

                                <select bind:value={hero.id_suffixe}>
                                    <option value={null}>Aucun suffixe</option>
                                    {#each data.disponibleSuffixes as suf}
                                        <option value={suf.id_suf}>
                                            {sexeSelectionne === 'Femelle' ? suf.texte_feminin : suf.texte_masculin}
                                        </option>
                                    {/each}
                                </select>
                            </div>
                    
                            <label for="sexe">Sexe :</label>
                            <select id="sexe" bind:value={sexeSelectionne}>
                                <option value="Mâle">Mâle</option>
                                <option value="Femelle">Femelle</option>
                            </select>

                            <label>Apparence :</label>
                            <div class="avatar-grid">
                                {#each imagesDisponibles as img (img.id_image)}
                                    <label class="avatar-option">
                                        <input 
                                            type="radio" 
                                            name="id_image" 
                                            value={img.id_image} 
                                            bind:group={imageSelectionneeId} 
                                        />
                                        <div class="avatar-wrapper" class:selected={imageSelectionneeId === img.id_image}>
                                            <img src={img.url_image} alt="Portrait" />
                                        </div>
                                    </label>
                                {:else}
                                    <p>Chargement des portraits...</p>
                                {/each}
                            </div>

                            <div class="actions">
                                <button type="button" class="btn-modifier" onclick={fermerMenu}>Annuler</button>
                                <button type="button" class="btn-modifier" onclick={validerModifications}>Valider</button>
                            </div>
                        </div>
                    </div>
                {/if}
            </div>
        {:else}
            <div class="fiche-parchemin">
                <p style="color: #4a3728; font-family: 'Cinzel', serif;">Chargement des données...</p>
            </div>
        {/if}
    </div>
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&display=swap');
    .page-detail { min-height: 100vh; background-size: cover; background-position: center; }
    .overlay { min-height: 100vh; background: rgba(0,0,0,0.6); padding: 40px 20px; display: flex; flex-direction: column; align-items: center; }
    .btn-back { font-family: 'Cinzel', serif; color: #ffd700; text-decoration: none; margin-bottom: 80px; font-size: 1.2rem; text-shadow: 2px 2px 4px #000; z-index: 100; position: relative; }
    .fiche-parchemin { width: 100%; max-width: 450px; background: #f4e4bc; border: 8px solid #4a3728; padding: 40px; text-align: center; box-shadow: 0 0 40px rgba(0,0,0,0.8); position: relative; }
    .portrait-container { width: 220px; height: 220px; margin: -110px auto 10px; display: flex; justify-content: center; align-items: center; z-index: 10; pointer-events: none; }
    .hero-img-float { width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 10px 8px rgba(0,0,0,0.4)); }
    .hero-title {
        display: flex; 
        justify-content: center; 
        align-items: baseline; 
        gap: 0.5rem; 
        font-family: 'Cinzel', serif; 
        color: #4a3728;
        margin: 10px 0;
    }
    .race-type { color: #5d4635; font-style: italic; margin-bottom: 25px; font-weight: bold; font-size: 1.1rem; }
    .xp-section { margin: 30px 0; }
    .xp-text { font-family: 'Cinzel', serif; font-size: 0.9rem; color: #4a3728; margin-bottom: 8px; }
    .bar-bg { width: 100%; height: 16px; background: #dcd0b9; border: 2px solid #4a3728; border-radius: 8px; overflow: hidden; box-shadow: inset 0 2px 4px rgba(0,0,0,0.2); }
    .bar-fill { height: 100%; background: linear-gradient(90deg, #b28543, #ffd700); }

    /* BOUTON POUBELLE DANS LE COIN INFÉRIEUR DROIT */
    .btn-delete-corner { 
        position: absolute; 
        bottom: 15px; 
        right: 15px; 
        background: none; 
        border: none; 
        cursor: pointer; 
        font-size: 1.3rem; 
        padding: 5px; 
        opacity: 0.4; 
        transition: all 0.2s; 
        z-index: 10;
    }
    .btn-delete-corner:hover { 
        opacity: 1; 
        transform: scale(1.2); 
    }

    /* GRILLE DE PARTAGE AGRANDIE DANS LE COIN EN BAS À GAUCHE */
    .partage-reseaux-coins {
        position: absolute;
        bottom: 12px;
        left: 12px;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 6px;
        z-index: 10;
    }

    .reseau-btn {
        width: 32px;
        height: 32px;
        background: transparent;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s;
        padding: 0;
        opacity: 1;
        cursor: pointer;
    }

    .reseau-btn:hover {
        transform: scale(1.15);
    }

    .reseau-btn img {
        width: 28px;
        height: 28px;
        object-fit: contain;
    }

    .modal-overlay { 
        position: fixed; 
        top: 0; 
        left: 0; 
        width: 100vw; 
        height: 100vh; 
        background: rgba(0, 0, 0, 0.7); 
        display: flex; 
        justify-content: center; 
        align-items: center; 
        z-index: 9999; 
        padding: 20px; /* Évite de coller aux bords sur les petits écrans */
    }
    .modal-content {
        background: #fdf5e6 !important;
        padding: 30px !important;
        border-radius: 10px !important;
        border: 4px solid #4a3728 !important;
        box-shadow: 0 10px 30px rgba(0,0,0,0.7) !important;
        width: 90% !important;        
        max-width: 700px !important;  
        max-height: 90vh !important; 
        overflow-y: auto !important; 
    }
    .titre-prefixe, .titre-suffixe {
        font-size: 1.0em; 
        font-weight: bold;
        text-transform: uppercase;
        opacity: 0.8;
    }
    .nom-principal {
        font-size: 1.2em; 
        letter-spacing: 1px;
    }
    .btn-modifier { background-size: cover; background-position: center; border: 2px solid #4a3728; padding: 10px 20px; cursor: pointer; font-family: 'Cinzel', serif; color: #4a3728; font-weight: bold; border-radius: 5px; transition: transform 0.2s; }
    .btn-modifier:hover { transform: scale(1.05); }
    .actions { margin-top: 10px; display: flex; justify-content: center; gap: 10px; }
    .modal-content h3 { font-family: 'Cinzel', serif; font-weight: bold; font-size: 1rem; color: #4a3728; margin-top: 0; margin-bottom: 25px; text-transform: uppercase; border-bottom: 1px solid #c5b399; padding-bottom: 10px; }
    .modal-content label { display: block; font-family: 'Cinzel', serif; font-weight: bold; color: #4a3728; margin-bottom: 8px; text-align: left; }
    .modal-content select { width: 100%; padding: 8px; margin-bottom: 20px; border: 1px solid #4a3728; border-radius: 4px; background: #f4e4bc; font-family: 'Cinzel', serif; cursor: pointer; }
    .avatar-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px; }
    .avatar-option input { display: none; }
    .avatar-wrapper { aspect-ratio: 1; border: 3px solid transparent; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; background: #f4e4bc; }
    .avatar-wrapper.selected { border-color: #d4af37; background: #c5b399; }
    .avatar-wrapper img { width: 90%; object-fit: contain; }
    .nom-preview-container {
        display: flex;
        align-items: center;
        gap: 15px;             
        margin-bottom: 25px;
        justify-content: center;
        flex-wrap: wrap;     
    }
    .nom-preview-container select {
        width: 200px;        
        margin-bottom: 0;
        font-size: 0.8rem;
    }
    .nom-hero { font-family: 'Cinzel', serif; font-weight: bold; color: #4a3728; white-space: nowrap; }
</style>