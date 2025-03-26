import { useZakekeTryOn, ZakekeTryOnViewer } from "zakeke-configurator-react";
import { useState } from "react";
export default function VTOViewer() {
  const [isReady, setIsReady] = useState(false);
  const {} = useZakekeTryOn();

  return (
    <div className="h-sc">
      {/* Full screen container */}
      <div className="relative h-full w-full">
        {/* Full screen viewer */}
        <div className="absolute inset-0">
          <ZakekeTryOnViewer
            onLoaded={() => {
              console.log("onLoaded");
              setIsReady(true);
            }}
            onPDUpdated={() => {
              console.log("onPDUpdated");
            }}
            onClose={() => {
              console.log("onClose");
            }}
            onWebcamError={() => {
              console.log("onWebcamError");
            }}
          />
        </div>
      </div>
      {!isReady && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full animate-spin mb-4"></div>
            <div className="text-lg font-medium">Loading scene...</div>
          </div>
        </div>
      )}
    </div>
  );
}
