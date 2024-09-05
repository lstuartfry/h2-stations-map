"use server";

import axios from "axios";
import { z } from "zod";

import { type GetAddressGeocodingResponseData } from "./types";

interface FormState {
  data?: GetAddressGeocodingResponseData;
  errors?: {
    address?: string[];
    city?: string[];
    zip?: string[];
    message?: string;
  };
}

const createAddressSchema = z
  .object({
    address: z.string({
      required_error: "must enter a street address",
    }),
    city: z.string({
      required_error: "must enter a city",
    }),
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
    address: formData.get("address"),
    city: formData.get("city"),
    zip: formData.get("zip"),
  });

  if (!validationResult.success) {
    return {
      errors: validationResult.error.flatten().fieldErrors,
    };
  } else {
    try {
      const { address, city, zip } = validationResult.data;
      const response = await axios.get(
        "https://api.mapbox.com/search/geocode/v6/forward",
        {
          params: {
            access_token: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
            address_line1: address,
            city,
            postCode: zip,
            state: "CA", // form state is locked to "CA"
            country: "US", // limit results to U.S.
            limit: "1", // limit the results to the most specific result as determined by the mapbox geocoding API
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
