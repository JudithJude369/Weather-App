import axios from "axios";

/* ---------- TYPES ---------- */
export interface GeoResult {
  latitude: number;
  longitude: number;
  name: string;
  country: string;
}

export interface GeoResponse {
  results: GeoResult[];
}

/* ---------- API FUNCTION ---------- */
const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";

export const fetchGeoLocation = async (
  searchTerm: string,
): Promise<GeoResponse> => {
  const res = await axios.get<GeoResponse>(GEO_URL, {
    params: {
      name: searchTerm,
      count: 1,
    },
  });
  return res.data;
};
