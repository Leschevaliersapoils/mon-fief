import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

// 1. Chargement initial et sécurisé des données
export const load: PageServerLoad = async (event) => {
    const { url, locals } = event;
    const { supabase } = locals;
    
    const idDefi = url.searchParams.get('defi');
    const idHeros = url.searchParams.get('heros');

    if (!idDefi || !idHeros) {
        throw redirect(303, '/quete');
    }

    const { data: defi } = await supabase
        .from('defis')
        .select('*')
        .eq('id', idDefi)
        .single();

    const { data: hero } = await supabase
        .from('heros')
        .select('*, images_profil(url_image)')
        .eq('id_heros', idHeros)
        .single();

    if (!defi || !hero) {
        throw redirect(303, '/quete');
    }

    return { defi, hero };
};

// 2. Action d'enregistrement de l'exploit nettoyée
export const actions: Actions = {
    enregistrerAccomplissement: async (event) => {
        const { request, locals } = event;
        const { supabase } = locals;
        
        const { session } = await locals.safeGetSession();
        if (!session || !session.user) {
            return fail(401, { error: "Vous devez être connecté." });
        }

        const formData = await request.formData();
        const idDefi = formData.get('id_defi');
        const idHeros = formData.get('id_heros');
        const image_preuve_url = formData.get('image_preuve_url');

        // On construit l'objet STRICTEMENT aligné avec tes tables Supabase
        const donnéesInsertion = {
            id_defi: idDefi,
            id_animal: idHeros,          // Validé : la table 'accomplissements' utilise id_animal
            image_preuve_url: image_preuve_url,
            user_id: session.user.id     // L'identifiant de l'utilisateur connecté
        };

        const { error: errInsert } = await supabase
            .from('accomplissements')
            .insert(donnéesInsertion);

        if (errInsert) {
            console.error("❌ Erreur Supabase :", errInsert.message);
            return fail(500, { error: errInsert.message });
        }

        return { success: true };
    }
};