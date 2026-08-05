<script lang="ts">
    import { base } from '$app/paths';
    let { data } = $props();
    
    // Récupération des données depuis le layout
    const user = $derived(data.session?.user);
    const surnom = $derived(data.surnom || "Héros Anonyme");
</script>

<div class="profil-container">
    <div class="parchemin">
        <h1 class="titre-medieval">Fiche de Personnage</h1>
        
        <div class="divider"></div>

        <div class="info-section">
            <div class="avatar-box">
                <!-- On réutilise ton icône de couronne -->
                <img src="{base}/icons/user-crown.png" alt="Avatar" class="avatar-img" />
            </div>
            
            <div class="details">
                <p class="label">Surnom</p>
                <p class="highlight">{surnom}</p>
                
                <p class="label">Missive (Email)</p>
                <p class="email-text">{user?.email}</p>
            </div>
        </div>

        <div class="divider"></div>

        <div class="actions">
            <a href="{base}/cour" class="btn-retour">Retour à la Cour</a>
        </div>
    </div>
</div>

<style>
    .profil-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        padding: 20px;
    }

    .parchemin {
        background: #f4e4bc;
        background-image: url('https://www.transparenttextures.com/patterns/old-map.png');
        border: 15px solid #4a3728;
        /* Bordure stylisée simple */
        border-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='75' height='75'%3E%3Cpath d='M0 0h75v75H0z' fill='%234a3728'/%3E%3Cpath d='M10 10h55v55H10z' fill='%23f4e4bc'/%3E%3C/svg%3E") 15;
        padding: 40px;
        max-width: 450px;
        width: 100%;
        box-shadow: 0 20px 50px rgba(0,0,0,0.7);
        position: relative;
    }

    .titre-medieval {
        font-family: 'MedievalSharp', serif;
        color: #2d1e14;
        text-align: center;
        margin-top: 0;
        font-size: 2rem;
        letter-spacing: 1px;
    }

    .divider {
        height: 2px;
        background: linear-gradient(to right, transparent, #4a3728, transparent);
        margin: 25px 0;
    }

    .info-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 20px;
    }

    .avatar-box {
        width: 120px;
        height: 120px;
        background: #2d1e14;
        border: 4px solid #fbbf24;
        border-radius: 50%; /* On passe l'avatar en rond pour varier */
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    }

    .avatar-img {
        width: 70%;
        height: 70%;
        object-fit: contain;
    }

    .label {
        font-size: 0.9rem;
        text-transform: uppercase;
        color: #6b4423;
        margin-bottom: 2px;
        font-weight: bold;
    }

    .highlight {
        font-family: 'MedievalSharp', serif;
        font-size: 1.8rem;
        color: #b45309;
        margin-top: 0;
        margin-bottom: 15px;
    }

    .email-text {
        color: #4a3728;
        font-style: italic;
    }

    .actions {
        margin-top: 20px;
        text-align: center;
    }

    .btn-retour {
        display: inline-block;
        padding: 12px 30px;
        background: #4a3728;
        color: #f4e4bc;
        text-decoration: none;
        font-weight: bold;
        border-radius: 2px;
        transition: all 0.2s;
        border: 1px solid #2d1e14;
    }

    .btn-retour:hover {
        background: #2d1e14;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
</style>