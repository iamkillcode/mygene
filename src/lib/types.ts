
export interface Profile {
  id: string; // Unique code
  imageUrl?: string; 
  name: string;
  birthDate: string; 
  deathDate: string; 
  familyDetails: string;
  religion?: string;
  education?: string;
  occupation?: string;
  burialInfo: string;
  country?: string; 
  submittedBy: string; // User ID of submitter
}

export interface User {
  id: string;
  email: string;
  name?: string;
  // country could be a preference stored for the user
  countryPreference?: string; 
}
