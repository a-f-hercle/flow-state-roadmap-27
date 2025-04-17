
import { ProductRoadmap } from "@/components/roadmap/product-roadmap";
import { Toaster } from "@/components/ui/sonner"; // Add Toaster import

export default function Roadmap() {
  return (
    <>
      <ProductRoadmap />
      <Toaster />
    </>
  );
}
