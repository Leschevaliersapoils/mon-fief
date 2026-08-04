<script lang="ts">
    import { enhance } from '$app/forms';
    import { invalidateAll } from '$app/navigation';
    
    let { data }: { data: PageData } = $props();

    let selectedPlayer = $state("");
    let selectedAnimalId = $state("");
    
    let chiensFiltres = $derived(data.chiens.filter((c: any) => c.id_joueur === selectedPlayer));

    function getStatutDefi(defi: any, animalId: string) {
        if (!animalId) return { icon: '', text: '' };
        const dejaFait = data.historique.some(h => h.id_defi === defi.id && h.id_animal === animalId);
        if (!defi.frequence && dejaFait) return { icon: '🚫', text: 'Déjà fait' };
        
        const chien = data.chiens.find(c => c.id_heros === animalId);
        if (chien && chien.niveau < defi.niveau_requis) return { icon: '⚠️', text: 'Niveau trop bas' };
        
        return { icon: '✅', text: 'OK' };
    }
</script>

<div class="page-admin">
    <header class="admin-header">
        <h1>DONJON DE L'ADMINISTRATEUR</h1>
    </header>

    <div class="container">
        
        <!-- PANEL POUR ENVOYER DES MESSAGES -->
        <div class="admin-panel-add">
            <h3>✉️ Envoyer un message ou une annonce</h3>
            <form method="POST" action="?/envoyerMessageAdmin" use:enhance={() => {
                return async ({ update }) => {
                    await update({ reset: true });
                    await invalidateAll();
                };
            }}>
                <select name="id_joueur" required>
                    <option value="tous">👑 Tous les joueurs (Annonce générale)</option>
                    {#each data.joueurs as j} 
                        <option value={j.id_joueur}>Joueur : {j.Surnom}</option> 
                    {/each}
                </select>

                <input type="text" name="titre" placeholder="Titre du message" required style="flex: 1; min-width: 200px;" />
                
                <textarea name="contenu" placeholder="Contenu du message..." required style="width: 100%; padding: 10px; background: #2a1f18; color: #f4e4bc; border: 1px solid #8b4513; border-radius: 4px; resize: vertical; min-height: 80px;"></textarea>
                
                <button type="submit" class="btn-action accepter">ENVOYER LE MESSAGE</button>
            </form>
        </div>

        <div class="admin-panel-add">
            <h3>⚔️ Ajouter un exploit manuellement</h3>
            <form method="POST" action="?/ajouterExploitManuel" use:enhance={() => {
                return async ({ update }) => {
                    await update({ reset: true });
                    await invalidateAll();
                };
            }}>
                <select name="id_joueur" bind:value={selectedPlayer} required>
                    <option value="">Choisir un joueur</option>
                    {#each data.joueurs as j} <option value={j.id_joueur}>{j.Surnom}</option> {/each}
                </select>

                <select name="id_animal" bind:value={selectedAnimalId} required>
                    <option value="">Choisir le chien</option>
                    {#each chiensFiltres as c} 
                        <option value={c.id_heros}>{c.nom} (Niv. {c.niveau})</option> 
                    {/each}
                </select>

                <select name="id_defi" required>
                    <option value="">Choisir le défi</option>
                    {#each data.defis as d}
                        {@const statut = getStatutDefi(d, selectedAnimalId)}
                        <option value={d.id}>
                            {statut.icon} {d.Nomdefis} (Niv. requis : {d.niveau_requis})
                        </option>
                    {/each}
                </select>

                <input type="text" name="image_preuve_url" placeholder="URL image (optionnel)" />
                <input type="text" name="commentaire" placeholder="Commentaire (optionnel)" />
                
                <button type="submit" class="btn-action accepter">VALIDER MANUELLEMENT</button>
            </form>
        </div>

        <h2>📜 Demandes en attente ({data.accomplissements.length})</h2>
        <div class="grille-demandes">
            {#each data.accomplissements as acc}
                <div class="carte-demande">
                    <div class="badge-xp">+{acc.defis?.XP} XP</div>
                    <div class="infos-bloc">
                        <h3 class="titre-quete">Quête : {acc.defis?.Nomdefis}</h3>
                        <p>Compagnon : {acc.heros?.nom} | <strong>Requis : {acc.defis?.niveau_requis}</strong></p>
                    </div>
                    <div class="actions-bloc">
                        {#if acc.image_preuve_url}
                            <a href={acc.image_preuve_url} target="_blank" rel="noopener noreferrer" class="btn-action voir">
                                VOIR
                            </a>
                        {/if}

                        <form method="POST" action="?/validerExploit" use:enhance>
                            <input type="hidden" name="id" value={acc.id_accomplissement} />
                            <button type="submit" class="btn-action accepter">ACCEPTER</button>
                        </form>
                        <form method="POST" action="?/refuserExploit" use:enhance>
                            <input type="hidden" name="id" value={acc.id_accomplissement} />
                            <button type="submit" class="btn-action refuser">REFUSER</button>
                        </form>
                    </div>
                </div>
            {:else}
                <p>Aucun exploit en attente.</p>
            {/each}
        </div>
    </div>
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=MedievalSharp&display=swap');
    
    .page-admin { min-height: 100vh; background: #1a110b; color: #f4e4bc; font-family: 'MedievalSharp', cursive; padding: 40px 20px; }
    .admin-header { text-align: center; margin-bottom: 40px; border-bottom: 2px dashed #8b4513; padding-bottom: 20px; }
    .admin-header h1 { font-family: 'Cinzel', serif; font-size: 2.8rem; color: #ffd700; margin: 0; }
    .container { max-width: 1000px; margin: 0 auto; }
    
    .admin-panel-add { background: rgba(255, 215, 0, 0.05); padding: 20px; border: 1px solid #ffd700; border-radius: 8px; margin-bottom: 40px; }
    .admin-panel-add form { display: flex; gap: 10px; flex-wrap: wrap; }
    .admin-panel-add select, .admin-panel-add input { padding: 10px; background: #2a1f18; color: #f4e4bc; border: 1px solid #8b4513; border-radius: 4px; }
    
    .carte-demande { background: rgba(139, 69, 19, 0.15); border: 2px solid #8b4513; border-radius: 8px; padding: 20px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; position: relative; }
    .badge-xp { position: absolute; top: -12px; right: 20px; background: #2e5a1c; color: #fff; padding: 4px 12px; border-radius: 12px; font-weight: bold; }
    
    .actions-bloc { display: flex; gap: 10px; }
    .btn-action { font-family: 'Cinzel', serif; padding: 10px 20px; border: none; cursor: pointer; font-weight: bold; border-radius: 4px; color: white; transition: 0.3s; }
    .btn-action:hover { opacity: 0.8; }
    .accepter { background: #2e5a1c; }
    .refuser { background: #8b0000; }
</style>