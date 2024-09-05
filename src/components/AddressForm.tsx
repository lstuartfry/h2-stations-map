"use client";

import dynamic from "next/dynamic";
import { useFormState } from "react-dom";
import { Button, Fieldset, Legend } from "@headlessui/react";
import { useEffect } from "react";

import { getAddressGeocode } from "@/actions";
import Input from "@/components/Input";

// reference: https://stackoverflow.com/questions/72311188/hydration-failed-error-using-recharts-with-nextjs
const AddressAutofill = dynamic(
  () =>
    import("@mapbox/search-js-react").then((mapbox) => mapbox.AddressAutofill),
  {
    ssr: false,
    // use a placeholder input while the mapbox search-js-react AddressAutofill component is dynamically loaded
    loading: () => (
      <Input
        label="Address"
        placeholder="enter street address"
        name="address"
      />
    ),
  }
);

export type AddressCoordinates = {
  latitude: number;
  longitude: number;
};

export default function AddressForm({
  onSuccess,
}: {
  onSuccess: (data: AddressCoordinates) => void;
}) {
  const [formState, action] = useFormState(getAddressGeocode, {});

  useEffect(() => {
    // invoke the success callback once data is successfully returned from the server
    if (formState.data) {
      const { latitude, longitude } =
        formState.data.features[0].properties.coordinates;
      onSuccess({
        latitude,
        longitude,
      });
    }
  }, [formState.data, onSuccess]);

  // on autofill selection, immediately invoke the onSuccess callback
  const handleAutofillRetrieve = (response: any) => {
    const { coordinates } = response.features[0].geometry;
    onSuccess({ latitude: coordinates[1], longitude: coordinates[0] });
  };

  return (
    <form action={action}>
      <Fieldset className="flex flex-col gap-4">
        <Legend className="text-xl font-semibold">Enter your address</Legend>
        <div className="flex flex-col gap-4">
          <AddressAutofill
            accessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!}
            onRetrieve={handleAutofillRetrieve}
            // limit returned results to bounding box for California
            // https://docs.mapbox.com/mapbox-search-js/api/core/autofill/#addressautofilloptions
            options={{
              bbox: [-124.409591, 32.534156, -114.131211, 42.009518],
            }}
          >
            <Input
              errorMessage={formState.errors?.address?.join(", ")}
              label="Address"
              placeholder="enter street address"
              name="address"
              autoComplete="address-line-1"
            />
          </AddressAutofill>
          <Input
            errorMessage={formState.errors?.city?.join(", ")}
            label="City"
            placeholder="enter city"
            name="city"
            autoComplete="address-level2"
          />
          <div className="flex gap-4">
            <Input
              label="State"
              placeholder=""
              name="state"
              disabled
              value="CA"
            />
            <Input
              errorMessage={formState.errors?.zip?.join(", ")}
              label="Zip code"
              placeholder="enter zip"
              name="zip"
              type="number"
              autoComplete="postal-code"
            />
          </div>
          <Button
            className="flex mt-6 justify-around items-center rounded-md bg-gray-200 py-1.5 px-3 text-sm/6 font-semibold text-black data-[hover]:bg-gray-300 data-[active]:scale-95"
            type="submit"
          >
            Submit
          </Button>
        </div>
        {formState.errors?.message && (
          <div className="my-2 p-2 bg-red-200 border rounded border-red-400">
            {formState.errors?.message}
          </div>
        )}
      </Fieldset>
    </form>
  );
}
