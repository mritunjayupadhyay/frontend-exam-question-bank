import { IExamPaperWithType } from "question-bank-interface";
import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { formatDate } from "@/utils/date.util";
import { useRouter } from 'next/navigation'

interface ExamPaperCardProps {
  examPaper: IExamPaperWithType;
}

const ExamPaperCard: React.FC<ExamPaperCardProps> = ({ examPaper }) => {
  const router = useRouter()
  const onSelectExamPaper = (examPaper: IExamPaperWithType) => {
    console.log("selectedExamPaper", examPaper);
    // go exam paper details page
    router.push('/exam-papers/' + examPaper.id);

  };
  return (
    <button
      key={examPaper.id}
      className={cn(
        "flex flex-col cursor-pointer questions-start gap-2 rounded-lg border p-3 text-left text-sm transition-all bg-white hover:bg-accent"
      )}
      onClick={() => onSelectExamPaper(examPaper)}
    >
      <div className="flex w-full flex-col gap-1">
        <div className="flex questions-center">
          <div className="flex questions-center gap-2">
            <Badge variant="label">Exam Type: {examPaper.examTypeName || 'Yearly'}</Badge>

            <Badge variant="label">Duration: {examPaper.durationMinutes} mins</Badge>
          </div>
          <div
            className={cn(
              "ml-auto text-xs text-muted-foreground"
            )}
          >
            <Badge variant="success">{examPaper.totalMarks}</Badge>
          </div>
        </div>
      </div>
      <div className="line-clamp-2 text-xs text-muted-foreground">
        <div
          className="prose prose-sm max-w-none text-black font-noto-sans font-medium text-sm"
          dangerouslySetInnerHTML={{ __html: examPaper.title }}
        />
      </div>
      <div className="flex questions-center gap-2">
          <Badge variant="secondary">
               Created: {formatDate(examPaper.createdAt)}
            </Badge>
            <Badge variant="secondary">
              Last Updated: {formatDate(examPaper.updatedAt)}
            </Badge>

        </div>
    </button>
  );
};
export default ExamPaperCard;
