import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
    const { session } = await safeGetSession();
    
    // Récupération des tables nécessaires
    const { data: races } = await supabase.from('race').select('*');
    const { data: images } = await supabase.from('images_profil').select('*');
    const { data: niveaux } = await supabase.from('niveau').select('*'); 

    if (!session) {
        return { heros: [], races: races ?? [], images: images ?? [], niveaux: niveaux ?? [] };
    }

    const { data: heros } = await supabase
        .from('heros')
        .select('*, race(nom_race), images_profil(url_image)')
        .eq('id_joueur', session.user.id)
        .eq('Actif', true);

    return {
        heros: heros ?? [],
        races: races ?? [],
        images: images ?? [],
        niveaux: niveaux ?? [] 
    };
};

export const actions: Actions = {
    ajouterHeros: async ({ request, locals: { supabase, safeGetSession } }) => {
        const { session } = await safeGetSession();
        if (!session) return fail(401, { message: "Session expirée" });

        const formData = await request.formData();
        
        // On récupère les valeurs
        const nom = formData.get('nom')?.toString();
        const id_race = formData.get('id_race');
        const id_image = formData.get('id_image');
        const sexe = formData.get('sexe')?.toString();

        console.log("Tentative d'insertion avec :", { nom, id_race, id_image, sexe });

        // Vérification renforcée
        if (!nom || !id_race || !id_image || !sexe) {
            console.log("Échec : champs manquants");
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

        if (error) {
            console.error("ERREUR CRITIQUE SUPABASE :", error); // <--- REGARDE TON TERMINAL ICI
            return fail(400, { message: "Erreur DB: " + error.message }); 
        }

        return { success: true, message: "Héros créé !" };
    }
};