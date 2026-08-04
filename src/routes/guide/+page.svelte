<div class="guide-container">
  <header class="guide-header">
    <h1>Le Grimoire des Aventuriers</h1>
    <p>Comment transformer votre fidèle compagnon en légende du royaume.</p>
  </header>

  <div class="steps-grid">
    <div class="step-card">
      <div class="step-number">1</div>
      <h3>Prêter Serment</h3>
      <p>Créez votre compte de Chevalier (humain) et enregistrez votre premier héros à poils, plumes ou écailles.</p>
    </div>

    <div class="step-card">
      <div class="step-number">2</div>
      <h3>Accomplir des Quêtes</h3>
      <p>Chaque soin, balade ou exercice est une quête. Validez-les pour faire gagner de l'expérience à votre compagnon.</p>
    </div>

    <div class="step-card">
      <div class="step-number">3</div>
      <h3>Monter en Niveau</h3>
      <p>Plus votre héros est actif, plus il grimpe dans les rangs de la Taverne, débloquant des badges et des titres épiques.</p>
    </div>
  </div>

  <div class="cta-section">
    <a href="/inscription" class="btn-start">Commencer ma première quête</a>
    <br>
    <a href="/" class="back-link">Retour au château</a>
  </div>
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Poppins:wght@300;400;600&display=swap');

  .guide-container {
    min-height: 100vh;
    background: #0f0f0f;
    color: white;
    font-family: 'Poppins', sans-serif;
    padding: 80px 20px;
    text-align: center;
  }

  .guide-header h1 {
    font-family: 'Cinzel', serif;
    font-size: 3rem;
    color: #fbbf24;
    margin-bottom: 10px;
  }

  .guide-header p {
    color: #888;
    margin-bottom: 60px;
  }

  .steps-grid {
    display: flex;
    justify-content: center;
    gap: 30px;
    flex-wrap: wrap;
    max-width: 1200px;
    margin: 0 auto;
  }

  .step-card {
    background: #1e1e1e;
    padding: 40px 30px;
    border-radius: 15px;
    width: 300px;
    border: 1px solid #333;
    position: relative;
    transition: transform 0.3s;
  }

  .step-card:hover {
    transform: translateY(-10px);
    border-color: #3a7a34;
  }

  .step-number {
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    background: #3a7a34;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-family: 'Cinzel', serif;
  }

  h3 {
    font-family: 'Cinzel', serif;
    color: #fbbf24;
    margin-top: 10px;
  }

  .cta-section {
    margin-top: 80px;
  }

  .btn-start {
    background: #3a7a34;
    color: white;
    text-decoration: none;
    padding: 15px 30px;
    border-radius: 8px;
    font-weight: 600;
    display: inline-block;
  }

  .back-link {
    display: inline-block;
    margin-top: 20px;
    color: #666;
    text-decoration: none;
    font-size: 0.9rem;
  }
</style>