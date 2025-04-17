"use client";

import { ILabelValue } from "question-bank-interface";
import SearchableSelect from "../common/searchable-select";

export default function QuestionFilter() {
  const allQuestionTypes: ILabelValue[] = [
    {
      label: "Descriptive",
      value: "descriptive",
    },
    {
      label: "Multiple Choice",
      value: "multiple_type",
    },
  ];
  const handleAllQuestionTypes = (values: string[]) => {
    console.log({handleAllQuestionTypes: values});
  };
  return (
    <div className="mb-4 w-full">
      <SearchableSelect
        options={allQuestionTypes}
        title="Question Type"
        onChange={handleAllQuestionTypes}
      />
      <input
        type="text"
        placeholder="Search questions..."
        className="border border-gray-300 rounded p-2 mr-2"
      />
      <select className="border border-gray-300 rounded p-2">
        <option value="">All Categories</option>
        <option value="math">Math</option>
        <option value="science">Science</option>
        <option value="history">History</option>
      </select>
      <button className="bg-blue-500 text-white rounded p-2 ml-2">
        Filter
      </button>
    </div>
  );
}
