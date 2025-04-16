import React, { memo, useState } from 'react';
import { ILabelValue } from 'question-bank-interface';
import { Check, PlusCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '../ui/command';
import { cn } from '@/lib/utils';

interface ISearchableSelectProps {
  options: ILabelValue[];
  title: string;
  onChange: (values: string[]) => void;
}

const SearchableSelect: React.FC<ISearchableSelectProps> = ({ 
  options,
    title,
    onChange,
}: ISearchableSelectProps) => {
    const [selectedValues, setSelectedValues] = useState(new Set<string>());
  console.log("SearchableSelect", { options, title, onChange });
  const handleSelection = (value: string) => {
    const updatedSelection = new Set<string>(selectedValues);
    
    // Toggle selection
    if (updatedSelection.has(value)) {
      updatedSelection.delete(value);
    } else {
      updatedSelection.add(value);
    }
    
    setSelectedValues(updatedSelection);
    onChange([...updatedSelection]); // Convert to array when passing to parent
  };
  const clearSelections = () => {
    setSelectedValues(new Set()); // Create a new empty Set
    onChange([]); // Pass empty array to parent
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircle />
          {title}
          </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelection(option.value)}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Check />
                    </div>
                    {/* {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )} */}
                    <span>{option.label}</span>
                    {/* {facets?.get(option.value) && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(option.value)}
                      </span>
                    )} */}
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => clearSelections()}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default memo(SearchableSelect); // Memoize component to prevent unnecessary re-renders