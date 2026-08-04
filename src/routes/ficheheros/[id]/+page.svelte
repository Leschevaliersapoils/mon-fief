<script lang="ts">
import { supabase } from '$lib/supabase';
    let { data } = $props();

    let hero = $state({ 
        ...data.hero,
        id_prefixe: data.hero?.id_prefixe ?? null,
        id_suffixe: data.hero?.id_suffixe ?? null
    });
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
</script>

<div class="page-detail">
    <div class="overlay">
        {#if hero && hero.nom}
            <div class="fiche-parchemin">
                <!-- Logo / Blason dans le coin supérieur droit -->
                <img src="/Logo2.png" alt="Blason" class="blason-coin" />

                <div class="titre-ordre-container">
                    <svg viewBox="0 0 500 140" class="texte-arc">
                        <path id="arcPath" d="M 20, 110 Q 250, 10 480, 110" fill="none"/>
                        <text>
                            <textPath href="#arcPath" startOffset="50%" text-anchor="middle">
                                L'ORDRE DES CHEVALIERS À POILS
                            </textPath>
                        </text>
                    </svg>
                </div>

                <div class="portrait-container">
                    {#if hero.images_profil?.url_image}
                        <img src={hero.images_profil.url_image} alt={hero.nom} class="hero-img-float" />
                    {/if}
                </div>

                <div class="contenu-texte">
                    <h1 class="hero-title-block">
                        <span class="titre-prefixe">
                            {hero.sexe === 'Femelle' ? (hero.pref?.texte_feminin || '') : (hero.pref?.texte_masculin || '')}
                        </span>
                        <span class="nom-principal">{hero.nom.toUpperCase()}</span>
                        <span class="titre-suffixe">
                            {hero.sexe === 'Femelle' ? (hero.suffixes?.texte_feminin || '') : (hero.suffixes?.texte_masculin || '')}
                        </span>
                    </h1>
                    
                    <!-- Badge de niveau avec infobulle couleur parchemin -->
                    <div class="niveau-badge-container">
                        <div class="tooltip-container">
                            <img 
                                src={`/chronique/${hero.niveau || 1}.png`} 
                                alt="Badge de niveau" 
                                class="img-niveau" 
                            />
                            <span class="tooltip-text">Niveau {hero.niveau || 1}</span>
                        </div>
                    </div>
                </div>

                <div class="footer-aventure">
                    <p>« En quête de gloire et d'os sacrés ! »</p>
                </div>

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
    
        <div class="cta-rejoindre-container">
            <p class="cta-texte">Toi aussi, rejoins l'Ordre et monte le niveau de tes héros !</p>
            <a href="/inscription" class="btn-rejoindre">Rejoindre l'Ordre</a>
        </div>
    </div>
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=IM+Fell+English+SC&display=swap'); 
    
    .page-detail { 
        position: relative;
        min-height: 100vh; 
        background-image: url('/Fondaccueil.jpg');
        background-size: cover; 
        background-position: center; 
    }

    .overlay { 
        position: relative;
        min-height: 100vh; 
        background: rgba(0, 0, 0, 0.4); 
        padding: 40px 20px; 
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        justify-content: center; 
    }

    .fiche-parchemin { 
        width: 100%;
        max-width: 550px; 
        min-height: 750px;
        background: url('/ficheheros/cadre.png') no-repeat center center;
        background-size: 100% 100%;
        padding: 40px 30px; 
        text-align: center; 
        position: relative; 
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
    }

    /* Style du logo en haut à droite */
    .blason-coin {
        position: absolute;
        top: 30px;
        right: 35px;
        width: 70px; 
        height: auto;
        object-fit: contain;
        z-index: 20;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
    }

    .titre-ordre-container {
        width: 100%;
        height: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 55px; /* Décalage vers le bas augmenté ici */
        margin-bottom: -10px;
    }

    .texte-arc {
        width: 450px;
        height: 150px;
        fill: #4a3728; 
        font-family: 'IM Fell English SC', serif;
        font-size: 1.45rem; 
        letter-spacing: 2px;
        font-weight: bold;
        overflow: visible;
    }

    .portrait-container { 
        width: 100%;
        max-width: 260px;
        aspect-ratio: 1;
        display: flex; 
        justify-content: center; 
        align-items: center; 
        margin-bottom: 20px;
        z-index: 10; 
        position: relative;
    }

    .hero-img-float { 
        width: 100%; 
        height: 100%; 
        object-fit: contain; 
        filter: drop-shadow(0 8px 8px rgba(0,0,0,0.4)); 
        z-index: 1;
    }

    .contenu-texte {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 5px; 
    }

    .hero-title-block {
        display: flex;
        flex-wrap: nowrap; 
        justify-content: center;
        align-items: baseline;
        gap: 0.3rem; 
        font-family: 'Cinzel', serif;
        color: #4a3728;
        margin: 10px 0;
        font-size: 1.1rem;
        width: 100%;
        box-sizing: border-box;
    }

    .titre-prefixe, .titre-suffixe {
        font-size: 0.9em;
        font-weight: bold;
        text-transform: uppercase;
        opacity: 0.8;
        flex-shrink: 0; 
    }

    .nom-principal {
        font-size: 1.3em; 
        letter-spacing: 1px;
        font-weight: bold;
    }

    .race-type { 
        color: #5d4635; 
        font-style: italic; 
        margin-top: 5px;
        font-weight: bold; 
        font-size: 1.1rem; 
    }

    /* Style pour l'image du niveau et son infobulle */
    .niveau-badge-container {
        margin-top: 8px;
        display: flex;
        justify-content: center;
    }

    .tooltip-container {
        position: relative;
        display: inline-block;
        cursor: pointer;
    }

    .img-niveau {
        max-width: 80px;
        height: auto;
        object-fit: contain;
    }

    .tooltip-container .tooltip-text {
        visibility: hidden;
        width: 85px;
        background-color: #fdf5e6;
        color: #4a3728;
        font-family: 'Cinzel', serif;
        font-weight: bold;
        font-size: 0.8rem;
        text-align: center;
        border-radius: 4px;
        border: 2px solid #4a3728;
        padding: 4px 0;
        position: absolute;
        z-index: 100;
        bottom: 110%;
        left: 50%;
        transform: translateX(-50%);
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        opacity: 0;
        transition: opacity 0.2s;
    }

    .tooltip-container:hover .tooltip-text {
        visibility: visible;
        opacity: 1;
    }

    .footer-aventure {
        margin-top: auto; 
        width: 100%;
        padding: 25px 20px;
        border-top: 1px solid #c5b399; 
        color: #6e553d;
        font-family: 'IM Fell English SC', serif; 
        font-style: italic;
        font-size: 1.1rem;
        background: rgba(233, 217, 187, 0.3); 
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
    }

    .modal-content {
        background: #fdf5e6 !important;
        padding: 30px !important;
        border-radius: 10px !important;
        border: 4px solid #4a3728 !important;
        box-shadow: 0 10px 30px rgba(0,0,0,0.7) !important;
        width: 90% !important;        
        max-width: 700px !important;  
        min-height: 400px !important; 
    }

    .btn-modifier {
        background-image: url('/cour/parchemin.png');
        background-size: cover;
        background-position: center;
        border: 2px solid #4a3728;
        padding: 10px 20px;
        cursor: pointer;
        font-family: 'Cinzel', serif;
        color: #4a3728;
        font-weight: bold;
        border-radius: 5px;
        transition: transform 0.2s;
    }

    .btn-modifier:hover {
        transform: scale(1.05);
    }

    .actions {
        margin-top: 10px;
        display: flex;
        justify-content: center;
        gap: 10px;
    }

    .modal-content h3 {
        font-family: 'Cinzel', serif;
        font-weight: bold;
        font-size: 1rem;
        color: #4a3728;
        margin-top: 0;
        margin-bottom: 25px;
        text-transform: uppercase;
        border-bottom: 1px solid #c5b399;
        padding-bottom: 10px;
    }

    .modal-content label {
        display: block;
        font-family: 'Cinzel', serif;
        font-weight: bold;
        color: #4a3728;
        margin-bottom: 8px;
        text-align: left;
    }

    .modal-content select {
        width: 100%;
        padding: 8px;
        margin-bottom: 20px;
        border: 1px solid #4a3728;
        border-radius: 4px;
        background: #f4e4bc;
        font-family: 'Cinzel', serif;
        cursor: pointer;
    }

    .avatar-grid { 
        display: grid; 
        grid-template-columns: repeat(3, 1fr); 
        gap: 10px; 
        margin-bottom: 20px;
    }

    .avatar-option input { 
        display: none; 
    }

    .avatar-wrapper { 
        aspect-ratio: 1; 
        border: 3px solid transparent; 
        border-radius: 8px; 
        cursor: pointer;
        display: flex; 
        align-items: center; 
        justify-content: center;
        background: #f4e4bc;
    }

    .avatar-wrapper.selected { 
        border-color: #d4af37; 
        background: #c5b399; 
    }

    .avatar-wrapper img { 
        width: 90%; 
        object-fit: contain; 
    }

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

    .nom-hero {
        font-family: 'Cinzel', serif;
        font-weight: bold;
        color: #4a3728;
        white-space: nowrap;
    }

    .cta-rejoindre-container {
        margin-top: 25px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
    }

    .cta-texte {
        color: #fdf5e6;
        font-family: 'IM Fell English SC', serif;
        font-size: 1.2rem;
        text-shadow: 0 2px 4px rgba(0,0,0,0.8);
        margin: 0;
    }

    .btn-rejoindre {
        display: inline-block;
        background: #fdf5e6;
        border: 3px solid #4a3728;
        padding: 12px 28px;
        font-family: 'Cinzel', serif;
        color: #4a3728;
        font-weight: bold;
        font-size: 1rem;
        text-decoration: none;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        transition: transform 0.2s, background-color 0.2s;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .btn-rejoindre:hover {
        transform: scale(1.05);
        background: #f4e4bc;
    }

    /* --- RESPONSOME MOBILE --- */
    @media (max-width: 600px) {
        .fiche-parchemin {
            padding: 30px 15px;
        }
        .texte-arc {
            font-size: 1.0rem;
        }
        .hero-title-block {
            font-size: 0.75rem;
            gap: 0.15rem;
        }
    }
</style>