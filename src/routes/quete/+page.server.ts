import { error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    const { supabase } = locals;
    const { session } = await locals.safeGetSession();

    if (!session || !session.user) {
        return { defis: [], heros: [], accomplissements: [], races: [] };
    }

    // 1. Récupérer tous les défis
    const { data: defis, error: errDefis } = await supabase.from('defis').select('*');

    // 2. Récupérer les races
    const { data: races, error: errRaces } = await supabase.from('race').select('*');

   // 3. Récupérer uniquement les héros actifs du joueur avec leur portrait lié par id_image
    const { data: heros, error: errHeros } = await supabase
        .from('heros')
        .select('*, images_profil(url_image)')
        .eq('id_joueur', session.user.id)
        .eq('Actif', true);

    // 4. Récupérer tous les accomplissements
    const { data: accomplissements, error: errAcc } = await supabase
        .from('accomplissements')
        .select('id_defi, id_animal, date_demande, validation');

    if (errDefis || errRaces || errHeros || errAcc) {
        console.error("Erreur taverne - defis:", errDefis);
        console.error("Erreur taverne - races:", errRaces);
        console.error("Erreur taverne - heros:", errHeros);
        console.error("Erreur taverne - accomplissements:", errAcc);
        throw error(500, "Impossible de charger les données de la taverne.");
    }

    return { 
        defis: defis || [], 
        heros: heros || [],
        accomplissements: accomplissements || [],
        races: races || []
    };
};

export const actions: Actions = {
    accomplirQuete: async ({ request, locals }) => {
        const { supabase } = locals;
        const formData = await request.formData();
        const id_defi = formData.get('id_defi');
        const id_heros = formData.get('id_heros');

        const { count } = await supabase
            .from('accomplissements')
            .select('*', { count: 'exact', head: true })
            .eq('id_animal', id_heros)
            .eq('validation', 'en_attente');

        if (count !== null && count >= 2) {
            return { success: false, message: "Le Chambellan refuse : vous avez déjà 2 quêtes en attente." };
        }

        const { error: insertError } = await supabase
            .from('accomplissements')
            .insert({
                id_defi: id_defi,
                id_animal: id_heros,
                validation: 'en_attente',
                date_demande: new Date().toISOString()
            });

        if (insertError) return { success: false, message: "Erreur lors de la soumission." };

        return { success: true };
    }
};