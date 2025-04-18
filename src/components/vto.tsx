import {
  useZakeke,
  useZakekeTryOn,
  ZakekeTryOnExposedMethods,
  ZakekeTryOnViewer,
} from "zakeke-configurator-react";
import { useEffect, useRef, useState } from "react";
import { isAndroid, isIOS } from "react-device-detect";
import { Link } from "react-router-dom";

export default function VTOViewer() {
  const viewerRef = useRef<ZakekeTryOnExposedMethods>(null);
  const [isReady, setIsReady] = useState(false);
  const [viewerReady, setViewerReady] = useState(false);
  const [viewerLoaded, setViewerLoaded] = useState(false);
  const [deeparUrl, setDeepARUrl] = useState("");
  const [tryOnLoaded, setTryOnLoaded] = useState(false);
  const {
    hasVTryOnEnabled,
    getTryOnSettings,
    getDeepARDesktopIframeUrl,
    isSceneLoading,
    isAssetsLoading,
  } = useZakeke();
  // const { tryOnVisibility, setTryOnVisibility } = useZakekeTryOn();
  const tryOnSettings = getTryOnSettings();

  useEffect(() => {
    console.log("***** tryOnSettings", tryOnSettings);
    if (
      hasVTryOnEnabled &&
      tryOnSettings &&
      !isSceneLoading &&
      !isAssetsLoading
    ) {
      // setTryOnVisibility(true);
      setTryOnLoaded(true);
      if (isAndroid || isIOS) {
        setIsReady(true);
        setTryOnLoaded(true);
        // setTryOnVisibility(true);
        //ZAKEKE TEAM MODIFICATION (COMMENTED OUT)
        viewerRef.current?.setVisible?.(true);
        viewerRef?.current?.changeMode?.(1);
      }
    }
  }, [hasVTryOnEnabled, tryOnSettings, isSceneLoading, isAssetsLoading]);

  console.group("****tryOnLoaded", tryOnLoaded);
  console.log("hasVTryOnEnabled", hasVTryOnEnabled);
  console.log("tryOnSettings", tryOnSettings);
  // console.log("tryOnVisibility", tryOnVisibility);
  console.log("isAndroid", isAndroid);
  console.log("isIOS", isIOS);
  console.groupEnd();

  useEffect(() => {
    const fetchDeepARUrl = async () => {
      try {
        if (
          hasVTryOnEnabled &&
          tryOnSettings &&
          tryOnSettings?.type === 6 &&
          !isAndroid &&
          !isIOS
        ) {
          const url = await getDeepARDesktopIframeUrl();
          if (url && url.startsWith("https://")) {
            console.log("***** url", url);
            setDeepARUrl(url);
            setIsReady(true);
          } else {
            console.error("Invalid DeepAR URL:", url);
          }
        }
      } catch (error) {
        console.error("***** error fetching DeepAR URL", error);
      }
    };

    fetchDeepARUrl();
  }, [hasVTryOnEnabled, tryOnSettings]);

  const handleWebcamError = () => {
    viewerRef.current?.setVisible?.(false);
    console.log(
      "Oops! It looks like your device doesn't have a camera. To use the Virtual Try-On, please ensure your device has a functioning camera."
    );
  };

  return (
    <div className="h-screen w-screen">
      {/* Full screen container */}

      {tryOnLoaded &&
        !isSceneLoading &&
        !isAssetsLoading &&
        hasVTryOnEnabled &&
        tryOnSettings &&
        tryOnSettings?.type === 6 && (
          <div className="relative h-full w-full">
            {/* Full screen viewer */}
            <div className="absolute inset-0">
              {!isAndroid && !isIOS ? (
                deeparUrl ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                      <h2 className="text-xl font-semibold mb-4">
                        Scan QR Code
                      </h2>
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
                      <p className="text-sm text-gray-600 text-center">
                        Or click the button below to try on
                      </p>
                      <Link
                        to={deeparUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-primary text-white px-4 py-2 rounded-md inline-block"
                      >
                        Try On
                      </Link>
                    </div>
                  </div>
                ) : null
              ) : (
                <ZakekeTryOnViewer
                  //ZAKEKE TEAM MODIFICATION (ADDED HERE)
                  ref={(ref) => {
                    viewerRef.current = ref;
                    if (isAndroid || isIOS) {
                      viewerRef.current?.setVisible?.(true);
                      viewerRef.current?.changeMode?.(1);
                    }
                  }}
                  switchable={false}
                  className="zakeke-try-on-viewer"
                  onReady={() => {
                    console.log("Viewer is ready");
                    setViewerReady(true);
                  }}
                  onLoaded={() => setViewerLoaded(true)}
                  onWebcamError={() => handleWebcamError()}
                  onPDUpdated={(value) => {
                    console.log("PD Updated", value);
                  }}
                  onClose={() => {
                    viewerRef.current?.setVisible?.(false);
                  }}
                >
                  <span>zakeke try on </span>
                </ZakekeTryOnViewer>
              )}
            </div>
          </div>
        )}

      {(!isReady || isSceneLoading || isAssetsLoading) && (
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
