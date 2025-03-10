import { useState } from "react";
import { FunctionComponent } from "react";
import { useZakeke } from "zakeke-configurator-react";
import {
  ZoomInIcon,
  ZoomOutIcon,
  VirtualTryOnIcon,
  ExportPdfIcon,
  ShareIcon,
  ARIcon,
} from "./icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Create a MenuBar component for the bottom-center menu actions
export const MenuBar: FunctionComponent = () => {
  const {
    zoomIn,
    zoomOut,
    getPDF,
    getTryOnUrl,
    getShareCompositionUrl,
    getMobileArUrl,
    getQrCodeArUrl,
    hasVTryOnEnabled,
    isSceneArEnabled,
  } = useZakeke();

  // State for PDF download modal
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  // Add state for Virtual Try On modal and URL
  const [showTryOnModal, setShowTryOnModal] = useState(false);
  const [tryOnUrl, setTryOnUrl] = useState("");

  // Loading states
  const [isVirtualTryOnLoading, setIsVirtualTryOnLoading] = useState(false);
  const [isShareLoading, setIsShareLoading] = useState(false);
  const [isARLoading, setIsARLoading] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);

  const handleZoomIn = () => {
    zoomIn ? zoomIn() : console.log("Zoom in");
  };

  const handleZoomOut = () => {
    zoomOut ? zoomOut() : console.log("Zoom out");
  };

  const handleVirtualTryOn = () => {
    if (getTryOnUrl) {
      setIsVirtualTryOnLoading(true);
      getTryOnUrl()
        .then((url) => {
          if (url) {
            setTryOnUrl(url);
            setShowTryOnModal(true);
          } else {
            console.log("Virtual try on URL not available");
          }
        })
        .catch((err) => console.error("Failed to get try-on URL:", err))
        .finally(() => setIsVirtualTryOnLoading(false));
    } else {
      console.log("Virtual try on feature not available");
    }
  };

  const handleExportPdf = () => {
    if (getPDF) {
      setIsPdfLoading(true);
      getPDF()
        .then((url) => {
          if (url) {
            setPdfUrl(url);
            setShowPdfModal(true);
          } else {
            console.log("PDF URL not available");
          }
        })
        .catch((err) => console.error("Failed to get PDF:", err))
        .finally(() => setIsPdfLoading(false));
    } else {
      console.log("PDF export feature not available");
    }
  };

  const handleShare = () => {
    if (getShareCompositionUrl) {
      setIsShareLoading(true);
      getShareCompositionUrl()
        .then((url) => {
          console.log("**** url", url);
          if (url) {
            // If Web Share API is available
            if (navigator.share) {
              navigator
                .share({
                  title: "My Custom Design",
                  text: "Check out my custom design!",
                  url: url,
                })
                .catch((err) => console.error("Failed to share:", err));
            } else {
              // Fallback for browsers that don't support Web Share API
              if (navigator.clipboard) {
                navigator.clipboard.writeText(url);
                alert("Link copied to clipboard!");
              } else {
                prompt("Copy this link to share your design:", url);
              }
            }
          } else {
            console.log("Share URL not available");
          }
        })
        .catch((err) => console.error("Failed to get share URL:", err))
        .finally(() => setIsShareLoading(false));
    } else {
      console.log("Share feature not available");
    }
  };

  const handleAR = () => {
    if (getMobileArUrl) {
      setIsARLoading(true);
      getMobileArUrl()
        .then((url) => {
          if (url) {
            console.log("**** url", url);
          } else {
            console.log("AR URL not available");
          }
        })
        .catch((err) => console.error("Failed to get AR URL:", err))
        .finally(() => setIsARLoading(false));
    } else {
      console.log("AR feature not available");
    }
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <svg
      className="animate-spin h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  return (
    <>
      {/* Bottom controls */}
      <div
        className="
          fixed bottom-6 left-4 md:left-1/2 md:-translate-x-1/2 
          flex md:flex-row flex-col
          md:space-x-4 md:space-y-0 space-y-3
          items-center md:justify-center justify-start
          bg-white/80 md:bg-white/80 
          p-3 rounded-lg shadow-md
          z-10
        "
      >
        <button
          className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
          onClick={handleZoomIn}
          title="Zoom In"
        >
          <ZoomInIcon />
        </button>
        <button
          className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
          onClick={handleZoomOut}
          title="Zoom Out"
        >
          <ZoomOutIcon />
        </button>
        {hasVTryOnEnabled && (
          <button
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
            onClick={handleVirtualTryOn}
            disabled={isVirtualTryOnLoading}
            title="Virtual Try On"
          >
            {isVirtualTryOnLoading ? <LoadingSpinner /> : <VirtualTryOnIcon />}
          </button>
        )}
        <button
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
          onClick={handleExportPdf}
          disabled={isPdfLoading}
          title="Export PDF"
        >
          {isPdfLoading ? <LoadingSpinner /> : <ExportPdfIcon />}
        </button>
        {/* <button
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
          onClick={handleShare}
          disabled={isShareLoading}
          title="Share"
        >
          {isShareLoading ? <LoadingSpinner /> : <ShareIcon />}
        </button>
        <button
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
          onClick={handleAR}
          disabled={isARLoading}
          title="View in AR"
        >
          {isARLoading ? <LoadingSpinner /> : <ARIcon />}
        </button> */}
      </div>

      {/* PDF Download Modal using ShadCN Dialog */}
      <Dialog open={showPdfModal} onOpenChange={setShowPdfModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Download PDF</DialogTitle>
            <DialogDescription>
              Your PDF has been generated. Click the button below to download
              it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2 sm:justify-end">
            <button
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => setShowPdfModal(false)}
            >
              Cancel
            </button>
            <a
              href={pdfUrl}
              target="_blank"
              download="custom-design.pdf"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => setShowPdfModal(false)}
            >
              Download
            </a>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Virtual Try On QR Code Modal */}
      <Dialog open={showTryOnModal} onOpenChange={setShowTryOnModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Virtual Try On</DialogTitle>
            <DialogDescription>
              Scan this QR code with your mobile device to try on this product
              virtually.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            {tryOnUrl && (
              <div className="bg-white p-4 rounded-md">
                {/* You'll need to install react-qr-code: npm install react-qr-code */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
                    tryOnUrl
                  )}`}
                  alt="QR Code for Virtual Try On"
                  width={300}
                  height={300}
                />
              </div>
            )}
          </div>
          <DialogFooter className="flex justify-end space-x-2 sm:justify-end">
            <button
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => setShowTryOnModal(false)}
            >
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
