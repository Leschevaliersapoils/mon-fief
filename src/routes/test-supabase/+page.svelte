<script lang="ts">
    let { data } = $props();
</script>

<div style="padding: 40px; color: white; font-family: sans-serif;">
    <h1>Test de connexion Supabase</h1>
    <p>Connexion initialisée : <strong>{data.urlConfigured ? 'OUI ✅' : 'NON ❌'}</strong></p>
    <p>Erreur détectée : <strong>{data.hasError ? 'OUI ❌' : 'AUCUNE ✅'}</strong></p>
</div>