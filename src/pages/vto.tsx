import {
  ZakekeEnvironment,
  ZakekeProvider,
  ZakekeTryOnViewer,
} from "zakeke-configurator-react";

const zakekeEnvironment = new ZakekeEnvironment();

export default function VTO() {
  return (
    <ZakekeProvider environment={zakekeEnvironment}>
      <ZakekeTryOnViewer
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
    </ZakekeProvider>
  );
}
