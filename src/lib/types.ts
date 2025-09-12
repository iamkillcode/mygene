
export interface Profile {
  id: string; // Unique code (Firestore document ID)
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
  name?: string | null;
  countryPreference?: string; 
}
