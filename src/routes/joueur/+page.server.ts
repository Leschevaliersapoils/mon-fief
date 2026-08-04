import { fail } from '@sveltejs/kit';

export const load = async ({ locals }) => {
    const { supabase, safeGetSession } = locals;
    const { session } = await safeGetSession();

    if (!session) {
        return { session: null, joueur: null, messages: [] };
    }

    // Récupérer le pseudo/surnom du joueur dans la table Joueurs
    const { data: joueurData } = await supabase
        .from('Joueurs')
        .select('Surnom')
        .eq('id_joueur', session.user.id)
        .single();

    // Récupérer les messages du joueur
    const { data: messages, error } = await supabase
        .from('message')
        .select('*')
        .eq('id_joueur', session.user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Erreur chargement messages:', error);
    }

    return {
        session,
        joueur: joueurData,
        messages: messages ?? []
    };
};

export const actions = {
    marquerLu: async ({ request, locals }) => {
        const { supabase, safeGetSession } = locals;
        const { session } = await safeGetSession();
        if (!session) return fail(401, { message: "Non autorisé" });

        const formData = await request.formData();
        const id_message = formData.get('id_message');

        if (!id_message) return fail(400, { message: "ID manquant" });

        const { error } = await supabase
            .from('message')
            .update({ lu: true })
            .eq('id_message', id_message)
            .eq('id_joueur', session.user.id);

        if (error) {
            return fail(400, { message: "Erreur lors de la mise à jour" });
        }

        return { success: true };
    }
};