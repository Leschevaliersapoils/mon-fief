import { fail, redirect } from '@sveltejs/kit';
import { base } from '$app/paths';
import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
  login: async (event) => {
    const { request, locals } = event;
    const formData = await request.formData();
    
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await locals.supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return fail(400, { error: "Identifiants incorrects, Messire." });
    }

    throw redirect(303, `${base}/cour`);
  },

  rreset: async (event) => {
    const { request, locals } = event;
    const formData = await request.formData();
    const email = formData.get('email') as string;

    if (!email) {
        return fail(400, { error: 'Veuillez renseigner votre e-mail pour retrouver votre chemin, Messire.' });
    }

    // On transforme request.url en objet URL pour récupérer l'origine proprement
    const url = new URL(request.url);
    const redirectTo = `${url.origin}${base}/reinitialisation-mot-de-passe`;

    const { error } = await locals.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectTo
    });

    if (error) {
        return fail(400, { error: error.message });
    }

    return { success: true, message: "Un pigeon voyageur a apporté un lien de réinitialisation à votre adresse." };
  }
};