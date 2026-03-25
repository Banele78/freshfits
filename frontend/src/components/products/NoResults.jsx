import React from "react";
import Button from "../ui/Button";

const NoResults = ({ clearFilters }) => {
  return (
    <div className="text-center py-20">
      <h3 className="text-xl font-bold">No products found</h3>
      <p className="text-gray-600 mt-2">
        Try adjusting your filters or clearing them.
      </p>
      <Button
        onClick={clearFilters}
        size="md"
        fullWidth={false}
        className="mt-4 mx-auto"
      >
        Clear Filters
      </Button>
    </div>
  );
};

export default NoResults;
