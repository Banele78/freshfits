import { useState } from "react";
import { ChevronDown } from "lucide-react";

function AccordionSection({ id, title, isOpen, onToggle, children }) {
  return (
    <div className="border-b border-gray-200 ">
      <button
        onClick={() => onToggle(id)}
        aria-expanded={isOpen}
        aria-controls={`${id}-content`}
        className="w-full flex justify-between items-center py-4 text-sm font-medium text-left focus:outline-none hover:cursor-pointer"
      >
        <span>{title}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        id={`${id}-content`}
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden pb-4 text-sm text-gray-500 space-y-1">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function ProductAccordion({ product }) {
  const [openSection, setOpenSection] = useState(null);

  const toggle = (id) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };

  return (
    <div className="mt-6 border-t border-gray-200">
      <AccordionSection
        id="info"
        title="Product Information"
        isOpen={openSection === "info"}
        onToggle={toggle}
      >
        <p>Category: {product.category}</p>
        <p>Fit: {product.fitType || "Standard"}</p>
      </AccordionSection>

      <AccordionSection
        id="shipping"
        title="Shipping"
        isOpen={openSection === "shipping"}
        onToggle={toggle}
      >
        <p>Delivery in 3–5 business days.</p>
        <p>Free shipping on orders over R999.</p>
      </AccordionSection>

      <AccordionSection
        id="returns"
        title="Returns"
        isOpen={openSection === "returns"}
        onToggle={toggle}
      >
        <p>Free returns within 14 days.</p>
        <p>Items must be unworn and in original packaging.</p>
      </AccordionSection>
    </div>
  );
}
