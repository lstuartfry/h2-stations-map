"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

import EnableGPSButton from "@/components/buttons/EnableGPS";
import AddressForm from "./AddressForm";
import CloseSVG from "/public/close.svg";
import LoadingSVG from "/public/loading.svg";
import RightArrowSVG from "/public/right-arrow.svg";
import WarningSVG from "/public/warning.svg";
import { type GetAddressGeocodingResponseData } from "@/actions";

/**
 * A dialogue displayed to the user when the application is first loaded.
 */
export default function WelcomeDialog({
  loaded,
  geolocateError,
  onGeolocationEnable,
  onAddressSuccess,
}: {
  loaded: boolean;
  geolocateError?: boolean;
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
    if (showAddressForm)
      return (
        <div className="flex flex-col gap-6">
          <button
            className="flex w-fit -mt-6 -ml-6"
            onClick={() => setShowAddressForm(false)}
          >
            <RightArrowSVG className="rotate-180" height={20} width={20} />
          </button>
          <AddressForm onSuccess={onAddressSuccess} />
        </div>
      );
    if (geolocateError)
      return (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center font-semibold text-lg">
            <WarningSVG width={40} height={40} />
            It looks like there was an error encountered fetching your
            geolocation.
          </div>
          <div>
            Try enabling location services for your browser and clicking the
            retry button below:
          </div>
          <EnableGPSButton onClick={onEnable}>
            Retry enabling GPS
          </EnableGPSButton>
          <span className="text-sm italic mt-4">
            (or, simply close this dialog to begin browsing the map)
          </span>
        </div>
      );
    if (loadingGeolocation)
      return (
        <div className="flex justify-center items-center gap-3">
          <div>Fetching your location</div>
          <LoadingSVG className="animate-spin" />
        </div>
      );

    return (
      <div className="flex flex-col gap-6">
        <DialogTitle className="font-bold text-2xl">
          Welcome to H2 Stations Map!
        </DialogTitle>
        <div className="text-xl">
          This site displays all active retail hydrogen fuel cell stations in
          California.
        </div>
        <div className="flex flex-col gap-4 text-lg text-black/65">
          <div>
            H2 stations within <strong>5</strong> miles of your current location
            will be{" "}
            <span className="text-primary-purple font-semibold">
              highlighted
            </span>{" "}
            on the map. This distance can be adjusted.
          </div>
          <div className="text-base flex flex-col gap-2">
            Enable location services to get started, or enter your address
            directly.
            <span className="text-sm italic">
              (or, simply close this dialog to begin browsing the map)
            </span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-6">
            <div>
              <div className="flex flex-col gap-3 text-base">
                <EnableGPSButton onClick={onEnable}>Enable GPS</EnableGPSButton>
              </div>
            </div>
            <div className=" flex flex-col gap-3 text-base">
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
  }, [
    geolocateError,
    loadingGeolocation,
    onAddressSuccess,
    onEnable,
    showAddressForm,
  ]);

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-white/50">
        <DialogPanel className="flex flex-col w-[500px] border bg-white p-12 shadow-lg">
          <button
            className="flex w-fit self-end -mt-6 -mr-6"
            onClick={() => setIsOpen(false)}
          >
            <CloseSVG width={20} height={20} />
          </button>
          {content}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
