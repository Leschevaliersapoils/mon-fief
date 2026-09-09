<script lang="ts">
  import { base } from '$app/paths';
  import { enhance } from '$app/forms';
  
  let { form } = $props();
</script>

<div class="form-container" style="background-image: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('{base}/Fondaccueil.jpg');">
  <form method="POST" action="?/updatePassword" use:enhance>
    <h1>Nouveau Sésame</h1>
    <p>Choisissez un nouveau mot de passe pour votre compte, Messire.</p>

    {#if form?.error}
      <p style="color: #ff4d4d; background: rgba(255,0,0,0.1); padding: 10px; border-radius: 5px; font-size: 0.8rem; margin-bottom: 20px;">
        ⚠️ {form.error}
      </p>
    {/if}

    <div class="input-group">
      <label for="password">Nouveau mot de passe</label>
      <input type="password" id="password" name="password" placeholder="••••••••" required minlength="6" />
    </div>

    <button type="submit" class="btn-submit">Mettre à jour le mot de passe 🛡️</button>
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
    background: #fbbf24;
    color: #000;
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
    background: #fcd34d;
  }
</style>