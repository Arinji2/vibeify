import Navbar from "../(navbar)/dashNavbar";
import WidthWrapper from "../(wrapper)/widthWrapper";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-palette-accent">
      <Navbar border icon={1} />
      <WidthWrapper>{children}</WidthWrapper>
    </div>
  );
}
