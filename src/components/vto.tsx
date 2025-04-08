import {
  useZakeke,
  useZakekeTryOn,
  ZakekeTryOnViewer,
} from "zakeke-configurator-react";
import { useEffect, useState } from "react";
import { isAndroid, isIOS } from "react-device-detect";

export default function VTOViewer() {
  const [isReady, setIsReady] = useState(false);
  const [deeparUrl, setDeepARUrl] = useState("");
  const [tryOnLoaded, setTryOnLoaded] = useState(false);
  const { hasVTryOnEnabled, getTryOnSettings, getDeepARDesktopIframeUrl } =
    useZakeke();
  const { tryOnVisibility, setTryOnVisibility } = useZakekeTryOn();
  const tryOnSettings = getTryOnSettings();

  useEffect(() => {
    if (hasVTryOnEnabled && tryOnSettings) {
      setTryOnVisibility(true);
      setTryOnLoaded(true);
    }
  }, [hasVTryOnEnabled, tryOnSettings]);

  console.group("****tryOnLoaded", tryOnLoaded);
  console.log("hasVTryOnEnabled", hasVTryOnEnabled);
  console.log("tryOnSettings", tryOnSettings);
  console.log("tryOnVisibility", tryOnVisibility);
  console.log("isAndroid", isAndroid);
  console.log("isIOS", isIOS);
  console.groupEnd();

  useEffect(() => {
    if (hasVTryOnEnabled && tryOnSettings && tryOnSettings?.type === 6) {
      getDeepARDesktopIframeUrl()
        .then((url) => {
          console.log("***** url", url);
          if (!(isAndroid || isIOS)) {
            setDeepARUrl(url);
          } else {
            console.log("***** redirecting to", url);
            window.location.href = url;
          }
          setIsReady(true);
        })
        .catch((error) => {
          console.error("***** error", error);
        });
    }
  }, [hasVTryOnEnabled, tryOnSettings]);

  return (
    <div className="h-screen w-screen">
      {/* Full screen container */}

      {tryOnLoaded && (
        <div className="relative h-full w-full">
          {/* Full screen viewer */}
          <div className="absolute inset-0">
            {hasVTryOnEnabled &&
            tryOnSettings &&
            tryOnSettings?.type === 6 &&
            !!deeparUrl &&
            deeparUrl?.startsWith("https://") ? (
              <div className="flex items-center justify-center h-full">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                  <h2 className="text-xl font-semibold mb-4">Scan QR Code</h2>
                  <div className="mb-4">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(
                        deeparUrl
                      )}`}
                      alt="QR Code"
                      className="w-64 h-64"
                    />
                  </div>
                  <p className="text-sm text-gray-600 text-center">
                    Scan this code with your mobile device to try on
                  </p>
                </div>
              </div>
            ) : (
              <ZakekeTryOnViewer
                onReady={() => {
                  console.log("***** onReady");
                }}
                onLoaded={() => {
                  console.log("***** onLoaded");
                  setIsReady(true);
                }}
                onPDUpdated={() => {
                  console.log("***** onPDUpdated");
                }}
                onClose={() => {
                  console.log("***** onClose");
                }}
                onWebcamError={() => {
                  console.log("***** onWebcamError");
                }}
              />
            )}
          </div>
        </div>
      )}

      {(!isReady || !tryOnLoaded) && (
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
