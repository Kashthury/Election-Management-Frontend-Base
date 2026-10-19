// Set this to the backend origin used by your local environment.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// Assessment instructions: replace each value with the matching backend endpoint.
export const API_ENDPOINTS = {
  provinces: "Call your backend API to get and manage provinces",
  provinceById: "Call your backend API to get, update, or delete a province by ID",
  districts: "Call your backend API to get and manage districts",
  districtById: "Call your backend API to get, update, or delete a district by ID",
  districtSeats: "Call your backend API to update seat allocation for a district",
  partiesByDistrict: "Call your backend API to get and create parties for a district",
  partyById: "Call your backend API to update or delete a party in a district",
  electionSettings: "Call your backend API to get and update election settings",
  electionResults: "Call your backend API to get election result history",
  calculateElection: "Call your backend API to calculate election results",
} as const;
