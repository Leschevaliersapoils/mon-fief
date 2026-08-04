<script lang="ts">
  let { data } = $props();

  let tousLesHeros = $derived(Array.isArray(data?.topHeros) ? data.topHeros : []);
  let royaumeActifs = $derived(Array.isArray(data?.tousLesHerosActifs) ? data.tousLesHerosActifs : []);

  // Top 3 pour le podium
  let topTrois = $derived(
    tousLesHeros.slice(0, 3).map((heros: any, index: number) => {
      let rangReel = index + 1;
      let estFeminin = heros?.sexe === 'Femelle' || heros?.sexe === 'F';

      let prefixe = heros?.pref 
        ? (estFeminin ? heros.pref.texte_feminin : heros.pref.texte_masculin) 
        : '';

      let suffixe = heros?.suffixes 
        ? (estFeminin ? heros.suffixes.texte_feminin : heros.suffixes.texte_masculin) 
        : '';

      return {
        ...heros,
        rang: rangReel,
        stele: `/pantheon/stele${rangReel}.png`,
        titreImg: `/pantheon/titre${rangReel}.png`,
        prefixe,
        suffixe,
        nomUpper: heros?.nom ? heros.nom.toUpperCase() : ''
      };
    })
  );

  let podiumVisuel = $derived(
    topTrois.length === 3 
      ? [topTrois[1], topTrois[0], topTrois[2]] 
      : topTrois
  );

  // Suite du classement général à partir du 4e
  let suiteClassement = $derived(
    tousLesHeros.slice(3).map((heros: any, index: number) => {
      let rangReel = index + 4;
      let estFeminin = heros?.sexe === 'Femelle' || heros?.sexe === 'F';

      let prefixe = heros?.pref 
        ? (estFeminin ? heros.pref.texte_feminin : heros.pref.texte_masculin) 
        : '';

      let suffixe = heros?.suffixes 
        ? (estFeminin ? heros.suffixes.texte_feminin : heros.suffixes.texte_masculin) 
        : '';

      let nomJoueur = heros?.Joueurs?.Surnom ? `(${heros.Joueurs.Surnom})` : '';
      let urlAvatar = heros?.images_profil?.url_image || '';

      return {
        ...heros,
        rang: rangReel,
        prefixe,
        suffixe,
        nomAffiche: heros?.nom || 'Inconnu',
        nomJoueur,
        urlAvatar,
        niveau: heros?.niveau || 1,
        xpTotal: heros?.experience ? heros.experience.toLocaleString('fr-FR') : '0'
      };
    })
  );

  // Traitement des héros du joueur connecté avec calcul de leur VRAI rang global dans le royaume
  let mesHerosClassement = $derived(
    (Array.isArray(data?.herosPerso) ? data.herosPerso : []).map((heros: any) => {
      let estFeminin = heros?.sexe === 'Femelle' || heros?.sexe === 'F';

      let prefixe = heros?.pref 
        ? (estFeminin ? heros.pref.texte_feminin : heros.pref.texte_masculin) 
        : '';

      let suffixe = heros?.suffixes 
        ? (estFeminin ? heros.suffixes.texte_feminin : heros.suffixes.texte_masculin) 
        : '';

      let urlAvatar = heros?.images_profil?.url_image || '';

      // Calcul du vrai rang global : position du chien dans le royaume trié par XP
      let indexGlobal = royaumeActifs.findIndex((h: any) => h.id_heros === heros.id_heros);
      let vraiRang = indexGlobal !== -1 ? indexGlobal + 1 : '-';

      return {
        ...heros,
        vraiRang,
        prefixe,
        suffixe,
        nomAffiche: heros?.nom || 'Inconnu',
        urlAvatar,
        niveau: heros?.niveau || 1,
        xpTotal: heros?.experience ? heros.experience.toLocaleString('fr-FR') : '0'
      };
    })
  );
</script>

