import { FunctionComponent } from "react";
import {
  ZakekeEnvironment,
  ZakekeViewer,
  ZakekeProvider,
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

const zakekeEnvironment = new ZakekeEnvironment();

const App: FunctionComponent<{}> = () => {
  return (
    <ZakekeProvider environment={zakekeEnvironment}>
      {/* Full screen container */}
      <div className="relative h-full w-full">
        {/* Full screen viewer */}
        <div className="absolute inset-0">
          <ZakekeViewer />
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
    </ZakekeProvider>
  );
};

export default App;
