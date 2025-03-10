import { FunctionComponent } from "react";
import {
  ZakekeEnvironment,
  ZakekeViewer,
  ZakekeProvider,
  useZakeke,
} from "zakeke-configurator-react";
import Selector from "./selector";
import { ChevronDownIcon } from "./icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { MenuBar } from "./menu";
import Viewer from "./viewer";

const zakekeEnvironment = new ZakekeEnvironment();

export default function App() {
  return (
    <ZakekeProvider environment={zakekeEnvironment}>
      <Viewer />
    </ZakekeProvider>
  );
}
