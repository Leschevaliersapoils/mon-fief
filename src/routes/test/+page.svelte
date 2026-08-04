<script>
    // Tu pourras mettre de la logique Svelte ici plus tard si besoin
</script>

<div class="carte-chevalier">
    <img src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=400" alt="Sir Négan">
    <div class="infos">
        <h2>Sir Négan, Premier Chevalier</h2>
        <p>Grand chasseur de chaussettes et protecteur infatigable du canapé royal.</p>
        <button class="btn-quete">Lancer la Quête</button>
    </div>
</div>

<style>
    /* --- Style global de base (PC) --- */
    :global(body) {
        font-family: Arial, sans-serif;
        background-color: #2c2c2c;
        margin: 0;
        padding: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
    }

    /* --- DESIGN PC : Riche, style parchemin --- */
    .carte-chevalier {
        display: flex;
        align-items: center;
        gap: 30px;
        background-color: #f4e8c1;
        border: 6px solid #8b4513;
        padding: 40px;
        box-shadow: 12px 12px 0px rgba(0, 0, 0, 0.7);
        max-width: 700px;
        border-radius: 10px;
    }

    .carte-chevalier img {
        width: 200px;
        height: 200px;
        object-fit: cover;
        border-radius: 50%;
        border: 4px solid #8b4513;
    }

    .infos h2 {
        margin-top: 0;
        color: #4a2511;
        font-size: 26px;
    }

    .infos p {
        color: #333;
        font-size: 18px;
        line-height: 1.5;
    }

    .btn-quete {
        background-color: #8b4513;
        color: white;
        border: none;
        padding: 12px 25px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        border-radius: 5px;
        margin-top: 10px;
    }

    .btn-quete:hover {
        background-color: #a0522d;
    }

    /* --- DESIGN MOBILE : Épuré et vertical --- */
    @media (max-width: 768px) {
        :global(body) {
            padding: 10px;
            background-color: #ffffff;
        }

        .carte-chevalier {
            flex-direction: column;
            text-align: center;
            background-color: #ffffff;
            border: none;
            box-shadow: none;
            padding: 15px;
            max-width: 100%;
        }

        .carte-chevalier img {
            width: 130px;
            height: 130px;
            margin: 0 auto 15px auto;
            border: 2px solid #ccc;
        }

        .infos h2 {
            font-size: 22px;
        }

        .infos p {
            font-size: 16px;
        }

        .btn-quete {
            width: 100%;
            padding: 15px;
            font-size: 18px;
        }
    }
</style>