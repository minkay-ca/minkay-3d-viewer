import { useZakeke, ZakekeViewer } from "zakeke-configurator-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "./ui/button";
import Selector from "./selector";
import { MenuBar } from "./menu";
import { useEffect, useState } from "react";

export default function Viewer() {
  // const { isViewerReady, isSceneLoading } = useZakeke();
  // const [isReady, setIsReady] = useState(false);

  // useEffect(() => {
  //   if (!isViewerReady) {
  //     return;
  //   }

  //   const timeout = setTimeout(() => {
  //     setIsReady(true);
  //   }, 5000);

  //   return () => clearTimeout(timeout);
  // }, [isViewerReady]);
  return (
    <>
      {/* Full screen container */}
      <div className="relative h-full w-full">
        {/* Full screen viewer */}
        <div className="absolute inset-0">
          <ZakekeViewer className="bg-white" bgColor="#ffffff" />
        </div>

        {/* Bottom controls */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10">
          {/* Menu Bar */}
          <div className="bg-white/80 p-3 rounded-lg shadow-lg">
            <MenuBar />
          </div>
        </div>

        {/* Customize dropdown positioned at bottom-right */}
        <div className="fixed bottom-6 right-6 z-10">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="bg-white p-2 rounded-md shadow-md flex items-center space-x-2"
              >
                <span>Customize</span>
                <ChevronDownIcon className={`h-5 w-5`} />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80 max-h-[70vh] overflow-auto"
              side="top"
              align="end"
            >
              <Selector />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      {/* {!isReady && <LoadingOverlay />} */}
    </>
  );
}

const LoadingOverlay = () => {
  return (
    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-20">
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full animate-spin mb-4"></div>
        <div className="text-lg font-medium">Loading scene...</div>
      </div>
    </div>
  );
};
