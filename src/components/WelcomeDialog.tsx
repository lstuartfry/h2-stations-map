"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

import AddressForm from "./AddressForm";
import LoadingSVG from "/public/loading.svg";
import RightArrowSVG from "/public/right-arrow.svg";
import { type GetAddressGeocodingResponseData } from "@/actions";

/**
 * A dialogue displayed to the user when the application is first loaded.
 */
export default function WelcomeDialog({
  loaded,
  onGeolocationEnable,
  onAddressSuccess,
}: {
  loaded: boolean;
  onGeolocationEnable: () => void;
  onAddressSuccess: (data: GetAddressGeocodingResponseData) => void;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [loadingGeolocation, setLoadingGeolocation] = useState<boolean>(false);
  const [showAddressForm, setShowAddressForm] = useState<boolean>(false);

  const onEnable = useCallback(() => {
    setLoadingGeolocation(true);
    onGeolocationEnable();
  }, [onGeolocationEnable]);

  // automatically close the dialog once the geolocation has been enabled
  useEffect(() => {
    if (isOpen && loaded) setIsOpen(false);
  }, [isOpen, loaded]);

  const content = useMemo(() => {
    if (showAddressForm) return <AddressForm onSuccess={onAddressSuccess} />;
    if (loadingGeolocation)
      return (
        <div className="flex justify-center items-center gap-3">
          <div>Fetching your location </div>
          <LoadingSVG className="animate-spin" />
        </div>
      );
    return (
      <div className="flex flex-col gap-6">
        <DialogTitle className="font-bold text-2xl">
          Welcome to H2 Stations Map!
        </DialogTitle>
        <div className="mt-4 flex flex-col gap-4 text-lg">
          <div>
            H2 stations within <strong>5</strong> miles of your current location
            will be{" "}
            <span className="text-primary-purple font-semibold">
              highlighted
            </span>{" "}
            on the map. This distance can be adjusted.
          </div>

          <div className="mt-4 grid grid-cols-2 gap-6">
            <div>
              <div className="flex flex-col gap-3 text-base">
                Enable location services to get started
                <Button
                  className="rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white data-[hover]:bg-gray-600 data-[active]:scale-95"
                  onClick={onEnable}
                >
                  Enable
                </Button>
              </div>
            </div>
            <div className=" flex flex-col gap-3 text-base">
              <div>Or, enter your address directly</div>
              <Button
                className="flex justify-around items-center rounded-md bg-gray-200 py-1.5 px-3 text-sm/6 font-semibold text-black data-[hover]:bg-gray-300 data-[active]:scale-95"
                onClick={() => setShowAddressForm(true)}
              >
                Enter address
                <RightArrowSVG height={20} width={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }, [loadingGeolocation, onAddressSuccess, onEnable, showAddressForm]);

  return (
    <Dialog open={isOpen} onClose={() => {}} className="relative z-50">
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-white/50">
        <DialogPanel className="w-[500px] border bg-white p-12 shadow-lg">
          {content}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
