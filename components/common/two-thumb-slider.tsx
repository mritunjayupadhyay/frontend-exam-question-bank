/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { Slider } from "../ui/slider";
import { on } from "events";

interface ITwoThumbSliderProps {
  min: number;
  max: number;
  step?: number;
  onChange: (val: [number, number]) => void;
}

const TwoThumbSlider: React.FC<ITwoThumbSliderProps> = ({
    min, max, onChange, step = 1
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
    )
}
export default TwoThumbSlider;