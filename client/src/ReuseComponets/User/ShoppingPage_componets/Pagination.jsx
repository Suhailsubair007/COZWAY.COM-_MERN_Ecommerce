import React from "react"
import { Button } from "@/components/ui/button"

export const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="mt-8 flex justify-center">
    <Button
      onClick={() => onPageChange((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
    >
      Previous
    </Button>
    <span className="mx-4 flex items-center">
      Page {currentPage} of {totalPages}
    </span>
    <Button
      onClick={() => onPageChange((prev) => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
    >
      Next
    </Button>
  </div>
)