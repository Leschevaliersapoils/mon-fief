<script lang="ts">
    import { base } from '$app/paths';
    import { enhance } from '$app/forms'; 
    import type { PageData, ActionData } from './$types';
    
    let { data, form }: { data: PageData; form: ActionData } = $props();

    function getYoutubeId(url: string) {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }
</script>

<div class="page-container" style="background: radial-gradient(circle, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.8) 100%), url('{base}/quete/taverne.png'); background-size: cover;">
    <a href="{base}/quete" class="btn-retour-externe">
        <span class="fleche">↩</span> RETOUR AUX QUÊTES
    </a>

    <div class="parchemin-fond" style="background: url('{base}/quete/parcho.png') no-repeat center; background-size: 100% 100%;">
        <div class="contenu-parchemin">
            
            <div class="header-compagnon">
                {#if data.hero?.images_profil?.url_image}
                    <img src={data.hero.images_profil.url_image} alt={data.hero.nom} class="portrait-header" />
                {/if}
                <div class="titre-bloc">
                    <h1>{data.defi?.Nomdefis}</h1>
                    <p class="subtitle">Compagnon : <strong>{data.hero?.nom}</strong> (Niv. {data.hero?.niveau})</p>
                </div>
            </div>

            <div class="description-zone">
                <p>{data.defi?.Description}</p>
            </div>

            {#if data.defi?.lienvideo && getYoutubeId(data.defi.lienvideo)}
                <div class="video-container">
                    <iframe 
                        src="https://www.youtube.com/embed/{getYoutubeId(data.defi.lienvideo)}" 
                        title="Vidéo de la quête" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>
                </div>
            {/if}

            <div class="instructions-zone">
                <h3>Comment valider l'exploit ?</h3>
                <p>Postez votre preuve en mode <strong>Public</strong>. Copiez le lien ci-dessous.</p>
                <p class="note-email">
                    <em>Pas de réseau ? Envoyez votre preuve par mail à <strong>ton.adresse@email.com</strong><br>
                    <strong>Informations à donner :</strong> nom du joueur , du héros et de la quête.</em>
                </p>
            </div>

            <div class="validation-zone">
                <form method="POST" action="?/enregistrerAccomplissement" use:enhance class="formulaire">
                    <input type="hidden" name="id_defi" value={data.defi?.id} />
                    <input type="hidden" name="id_heros" value={data.hero?.id_heros} />
                    
                    {#if form?.success}
                        <div class="success-box">
                            🎉 L'EXPLOIT A ÉTÉ ENREGISTRÉ AVEC SUCCÈS !
                        </div>
                    {:else}
                        <input type="url" name="image_preuve_url" placeholder="Collez votre lien ici..." required />
                        
                        <p class="xp-badge">Récompense : <strong>+{data.defi?.XP} XP</strong></p>
                        
                        {#if form?.error}
                            <p class="error-text">❌ {form.error}</p>
                        {/if}

                        <button type="submit" class="btn-valider">VALIDER L'EXPLOIT</button>
                    {/if}
                </form>
            </div>
        </div>
    </div>
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=MedievalSharp&display=swap');

    .page-container {
        min-height: 100vh;
        padding: 40px 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-size: cover;
    }

    .btn-retour-externe {
        color: #d4af37;
        text-decoration: none;
        font-family: 'Cinzel', serif;
        font-weight: bold;
        margin-bottom: 20px;
        font-size: 1.2rem;
        align-self: flex-start;
    }

    .parchemin-fond {
        background-size: 100% 100%;
        width: 100%;
        max-width: 1300px;
        min-height: 1100px;
        padding: 160px 160px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
    }

    .contenu-parchemin {
        font-family: 'MedievalSharp', cursive;
        color: #3d2b1f;
        text-align: center;
        width: 100%;
        max-width: 700px; 
        margin: 0 auto;
        display: flex;
        flex-direction: column;
    }

    .video-container {
        width: 100%;
        max-width: 700px;
        aspect-ratio: 16 / 9;
        margin: 15px 0;
        border: 4px solid #8b4513;
        overflow: hidden;
    }

    .video-container iframe {
        width: 100%;
        height: 100%;
    }

    .instructions-zone {
        background: rgba(139, 69, 19, 0.1);
        padding: 8px 12px;
        border-radius: 8px;
        margin-bottom: 10px;
        border: 1px dashed #8b4513;
    }

    .instructions-zone h3 { font-family: 'Cinzel', serif; margin: 0 0 5px 0; font-size: 1.1rem; }
    .instructions-zone p { margin: 5px 0; font-size: 0.95rem; }

    .xp-badge { color: #2e5a1c; font-weight: bold; margin: 5px 0; font-size: 1.1rem; }

    .header-compagnon { 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        gap: 20px; 
        border-bottom: 2px solid #8b4513; 
        padding-bottom: 20px; 
        margin-bottom: 15px; 
    }
    
    .titre-bloc h1 { 
        font-family: 'Cinzel', serif; 
        font-size: 2.2rem; 
        margin: 0; 
        line-height: 1.2;
    }

    .subtitle {
        margin: 5px 0 0 0;
        font-size: 1.05rem;
    }

    .portrait-header { 
        width: 130px; 
        height: 130px; 
        border-radius: 50%; 
        border: 3px solid #8b4513; 
        object-fit: cover; 
        flex-shrink: 0;
    }

    .formulaire input { 
        width: 100%; 
        padding: 10px; 
        margin: 10px 0; 
        border: 1px solid #8b4513; 
        background: rgba(0, 0, 0, 0.05); 
        box-sizing: border-box;
        font-family: inherit;
        border-radius: 4px;
    }

    .btn-valider { 
        background: #8b4513; 
        color: #f4e4bc; 
        padding: 12px 20px; 
        border: none; 
        cursor: pointer; 
        font-family: 'Cinzel', serif; 
        width: 100%; 
        font-weight: bold;
        border-radius: 4px;
        font-size: 1rem;
    }
    
    .success-box {
        background: rgba(46, 90, 28, 0.2);
        border: 2px solid #2e5a1c;
        color: #2e5a1c;
        padding: 15px;
        font-family: 'Cinzel', serif;
        font-weight: bold;
        border-radius: 4px;
        margin-top: 15px;
    }
    .error-text { color: #8b0000; font-weight: bold; margin-bottom: 10px; }

    /* --- ADAPTATION MOBILE --- */
    @media (max-width: 768px) {
        .page-container {
            padding: 10px 5px;
        }

        .parchemin-fond {
            /* Réduction drastique du padding pour que le texte rentre dans la zone utile du parchemin */
            padding: 90px 45px; 
            min-height: auto;
            background-size: 100% 100%;
        }

        .header-compagnon {
            flex-direction: column; /* Le portrait passe au-dessus du titre */
            text-align: center;
            gap: 10px;
            padding-bottom: 12px;
            margin-bottom: 10px;
        }

        .portrait-header {
            width: 90px;
            height: 90px; /* Taille parfaite, évite l'effet ovale écrasé */
        }

        .titre-bloc h1 {
            font-size: 1.3rem; /* Titre plus petit pour ne pas déborder sur les côtés */
        }

        .subtitle {
            font-size: 0.85rem;
        }

        .description-zone p {
            font-size: 0.9rem;
            line-height: 1.3;
        }

        .instructions-zone {
            padding: 6px 8px;
        }

        .instructions-zone h3 {
            font-size: 0.95rem;
        }

        .instructions-zone p, .instructions-zone .note-email {
            font-size: 0.75rem;
            line-height: 1.2;
        }

        .formulaire input {
            padding: 8px;
            font-size: 0.9rem;
        }

        .btn-valider {
            padding: 10px;
            font-size: 0.9rem;
        }
    }
</style>