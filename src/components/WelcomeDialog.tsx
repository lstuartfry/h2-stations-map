import { useCallback, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

import LoadingSVG from "/public/loading.svg";

/**
 * A dialogue displayed to the user when the application is first loaded.
 */
const WelcomeDialog = ({
  loaded,
  onGeolocationEnable,
}: {
  loaded: boolean;
  onGeolocationEnable: () => void;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [loadingGeolocation, setLoadingGeolocation] = useState<boolean>(false);

  const onEnable = useCallback(() => {
    setLoadingGeolocation(true);
    onGeolocationEnable();
  }, [onGeolocationEnable]);

  // automatically close the dialog once the geolocation has been enabled
  useEffect(() => {
    if (isOpen && loaded) setIsOpen(false);
  }, [isOpen, loaded]);

  const content = useMemo(() => {
    if (loadingGeolocation)
      return (
        <div className="flex justify-center items-center gap-3">
          <div>Fetching your location </div>
          <LoadingSVG className="animate-spin" />
        </div>
      );
    return (
      <div className="flex flex-col gap-6">
        <div>
          <DialogTitle className="font-bold">
            Welcome to H2 Stations Map!
          </DialogTitle>
          <div className="mt-4 flex flex-col gap-3">
            <div>
              H2 stations within <strong>5</strong> miles of your current
              location will be highlighted on the map. This distance can be
              adjusted.
            </div>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          Enable location services to get started:
          <Button
            className={clsx(
              "items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white",
              !loaded ? "inline-flex" : "hidden"
            )}
            onClick={onEnable}
          >
            Enable
          </Button>
        </div>
      </div>
    );
  }, [loaded, loadingGeolocation, onEnable]);

  return (
    <Dialog open={isOpen} onClose={() => {}} className="relative z-50">
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-white/50">
        <DialogPanel className="w-[500px] border bg-white p-12 shadow-lg">
          {content}
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default WelcomeDialog;
