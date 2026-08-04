import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    // 1. Récupération de la session sécurisée
    const { session } = await locals.safeGetSession();

    if (!session) {
        throw redirect(303, '/inscription'); 
    }

    // 2. On récupère l'ID du joueur connecté
    const userId = session.user.id;

    // 3. On peut optionnellement charger les données initiales du royaume directement ici si tu veux, 
    // ou laisser le client les charger. Le plus important est de transmettre le userId !
    return {
        userId
    };
};