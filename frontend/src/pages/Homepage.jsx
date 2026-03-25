import React from "react";
import Herosection from "../components/Home/HeroSection";
import CategoriesSection from "../components/Home/CategoriesSection";
import BrandsSection from "../components/Home/BrandsSection";
import CategoryScroll from "../components/Home/CategoryScroll";
import FullCollectionImage from "../components/Home/FullCollectionImage";
import NewsletterSection from "../components/Home/NewsletterSection";
import Footer from "../components/Footer";

const Homepage = () => {
  return (
    <div>
      <Herosection />
      <CategoriesSection />

      <CategoryScroll />
      <FullCollectionImage />

      <BrandsSection />

      <NewsletterSection />
    </div>
  );
};

export default Homepage;
