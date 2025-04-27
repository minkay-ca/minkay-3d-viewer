import {
  useZakeke,
  useZakekeTryOn,
  ZakekeTryOnExposedMethods,
  ZakekeTryOnViewer,
} from "zakeke-configurator-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  const [deeparMobileUrl, setDeepARMobileUrl] = useState<string | undefined>(
    undefined
  );
  const {
    hasVTryOnEnabled,
    getTryOnSettings,
    getDeepARDesktopIframeUrl,
    deepARsceneGLBUrl,
    getMobileArUrl,
    isSceneLoading,
    isAssetsLoading,
  } = useZakeke();

  // State for progress tracking
  const [loadingMessage, setLoadingMessage] = useState("Initializing...");
  const [isFetchingDeepAR, setIsFetchingDeepAR] = useState(false);
  const [isViewerLoaded, setIsViewerLoaded] = useState(false);

  const tryOnSettings = getTryOnSettings();
  const isMobile = isAndroid || isIOS;
  const needsDeepAR = tryOnSettings?.type === 6 && !isAndroid; // DeepAR needed for iOS & Desktop with type 6

  // Effect to manage loading messages and trigger DeepAR fetch
  useEffect(() => {
    let currentMessage = "Initializing...";
    let shouldFetchDeepAR = false;

    if (!hasVTryOnEnabled && !isSceneLoading && !isAssetsLoading) {
      // Determined VTO is not enabled, maybe show message elsewhere or just stop loading
      currentMessage = "Virtual Try On not available.";
    } else if (hasVTryOnEnabled && !tryOnSettings) {
      currentMessage = "Loading configuration..."; // Waiting for settings
    } else if (hasVTryOnEnabled && tryOnSettings) {
      // VTO enabled, settings available
      if (needsDeepAR && !deeparUrl && !status.isError && !isFetchingDeepAR) {
        // Need to fetch DeepAR URL and not already fetching/errored
        shouldFetchDeepAR = true;
        currentMessage = "Fetching configuration...";
      } else if (isFetchingDeepAR) {
        currentMessage = "Fetching configuration...";
      } else if (status.isError && status.errorType === "config") {
        currentMessage = "Error loading configuration.";
      } else if (isSceneLoading) {
        currentMessage = "Loading scene...";
      } else if (isAssetsLoading) {
        currentMessage = "Loading assets...";
      } else if (!isReady && (isMobile || deeparUrl)) {
        // For mobile (non-iOS DeepAR) or desktop/iOS after URL is fetched
        currentMessage = "Preparing viewer...";
      } else if (isReady && !isViewerLoaded && isMobile && !isIOS) {
        // Android/Mobile VTO
        currentMessage = "Initializing viewer...";
      } else if (isReady && isViewerLoaded) {
        currentMessage = "Done!"; // Final state before hiding overlay
      } else {
        currentMessage = "Loading..."; // Fallback
      }
    }

    setLoadingMessage(currentMessage);

    // Trigger fetch outside state update
    if (shouldFetchDeepAR) {
      const fetchDeepARUrl = async () => {
        setIsFetchingDeepAR(true);
        try {
          const url = await getDeepARDesktopIframeUrl();
          if (url && url.startsWith("https://")) {
            console.log("***** url", url);
            setDeepARUrl(url);
          } else {
            console.error("Invalid DeepAR URL:", url);
            setStatus({
              errorType: "config",
              isError: true,
              message: "Failed to load configuration.",
            });
          }
        } catch (error) {
          console.error("***** error fetching DeepAR URL", error);
          setStatus({
            errorType: "config",
            isError: true,
            message: "Failed to load configuration.",
          });
        } finally {
          setIsFetchingDeepAR(false);
        }
      };
      fetchDeepARUrl();
    }

    if (isMobile) {
      getMobileArUrl().then((url) => {
        if (url && typeof url === "string") {
          setDeepARMobileUrl(url);
        }
      });
    }
  }, [
    hasVTryOnEnabled,
    tryOnSettings,
    needsDeepAR,
    deeparUrl,
    isFetchingDeepAR,
    isSceneLoading,
    isAssetsLoading,
    isReady,
    isViewerLoaded,
    status.isError,
    status.errorType,
    isMobile,
    isIOS,
    getDeepARDesktopIframeUrl, // Added dependency
  ]);

  // Calculate overall loading state
  const isLoading = useMemo(() => {
    if (!hasVTryOnEnabled && !isSceneLoading && !isAssetsLoading) {
      if (hasVTryOnEnabled === false) return false; // Explicitly disabled
      return true; // Still waiting for initial state/settings
    }
    if (!tryOnSettings && hasVTryOnEnabled) return true; // Waiting for settings

    if (
      status.isError &&
      (status.errorType === "config" || status.errorType === "webcam")
    )
      return false; // Error stops loading overlay

    if (needsDeepAR) {
      // iOS or Desktop Type 6 flow
      if (isFetchingDeepAR) return true; // Fetching URL
      if (!deeparUrl) return true; // Waiting for URL (unless errored above)
      // Once URL is fetched, iOS/Desktop shows QR/redirects, loading is done for overlay purpose
      if (isIOS || !isMobile) return false;
    }

    // Must be Android or a non-DeepAR flow
    if (isSceneLoading || isAssetsLoading) return true;
    if (!isReady) return true; // ZakekeTryOnViewer component hasn't reported ready
    if (!isViewerLoaded) return true; // ZakekeTryOnViewer component hasn't reported loaded

    return false; // All loading conditions passed for the current flow
  }, [
    hasVTryOnEnabled,
    tryOnSettings,
    isSceneLoading,
    isAssetsLoading,
    status.isError,
    status.errorType,
    isIOS,
    isMobile,
    needsDeepAR,
    isFetchingDeepAR,
    deeparUrl,
    isReady,
    isViewerLoaded,
  ]);

  const handleWebcamError = () => {
    viewerRef.current?.setVisible?.(false);
    setStatus({
      errorType: "webcam",
      isError: true,
      message:
        "Oops! It looks like your device doesn't have a camera. To use the Virtual Try-On, please ensure your device has a functioning camera.",
    });
  };

  // Add handler for onLoaded
  const handleLoaded = () => {
    console.log("Viewer is loaded");
    setIsViewerLoaded(true);
  };

  // Update onReady handler
  const handleReady = () => {
    console.log("Viewer is ready");
    setIsReady(true);
    // Message update is handled by the main useEffect
  };

  const renderContent = useCallback(() => {
    // Initial checks: Still loading if these aren't met, handled by `isLoading` overlay now
    if (!hasVTryOnEnabled || !tryOnSettings) {
      // Show nothing here, overlay handles loading/unavailable message
      return null;
    }

    // Config Error
    if (status.isError && status.errorType === "config") {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">{status.message}</h2>
          </div>
        </div>
      );
    }

    // Platform specific rendering (iOS / Desktop needing DeepAR)
    if (needsDeepAR) {
      // While fetching or if URL is invalid (isLoading handles fetching state)
      if (!deeparUrl || !deeparUrl.startsWith("https://")) {
        // If not fetching and no valid URL, it's likely an error state (handled above) or still loading
        // Let the isLoading overlay manage display until URL is ready or error shown
        return null;
      }

      if (isIOS) {
        window.open(deeparUrl, "_blank");
        return (
          <div className="flex items-center justify-center h-full">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">
                Opening VTO experience...
              </h2>
              <p className="text-sm">
                If nothing happens, please check your pop-up blocker.
              </p>
            </div>
          </div>
        );
      }

      if (!isMobile) {
        // Desktop
        return (
          <div className="flex items-center justify-center h-full">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <h2 className="text-xl font-semibold mb-4">Scan QR Code</h2>
              <p className="mb-4">
                Please scan the QR code with your mobile device to start the
                Virtual Try-On.
              </p>
              {/* TODO: Render actual QR code using deeparUrl */}
              <div className="w-40 h-40 bg-gray-200 mx-auto flex items-center justify-center">
                <span className="text-gray-500">QR Placeholder</span>
              </div>
            </div>
          </div>
        );
      }
    }

    // Webcam Error
    if (status.isError && status.errorType === "webcam") {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">{status.message}</h2>
          </div>
        </div>
      );
    }

    // Android / Mobile VTO (or non-DeepAR flows)
    // Render ZakekeTryOnViewer - loading state handled by overlay until viewer is loaded
    if (isMobile && !isIOS) {
      // Assuming this path is primarily Android
      return (
        <ZakekeTryOnViewer
          ref={(ref) => {
            viewerRef.current = ref;
            if (ref) {
              // Ensure ref is assigned before calling methods
              viewerRef.current?.setVisible?.(true);
              viewerRef.current?.changeMode?.(1);
            }
          }}
          switchable={false}
          className="zakeke-try-on-viewer"
          onReady={handleReady} // Use handler
          onLoaded={handleLoaded} // Use handler
          onWebcamError={() => handleWebcamError()}
          onPDUpdated={(value) => {
            console.log("PD Updated", value);
          }}
          onClose={() => {
            viewerRef.current?.setVisible?.(false);
          }}
        >
          {/* Keep internal loading indicator for viewer itself if needed */}
          <div className="flex items-center justify-center h-full">
            <div className="bg-white p-8 rounded-lg shadow-lg flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full animate-spin mr-4"></div>
              <div className="text-sm font-medium">Loading Viewer...</div>
            </div>
          </div>
        </ZakekeTryOnViewer>
      );
    }

    // Fallback or handle other cases if necessary
    return null;
  }, [
    status,
    deeparUrl,
    hasVTryOnEnabled,
    tryOnSettings,
    viewerRef, // Keep ref dependency
    isMobile,
    isIOS,
    needsDeepAR,
    // Removed states used only for loading overlay: isReady, isSceneLoading, isAssetsLoading etc.
    // Keep setIsReady if it were used directly in render logic, but it's not now.
  ]);

  return (
    <div className="h-screen w-screen relative">
      {" "}
      {/* Added relative positioning */}
      {renderContent()}
      {/* Updated Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center text-center w-64">
            {" "}
            {/* Adjusted width */}
            <div className="w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full animate-spin mb-4"></div>
            <div className="text-lg font-medium">{loadingMessage}</div>
            {/* Optional: Add a simple progress bar */}
            {/* <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-4">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${loadingPercentage}%` }}></div>
             </div> */}
          </div>
        </div>
      )}
      {/* Debug Info Panel - Added */}
      <div className="fixed bottom-2 left-2 bg-gray-800 text-white text-xs p-2 rounded shadow-lg z-30 max-w-xs break-words">
        <p>
          <strong>OS:</strong>{" "}
          {isIOS ? "iOS" : isAndroid ? "Android" : "Desktop/Other"}
        </p>
        <p>
          <strong>TryOn Type:</strong> {tryOnSettings?.type ?? "N/A"}
        </p>
        <p>
          <strong>DeepAR URL:</strong> {deeparUrl || "None"}
        </p>
        <p>
          <strong>Needs DeepAR:</strong> {needsDeepAR ? "Yes" : "No"}
        </p>
        <p>
          <strong>Is Loading:</strong> {isLoading ? "Yes" : "No"}
        </p>
        <p>
          <strong>Loading Msg:</strong> {loadingMessage}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          {status.isError ? `Error (${status.errorType})` : "OK"}
        </p>
        <p>
          <strong>DeepAR GLB URL:</strong> {deepARsceneGLBUrl || "None"}
        </p>
        <p>
          <strong>DeepAR URL:</strong> {deeparMobileUrl || "None"}
        </p>
      </div>
    </div>
  );
}
