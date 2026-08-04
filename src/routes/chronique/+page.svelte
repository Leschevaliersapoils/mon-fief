<script>
  import { supabase } from '$lib/supabase';

  let { data } = $props();
  let userId = data.userId;

  let activeTab = $state('royaume');
  let events = $state([]);
  let loading = $state(true);

  async function loadEvents(tab, currentUserId) {
    loading = true;
    try {
      let query;
      
      if (tab === 'royaume') {
        query = supabase.from('vue_chroniques_royaume').select('*');
      } 
      else if (tab === 'compagnon') {
        if (!currentUserId) {
          events = [];
          loading = false;
          return;
        }
        query = supabase
          .from('vue_chroniques_compagnons')
          .select('*')
          .eq('id_joueur', currentUserId);
      } 
      else if (tab === 'amis') {
        events = [];
        loading = false;
        return;
      }

      const { data: dbData, error } = await query
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      events = dbData || []; 
      
    } catch (e) {
      console.error("Erreur chargement :", e);
    } finally {
      loading = false;
    }
  }

  function switchTab(tab) {
    activeTab = tab;
    loadEvents(tab, userId);
  }

  const tabsList = [
    { id: 'royaume', label: 'TOUT LE ROYAUME' },
    { id: 'compagnon', label: 'MES COMPAGNONS' },
    { id: 'amis', label: 'MES AMIS' }
  ];

  function tabSuivant() {
    const currentIndex = tabsList.findIndex(t => t.id === activeTab);
    const nextIndex = (currentIndex + 1) % tabsList.length;
    switchTab(tabsList[nextIndex].id);
  }

  function tabPrecedent() {
    const currentIndex = tabsList.findIndex(t => t.id === activeTab);
    const prevIndex = (currentIndex - 1 + tabsList.length) % tabsList.length;
    switchTab(tabsList[prevIndex].id);
  }

  let activeTabLabel = $derived(tabsList.find(t => t.id === activeTab)?.label || '');

  import { onMount } from 'svelte';
  onMount(() => {
    loadEvents(activeTab, userId);
  });
</script>

