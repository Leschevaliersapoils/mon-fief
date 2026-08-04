<script lang="ts">
    import { enhance } from '$app/forms';
    let { data, form } = $props();

    // Onglet actif : 'messagerie' ou 'compte'
    let ongletActif = $state('messagerie');

    let messages = $derived(data?.messages ?? []);
    let session = $derived(data?.session);
    let joueur = $derived(data?.joueur);

    // Compter les messages non lus pour afficher un badge
    let nbNonLus = $derived(messages.filter((m: any) => !m.lu).length);
</script>

<div class="page-quete" style="background-image: url('/compte/fondcompte.png');">


    <div class="container">
        <!-- Système d'onglets (placé directement en haut) -->
        <div class="onglets-container">
            <button 
                class="btn-onglet {ongletActif === 'messagerie' ? 'actif' : ''}" 
                onclick={() => ongletActif = 'messagerie'}
            >
                Messagerie
                {#if nbNonLus > 0}
                    <span class="badge-notification">{nbNonLus}</span>
                {/if}
            </button>
            <button 
                class="btn-onglet {ongletActif === 'compte' ? 'actif' : ''}" 
                onclick={() => ongletActif = 'compte'}
            >
                Mon Compte
            </button>
        </div>

        <!-- Contenu des onglets -->
        <div class="classement-section">
            <div class="classement-cadre">
                
                {#if ongletActif === 'messagerie'}
                    <h3 class="titre-tableau">Boîte aux lettres</h3>
                    
                    {#if messages.length === 0}
                        <p class="texte-vide">Aucun message pour le moment.</p>
                    {:else}
                        <div class="liste-messages">
                            {#each messages as msg}
                                <div class="message-item {msg.lu ? 'lu' : 'non-lu'}">
                                    <div class="message-header">
                                        <span class="message-titre">
                                            {#if !msg.lu}<span class="point-rouge"></span>{/if}
                                            {msg.titre || 'Message du Royaume'}
                                        </span>
                                        <span class="message-date">
                                            {new Date(msg.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p class="message-contenu">{msg.contenu}</p>

                                    {#if !msg.lu}
                                        <form method="POST" action="?/marquerLu" use:enhance>
                                            <input type="hidden" name="id_message" value={msg.id_message} />
                                            <button type="submit" class="btn-marquer-lu">Marquer comme lu</button>
                                        </form>
                                    {/if}
                                </div>
                            {/each}
                        </div>
                    {/if}

                {:else if ongletActif === 'compte'}
                    <h3 class="titre-tableau">Informations du Compte</h3>
                    <div class="compte-infos">
                        <p><strong>Nom du joueur :</strong> <span class="valeur-texte">{joueur?.Surnom ?? 'Inconnu'}</span></p>
                        <p><strong>Email :</strong> <span class="valeur-texte">{session?.user?.email ?? 'Inconnu'}</span></p>
                    </div>
                {/if}

            </div>
        </div>
    </div>
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&display=swap');

    .page-quete { min-height: 100vh; height: auto; background-size: cover; background-position: center; background-attachment: fixed; padding: 40px 20px 80px 20px; position: relative; box-sizing: border-box; }
    .btn-retour { position: absolute; top: 25px; left: 25px; z-index: 100; text-decoration: none; font-family: 'Cinzel', serif; color: #ffd700; text-shadow: 2px 2px 4px #000; display: flex; align-items: center; gap: 8px; font-size: 0.95rem; }
    .container { max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; padding-top: 20px; }

    /* Onglets */
    .onglets-container { display: flex; gap: 10px; width: 100%; max-width: 900px; justify-content: center; margin-bottom: -5px; z-index: 2; position: relative; }
    .btn-onglet { font-family: 'Cinzel', serif; background-color: #1a120b; color: #b59b75; border: 4px solid #5a4025; border-bottom: none; padding: 12px 25px; cursor: pointer; font-size: 1rem; font-weight: bold; transition: all 0.2s ease; position: relative; border-top-left-radius: 6px; border-top-right-radius: 6px; }
    .btn-onglet:hover { color: #ffd700; background-color: #2b1f14; }
    .btn-onglet.actif { background-color: #2b1f14; color: #ffd700; border-color: #704b2b; padding-bottom: 15px; z-index: 3; }
    
    .badge-notification { background-color: #b30000; color: white; font-size: 0.75rem; padding: 2px 6px; border-radius: 50%; position: absolute; top: 6px; right: 6px; font-family: sans-serif; }

    /* Cadre contenu */
    .classement-section { width: 100%; display: flex; justify-content: center; z-index: 2; }
    .classement-cadre { width: 100%; background-color: #2b1f14; border: 8px solid #704b2b; box-shadow: 0 15px 30px rgba(0,0,0,0.8), inset 0 0 20px rgba(0,0,0,0.9); padding: 25px; box-sizing: border-box; }
    .titre-tableau { font-family: 'Cinzel', serif; color: #ffd700; text-align: center; margin-top: 0; margin-bottom: 20px; font-size: 1.2rem; text-shadow: 2px 2px 4px #000; letter-spacing: 1px; border-bottom: 1px solid #5a4025; padding-bottom: 10px; }

    /* Messagerie */
    .texte-vide { font-family: 'Cinzel', serif; color: #d4af37; text-align: center; font-style: italic; padding: 20px; }
    .liste-messages { display: flex; flex-direction: column; gap: 15px; }
    .message-item { background: rgba(40, 25, 15, 0.9); border: 1px solid #5a4025; padding: 15px; box-shadow: inset 0 0 8px rgba(0,0,0,0.5); }
    .message-item.non-lu { border-color: #ffd700; background: rgba(60, 40, 20, 0.95); }
    .message-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; border-bottom: 1px dashed #5a4025; padding-bottom: 6px; }
    .message-titre { font-family: 'Cinzel', serif; color: #ffd700; font-weight: bold; font-size: 1rem; display: flex; align-items: center; gap: 8px; }
    .point-rouge { width: 8px; height: 8px; background-color: #ff3333; border-radius: 50%; display: inline-block; box-shadow: 0 0 5px #ff3333; }
    .message-date { font-size: 0.75rem; color: #a09080; font-family: sans-serif; }
    .message-contenu { font-family: 'Cinzel', serif; color: #f4e4bc; font-size: 0.9rem; line-height: 1.4; margin-bottom: 10px; }
    
    .btn-marquer-lu { font-family: 'Cinzel', serif; background-color: #4a3520; color: #ffd700; border: 1px solid #704b2b; padding: 5px 12px; font-size: 0.75rem; cursor: pointer; float: right; transition: background 0.2s; }
    .btn-marquer-lu:hover { background-color: #6a4f30; }

    /* Compte */
    .compte-infos { font-family: 'Cinzel', serif; color: #f4e4bc; display: flex; flex-direction: column; gap: 12px; font-size: 0.95rem; }
    .valeur-texte { color: #ffd700; font-weight: normal; }
</style>
