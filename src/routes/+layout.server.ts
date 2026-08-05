import { redirect } from '@sveltejs/kit';
import { base } from '$app/paths';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
   
    const { session, user } = await locals.safeGetSession();

    const pagesPubliques = [`${base}/`, `${base}/inscription`, `${base}/connexion`];
    const estSurPagePublique = pagesPubliques.includes(url.pathname);

    // 2. Sécurité basée sur l'objet 'user' (vérifié côté serveur)
    if (!user && !estSurPagePublique) {
        throw redirect(303, `${base}/`);
    }

    // 3. Récupération des données du joueur et du nombre de messages non lus
    let surnom = null;
    let nbMessagesNonLus = 0;

    if (user) {
        // On utilise directement locals.supabase qui est déjà authentifié
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
        session, // Nécessaire pour le client (browser)
        user,    // L'objet utilisateur sûr
        surnom,
        nbMessagesNonLus
    };
};