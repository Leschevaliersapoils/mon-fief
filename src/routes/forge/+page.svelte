<script lang="ts">
  // Code logique de ta page si besoin
</script>

<div class="page-quete">
    
    <div class="container">
        <!-- Contenu de ta nouvelle page ici -->
    </div>
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=MedievalSharp&display=swap');

    .page-quete { 
        min-height: 100vh; 
        background-image: url('/forge/fond.png'); 
        background-size: cover; 
        background-position: center; 
        background-attachment: fixed; 
        padding: 40px 20px; 
        position: relative; 
    }

    .btn-retour { 
        position: absolute; 
        top: 25px; 
        left: 25px; 
        z-index: 100; 
        text-decoration: none; 
        font-family: 'Cinzel', serif; 
        color: #ffd700; 
        text-shadow: 2px 2px 4px #000; 
        display: flex; 
        align-items: center; 
        gap: 8px; 
        font-size: 0.95rem; 
    }

    .container { 
        max-width: 1400px; 
        margin: 0 auto; 
        display: flex; 
        flex-direction: column; 
        align-items: center; 
    }
</style>