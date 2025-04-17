"use client";

import SearchableSelect from "../common/searchable-select";
import { useTopics } from "@/react-query-hooks/hooks/use-topics";
import { useSelector } from "react-redux";
import { classSubjectState } from "@/rtk/slices/classSubject.slice";

export default function QuestionFilter() {
  const { subject } = useSelector(classSubjectState);
  const { data: topics } = useTopics(
    subject?.id
    );

  const handleTopicSelection = (values: string[]) => {
    console.log({handleTopicSelection: values});
  };
  return (
    <div className="mb-4 w-full">
      <SearchableSelect
        options={(topics?.data || []).map((topic) => ({
          label: topic.name,
          value: topic.id,
        }))}
        title="Topic"
        onChange={handleTopicSelection}
      />
    </div>
  );
}
