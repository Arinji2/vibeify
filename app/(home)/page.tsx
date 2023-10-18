import WidthWrapper from "../(wrapper)/widthWrapper";
import Compare from "./compare";
import Convert from "./convert";
import { Footer } from "./footer";

import { Hero } from "./hero";
import Showcase from "./showcase";

export default function Home() {
  return (
    <section className="flex h-full w-full flex-col items-center justify-start gap-10 bg-palette-background">
      <WidthWrapper>
        <Hero />
      </WidthWrapper>
      <Showcase />
      <Compare />
      <Convert />
      <Footer />
    </section>
  );
}
