import { fail, redirect } from '@sveltejs/kit';
import { base } from '$app/paths';
import type { Actions } from './$types';

export const actions: Actions = {
    default: async (event) => {
        const { request, locals, url } = event;
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

        // 2. Tentative d'inscription sur Supabase Auth sans redirection complexe
        const { data, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
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

        // 4. Si la confirmation par e-mail est active, pas de session immédiate
        if (!data.session) {
            return {
                success: true,
                message: "Inscription réussie ! Veuillez vérifier vos e-mails pour confirmer votre compte."
            };
        }

        // 5. Si tout est bon et qu'on a une session active, direction la cour
        throw redirect(303, `${base}/cour`);
    }
};