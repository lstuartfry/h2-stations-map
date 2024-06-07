"use server";

import { z } from "zod";
import { type GetAddressGeocodingResponseData } from "./types";

interface GetAddressGeocodingResponse {
  data?: GetAddressGeocodingResponseData;
  message?: string;
}

interface FormState {
  errors: {
    addressNumber?: string[];
    street?: string[];
    zip?: string[];
  };
}

const createAddressSchema = z
  .object({
    addressNumber: z.number({
      invalid_type_error: "must be a number",
    }),
    street: z.string().min(3),
    zip: z
      .number({
        invalid_type_error: "must be a 5-digit number",
      })
      .min(5)
      .max(5),
  })
  .required();

/**
 * Fetches Mapbox Geocoding data for a specific U.S. zip code.
 */
export async function getAddressGeocode(
  _formState: FormState,
  formData: FormData
): Promise<FormState> {
  // validate the form values before dispatching the server request
  const validationResult = createAddressSchema.safeParse({
    addressNumber: formData.get("addressNumber"),
    street: formData.get("street"),
    zip: formData.get("zip"),
  });

  if (!validationResult.success) {
    return {
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  return {
    errors: {},
  };

  // try {
  //   const addressNumber = formData.get("addressNumber");
  //   const street = formData.get("street");
  //   const zip = formData.get("zip");

  //   // validate each field
  //   if (typeof addressNumber !== "string" || addressNumber.length === 0) {
  //     return { message: "Please enter a valid street number" };
  //   }

  //   if (typeof street !== "string" || street.length === 0) {
  //     return { message: "Please enter a valid street address" };
  //   }

  //   if (typeof zip !== "string" || zip.length !== 5) {
  //     return { message: "Please enter a valid zip code" };
  //   }

  //   const response = await axios.get(
  //     "https://api.mapbox.com/search/geocode/v6/forward",
  //     {
  //       params: {
  //         access_token: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
  //         address_number: addressNumber,
  //         street,
  //         postCode: zip,
  //         country: "US", // limit results to U.S.
  //         limit: "1", // limit the results to the most specific result as determined by the mapbox directions API
  //       },
  //     }
  //   );
  //   return { data: response.data };
  // } catch (error: unknown) {
  //   if (error instanceof Error) {
  //     {
  //       return {
  //         message: error.message,
  //       };
  //     }
  //   } else {
  //     return {
  //       message: "error entering address. Please try again",
  //     };
  //   }
  // }
}
