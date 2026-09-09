import { fail, redirect } from '@sveltejs/kit';
import { base } from '$app/paths';
import type { Actions } from './$types';

export const actions: Actions = {
    updatePassword: async ({ request, locals }) => {
        const formData = await request.formData();
        const password = formData.get('password') as string;

        if (!password || password.length < 6) {
            return fail(400, { error: 'Le mot de passe doit faire au moins 6 caractères.' });
        }

        // Met à jour l'utilisateur connecté via le token de réinitialisation
        const { error } = await locals.supabase.auth.updateUser({
            password: password
        });

        if (error) {
            return fail(400, { error: error.message });
        }

        // Une fois changé, on redirige vers la cour (ou la page de connexion)
        throw redirect(303, `${base}/connexion`);
    }
};