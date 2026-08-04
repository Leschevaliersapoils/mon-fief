import { fail } from '@sveltejs/kit';

export const load = async ({ locals }) => {
    const { supabase, safeGetSession } = locals;
    const { session } = await safeGetSession();
    
    const { data: races } = await supabase.from('race').select('*');
    const { data: images } = await supabase.from('images_profil').select('*');
    const { data: niveaux } = await supabase.from('niveau').select('*'); 
    
    // 1. Récupération de TOUS les héros actifs du royaume (avec tri stable par XP puis par ID)
    const { data: tousLesHerosActifs } = await supabase
        .from('heros')
        .select(`
            id_heros, 
            nom, 
            experience, 
            niveau, 
            id_image, 
            sexe, 
            id_prefixe, 
            id_suffixe, 
            images_profil(url_image),
            pref:id_prefixe(texte_masculin, texte_feminin),
            suffixes:id_suffixe(texte_masculin, texte_feminin),
            Joueurs(Surnom, id_joueur)
        `)
        .eq('Actif', true)
        .order('experience', { ascending: false })
        .order('id_heros', { ascending: true });

    const listeHeros = tousLesHerosActifs ?? [];
    const topHeros = listeHeros.slice(0, 20);

    // 2. Si pas connecté
    if (!session) {
        return { 
            herosPerso: [], 
            topHeros, 
            tousLesHerosActifs: listeHeros,
            races: races ?? [], 
            images: images ?? [], 
            niveaux: niveaux ?? []
        };
    }

    // 3. Récupération des héros actifs du joueur connecté (avec le même tri stable)
    const { data: herosPerso } = await supabase
        .from('heros')
        .select(`
            id_heros, 
            nom, 
            experience, 
            niveau, 
            id_image, 
            sexe, 
            Actif,
            id_prefixe, 
            id_suffixe, 
            images_profil(url_image),
            pref:id_prefixe(texte_masculin, texte_feminin),
            suffixes:id_suffixe(texte_masculin, texte_feminin),
            Joueurs(Surnom)
        `)
        .eq('id_joueur', session.user.id)
        .eq('Actif', true)
        .order('experience', { ascending: false })
        .order('id_heros', { ascending: true });

    return {
        herosPerso: herosPerso ?? [],
        topHeros,
        tousLesHerosActifs: listeHeros,
        races: races ?? [], 
        images: images ?? [], 
        niveaux: niveaux ?? []
    };
};

export const actions = {
    ajouterHeros: async ({ request, locals }) => {
        const { supabase, safeGetSession } = locals;
        const { session } = await safeGetSession();
        if (!session) return fail(401, { message: "Session expirée" });

        const formData = await request.formData();
        const nom = formData.get('nom')?.toString();
        const id_race = formData.get('id_race');
        const id_image = formData.get('id_image');
        const sexe = formData.get('sexe')?.toString();

        if (!nom || !id_race || !id_image || !sexe) {
            return fail(400, { message: "Champs manquants" });
        }

        const { error } = await supabase.from('heros').insert([{ 
            nom,
            sexe: sexe,
            id_race: Number(id_race),
            id_image: Number(id_image),
            id_joueur: session.user.id,
            niveau: 1,
            experience: 0,
            Actif: true
        }]);

        if (error) return fail(400, { message: "Erreur DB: " + error.message }); 

        return { success: true, message: "Héros créé !" };
    }
};