"use server";

import { parse } from "set-cookie-parser";
import { type ZodType, z } from "zod";

const OLIMANAGER_URL = "https://olimpiadi-scientifiche.it/graphql";

async function getCsrf() {
  const res = await fetch(OLIMANAGER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  const cookies = parse(res.headers.getSetCookie());
  const csrf = cookies.find((cookie) => cookie.name === "csrftoken")?.value;
  if (!csrf) {
    throw new Error("No CSRF token found");
  }
  return csrf;
}

async function query<T>(query: string, schema: ZodType<T, any, any>): Promise<T> {
  const csrf = await getCsrf();
  const res = await fetch(OLIMANAGER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrf,
      Cookie: `csrftoken=${csrf}`,
    },
    cache: "no-store",
    body: JSON.stringify({ query }),
  });

  const responseSchema = z.union([
    z.object({ errors: z.array(z.object({ message: z.string() })) }),
    z.object({ data: schema }),
  ]);

  const data = responseSchema.parse(await res.json());
  if ("errors" in data) {
    throw new Error(data.errors[0].message);
  }
  return data.data as T;
}

const locationSchema = z.object({
  id: z.coerce.string(),
  name: z.string(),
});

export type Location = z.infer<typeof locationSchema>;

// biome-ignore lint/suspicious/useAwait: server actions must be async
export async function getRegions(_: string): Promise<Location[]> {
  return [
    { id: "ABR", name: "Abruzzo" },
    { id: "BAS", name: "Basilicata" },
    { id: "CAL", name: "Calabria" },
    { id: "CAM", name: "Campania" },
    { id: "EMI", name: "Emilia-Romagna" },
    { id: "FRI", name: "Friuli-Venezia Giulia" },
    { id: "LAZ", name: "Lazio" },
    { id: "LIG", name: "Liguria" },
    { id: "LOM", name: "Lombardia" },
    { id: "MAR", name: "Marche" },
    { id: "MOL", name: "Molise" },
    { id: "PIE", name: "Piemonte" },
    { id: "PUG", name: "Puglia" },
    { id: "SAR", name: "Sardegna" },
    { id: "SIC", name: "Sicilia" },
    { id: "TOS", name: "Toscana" },
    { id: "TRE", name: "Trentino-Alto Adige" },
    { id: "UMB", name: "Umbria" },
    { id: "VAL", name: "Valle d'Aosta" },
    { id: "VEN", name: "Veneto" },
  ];
}

const provincesSchema = z.object({
  provinces: z.object({
    provinces: locationSchema.array(),
  }),
});

export async function getProvinces(regionId: string): Promise<Location[]> {
  const data = await query(
    `{
      provinces {
        provinces(filters: {region: {id: {exact: "${regionId}"}}}) {
          id
          name
        }
      }
    }`,
    provincesSchema,
  );
  return data.provinces.provinces;
}

const citiesSchema = z.object({
  cities: z.object({
    cities: locationSchema.array(),
  }),
});

export async function getCities(provinceId: string): Promise<Location[]> {
  const data = await query(
    `{
      cities {
        cities(filters: {province: {id: {exact: "${provinceId}"}}})  {
          id
          name
        }
      }
    }`,
    citiesSchema,
  );
  return data.cities.cities;
}

const schoolsSchema = z.object({
  schools: z.object({
    schools: z.object({
      edges: z.array(
        z.object({
          node: z.object({
            externalId: z.string(),
            name: z.string(),
          }),
        }),
      ),
    }),
  }),
});

export async function getSchools(cityId: string): Promise<Location[]> {
  const data = await query(
    `{
      schools {
        schools(filters: {location: {city: {id: {exact: "${cityId}"}}}}) {
          edges {
            node {
              externalId
              name
            }
          }
        }
      }
    }`,
    schoolsSchema,
  );
  return data.schools.schools.edges.map(
    (edge): Location => ({ id: edge.node.externalId, name: edge.node.name }),
  );
}

const schoolSchema = z.object({
  schools: z.object({
    schools: z.object({
      edges: z
        .object({
          node: z.object({
            externalId: z.string(),
            name: z.string(),
            type: z.object({
              name: z.string(),
            }),
            location: z.object({
              city: z.object({
                name: z.string(),
                province: z.object({
                  region: z.object({
                    name: z.string(),
                  }),
                }),
              }),
            }),
          }),
        })
        .array(),
    }),
  }),
});

export async function getSchool(schoolId: string | undefined | null): Promise<string | undefined> {
  if (!schoolId) return;
  const data = await query(
    `{
      schools {
        schools(filters: {externalId: {exact: "${schoolId}"}}) {
          edges {
            node {
              name
              type {
                name
              }
              location {
                city {
                  name
                  province {
                    region {
                      name
                    }
                  }
                }
              }
            }
          }
        }
      }
    }`,
    schoolSchema,
  );
  const school = data.schools.schools.edges[0]?.node;
  if (!school) return;
  return `${school.type.name} ${school.name}, ${school.location.city.name}, ${school.location.city.province.region.name}`;
}
