import { fail, redirect } from '@sveltejs/kit';
import { base } from '$app/paths';
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
                data: {
                    username: username
                },
                emailRedirectTo: `${event.url.origin}${base}/cour`
            }
        });

        // 3. Gestion des erreurs (ex: email déjà utilisé ou mot de passe trop court)
        if (authError) {
            console.error("Erreur d'inscription:", authError.message);
            return fail(400, { error: authError.message });
        }

        // 4. Vérification si la confirmation par email bloque la connexion immédiate
        // Si Supabase demande de confirmer l'email, il n'y a pas de session active
        if (!data.session) {
            return fail(400, { 
                error: "Inscription réussie ! Cependant, veuillez vérifier vos e-mails pour confirmer votre compte avant de vous connecter." 
            });
        }

        // 5. Redirection vers la cour
        throw redirect(303, '/cour');
    }
};