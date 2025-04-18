
import { ProductRoadmap } from "@/components/roadmap/product-roadmap";
import { Toaster } from "sonner"; // Use sonner toaster for consistent UI

export default function Roadmap() {
  return (
    <>
      <ProductRoadmap />
      <Toaster />
    </>
  );
}
