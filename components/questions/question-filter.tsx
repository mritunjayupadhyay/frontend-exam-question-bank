"use client";

import SearchableSelect from "../common/searchable-select";
import { useTopics } from "@/react-query-hooks/hooks/use-topics";
import { useSelector } from "react-redux";
import { classSubjectState } from "@/rtk/slices/classSubject.slice";
import TwoThumbSlider from "../common/two-thumb-slider";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import Text from "../common/text";

export default function QuestionFilter() {
  const { subject } = useSelector(classSubjectState);
  const { data: topics } = useTopics(subject?.id);

  const handleTopicSelection = (values: string[]) => {
    console.log({ handleTopicSelection: values });
  };
  const handleDifficultySelection = (value: string) => {
    console.log({ handleDifficultySelection: value });
  };
  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex w-full flex-wrap gap-2 items-center">
        <div className="p-2">
          <SearchableSelect
            options={(topics?.data || []).map((topic) => ({
              label: topic.name,
              value: topic.id,
            }))}
            title="Topic"
            onChange={handleTopicSelection}
          />
        </div>
        <div className=" p-2">
          <ToggleGroup type="single" onValueChange={handleDifficultySelection}>
            <ToggleGroupItem value="bold" aria-label="Toggle bold">
              <p>Easy</p>
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Toggle italic">
              <p>Medium</p>
            </ToggleGroupItem>
            <ToggleGroupItem
              value="strikethrough"
              aria-label="Toggle strikethrough"
            >
              <p>Hard</p>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        
        <div className="flex-1 flex justify-end items-center gap-2">
        <Text type="lightText">Diffuculty Level</Text>
          <div className="w-[200px]"><TwoThumbSlider min={0} max={10} onChange={() => {}} /></div>
        </div>
      </div>
      <div className="flex w-full justify-end gap-2 items-center">
      <div className="flex items-center space-x-2">
            <Switch id="airplane-mode" />
            <Label htmlFor="airplane-mode">MCQ</Label>
          </div>
      </div>
    </div>
  );
}
