import { ZakekeEnvironment, ZakekeProvider } from "zakeke-configurator-react";

const zakekeEnvironment = new ZakekeEnvironment();

export default function ZakekeApp({ children }: { children: React.ReactNode }) {
  return (
    <ZakekeProvider environment={zakekeEnvironment}>{children}</ZakekeProvider>
  );
}
