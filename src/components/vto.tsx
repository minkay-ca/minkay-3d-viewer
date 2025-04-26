import {
  useZakeke,
  useZakekeTryOn,
  ZakekeTryOnExposedMethods,
  ZakekeTryOnViewer,
} from "zakeke-configurator-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { isAndroid, isIOS } from "react-device-detect";

export default function VTOViewer() {
  const viewerRef = useRef<ZakekeTryOnExposedMethods>(null);
  const [isReady, setIsReady] = useState(false);
  const [status, setStatus] = useState({
    errorType: "",
    isError: false,
    message: "",
  });
  const [deeparUrl, setDeepARUrl] = useState("");
  const {
    hasVTryOnEnabled,
    getTryOnSettings,
    getDeepARDesktopIframeUrl,
    isSceneLoading,
    isAssetsLoading,
  } = useZakeke();
  const tryOnSettings = getTryOnSettings();
  const isMobile = isAndroid || isIOS;

  useEffect(() => {
    const fetchDeepARUrl = async () => {
      try {
        if (
          hasVTryOnEnabled &&
          tryOnSettings &&
          tryOnSettings?.type === 6 &&
          !isAndroid
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
    setStatus({
      errorType: "webcam",
      isError: true,
      message:
        "Oops! It looks like your device doesn't have a camera. To use the Virtual Try-On, please ensure your device has a functioning camera.",
    });
  };

  const renderContent = useCallback(() => {
    if (
      isSceneLoading ||
      isAssetsLoading ||
      !hasVTryOnEnabled ||
      !tryOnSettings
    ) {
      return null;
    }
    if (isIOS && deeparUrl?.startsWith("https://")) {
      return window.open(deeparUrl, "__BLANK");
    }

    if (!isMobile) {
      if (!deeparUrl) return null;

      return (
        <div className="flex items-center justify-center h-full">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Scan QR Code</h2>
          </div>
        </div>
      );
    }

    if (status.isError && status.errorType === "webcam") {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">{status.message}</h2>
          </div>
        </div>
      );
    }

    return (
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
          setIsReady(true);
        }}
        onLoaded={() => console.log("Viewer is loaded")}
        onWebcamError={() => handleWebcamError()}
        onPDUpdated={(value) => {
          console.log("PD Updated", value);
        }}
        onClose={() => {
          viewerRef.current?.setVisible?.(false);
        }}
      >
        <div className="flex items-center justify-center h-full">
          <div className="bg-white p-8 rounded-lg shadow-lg flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full animate-spin mb-4"></div>
            <div className="text-sm font-medium">Loading VTO...</div>
          </div>
        </div>
      </ZakekeTryOnViewer>
    );
  }, [
    status,
    deeparUrl,
    isSceneLoading,
    isAssetsLoading,
    hasVTryOnEnabled,
    tryOnSettings,
    viewerRef,
    setIsReady,
  ]);

  return (
    <div className="h-screen w-screen">
      {renderContent()}

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
