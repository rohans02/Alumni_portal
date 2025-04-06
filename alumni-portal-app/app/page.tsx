import HomePage from "@/components/home-pg/landingPage";
import EventsSection from "@/components/home-pg/event-section";
import AlumniCarousel from "@/components/home-pg/alumni-stories";
import GallerySection from "@/components/home-pg/gallery-section";
import Footer from "@/components/home-pg/footer-section";
export default function Page() {
  return (
    <>
      <HomePage />
      <EventsSection />
      <AlumniCarousel />
      <GallerySection />
      <Footer />
    </>
  );
}
