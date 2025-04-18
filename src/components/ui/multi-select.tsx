
import * as React from "react";
import { X, Check } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Command as CommandPrimitive } from "cmdk";

type Option = {
  value: string;
  label: string;
};

type MultiSelectProps = {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
};

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select items...",
  className,
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const handleUnselect = (item: string) => {
    onChange(value.filter((i) => i !== item));
  };

  const handleSelect = (item: string) => {
    if (value.includes(item)) {
      onChange(value.filter((i) => i !== item));
    } else {
      onChange([...value, item]);
    }
  };

  const selectedLabels = value.map(
    (v) => options.find((option) => option.value === v)?.label || v
  );

  return (
    <Command
      className={cn(
        "overflow-visible bg-white border border-input rounded-md w-full",
        className
      )}
    >
      <div className="group border-0 px-3 py-2 flex flex-wrap gap-1">
        {selectedLabels.map((label, index) => (
          <Badge
            key={label}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {label}
            <button
              className="ml-1 rounded-full outline-none focus:ring-2"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleUnselect(value[index]);
                }
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={() => handleUnselect(value[index])}
            >
              <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
            </button>
          </Badge>
        ))}
        <CommandInput
          ref={inputRef}
          value={inputValue}
          onValueChange={setInputValue}
          onBlur={() => setOpen(false)}
          onFocus={() => setOpen(true)}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 outline-none bg-transparent min-w-[8rem] min-h-[1.5rem]"
        />
      </div>
      <div className="relative">
        {open && (
          <div className="absolute w-full z-10 top-0 bg-background rounded-md border shadow-md">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup className="max-h-60 overflow-auto">
              {options.map((option) => {
                const isSelected = value.includes(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleSelect(option.value)}
                    className="flex items-center gap-2"
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "opacity-50"
                      )}
                    >
                      {isSelected ? <Check className="h-3 w-3" /> : null}
                    </div>
                    {option.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </div>
        )}
      </div>
    </Command>
  );
}
