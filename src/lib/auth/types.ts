export type User = {
  id: string;
  cmsId: number;
  username: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  image: string;
  institute?: string | null | undefined;
  role?: string | null | undefined;
};