<div class="page-quete" style="background-image: url('/pantheon/fond.png');">

    <div class="container">
        <header class="main-header">
            <img src="/pantheon/banniere.png" alt="Mur des Légendes" class="banner-img" />
        </header>

        {#if topTrois.length > 0}
            <div class="podium-section">
                <div class="podium-container">
                    {#each podiumVisuel as heros}
                        <div class="podium-slot rang-{heros.rang}">
                            
                            <div class="portrait-wrapper">
                                {#if heros?.images_profil?.url_image}
                                    <img src={heros.images_profil.url_image} alt={heros.nom} class="hero-img" />
                                {/if}
                            </div>

                            <div class="socle-stete">
                                <img src={heros.stele} alt="Stèle" class="stele-img" />
                                
                                <div class="titre-img-wrapper">
                                    <img src={heros.titreImg} alt="Titre du héros" class="titre-img" />
                                    <div class="texte-sur-image">
                                        {#if heros.prefixe}
                                            <span class="ligne-prefixe">{heros.prefixe}</span>
                                        {/if}
                                        <span class="ligne-nom">{heros.nomUpper}</span>
                                        {#if heros.suffixe}
                                            <span class="ligne-suffixe">{heros.suffixe}</span>
                                        {/if}
                                    </div>
                                </div>
                            </div>

                        </div>
                    {/each}
                </div>
            </div>
        {/if}

        <!-- Tableau de classement général (Du 4e et +) -->
        {#if suiteClassement.length > 0}
            <div class="classement-section">
                <div class="classement-cadre">
                    <h3 class="titre-tableau">Classement Général</h3>
                    <table class="classement-table">
                        <thead>
                            <tr>
                                <th class="col-rang">Rang</th>
                                <th class="col-heros">Héros</th>
                                <th class="col-niveau">Niveau</th>
                                <th class="col-xp">XP Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each suiteClassement as ligne}
                                <tr class="classement-ligne">
                                    <td class="col-rang"><strong>{ligne.rang}</strong></td>
                                    <td class="col-heros">
                                        <div class="heros-cellule">
                                            {#if ligne.urlAvatar}
                                                <img src={ligne.urlAvatar} alt="" class="avatar-mini" />
                                            {/if}
                                            <span class="nom-texte">
                                                {#if ligne.prefixe}<span class="table-prefixe">{ligne.prefixe} </span>{/if}
                                                {ligne.nomAffiche}
                                                {#if ligne.suffixe}<span class="table-suffixe"> {ligne.suffixe}</span>{/if}
                                                {#if ligne.nomJoueur}<span class="table-joueur"> {ligne.nomJoueur}</span>{/if}
                                            </span>
                                        </div>
                                    </td>
                                    <td class="col-niveau">{ligne.niveau}</td>
                                    <td class="col-xp">{ligne.xpTotal}</td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </div>
        {/if}

        <!-- Panneau : Mon Classement avec le VRAI rang global -->
        {#if mesHerosClassement.length > 0}
            <div class="classement-section">
                <div class="classement-cadre cadre-perso">
                    <h3 class="titre-tableau">Mon Classement Personnel</h3>
                    <table class="classement-table">
                        <thead>
                            <tr>
                                <th class="col-rang">Rang</th>
                                <th class="col-heros">Mes Chiens</th>
                                <th class="col-niveau">Niveau</th>
                                <th class="col-xp">XP Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each mesHerosClassement as ligne}
                                <tr class="classement-ligne">
                                    <td class="col-rang"><strong>{ligne.vraiRang}</strong></td>
                                    <td class="col-heros">
                                        <div class="heros-cellule">
                                            {#if ligne.urlAvatar}
                                                <img src={ligne.urlAvatar} alt="" class="avatar-mini" />
                                            {/if}
                                            <span class="nom-texte">
                                                {#if ligne.prefixe}<span class="table-prefixe">{ligne.prefixe} </span>{/if}
                                                {ligne.nomAffiche}
                                                {#if ligne.suffixe}<span class="table-suffixe"> {ligne.suffixe}</span>{/if}
                                            </span>
                                        </div>
                                    </td>
                                    <td class="col-niveau">{ligne.niveau}</td>
                                    <td class="col-xp">{ligne.xpTotal}</td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </div>
        {/if}
    </div>
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&display=swap');

    .page-quete { min-height: 100vh; height: auto; background-size: cover; background-position: center; background-attachment: fixed; padding: 40px 20px 80px 20px; position: relative; box-sizing: border-box; }
    .btn-retour { position: absolute; top: 25px; left: 25px; z-index: 100; text-decoration: none; font-family: 'Cinzel', serif; color: #ffd700; text-shadow: 2px 2px 4px #000; display: flex; align-items: center; gap: 8px; font-size: 0.95rem; }
    .container { max-width: 1400px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; }
    .main-header { padding-top: 10px; width: 100%; max-width: 700px; display: flex; justify-content: center; align-items: center; margin-bottom: 10px; }
    .banner-img { width: 100%; height: auto; object-fit: contain; filter: drop-shadow(0 5px 15px rgba(0,0,0,0.7)); }
    .podium-section { width: 100%; display: flex; justify-content: center; padding: 20px 0; box-sizing: border-box; }
    .podium-container { display: flex; justify-content: center; align-items: flex-end; gap: 25px; width: 100%; max-width: 1200px; box-sizing: border-box; }
    
    .podium-slot { display: flex; flex-direction: column; align-items: center; position: relative; flex: 1; max-width: 400px; }
    .podium-slot.rang-2 { order: 1; z-index: 2; }
    .podium-slot.rang-1 { order: 2; z-index: 3; }
    .podium-slot.rang-3 { order: 3; z-index: 1; }
    
    .portrait-wrapper { display: flex; justify-content: center; align-items: center; margin-bottom: -50px; position: relative; z-index: 1; }
    .hero-img { width: 200px; height: auto; object-fit: contain; border-radius: 0; border: none; -webkit-mask-image: radial-gradient(circle, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 95%); mask-image: radial-gradient(circle, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 95%); }
    
    .socle-stete { width: 100%; display: flex; justify-content: center; position: relative; z-index: 2; }
    .stele-img { width: 100%; height: auto; object-fit: contain; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.8)); display: block; }
    
    .titre-img-wrapper { position: absolute; bottom: 20%; left: 50%; transform: translateX(-50%); width: 85%; max-width: 340px; display: flex; align-items: center; z-index: 10; }
    .titre-img { width: 100%; height: auto; object-fit: contain; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.8)); display: block; }
    .texte-sur-image { position: absolute; left: 0; right: 10px; height: 100%; font-family: 'Cinzel', serif; color: #f4e4bc; text-shadow: 2px 2px 4px #000, 0 0 2px #000; display: flex; flex-direction: column; justify-content: center; font-weight: bold; z-index: 11; }
    
    /* Tailles de texte de base (grand écran) */
    .ligne-prefixe { font-size: 0.8rem; opacity: 0.9; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: auto; align-self: flex-start; margin-left: 85px; }
    .ligne-nom { font-size: 0.9rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: auto; align-self: center; margin-left: 35px; }
    .ligne-suffixe { font-size: 0.8rem; opacity: 0.9; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: auto; align-self: flex-end; margin-right: 30px; }

    /* --- Styles des Tableaux de Classement --- */
    .classement-section { width: 100%; max-width: 900px; margin-top: 30px; margin-bottom: 20px; display: flex; justify-content: center; }
    .classement-cadre { width: 100%; background-color: #2b1f14; border: 8px solid #5a4025; box-shadow: 0 15px 30px rgba(0,0,0,0.8), inset 0 0 20px rgba(0,0,0,0.9); padding: 20px; box-sizing: border-box; }
    .cadre-perso { border-color: #704b2b; background-color: #231911; }
    .titre-tableau { font-family: 'Cinzel', serif; color: #ffd700; text-align: center; margin-top: 0; margin-bottom: 15px; font-size: 1.1rem; text-shadow: 2px 2px 4px #000; letter-spacing: 1px; border-bottom: 1px solid #5a4025; padding-bottom: 8px; }
    .classement-table { width: 100%; border-collapse: separate; border-spacing: 0 8px; font-family: 'Cinzel', serif; color: #f4e4bc; }
    .classement-table th { font-size: 0.9rem; color: #ffd700; text-shadow: 2px 2px 3px #000; padding: 8px 15px; text-align: left; border-bottom: 2px solid #5a4025; }
    .classement-ligne { background: rgba(50, 35, 20, 0.85); box-shadow: inset 0 0 10px rgba(0,0,0,0.6), 0 4px 6px rgba(0,0,0,0.4); border: 1px solid #5a4025; }
    .classement-ligne td { padding: 10px 15px; font-size: 0.9rem; text-shadow: 1px 1px 2px #000; vertical-align: middle; }
    
    .heros-cellule { display: flex; align-items: center; gap: 12px; }
    .avatar-mini { width: 40px; height: 40px; object-fit: contain; background: transparent; border: none; filter: drop-shadow(0 2px 3px rgba(0,0,0,0.8)); flex-shrink: 0; }
    
    .nom-texte { color: #ffebad; font-weight: bold; }
    .table-prefixe, .table-suffixe { font-size: 0.8rem; color: #d4af37; font-weight: normal; opacity: 0.9; }
    .table-joueur { font-size: 0.8rem; color: #a0a0a0; font-weight: normal; font-style: italic; }

    .col-rang { width: 15%; text-align: center; }
    .col-heros { width: 45%; }
    .col-niveau { width: 20%; text-align: center; }
    .col-xp { width: 20%; text-align: right; }

    /* --- Adaptation pour écran réduit / mobile --- */
    @media (max-width: 768px) {
        .podium-container { flex-direction: column; align-items: center; gap: 30px; }
        .podium-slot.rang-1 { order: 1; }
        .podium-slot.rang-2 { order: 2; }
        .podium-slot.rang-3 { order: 3; }
        .podium-slot { max-width: 380px; width: 100%; }
        
        /* Réduction dynamique de la taille des polices et des marges du bandeau sur mobile */
        .ligne-prefixe { font-size: 0.65rem; margin-left: 65px; }
        .ligne-nom { font-size: 0.75rem; margin-left: 25px; }
        .ligne-suffixe { font-size: 0.65rem; margin-right: 20px; }

        .classement-section { padding: 0 10px; }
        .classement-table th, .classement-ligne td { font-size: 0.75rem; padding: 8px 6px; }
        .avatar-mini { width: 32px; height: 32px; }
    }
</style>