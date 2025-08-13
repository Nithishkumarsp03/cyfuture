import { useState, useRef } from "react";
import { Listbox } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { useFloating, offset, flip, size, autoUpdate, FloatingPortal } from "@floating-ui/react";

export default function Select({ value, onChange, options, placeholder, className }) {
  const selected = options.find((o) => o.value === value);
  const buttonRef = useRef(null);

  const { refs, floatingStyles } = useFloating({
    placement: "bottom-start",
    middleware: [
      offset(4),
      flip(),
      size({
        apply({ rects, elements }) {
          elements.floating.style.width = `${rects.reference.width}px`;
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  return (
    <div className="w-full">
      <Listbox value={value} onChange={onChange}>
        {/* Button */}
        <Listbox.Button
          ref={(node) => {
            refs.setReference(node);
            buttonRef.current = node;
          }}
          className={`relative w-full bg-gray-100 px-3 py-2 pr-8 rounded-lg text-sm outline-none 
                      hover:bg-gray-200 transition focus:ring-blue-500 focus:border-blue-500 focus:ring-2 ${className}`}
        >
          <span className="flex items-center gap-2">
            {selected?.icon && <selected.icon className="w-4 h-4 text-gray-600" />}
            {selected ? selected.label : placeholder || "Select..."}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </Listbox.Button>

        {/* Options in a portal with floating positioning */}
        <FloatingPortal>
          <Listbox.Options
            ref={refs.setFloating}
            style={floatingStyles}
            className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-[9999] border-none outline-none"
          >
            {options.map((option) => (
              <Listbox.Option
                key={option.value}
                value={option.value}
                className={({ active }) =>
                  `flex items-center gap-2 px-4 py-2 cursor-pointer text-sm ${
                    active ? "bg-blue-100 text-blue-700" : "text-gray-700"
                  }`
                }
              >
                {option.icon && <option.icon className="w-4 h-4" />}
                {option.label}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </FloatingPortal>
      </Listbox>
    </div>
  );
}
