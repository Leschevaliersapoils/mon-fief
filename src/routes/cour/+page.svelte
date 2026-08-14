<script>
  import { base } from '$app/paths';

  let { data } = $props(); 
</script>

<div class="cour-container" style="min-height: 100vh; width: 100vw; background: url('{base}/cour/fondcour.png') center center / cover no-repeat fixed; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding: 30px 10px; box-sizing: border-box; overflow-y: auto; font-family: 'Poppins', sans-serif;">
  
  <!-- BANNIÈRE DU HAUT -->
  <header class="cour-banner" style="width: 100%; max-width: 650px; height: 130px; background-image: url('{base}/cour/parchemin.png'); background-size: 100% 100%; background-repeat: no-repeat; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; filter: drop-shadow(0 5px 10px rgba(0,0,0,0.4)); flex-shrink: 0; opacity: 0.95;">
    <div class="banner-content" style="text-align: center; padding: 0 40px;">
      <h1 style="font-family: 'Cinzel', serif; color: #3d2b1f; font-size: 1.5rem; margin: 0; text-transform: uppercase;">Bienvenue dans ton Fief, {data.surnom.toUpperCase()}</h1>
      <p style="color: #5d4a3a; margin: 2px 0 0 0; font-size: 0.8rem; font-style: italic;">Tes exploits sont consignés ici. Quelle sera ta prochaine quête ?</p>
    </div>
  </header>

  <div class="cour-grid">
    
    <div class="card">
      <div class="card-inner">
        <img src="{base}/cour/chenil.png" alt="Chenil" class="illustration" style="filter: drop-shadow(2px 4px 5px rgba(0,0,0,0.3));" />
        <div class="card-body">
          <h2 style="font-family: 'Cinzel', serif; color: #3d2b1f; text-transform: uppercase;">Chenil des Héros</h2>
          <p class="subtitle" style="font-style: italic;">Le refuge de vos braves compagnons. Recrutez vos héros et suivez les.</p>
          <a href="{base}/heros" class="btn-action">ENTREZ</a>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-inner">
        <img src="{base}/cour/tableau.png" alt="Tableau" class="illustration" style="filter: drop-shadow(2px 4px 5px rgba(0,0,0,0.3));" />
        <div class="card-body">
          <h2 style="font-family: 'Cinzel', serif; color: #3d2b1f; text-transform: uppercase;">Tableau des Quêtes</h2>
          <p class="subtitle" style="font-style: italic;">Le royaume a besoin d'aide. Quel exploit accomplirez-vous ?</p>
          <a href="{base}/quete" class="btn-action">CONSULTEZ</a>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-inner">
        <img src="{base}/cour/chronique.png" alt="Chronique" class="illustration" style="filter: drop-shadow(2px 4px 5px rgba(0,0,0,0.3));" />
        <div class="card-body">
          <h2 style="font-family: 'Cinzel', serif; color: #3d2b1f; text-transform: uppercase;">Les Chroniques</h2>
          <p class="subtitle" style="font-style: italic;">Suivez les exploits du Royaume et de vos amis</p>
          <a href="{base}/chronique" class="btn-action">FEUILLETEZ</a>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-inner">
        <img src="{base}/cour/legende.png" alt="Légende" class="illustration" style="filter: drop-shadow(2px 4px 5px rgba(0,0,0,0.3));" />
        <div class="card-body">
          <h2 style="font-family: 'Cinzel', serif; color: #3d2b1f; text-transform: uppercase;">Le Panthéon des Légendes</h2>
          <p class="subtitle" style="font-style: italic;">Gravez votre nom aux côtés des plus grands protecteurs.</p>
          <a href="{base}/pantheon" class="btn-action">ADMIREZ</a>
        </div>
      </div>
    </div>
    
  </div>

  <!-- BANNIÈRE FORGE -->
  <a href="{base}/forge" class="forge-banner-container" style="width: 100%; max-width: 520px; display: flex; justify-content: center; align-items: center; transition: transform 0.3s ease; filter: drop-shadow(0 5px 10px rgba(0,0,0,0.4)); margin-bottom: 30px; flex-shrink: 0; text-decoration: none;">
    <img src="{base}/cour/forge.png" alt="Forge des Héros" class="forge-img flames-animation" style="width: 100%; height: auto; object-fit: contain; display: block;" />
  </a>

