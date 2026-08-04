import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
    const supabase = locals.supabase;
    const herosId = Number(params.id);

    if (isNaN(herosId)) {
        throw error(400, "Identifiant invalide");
    }

    // 1. Charger le héros et ses relations principales
    const { data: hero, error: fetchError } = await supabase
        .from('heros')
        .select(`
            *, 
            race:id_race (nom_race, id_race), 
            images_profil:id_image (url_image),
            pref:id_prefixe (texte_masculin, texte_feminin),
            suffixes:id_suffixe (texte_masculin, texte_feminin)
        `)
        .eq('id_heros', herosId)
        .single();

    if (fetchError || !hero) {
        console.error("Erreur fetch hero:", fetchError);
        throw error(404, 'Compagnon introuvable');
    }

    // 2. Charger toutes les tables de référence nécessaires pour la modale et l'XP
    const { data: niveaux } = await supabase.from('niveau').select('*');
    const { data: images } = await supabase.from('images_profil').select('*');
    const { data: pref } = await supabase.from('pref').select('*');
    const { data: suffixes } = await supabase.from('suffixes').select('*');

    // 3. Charger les préfixes acquis
    const { data: prefixesAcquis } = await supabase
        .from('prefixes_acquis')
        .select(`
            id_pref,
            pref (id_pre, texte_masculin, texte_feminin)
        `)
        .eq('id_heros', herosId);

    // 4. Charger les suffixes acquis
    const { data: suffixesAcquis } = await supabase
        .from('suffixes_acquis')
        .select(`
            id_suffixe,
            suffixes (id_suf, texte_masculin, texte_feminin)
        `)
        .eq('id_heros', herosId);

    return { 
        hero, 
        disponiblePrefixes: prefixesAcquis?.map((a: any) => a.pref).filter(Boolean) || [],
        disponibleSuffixes: suffixesAcquis?.map((a: any) => a.suffixes).filter(Boolean) || [],
        niveaux: niveaux || [],
        images: images || [],
        pref: pref || [],
        suffixes: suffixes || []
    };
};

export const actions = {
    default: async ({ params, locals }) => {
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