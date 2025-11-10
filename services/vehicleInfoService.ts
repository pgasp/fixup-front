import { Vehicle } from '../types';

// Le token de démonstration fourni dans l'exemple
const API_TOKEN = 'TokenDemo2025A';
// L'endpoint pour la recherche par plaque (SIV)
const API_URL = 'https://api.apiplaqueimmatriculation.com/siv';

interface ApiResponse {
    success: boolean;
    message?: string;
    marque: string;
    modele: string;
    [key: string]: any; 
}

export const fetchVehicleInfo = async (licensePlate: string): Promise<Partial<Omit<Vehicle, 'id' | 'licensePlate'>>> => {
    // Utilisation de URLSearchParams pour créer un corps de requête x-www-form-urlencoded.
    // C'est une méthode standard pour les formulaires web et elle est considérée comme une
    // "requête simple" par les navigateurs, ce qui évite les problèmes de pré-vérification CORS
    // qui causaient l'erreur "Failed to fetch". C'est aussi la méthode attendue par le serveur,
    // ce qui corrige l'erreur "The route siv could not be found".
    const body = new URLSearchParams();
    body.append('plaque', licensePlate.trim().toUpperCase());
    body.append('token', API_TOKEN);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                // Le Content-Type est automatiquement défini à 'application/x-www-form-urlencoded' 
                // par le navigateur lorsqu'on utilise un corps de type URLSearchParams.
                'Accept': 'application/json',
            },
            body: body,
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: `Erreur HTTP ${response.status}` }));
            throw new Error(errorData?.message || `Erreur API: Véhicule non trouvé ou plaque incorrecte.`);
        }

        const data: ApiResponse = await response.json();
        
        if (data.success === false || !data.marque || !data.modele) {
             throw new Error(data.message || "Les données reçues de l'API sont incomplètes.");
        }

        const capitalize = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '';

        return {
            make: capitalize(data.marque),
            model: capitalize(data.modele),
        };

    } catch (error) {
        console.error("Erreur lors de la récupération des informations du véhicule:", error);
        if (error instanceof Error) {
            // On propage le message d'erreur pour qu'il soit affiché à l'utilisateur
            throw new Error(error.message);
        }
        throw new Error('Une erreur réseau ou inconnue est survenue.');
    }
};