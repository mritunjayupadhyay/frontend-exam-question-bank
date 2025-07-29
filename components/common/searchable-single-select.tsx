import React, { memo, useState } from "react";
import { ILabelValue } from "question-bank-interface";
import { Check } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";

interface ISearchableSelectSingleProps {
  options: ILabelValue[];
  title: string;
  value?: string;
  onChange: (value: ILabelValue) => void; // Removed null to match form field expectations
  placeholder?: string;
  isLoading?: boolean; // Optional prop for loading state
  isDisabled?: boolean; // Optional prop for disabled state
  prefix?: string; // Optional prop for prefix
}

const SearchableSelectSingle: React.FC<ISearchableSelectSingleProps> = ({
  options,
  title,
  value,
  onChange,
  placeholder,
  isLoading = false, // Default to false if not provided
  isDisabled = false, // Default to false if not provided
  prefix = "",
}: ISearchableSelectSingleProps) => {
  const [open, setOpen] = useState(false);
    
  const selectedOption = options.find(option => option.value === value);

  const handleSelection = (selectedValue: ILabelValue) => {
    onChange(selectedValue);
    setOpen(false); // Close popover after selection
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={isDisabled}>
        <Button variant="outline" size="sm" className="h-8 border border-gray-300">
          {selectedOption ? prefix + selectedOption.label : (placeholder || title)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={placeholder || title} />
          <CommandList>
            <CommandEmpty>{isLoading ? "Loading..." : "No results found."}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = value === option.value;
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelection(option)}
                  >
                   {isSelected && <Check />}
                    <span>{option.label}</span>
                   
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default memo(SearchableSelectSingle);