import React from "react";

import WhyFreshFits from "../components/landingpage/WhyFreshFits.jsx";
import BrandLogos from "../components/landingpage/BrandLogos.jsx";
import Herosection from "../components/landingpage/Herosection.jsx";
import HowItWorks from "../components/landingpage/HowItWorks.jsx";
import FloatingButton from "../components/landingpage/FloatingButton.jsx";
import Footer from "../components/Footer.jsx";

const Landingpage = () => {
  return (
    <div>
      <Herosection />
      <WhyFreshFits />
      <BrandLogos />
      <HowItWorks />
      <FloatingButton />
      <Footer />
    </div>
  );
};

export default Landingpage;
