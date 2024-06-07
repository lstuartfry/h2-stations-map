"use client";

import { useFormState } from "react-dom";
import { Button, Fieldset, Legend } from "@headlessui/react";
import { useEffect } from "react";

import { getAddressGeocode } from "@/actions";
import { type GetAddressGeocodingResponseData } from "@/actions/types";
import Input from "@/components/Input";

export default function AddressForm({
  onSuccess,
}: {
  onSuccess: (data: GetAddressGeocodingResponseData) => void;
}) {
  const [formState, action] = useFormState(getAddressGeocode, { errors: {} });

  useEffect(() => {
    // invoke the success callback once data is successfully returned from the server
    // if (formState.data) {
    //   onSuccess(formState.data);
    // }
  }, [formState.data, onSuccess]);

  return (
    <form action={action}>
      <Fieldset className="flex flex-col gap-4">
        <Legend className="text-xl font-semibold">Enter your address</Legend>
        <div className="flex flex-col gap-4">
          <Input
            errorMessage={formState.errors.addressNumber?.join(", ")}
            label="Street number"
            placeholder="enter your street number"
            name="addressNumber"
            type="number"
          />
          <Input
            errorMessage={formState.errors.street?.join(", ")}
            label="Street name"
            placeholder="enter your street name"
            name="street"
          />
          <Input
            errorMessage={formState.errors.zip?.join(", ")}
            label="Zip code"
            placeholder="enter your zip code"
            name="zip"
            type="number"
          />
          <Button
            className="flex mt-6 justify-around items-center rounded-md bg-gray-200 py-1.5 px-3 text-sm/6 font-semibold text-black data-[hover]:bg-gray-300 data-[active]:scale-95"
            type="submit"
          >
            Submit
          </Button>
        </div>
      </Fieldset>
    </form>
  );
}
