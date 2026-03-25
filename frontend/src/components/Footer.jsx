import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  MapPin,
  Phone,
  Clock,
  ArrowRight,
  Heart,
  Shield,
  Truck,
  CreditCard,
} from "lucide-react";
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-foreground text-primary-foreground">
      {/* Top section with trust badges */}
      <div className="border-b border-primary-foreground/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-center justify-center gap-4 p-4">
              <Truck className="w-8 h-8 text-primary-foreground/60" />
              <div>
                <h4 className="font-semibold text-primary-foreground/90">
                  Free Shipping
                </h4>
                <p className="text-sm text-primary-foreground/60">
                  On orders over R1000
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 p-4">
              <Shield className="w-8 h-8 text-primary-foreground/60" />
              <div>
                <h4 className="font-semibold text-primary-foreground/90">
                  Secure Payment
                </h4>
                <p className="text-sm text-primary-foreground/60">
                  100% secure transactions
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 p-4">
              <CreditCard className="w-8 h-8 text-primary-foreground/60" />
              <div>
                <h4 className="font-semibold text-primary-foreground/90">
                  Easy Returns
                </h4>
                <p className="text-sm text-primary-foreground/60">
                  30-day return policy
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 p-4">
              <Heart className="w-8 h-8 text-primary-foreground/60" />
              <div>
                <h4 className="font-semibold text-primary-foreground/90">
                  Mzansi Made
                </h4>
                <p className="text-sm text-primary-foreground/60">
                  Supporting local brands
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Main footer content */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            {/* Brand section */}
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold mb-4 font-poppins">
                FRESH<span className="text-primary-foreground/60">FITS</span>
              </h3>
              <p className="text-primary-foreground/60 mb-6 max-w-md">
                Elevating street culture through curated collections that
                celebrate Mzansi's unique style and creativity. Where fashion
                meets identity.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://facebook.com"
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://instagram.com"
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://twitter.com"
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="mailto:contact@freshfits.co.za"
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-primary-foreground/90">
                Quick Links
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/"
                    className="text-primary-foreground/60 hover:text-primary-foreground transition-colors flex items-center gap-2"
                  >
                    <ArrowRight className="w-3 h-3" />
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products"
                    className="text-primary-foreground/60 hover:text-primary-foreground transition-colors flex items-center gap-2"
                  >
                    <ArrowRight className="w-3 h-3" />
                    Shop All
                  </Link>
                </li>
                <li>
                  <Link
                    to="/new-arrivals"
                    className="text-primary-foreground/60 hover:text-primary-foreground transition-colors flex items-center gap-2"
                  >
                    <ArrowRight className="w-3 h-3" />
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link
                    to="/brands"
                    className="text-primary-foreground/60 hover:text-primary-foreground transition-colors flex items-center gap-2"
                  >
                    <ArrowRight className="w-3 h-3" />
                    Our Brands
                  </Link>
                </li>
                <li>
                  <Link
                    to="/sale"
                    className="text-primary-foreground/60 hover:text-primary-foreground transition-colors flex items-center gap-2"
                  >
                    <ArrowRight className="w-3 h-3" />
                    Sale
                  </Link>
                </li>
              </ul>
            </div>
            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-primary-foreground/90">
                Support
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/contact"
                    className="text-primary-foreground/60 hover:text-primary-foreground transition-colors flex items-center gap-2"
                  >
                    <ArrowRight className="w-3 h-3" />
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/faq"
                    className="text-primary-foreground/60 hover:text-primary-foreground transition-colors flex items-center gap-2"
                  >
                    <ArrowRight className="w-3 h-3" />
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shipping"
                    className="text-primary-foreground/60 hover:text-primary-foreground transition-colors flex items-center gap-2"
                  >
                    <ArrowRight className="w-3 h-3" />
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link
                    to="/returns"
                    className="text-primary-foreground/60 hover:text-primary-foreground transition-colors flex items-center gap-2"
                  >
                    <ArrowRight className="w-3 h-3" />
                    Returns & Exchanges
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="text-primary-foreground/60 hover:text-primary-foreground transition-colors flex items-center gap-2"
                  >
                    <ArrowRight className="w-3 h-3" />
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-primary-foreground/90">
                Contact
              </h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary-foreground/60 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-primary-foreground/80 text-sm font-medium">
                      123 Fashion Street
                    </p>
                    <p className="text-primary-foreground/60 text-sm">
                      Johannesburg, South Africa
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary-foreground/60" />
                  <a
                    href="tel:+27123456789"
                    className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                  >
                    +27 12 345 6789
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary-foreground/60" />
                  <p className="text-primary-foreground/60 text-sm">
                    Mon-Sat: 9AM - 6PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom footer */}
      <div className="border-t border-primary-foreground/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-primary-foreground/60 text-sm">
                &copy; {currentYear} FreshFits. All rights reserved.
              </p>
              <p className="text-primary-foreground/40 text-xs mt-1">
                Celebrating Mzansi's street culture and creativity.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <Link
                to="/terms"
                className="text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/privacy"
                className="text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/cookies"
                className="text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
            <div className="text-primary-foreground/50 text-sm">
              <span className="text-primary-foreground/60">🇿🇦</span> Proudly
              South African
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
