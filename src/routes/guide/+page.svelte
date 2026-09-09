<script>
    import { base } from '$app/paths';
</script>

<div class="page-background" style="background-image: url('{base}/guide/fond.png');">
    <div class="content-container">
        <!-- Titre agrandi -->
        <img src="{base}/guide/titre.png" alt="Titre du Guide" class="titre-element" />
        
        <!-- Plan réduit -->
        <img src="{base}/guide/plan.png" alt="Plan" class="plan-element" />
        
        <!-- Vos autres éléments à rajouter par-dessus -->
    </div>
</div>

<style>
@import url('https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600&display=swap');

.page-background {
    min-height: 100vh;
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    padding: 40px 20px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
}

.content-container {
    position: relative;
    max-width: 1000px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
}

.titre-element {
    width: 100%;
    max-width: 750px; /* Titre plus grand */
    height: auto;
    display: block;
    }
    </style>