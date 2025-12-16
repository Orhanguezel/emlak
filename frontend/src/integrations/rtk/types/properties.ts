// FILE: src/integrations/metahub/db/types/properties.ts

export interface Properties {
    id: string;
    title: string;
    slug: string;

    type: string;
    status: string;

    address: string;
    district: string;
    city: string;

    coordinates: {
        lat: number;
        lng: number;
    };

    description?: string | null;

    is_active: boolean;
    display_order: number;

    created_at: string; // backend Date dönüyorsa FE'de genelde string geliyor
    updated_at: string;
}
