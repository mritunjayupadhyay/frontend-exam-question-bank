/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { Slider } from "../ui/slider";
import { Badge } from "../ui/badge";

interface ITwoThumbSliderProps {
  min: number;
  max: number;
  step?: number;
  onChange: (val: [number, number]) => void;
  showCurrentValues?: boolean;
}

const TwoThumbSlider: React.FC<ITwoThumbSliderProps> = ({
    min, max, onChange, step = 1, showCurrentValues = true
  }: ITwoThumbSliderProps) => {
    const [values, setValues] = useState([min, max]);
    const handleValueChange = (newValues: [number, number]) => {
        console.log("handleValueChange", { newValues });
        // Ensure values are ordered (smaller value first)
        const orderedValues = [...newValues].sort((a, b) => a - b);
        onChange([orderedValues[0], orderedValues[1]]);
        setValues([orderedValues[0], orderedValues[1]]);
      };
    return (
        <div className="w-full flex flex-col gap-2">
          {showCurrentValues && (
            <div className="flex justify-between text-sm">
              <Badge
                className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
                variant="outline"
              >
                {values[0]}
              </Badge>
              <Badge
                className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
                variant="outline"
              >
                {values[1]}
              </Badge>
            </div>
          )}
          <Slider
                min={min}
                max={max}
                step={step}
                defaultValue={[min, max]}
                value={values}
                minStepsBetweenThumbs={1}
                onValueChange={(val: [number, number]) => handleValueChange(val)}
                className="w-full"
              >
              </Slider>
        </div>
    )
}
export default TwoThumbSlider;