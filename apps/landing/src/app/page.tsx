import { About } from "@/components/about";
import { Audiences } from "@/components/audiences";
import { Faq } from "@/components/faq";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { Join } from "@/components/join";
import { JoinProvider } from "@/components/join-context";
import { LiveMap } from "@/components/live-map";
import { Privacy } from "@/components/privacy";
import { RoutesCovered } from "@/components/routes-covered";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <JoinProvider>
      <SiteHeader />
      <main>
        <Hero />
        <HowItWorks />
        <LiveMap />
        <Audiences />
        <RoutesCovered />
        <Privacy />
        <Faq />
        <About />
        <Join />
      </main>
      <SiteFooter />
    </JoinProvider>
  );
}
