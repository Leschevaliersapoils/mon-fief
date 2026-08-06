<script lang="ts">
  import { base } from '$app/paths';
  import { enhance } from '$app/forms';
  
  let { form } = $props();
</script>

<div class="form-container" style="background-image: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('{base}/Fondaccueil.jpg');">
  <form method="POST" action="{base}/inscription" use:enhance>
    <h1>Devenir Chevalier</h1>
    <p>Créez votre compte de joueur pour commencer l'aventure.</p>

    <!-- Affichage des erreurs d'inscription -->
    {#if form?.error}
      <p style="color: #ff4d4d; background: rgba(255,0,0,0.1); padding: 10px; border-radius: 5px; font-size: 0.8rem;">
        ⚠️ {form.error}
      </p>
    {/if}

    <div class="input-group">
      <label for="username">Pseudo</label>
      <input type="text" id="username" name="username" placeholder="Votre nom de preux" required />
    </div>

    <div class="input-group">
      <label for="email">Adresse de messagerie</label>
      <input type="email" id="email" name="email" placeholder="votre@email.com" required />
    </div>

    <div class="input-group">
      <label for="password">Mot de passe</label>
      <input type="password" id="password" name="password" placeholder="••••••••" required />
    </div>

    <button type="submit" class="btn-submit">Rejoindre la Table Ronde ⚔️</button>
    
    <div class="footer-links">
      <a href="{base}/connexion" class="link">Déjà un compte ? Se connecter</a>
      <br />
      <a href="{base}/" class="back-link">Retour au château</a>
    </div>
  </form>
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Poppins:wght@400;600&display=swap');

  .form-container {
    min-height: 100vh;
    width: 100vw;
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Poppins', sans-serif;
    color: white;
    box-sizing: border-box;
    padding: 15px;
  }

  form {
    background: rgba(30, 30, 30, 0.95);
    padding: 40px;
    border-radius: 15px;
    border: 1px solid #fbbf24;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
    backdrop-filter: blur(10px);
    text-align: center;
    box-sizing: border-box;
  }

  h1 {
    font-family: 'Cinzel', serif;
    color: #fbbf24;
    margin-bottom: 10px;
    font-size: 1.5rem;
  }

  p {
    font-size: 0.9rem;
    color: #bbb;
    margin-bottom: 30px;
  }

  .input-group {
    text-align: left;
    margin-bottom: 20px;
  }

  label {
    display: block;
    margin-bottom: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    color: #eee;
  }

  input {
    width: 100%;
    padding: 12px;
    background: #2a2a2a;
    border: 1px solid #444;
    color: white;
    border-radius: 6px;
    box-sizing: border-box;
  }

  .btn-submit {
    background: #22c55e;
    color: #fff;
    border: none;
    padding: 15px;
    width: 100%;
    border-radius: 8px;
    font-weight: bold;
    font-size: 1rem;
    cursor: pointer;
    margin-top: 10px;
    transition: transform 0.2s;
    box-sizing: border-box;
  }

  .btn-submit:hover {
    transform: scale(1.02);
    background: #16a34a;
  }

  .footer-links {
    margin-top: 25px;
    border-top: 1px solid #333;
    padding-top: 15px;
  }

  .link {
    color: #fbbf24;
    text-decoration: none;
    font-size: 0.85rem;
  }

  .back-link {
    display: inline-block;
    margin-top: 10px;
    color: #888;
    text-decoration: none;
    font-size: 0.8rem;
  }

  /* --- VERSION MOBILE --- */
  @media (max-width: 768px) {
    .form-container {
      padding: 10px;
    }

    form {
      padding: 20px 15px;
      max-width: 90%;
      border-radius: 12px;
    }

    h1 {
      font-size: 1.25rem;
      margin-bottom: 8px;
    }

    p {
      font-size: 0.8rem;
      margin-bottom: 20px;
    }

    .input-group {
      margin-bottom: 12px;
    }

    input {
      padding: 10px;
      font-size: 0.9rem;
    }

    .btn-submit {
      padding: 12px;
      font-size: 0.9rem;
    }

    .footer-links {
      margin-top: 15px;
      padding-top: 10px;
    }
  }
</style>