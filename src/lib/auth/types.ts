export enum RegistrationStep {
  Credential = 1,
  Verification = 2,
  Profile = 3,
  School = 4,
  Completed = 5,
}

export type User = {
  id: string;
  cmsId: number;
  username: string;
  email: string;
  name: string;
  image: string;
  institute?: string | null | undefined;
  role?: string | null | undefined;
  emailVerified: boolean;
  registrationStep: RegistrationStep;
};
