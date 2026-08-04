import { error, redirect } from '@sveltejs/kit';

export const load = async ({ params, locals }: { params: any; locals: any }) => {
    const supabase = locals.supabase;
    const herosId = Number(params.id);

    if (isNaN(herosId)) {
        throw error(400, "Identifiant invalide");
    }

    // 1. Charger le héros avec ses relations, y compris le préfixe et le suffixe actifs
    const { data: hero, error: fetchError } = await supabase
        .from('heros')
        .select(`
            *, 
            race(nom_race, id_race), 
            images_profil(url_image),
            pref(texte_masculin, texte_feminin),
            suffixes(texte_masculin, texte_feminin)
        `)
        .eq('id_heros', herosId)
        .single();

    if (fetchError || !hero) {
        throw error(404, 'Compagnon introuvable');
    }

    // 2. Charger les données de référence (pour les menus de modification)
    const { data: niveaux } = await supabase.from('niveau').select('*');
    const { data: images } = await supabase.from('images_profil').select('*');
    const { data: pref } = await supabase.from('pref').select('*');
    const { data: suffixes } = await supabase.from('suffixes').select('*');

    // 3. Charger les préfixes acquis (pour le menu de choix dans la modale)
    const { data: prefixesAcquis, error: prefError } = await supabase
        .from('prefixes_acquis')
        .select(`
            id_pref,
            pref (id_pre, texte_masculin, texte_feminin)
        `)
        .eq('id_heros', herosId);

    if (prefError) console.error("Erreur chargement préfixes acquis :", prefError);

    // 4. Charger les suffixes acquis (pour le menu de choix dans la modale)
    const { data: suffixesAcquis, error: sufError } = await supabase
        .from('suffixes_acquis')
        .select(`
            id_suffixe,
            suffixes (id_suf, texte_masculin, texte_feminin)
        `)
        .eq('id_heros', herosId);

    if (sufError) console.error("Erreur chargement suffixes acquis :", sufError);

    // 5. Retourner les données
    return { 
        hero, 
        disponiblePrefixes: prefixesAcquis?.map(a => a.pref).filter(Boolean) || [],
        disponibleSuffixes: suffixesAcquis?.map(a => a.suffixes).filter(Boolean) || [],
        niveaux: niveaux || [],
        images: images || [],
        pref: pref || [],
        suffixes: suffixes || []
    };
};

export const actions = {
    default: async ({ params, locals }: { params: any; locals: any }) => {
        const supabase = locals.supabase;
        const herosId = Number(params.id); 

        if (isNaN(herosId)) {
            throw error(400, "Identifiant invalide");
        }

        const { error: updateError } = await supabase
            .from('heros')
            .update({ Actif: false })
            .eq('id_heros', herosId);

        if (updateError) {
            console.error("Erreur update :", updateError.message);
            throw error(500, updateError.message);
        }
        
        throw redirect(303, '/heros');
    }
};