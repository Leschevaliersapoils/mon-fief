import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    // On essaie de récupérer la session ou de faire une requête simple
    const { data, err } = await locals.supabase.auth.getSession();
    
    return {
        success: true,
        urlConfigured: !!locals.supabase,
        hasError: !!err
    };
};