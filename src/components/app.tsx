import { ZakekeEnvironment, ZakekeProvider } from "zakeke-configurator-react";
import Viewer from "./viewer";

const zakekeEnvironment = new ZakekeEnvironment();

export default function App() {
  return (
    <ZakekeProvider environment={zakekeEnvironment}>
      <Viewer />
    </ZakekeProvider>
  );
}
