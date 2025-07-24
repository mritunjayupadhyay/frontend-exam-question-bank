"use client";

import SearchableSelect from "../common/searchable-select";
import { useTopics } from "@/react-query-hooks/hooks/use-topics";
import { useSelector, useDispatch } from "react-redux";
import { classSubjectState } from "@/rtk/slices/classSubject.slice";
import TwoThumbSlider from "../common/two-thumb-slider";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import Text from "../common/text";
import { questionsFilterState, setDifficultyLevel, setMarks, setQuestionFilter, setTopics } from "@/rtk/slices/question.filter.slice";
import { useEffect, useMemo } from "react";
import { DifficultyLevel, QuestionType } from "question-bank-interface";
import { debounce } from "lodash";

export default function QuestionFilter() {
  // Redux store
  const dispatch = useDispatch();
  const { subject } = useSelector(classSubjectState);
  const questionFilter = useSelector(questionsFilterState);

  // react query
  const { data: topics } = useTopics(subject?.id);

  const handleTopicSelection = (values: string[]) => {
    console.log({ handleTopicSelection: values });
    dispatch(setTopics(values));
  };
  const handleDifficultySelection = (value: string) => {
    console.log({ handleDifficultySelection: value });
    dispatch(setDifficultyLevel(value));
  };
  const debouncedHandleMarksChange = useMemo(
  () => debounce((values: number[]) => {
    dispatch(setMarks(values));
  }, 300),
  [dispatch]
);

  const handleQuestionTypeSelection = (checked: boolean) => {
    console.log({ handleQuestionTypeSelection: checked });
    const questionType = checked ? QuestionType.MULTIPLE_CHOICE : QuestionType.DESCRIPTIVE;
    dispatch(setQuestionFilter({ 
      key: "questionType",
      value: questionType,
     }));
  };
  useEffect(() => {
    console.log("questionFilter",{ questionFilter });
  }, [questionFilter]);
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
            <ToggleGroupItem value={DifficultyLevel.LOW} aria-label="Easy Question">
              <p>Easy</p>
            </ToggleGroupItem>
            <ToggleGroupItem value={DifficultyLevel.MEDIUM} aria-label="Medium Question">
              <p>Medium</p>
            </ToggleGroupItem>
            <ToggleGroupItem
              value={DifficultyLevel.HARD}
              aria-label="Hard Question"
            >
              <p>Hard</p>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="flex-1 flex justify-end items-center gap-2">
          <Text type="lightText">Marks</Text>
          <div className="w-[300px]">
            <TwoThumbSlider min={1} max={10} onChange={debouncedHandleMarksChange} />
          </div>
        </div>
      </div>
      <div className="flex w-full justify-end gap-2 items-center">
        <div className="flex items-center space-x-2">
          <Switch id="airplane-mode" defaultChecked={true} onCheckedChange={handleQuestionTypeSelection} />
          <Label htmlFor="airplane-mode">MCQ</Label>
        </div>
      </div>
    </div>
  );
}