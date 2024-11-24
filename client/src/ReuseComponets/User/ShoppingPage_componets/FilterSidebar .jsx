import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useDebounce } from "../Hooks/Debounce"

export const FilterSidebar = ({ className, categories, onFilterChange }) => {
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedFits, setSelectedFits] = useState([])
  const [selectedSleeves, setSelectedSleeves] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [openSections, setOpenSections] = useState({
    category: true,
    fit: true,
    sleeve: true
  })

  const fits = ["Slim Fit", "Regular Fit", "Loose Fit"]
  const sleeves = ["Full Sleeve", "Half Sleeve", "Elbow Sleeve"]

  //Debounce searching...
  const debouncedSearchTerm = useDebounce(searchTerm, 1000)

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleFitChange = (fit) => {
    setSelectedFits((prev) =>
      prev.includes(fit)
        ? prev.filter((f) => f !== fit)
        : [...prev, fit]
    )
  }

  const handleSleeveChange = (sleeve) => {
    setSelectedSleeves((prev) =>
      prev.includes(sleeve)
        ? prev.filter((s) => s !== sleeve)
        : [...prev, sleeve]
    )
  }

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  useEffect(() => {
    onFilterChange({
      categories: selectedCategories.join(','),
      fits: selectedFits.join(','),
      sleeves: selectedSleeves.join(','),
      searchTerm,
    }) 
  }, [selectedCategories, selectedFits, selectedSleeves , debouncedSearchTerm])

  return (
    <div className={`${className} flex flex-col space-y-6 p-4 bg-background rounded-lg shadow`}>
      <h2 className="text-2xl font-semibold">Filters</h2>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Search</h3>
        <Input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="space-y-4">
        <div>
          <button
            onClick={() => toggleSection('category')}
            className="flex justify-between items-center w-full text-left text-lg font-medium"
          >
            Category
            {openSections.category ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
          {openSections.category && (
            <div className="mt-2 space-y-2">
              {categories.map((category) => (
                <div key={category._id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category._id}`}
                    checked={selectedCategories.includes(category._id)}
                    onCheckedChange={() => handleCategoryChange(category._id)}
                  />
                  <label
                    htmlFor={`category-${category._id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <button
            onClick={() => toggleSection('fit')}
            className="flex justify-between items-center w-full text-left text-lg font-medium"
          >
            Fit
            {openSections.fit ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
          {openSections.fit && (
            <div className="mt-2 space-y-2">
              {fits.map((fit) => (
                <div key={fit} className="flex items-center space-x-2">
                  <Checkbox
                    id={`fit-${fit}`}
                    checked={selectedFits.includes(fit)}
                    onCheckedChange={() => handleFitChange(fit)}
                  />
                  <label
                    htmlFor={`fit-${fit}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {fit}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <button
            onClick={() => toggleSection('sleeve')}
            className="flex justify-between items-center w-full text-left text-lg font-medium"
          >
            Sleeve
            {openSections.sleeve ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
          {openSections.sleeve && (
            <div className="mt-2 space-y-2">
              {sleeves.map((sleeve) => (
                <div key={sleeve} className="flex items-center space-x-2">
                  <Checkbox
                    id={`sleeve-${sleeve}`}
                    checked={selectedSleeves.includes(sleeve)}
                    onCheckedChange={() => handleSleeveChange(sleeve)}
                  />
                  <label
                    htmlFor={`sleeve-${sleeve}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {sleeve}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Button
        onClick={() => {
          setSelectedCategories([])
          setSelectedFits([])
          setSelectedSleeves([])
          setSearchTerm("")
        }}
        variant="outline"
        className="w-full"
      >
        Reset Filters
      </Button>
    </div>
  )
}