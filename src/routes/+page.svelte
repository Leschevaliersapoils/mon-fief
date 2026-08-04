<script>
  //   données dynamiques
</script>

<div class="page-container">
  <nav class="navbar">
    <div class="nav-left">
      <a href="/">
        <img src="/Logo.png" alt="Logo Les Chevaliers à Poils" class="nav-logo" />
      </a>
      <span class="site-title">Les Chevaliers à Poils</span>
    </div>
    
    <div class="nav-right">
      <a href="/guide">Comment ça marche</a>
      <a href="/inscription">S'inscrire</a>
      <a href="/connexion" class="btn-login" style="text-decoration: none;">Se connecter</a>
    </div>
  </nav>

  <header class="hero-section">
    <div class="hero-content">
      <h1 class="main-title">Les Chevaliers à Poils</h1>
      <p class="subtitle">
        Votre animal de compagnie est un héros qui s'ignore. 
        Relevez des défis épiques, montez de niveau et devenez une légende du royaume !
      </p>
      <a href="/connexion" class="btn-adventure" style="text-decoration: none; display: inline-block;">⚔️ Entrer dans l'aventure</a>
    </div>
  </header>
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Poppins:wght@300;400;600&display=swap');

  :global(body) {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    font-family: 'Poppins', sans-serif;
  }

  .page-container {
    height: 100vh;
    width: 100vw;
  }

  .hero-section {
    height: 100vh;
    width: 100%;
    background: linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.4)), 
                url('/Fondaccueil.jpg'); 
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: white;
  }

  .navbar {
    position: absolute;
    top: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
    z-index: 10;
    box-sizing: border-box;
  }

  .nav-left, .nav-right {
    margin: 0 60px;
    display: flex;
    align-items: center;
    gap: 30px;
  }

  .nav-left {
    color: white;
    gap: 15px;          
  }

  .nav-logo {
    height: 120px;       
    width: 120px;        
    object-fit: contain;
  }

  .site-title {
    font-family: 'Cinzel', serif;
    font-size: 1.4rem;
    font-weight: bold;
    text-shadow: 2px 2px 4px #000;
  }

  .nav-right a {
    color: white;
    text-decoration: none;
    font-size: 0.9rem;
    text-shadow: 2px 2px 4px #000;
  }

  .btn-login {
    background: #3a7a34;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    font-weight: 600;
    cursor: pointer;
  }

  .hero-content {
    max-width: 850px;
    padding: 0 20px;
    margin-top: 150px;
  }

  .main-title {
    font-family: 'Cinzel', serif;
    font-size: 5rem; 
    margin-bottom: 20px;
    line-height: 1;
    text-shadow: 2px 2px 8px #000;
  }

  .subtitle {
    font-size: 1.3rem;
    margin-bottom: 40px;
    font-weight: 300;
    text-shadow: 1px 1px 4px #000;
  }

  .btn-adventure {
    background: #3a7a34; 
    color: white;
    border: none;
    padding: 20px 45px;
    font-size: 1.2rem;
    font-weight: bold;
    border-radius: 8px;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  }

  /* --- VERSION MOBILE --- */
  @media (max-width: 768px) {
    .navbar {
      padding: 10px 15px;
      margin: 0;
      width: 100%;
    }

    .nav-left, .nav-right {
      margin: 0;
      gap: 15px;
    }

    .site-title {
      display: none;
    }

    /* Logo agrandi pour la version mobile (ajusté à 95px) */
    .nav-logo {
      height: 95px;
      width: 95px;
    }

    .nav-right a {
      font-size: 0.8rem;
    }

    .btn-login {
      display: none;
    }

    .main-title {
      font-size: 2.8rem;
    }

    .subtitle {
      font-size: 1rem;
    }

    .hero-content {
      margin-top: 100px;
    }

    .btn-adventure {
      padding: 15px 30px;
      font-size: 1rem;
    }
  }
</style>