<div class="page-background">
  <!-- Titre en pleine largeur -->
  <header class="wide-header">
    <div class="title-container">
      <img src="/chronique/banniere.png" alt="Les Chroniques du Royaume" class="main-banniere" />
    </div>
  </header>

  <main class="main-container">
    
    <!-- VERSION DESKTOP : Onglets classiques côte à côte -->
    <div class="desktop-tabs">
      {#each tabsList as tab}
        <button class:active={activeTab === tab.id} onclick={() => switchTab(tab.id)}>
          {tab.label}
        </button>
      {/each}
    </div>

    <!-- VERSION MOBILE : Filtre unique avec flèches latérales -->
    <div class="mobile-filter-slider">
      <button class="slider-arrow" onclick={tabPrecedent} aria-label="Précédent">❮</button>
      
      <div class="current-filter-display" onclick={tabSuivant}>
        <span class="filter-text">{activeTabLabel}</span>
      </div>

      <button class="slider-arrow" onclick={tabSuivant} aria-label="Suivant">❯</button>
    </div>

    <div class="content">
      {#if activeTab === 'royaume'}
        <img src="/chronique/royaume.png" alt="Bannière Royaume" class="section-banner" />
      {:else if activeTab === 'compagnon'}
        <img src="/chronique/compagnon.png" alt="Bannière Compagnons" class="section-banner" />
      {:else}
        <img src="/chronique/amis.png" alt="Bannière Amis" class="section-banner" />
      {/if}

      {#if loading}
        <p class="loading-text">Chargement des chroniques...</p>
      {:else if events.length === 0}
        <div class="chantier-wrapper">
           <div class="chantier-icon">🚧</div>
           <h2>TERRITOIRE EN CONSTRUCTION</h2>
           <p>Rien à signaler pour le moment dans ces contrées.</p>
        </div>
      {:else}
        <div class="events-list">
          {#each events as event}
            <div class="event-card">
              <div class="event-left">
                <img src={event.logo_url} alt="Logo" class="main-logo" />
              </div>
              <div class="middle-content">
                <div class="title-header-mobile">
                  <img src={event.logo_url} alt="Logo" class="main-logo-mobile" />
                  <span class="event-title">{event.titre}</span>
                </div>
                <p class="event-text">{@html event.description}</p>
              </div>
              <div class="right-content">
                <img src={event.mini_logo_url} alt="Mini" class="small-logo-right" />
                <div class="datetime">
                  <span class="event-date">{new Date(event.created_at).toLocaleDateString()}</span>
                  <span class="event-time">{event.heure_event}</span>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </main>
</div>

<style>
@import url('https://fonts.googleapis.com/css2?family=UnifrakturCook:wght@700&family=Crimson+Text:wght@400;600&display=swap');

.page-background { min-height: 100vh; background-image: url('/chronique/fondparchemin.png'); background-size: cover; background-position: center; background-attachment: fixed; padding: 40px 20px; box-sizing: border-box; }

.wide-header { width: 100%; margin-bottom: 25px; display: flex; justify-content: center; }
.title-container { width: 100%; max-width: 1400px; display: flex; justify-content: center; align-items: center; padding: 0 10px; box-sizing: border-box; }

.main-banniere { 
  width: 100%; 
  max-width: 1000px; 
  height: auto; 
  object-fit: contain; 
  display: block; 
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4)); 
}

.main-container { max-width: 1300px; margin: 0 auto; }
.section-banner { display: block; width: 100%; max-height: 70px; object-fit: contain; margin-bottom: 25px; }

/* Desktop Tabs */
.desktop-tabs {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;
  width: 100%;
}

.desktop-tabs button {
  background: linear-gradient(to bottom, #e1c699, #c8a268);
  border: 2px solid #8b4513;
  border-radius: 8px;
  padding: 12px 30px;
  font-family: 'Crimson Text', serif;
  color: #5a3728;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0,0,0,0.15);
  transition: all 0.2s;
}

.desktop-tabs button:hover {
  background: linear-gradient(to bottom, #d2b48c, #b8860b);
  transform: translateY(-2px);
}

.desktop-tabs button.active {
  background: linear-gradient(to bottom, #8b4513, #5a3728);
  color: #fff;
  border-color: #ffd700;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
}

.mobile-filter-slider {
  display: none;
}

.content { background: rgba(255, 250, 240, 0.55); padding: 30px; border-radius: 12px; border: 2px solid #d2b48c; box-shadow: 0 8px 16px rgba(0,0,0,0.1); }
.loading-text { text-align: center; font-family: 'Crimson Text', serif; font-size: 1.2rem; color: #5a3728; padding: 20px; }

.events-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.event-card { 
  display: flex; 
  align-items: center; 
  padding: 18px 20px; 
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid #d2b48c; 
  border-radius: 8px;
  gap: 20px; 
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.main-logo { width: 65px; height: 65px; object-fit: contain; flex-shrink: 0; }
.main-logo-mobile { display: none; }
.title-header-mobile { display: block; }
.middle-content { flex: 1; min-width: 200px; }
.right-content { display: flex; align-items: center; gap: 15px; flex-shrink: 0; }
.small-logo-right { width: 45px; height: 45px; object-fit: contain; }

.datetime { display: flex; flex-direction: column; align-items: flex-end; min-width: 75px; }
.event-title { color: #8b0000; font-weight: bold; display: block; font-family: 'Crimson Text', serif; font-size: 1.05rem; }
.event-text { margin: 4px 0 0 0; color: #4a3728; font-family: 'Crimson Text', serif; font-size: 1.05rem; line-height: 1.3; }
.event-date { font-size: 0.8rem; color: #5a3728; }
.event-time { font-size: 0.85rem; font-weight: bold; color: #8b0000; }

.chantier-wrapper { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 50px 20px; text-align: center; background: rgba(244, 230, 195, 0.4); border: 2px dashed #b8a070; border-radius: 12px; margin-top: 10px; }
.chantier-icon { font-size: 45px; margin-bottom: 15px; }
.chantier-wrapper h2 { font-family: 'UnifrakturCook', cursive; color: #4a3728; margin-bottom: 8px; font-size: 1.8rem; }
.chantier-wrapper p { font-family: 'Crimson Text', serif; color: #6b574a; font-size: 1.2rem; margin: 0; }

:global(.event-text .hero-name) { font-weight: bold; color: #8b0000; font-size: 1.05em; }

/* --- RESPONSIVE MOBILE COMPACT --- */
@media (max-width: 768px) {
  .page-background { padding: 10px 4px; }
  .content { padding: 10px 8px; }

  .main-banniere {
    max-width: 100%;
  }

  .section-banner {
    max-height: 35px;
    margin-bottom: 12px;
  }

  .desktop-tabs {
    display: none;
  }

  .mobile-filter-slider {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-bottom: 15px;
    width: 100%;
  }

  .current-filter-display {
    background: linear-gradient(to bottom, #8b4513, #5a3728);
    border: 1.5px solid #ffd700;
    border-radius: 6px;
    padding: 6px 10px;
    text-align: center;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    flex-grow: 1;
  }

  .filter-text {
    font-size: 0.9rem;
  }

  .slider-arrow {
    width: 32px;
    height: 32px;
    font-size: 1rem;
    border-width: 1.5px;
    border-radius: 6px;
  }
  
  .events-list {
    gap: 10px;
  }

  /* Cache le grand logo à gauche sur mobile pour libérer de la hauteur */
  .event-left {
    display: none;
  }

  .event-card {
    flex-direction: column;
    align-items: stretch;
    padding: 10px 12px;
    gap: 6px;
  }

  /* Alignement du logo et du titre sur une seule ligne */
  .title-header-mobile {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 2px;
  }

  .main-logo-mobile {
    display: inline-block;
    width: 34px;
    height: 34px;
    object-fit: contain;
    flex-shrink: 0;
  }

  .event-title { 
    font-size: 0.9rem; 
    text-align: left;
  }
  
  .event-text { 
    font-size: 0.88rem; 
    text-align: center;
    margin-top: 2px;
  }

  .middle-content {
    width: 100%;
    min-width: 0;
  }

  /* Pied de carte compact (Date + Heure + Sceau) */
  .right-content {
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    gap: 12px;
    border-top: 1px dashed rgba(139, 69, 19, 0.2);
    padding-top: 6px;
    margin-top: 4px;
  }

  .small-logo-right { 
    width: 28px; 
    height: 28px; 
  }

  .datetime {
    flex-direction: row;
    gap: 6px;
    align-items: center;
    min-width: 0;
  }
  
  .event-date { font-size: 0.75rem; }
  .event-time { font-size: 0.75rem; }
}
</style>