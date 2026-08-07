import { fail, redirect } from '@sveltejs/kit';
import { base } from '$app/paths';
import type { Actions } from './$types';

export const actions: Actions = {
    default: async (event) => {
        const { request, locals } = event;
        const supabase = locals.supabase;

        const formData = await request.formData();
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const username = formData.get('username') as string;

        if (!email || !password || !username) {
            return fail(400, { error: 'Tous les champs sont obligatoires, Messire !' });
        }

        if (password.length < 6) {
            return fail(400, { error: 'Le mot de passe doit faire au moins 6 caractères.' });
        }

        const { data, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username: username
                }
            }
        });

        if (authError) {
            console.error("Erreur d'inscription Supabase:", authError);
            return fail(400, { error: authError.message });
        }

        // Si l'utilisateur est bien créé, on s'assure d'ajouter le profil dans ta table 'Joueurs'
        if (data.user) {
            const { error: profileError } = await supabase
                .from('Joueurs')
                .upsert({
                    id_joueur: data.user.id,
                    Surnom: username
                });

            if (profileError) {
                console.error("Erreur création profil Joueur:", profileError.message);
            }
        }

        if (!data.session) {
            return {
                success: true,
                message: "Inscription réussie ! Veuillez vérifier vos e-mails pour confirmer votre compte."
            };
        }

        throw redirect(303, `${base}/cour`);
    }
};