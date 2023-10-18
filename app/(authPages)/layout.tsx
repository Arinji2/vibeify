import Navbar from "../(navbar)/navbar";
import WidthWrapper from "../(wrapper)/widthWrapper";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-palette-background">
      <Navbar border />
      <WidthWrapper>{children}</WidthWrapper>
    </div>
  );
}
