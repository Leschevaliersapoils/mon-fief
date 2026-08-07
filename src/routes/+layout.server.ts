import { redirect } from '@sveltejs/kit';
import { base } from '$app/paths';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
    const { session, user } = await locals.safeGetSession();

    // Nettoyage du pathname (enlève le slash de fin s'il y en a un)
    const cheminActuel = url.pathname.replace(/\/$/, "");
    const baseClean = (base || '').replace(/\/$/, "");

    // Liste de toutes les routes publiques autorisées sans connexion
    const routesPubliques = [
        `${baseClean}`,
        `${baseClean}/`,
        `${baseClean}/inscription`,
        `${baseClean}/connexion`,
        `${baseClean}/guide`,
        `${baseClean}/test-supabase`,
    ];

    // On vérifie si le chemin actuel correspond à l'une des pages publiques
    const estSurPagePublique = routesPubliques.includes(cheminActuel) || cheminActuel === "";

    // Si l'utilisateur n'est pas connecté ET qu'il n'est pas sur une page publique -> Redirection vers l'accueil
    if (!user && !estSurPagePublique) {
        throw redirect(303, `${base || ''}/`);
    }

    let surnom = null;
    let nbMessagesNonLus = 0;

    if (user) {
        const [joueurRes, messageRes] = await Promise.all([
            locals.supabase
                .from('Joueurs')
                .select('Surnom')
                .eq('id_joueur', user.id)
                .single(),
            
            locals.supabase
                .from('message')
                .select('*', { count: 'exact', head: true })
                .eq('id_joueur', user.id)
                .eq('lu', false)
        ]);
        
        if (!joueurRes.error && joueurRes.data) {
            surnom = joueurRes.data.Surnom;
        }

        if (!messageRes.error && messageRes.count !== null) {
            nbMessagesNonLus = messageRes.count;
        }
    }

    return {
        session,
        user,
        surnom,
        nbMessagesNonLus
    };
};