"use server";

import axios from "axios";
import { z } from "zod";

import { type GetAddressGeocodingResponseData } from "./types";

interface FormState {
  data?: GetAddressGeocodingResponseData;
  errors?: {
    addressNumber?: string[];
    street?: string[];
    zip?: string[];
    message?: string;
  };
}

const createAddressSchema = z
  .object({
    addressNumber: z.string({
      invalid_type_error: "must enter a valid street number",
    }),
    street: z.string().min(3),
    zip: z
      .string({
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
  } else {
    try {
      const { addressNumber, street, zip } = validationResult.data;
      const response = await axios.get(
        "https://api.mapbox.com/search/geocode/v6/forward",
        {
          params: {
            access_token: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
            address_number: addressNumber,
            street,
            postCode: zip,
            country: "US", // limit results to U.S.
            limit: "1", // limit the results to the most specific result as determined by the mapbox directions API
          },
        }
      );
      return { data: response.data };
    } catch (error: unknown) {
      if (error instanceof Error) {
        {
          return {
            errors: {
              message: error.message,
            },
          };
        }
      } else {
        return {
          errors: {
            message: "error entering address. Please try again",
          },
        };
      }
    }
  }
}
