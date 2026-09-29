<script lang="ts">
  import { base } from '$app/paths';
  import { enhance } from '$app/forms';
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';

  let { form } = $props();
  let sessionLoaded = $state(false);
  let errorMessage = $state(form?.error);

  onMount(async () => {
    // 1. On récupère les paramètres de l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      // 2. Si un code PKCE est présent, on l'échange contre une session Supabase valide
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      if (exchangeError) {
        errorMessage = "Le lien de réinitialisation est invalide ou a expiré, Messire.";
        return;
      }
    }

    // 3. On vérifie ensuite que la session est bien active
    const { data, error } = await supabase.auth.getSession();
    
    if (error || !data.session) {
      errorMessage = "Aucune session de réinitialisation active, Messire.";
    } else {
      sessionLoaded = true;
    }
  });
</script>

<div class="form-container" style="background-image: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('{base}/Fondaccueil.jpg');">
  <form method="POST" action="?/updatePassword" use:enhance>
    <h1>Nouveau Sésame</h1>
    <p>Choisissez un nouveau mot de passe pour votre compte, Messire.</p>

    {#if errorMessage}
      <p style="color: #ff4d4d; background: rgba(255,0,0,0.1); padding: 10px; border-radius: 5px; font-size: 0.8rem; margin-bottom: 20px;">
        ⚠️ {errorMessage}
      </p>
    {/if}

    {#if sessionLoaded}
      <div class="input-group">
        <label for="password">Nouveau mot de passe</label>
        <input type="password" id="password" name="password" placeholder="••••••••" required minlength="6" />
      </div>

      <button type="submit" class="btn-submit">Mettre à jour le mot de passe 🛡️</button>
    {/if}
  </form>
</div>

<style>
  /* Garde exactement ton bloc style actuel */
  .form-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    width: 100vw;
    background-size: cover;
    background-position: center;
    box-sizing: border-box;
    padding: 15px;
  }

  form {
    background: rgba(20, 20, 20, 0.85);
    padding: 40px;
    border-radius: 12px;
    border: 1px solid #c5a059;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    color: #f0f0f0;
    font-family: serif;
    box-sizing: border-box;
  }

  h1 {
    text-align: center;
    color: #c5a059;
    margin-bottom: 10px;
  }

  p {
    text-align: center;
    font-size: 0.9rem;
    margin-bottom: 30px;
    color: #b0b0b0;
  }

  .input-group {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    text-align: left;
  }

  label {
    margin-bottom: 8px;
    font-size: 0.9rem;
    color: #d4af37;
  }

  input {
    padding: 12px;
    border-radius: 6px;
    border: 1px solid #444;
    background: #2a2a2a;
    color: #fff;
    font-size: 1rem;
    box-sizing: border-box;
    width: 100%;
  }

  input:focus {
    outline: none;
    border-color: #c5a059;
  }

  .btn-submit {
    width: 100%;
    padding: 12px;
    border: none;
    border-radius: 6px;
    background: #c5a059;
    color: #121212;
    font-weight: bold;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.2s;
    box-sizing: border-box;
  }

  .btn-submit:hover {
    background: #d4af37;
  }
</style>