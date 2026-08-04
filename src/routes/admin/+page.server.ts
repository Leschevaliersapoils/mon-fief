import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

// Identifiant de ton compte admin
const ID_MON_COMPTE_ADMIN = '7f080067-2887-498e-a097-d8f252e632cd'; 

export const load: PageServerLoad = async ({ locals }) => {
    const { supabase } = locals;
    const { session } = await locals.safeGetSession();
    
    // Sécurité : Vérification de la session et des droits admin
    if (!session) throw redirect(303, '/'); 
    if (session.user.id !== ID_MON_COMPTE_ADMIN) throw error(403, "Accès refusé.");

    // Chargement parallèle des données nécessaires
    const [acc, joueurs, chiens, defis, historique] = await Promise.all([
        supabase.from('accomplissements').select(`
            id_accomplissement,
            id_animal,
            id_defi,
            image_preuve_url,
            date_demande,
            validation,
            defis ( Nomdefis, XP, niveau_requis ),
            heros ( nom, niveau, id_joueur )
        `).eq('validation', 'en_attente'),
        
        supabase.from('Joueurs').select('id_joueur, Surnom'),
        
        supabase.from('heros').select('id_heros, nom, id_joueur, Actif, niveau').eq('Actif', true),
        
        supabase.from('defis').select('id, Nomdefis, niveau_requis, frequence').order('niveau_requis', { ascending: true }),
        
        supabase.from('accomplissements').select('id_defi, id_animal').eq('validation', 'valide')
    ]);

    if (acc.error) throw error(500, acc.error.message);

    return { 
        accomplissements: acc.data || [],
        joueurs: joueurs.data || [],
        chiens: chiens.data || [],
        defis: defis.data || [],
        historique: historique.data || []
    };
};

export const actions: Actions = {
    // Action pour accepter un exploit et notifier le joueur
    validerExploit: async ({ request, locals: { supabase } }) => {
        const formData = await request.formData();
        const id = formData.get('id');
        
        const { data: accData } = await supabase
            .from('accomplissements')
            .select(`
                id_animal,
                defis ( Nomdefis ),
                heros ( id_joueur, nom )
            `)
            .eq('id_accomplissement', id)
            .single();

        const { error } = await supabase.from('accomplissements').update({ 
            validation: 'valide',
            date_validation: new Date().toISOString() 
        }).eq('id_accomplissement', id);

        if (error) {
            console.error("ERREUR SUPABASE EXACTE :", error);
            return fail(500, { message: error.message });
        }

        if (accData && accData.heros) {
            const nomQuete = (accData.defis as any)?.Nomdefis || 'Quête';
            const nomChien = (accData.heros as any)?.nom || 'Compagnon';
            const idJoueur = (accData.heros as any)?.id_joueur;

            if (idJoueur) {
                await supabase.from('message').insert({
                    id_joueur: idJoueur,
                    titre: "Quête validée !",
                    contenu: `Le Maître du Jeu a validé votre quête "${nomQuete}" pour votre compagnon ${nomChien}. Gloire à vous !`,
                    lu: false
                });
            }
        }

        return { success: true };
    },

    // Action pour refuser un exploit et notifier le joueur
    refuserExploit: async ({ request, locals: { supabase } }) => {
        const formData = await request.formData();
        const id = formData.get('id');

        const { data: accData } = await supabase
            .from('accomplissements')
            .select(`
                defis ( Nomdefis ),
                heros ( id_joueur, nom )
            `)
            .eq('id_accomplissement', id)
            .single();
        
        await supabase.from('accomplissements').update({ 
            validation: 'refuse',
            date_validation: new Date().toISOString() 
        }).eq('id_accomplissement', id);

        if (accData && accData.heros) {
            const nomQuete = (accData.defis as any)?.Nomdefis || 'Quête';
            const nomChien = (accData.heros as any)?.nom || 'Compagnon';
            const idJoueur = (accData.heros as any)?.id_joueur;

            if (idJoueur) {
                await supabase.from('message').insert({
                    id_joueur: idJoueur,
                    titre: "Quête refusée",
                    contenu: `Votre demande pour la quête "${nomQuete}" (${nomChien}) a été refusée par le Maître du Jeu.`,
                    lu: false
                });
            }
        }

        return { success: true };
    },

    // Action pour envoyer un message personnalisé (à un joueur ou à tous)
    envoyerMessageAdmin: async ({ request, locals: { supabase } }) => {
        const formData = await request.formData();
        const id_joueur = formData.get('id_joueur')?.toString();
        const titre = formData.get('titre')?.toString();
        const contenu = formData.get('contenu')?.toString();

        if (!titre || !contenu || !id_joueur) {
            return fail(400, { message: "Tous les champs sont obligatoires." });
        }

        if (id_joueur === 'tous') {
            const { data: joueurs, error: errJoueurs } = await supabase
                .from('Joueurs')
                .select('id_joueur');

            if (errJoueurs || !joueurs || joueurs.length === 0) {
                return fail(500, { message: "Impossible de récupérer la liste des joueurs." });
            }

            const messagesAGenerer = joueurs.map(j => ({
                id_joueur: j.id_joueur,
                titre: titre,
                contenu: contenu,
                lu: false
            }));

            const { error: errInsert } = await supabase
                .from('message')
                .insert(messagesAGenerer);

            if (errInsert) {
                return fail(500, { message: errInsert.message });
            }
        } else {
            const { error: errInsert } = await supabase
                .from('message')
                .insert({
                    id_joueur: id_joueur,
                    titre: titre,
                    contenu: contenu,
                    lu: false
                });

            if (errInsert) {
                return fail(500, { message: errInsert.message });
            }
        }

        return { success: true };
    },

    // Action d'insertion manuelle
    ajouterExploitManuel: async ({ request, locals: { supabase } }) => {
        const formData = await request.formData();
        
        const insertData = {
            user_id: formData.get('id_joueur'),
            id_animal: parseInt(formData.get('id_animal') as string),
            id_defi: parseInt(formData.get('id_defi') as string),
            image_preuve_url: formData.get('image_preuve_url') || null,
            commentaire: formData.get('commentaire') || null,
            validation: 'valide',
            date_demande: new Date().toISOString(),
            date_validation: new Date().toISOString()
        };

        const { data, error } = await supabase
            .from('accomplissements')
            .insert(insertData)
            .select();

        if (error) {
            console.error("Erreur lors de l'insertion manuelle :", error);
            return fail(500, { message: error.message });
        }

        return { success: true, data };
    }
};