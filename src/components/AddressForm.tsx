"use client";

import { useFormState } from "react-dom";
import { Button } from "@headlessui/react";

import {
  getAddressGeocode,
  type GetAddressGeocodingResponseData,
} from "@/actions";
import { useEffect } from "react";

export default function AddressForm({
  onSuccess,
}: {
  onSuccess: (data: GetAddressGeocodingResponseData) => void;
}) {
  const [formState, action] = useFormState(getAddressGeocode, {
    message: "",
  });

  useEffect(() => {
    // invoke the success callback once data is successfully returned from the server
    if (formState.data) {
      onSuccess(formState.data);
    }
  }, [formState.data, onSuccess]);

  return (
    <form action={action}>
      <div className="text-lg font-semibold">Enter your address</div>
      <div className="flex flex-col gap-4">
        <div className="mt-6 flex flex-col gap-2">
          <label className="text-black/60" htmlFor="addressNumber">
            Street Number
          </label>
          <input
            name="addressNumber"
            className="border rounded p-2 w-full"
            id="addressNumber"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-black/60" htmlFor="street">
            Street
          </label>
          <input
            name="street"
            className="border rounded p-2 w-full"
            id="addressstreetNumber"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-black/60" htmlFor="zip">
            Zip code
          </label>
          <input name="zip" className="border rounded p-2 w-full" id="zip" />
        </div>
        {formState.message && (
          <div className="my-2 p-2 bg-red-200 border rounded border-red-400">
            {formState.message}
          </div>
        )}
        <Button
          className="flex mt-6 justify-around items-center rounded-md bg-gray-200 py-1.5 px-3 text-sm/6 font-semibold text-black data-[hover]:bg-gray-300 data-[active]:scale-95"
          type="submit"
        >
          Submit
        </Button>
      </div>
    </form>
  );
}