</div>

<style>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Poppins:ital,wght@0,400;0,600;1,400&display=swap');

.cour-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  width: 100%;
  max-width: 1200px;
  margin-bottom: 20px;
}

/* Style Bureau : Colonne verticale */
.card {
  height: 480px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 40px 15px;
  box-sizing: border-box;
  transition: transform 0.3s ease;
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url('./cour/colonne.png');
}

.card:hover { 
  transform: translateY(-10px); 
}

.card-inner {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.illustration {
  width: 220px;
  height: 220px;
  object-fit: contain;
}

.card-body {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  justify-content: center;
}

.card h2 {
  font-size: 0.95rem;
  margin: 10px 0 5px 0;
}

.subtitle {
  font-size: 0.75rem;
  color: #5d4a3a;
  line-height: 1.3;
  margin-bottom: 15px;
  min-height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-action {
  background: #4a3721;
  color: #fbbf24;
  border: 1.5px solid #322518;
  padding: 8px 20px;
  font-family: 'Cinzel', serif;
  font-weight: bold;
  font-size: 0.75rem;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
  text-transform: uppercase;
  text-decoration: none;
}

.btn-action:hover {
  background: #fbbf24;
  color: #4a3721;
  transform: scale(1.05);
}

.forge-banner-container:hover { 
  transform: translateY(-5px); 
}

.flames-animation { 
  animation: dance-flames 1.5s infinite ease-in-out; 
}

@keyframes dance-flames {
  0% {
    transform: translateY(0) scale(1);
    filter: drop-shadow(0 0 4px rgba(255, 120, 0, 0.6)) brightness(1);
  }
  50% {
    transform: translateY(-3px) scale(1.02);
    filter: drop-shadow(0 0 16px rgba(255, 60, 0, 0.9)) brightness(1.2);
  }
  100% {
    transform: translateY(0) scale(1);
    filter: drop-shadow(0 0 4px rgba(255, 120, 0, 0.6)) brightness(1);
  }
}

@media (max-width: 1000px) {
  .cour-grid { 
    grid-template-columns: repeat(2, 1fr); 
  }
  .cour-banner { 
    max-width: 90%; 
  }
  .forge-banner-container { 
    max-width: 80%; 
  }
}

/* --- ADAPTATION MOBILE (GSM) : Parchemin horizontal --- */
@media (max-width: 600px) {
  .cour-container { 
    padding: 15px 5px; 
  }

  .cour-banner {
    height: 100px;
    max-width: 95%;
    opacity: 0.9;
  }

  .banner-content { 
    padding: 0 20px; 
  }
  .banner-content h1 { 
    font-size: 1.1rem; 
  }
  .banner-content p { 
    font-size: 0.7rem; 
  }

  .cour-grid {
    grid-template-columns: 1fr;
    gap: 10px;
    max-width: 95%;
  }

  .card {
    height: auto;
    min-height: unset;
    padding: 12px 15px;
    background-image: url('./cour/parchemin.png');
    background-size: 100% 100%;
    filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
  }

  .card-inner {
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 12px;
    height: auto;
  }

  .illustration {
    width: 65px;
    height: 65px;
    flex-shrink: 0;
  }

  .card-body {
    align-items: flex-start;
    text-align: left;
    justify-content: center;
    flex-grow: 1;
  }

  .card h2 { 
    font-size: 0.8rem; 
    margin: 0 0 2px 0; 
    color: #3d2b1f;
  }

  .subtitle {
    font-size: 0.6rem;
    margin-bottom: 6px;
    min-height: auto;
    justify-content: flex-start;
    text-align: left;
    color: #5d4a3a;
  }

  .btn-action { 
    padding: 4px 10px; 
    font-size: 0.6rem; 
  }

  .forge-banner-container { 
    max-width: 95%; 
  }
}
</style>