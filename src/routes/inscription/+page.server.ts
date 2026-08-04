import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
    default: async (event) => {
        const { request, locals } = event;
        const supabase = locals.supabase;

        // 1. Récupération des données du formulaire
        const formData = await request.formData();
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const username = formData.get('username') as string;

        // Petite vérification de sécurité rapide
        if (!email || !password || !username) {
            return fail(400, { error: 'Tous les champs sont obligatoires, Messire !' });
        }

        // 2. Tentative d'inscription sur Supabase Auth
        const { data, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                // Ces données sont envoyées à la table 'auth.users' 
                // et seront lues par ton Trigger SQL pour remplir la table 'Joueurs'
                data: {
                    username: username
                }
            }
        });

        // 3. Gestion des erreurs (ex: email déjà utilisé ou mot de passe trop court)
        if (authError) {
            console.error("Erreur d'inscription:", authError.message);
            return fail(400, { error: authError.message });
        }

        // 4. Si tout est bon, on redirige vers la cour !
        // Le Trigger SQL s'occupe tout seul de créer la ligne dans la table 'Joueurs'
        throw redirect(303, '/cour');
    }
};