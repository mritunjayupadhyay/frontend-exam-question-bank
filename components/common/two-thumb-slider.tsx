/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { Slider } from "../ui/slider";

interface ITwoThumbSliderProps {
  min: number;
  max: number;
  step?: number;
  onChange: (val: [number, number]) => void;
}

const TwoThumbSlider: React.FC<ITwoThumbSliderProps> = ({
    min, max
  }: ITwoThumbSliderProps) => {
    const [values, setValues] = useState([25, 75]);
    const handleValueChange = (newValues: [number, number]) => {
        console.log("handleValueChange", { newValues });
        // Ensure values are ordered (smaller value first)
        const orderedValues = [...newValues].sort((a, b) => a - b);
        setValues(orderedValues);
      };
    return (
        <Slider
                min={0}
                max={10}
                step={1}
                defaultValue={[min, max]}
                minStepsBetweenThumbs={1}
                onValueChange={(val: [number, number]) => handleValueChange(val)}
                className="w-full"
              >
              </Slider>
    )
}
export default TwoThumbSlider;