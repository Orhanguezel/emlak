// src/integrations/metahub/db/types/cemeteries.ts


export interface Cemeteries {
  id: string;
  name: string;
  type: string;
  address: string;
  district: string;
  phone: string;
  fax?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  services: string[];
  workingHours: string;
  description: string;
  accessibility?: string;
  transportation?: string;
}