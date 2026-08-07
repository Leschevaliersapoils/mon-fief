<script>
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabaseClient';
  import { PUBLIC_SUPABASE_URL } from '$env/static/public';

  let status = "Test en cours...";
  let loginResult = "En attente de test de connexion...";

  onMount(async () => {
    // 1. Affiche l'URL active pour voir si c'est la même qu'en local
    status = `URL Supabase utilisée : ${PUBLIC_SUPABASE_URL}`;
  });

  async function testerConnexion() {
    loginResult = "Tentative de connexion avec test5@wanadoo.fr...";
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'test5@wanadoo.fr',
      password: 'TON_MOT_DE_PASSE' // Mets ton vrai mot de passe ici pour le test
    });

    if (error) {
      loginResult = "❌ Échec : " + error.message;
    } else {
      loginResult = "✅ Succès ! Connecté en tant que " + data.user.email;
    }
  }
</script>

<main style="color: white; padding: 50px; font-family: sans-serif;">
  <h1>Test Supabase Production</h1>
  <p style="background: #333; padding: 10px;">{status}</p>
  
  <button on:click={testerConnexion} style="padding: 10px 20px; background: gold; color: black; font-weight: bold; cursor: pointer;">
    Tester la connexion de test5@wanadoo.fr
  </button>

  <p style="margin-top: 20px; font-size: 1.2em;">{loginResult}</p>
</main>