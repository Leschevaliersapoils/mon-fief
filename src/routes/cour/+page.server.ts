import { redirect } from '@sveltejs/kit'; // On remplace error par redirect
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    // 1. On récupère la session via safeGetSession
    const { session } = await locals.safeGetSession();

    // 🛡️ PROTECTION : Si pas de session, on renvoie à la page d'inscription (ou connexion)
    if (!session) {
        // Le code 303 est le code standard pour une redirection après vérification
        throw redirect(303, '/inscription'); 
    }

    // 2. On cherche le joueur dans la table "Joueurs"
    // Note : On utilise session.user.id (plus direct)
    const { data: joueur, error: dbError } = await locals.supabase
        .from('Joueurs')
        .select('Surnom')
        .eq('id_joueur', session.user.id)
        .maybeSingle();

    if (dbError) {
        console.error("Erreur de base de données:", dbError.message);
    }

    return {
        surnom: joueur?.Surnom ?? 'Messire Inconnu'
    };
};