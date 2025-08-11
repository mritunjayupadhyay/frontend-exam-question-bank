import { ENDPOINTS } from "@/config/api";
import { IExamPaperWithType } from "question-bank-interface";
import { IExamPaperSectionWithQuestions } from "@/api-handler/exam-papers.api";

interface ExamPaperFullData {
  examPaper: IExamPaperWithType;
  sections: IExamPaperSectionWithQuestions[];
}

export async function fetchCompleteExamPaper(examPaperId: string): Promise<ExamPaperFullData> {
  try {
    // Fetch exam paper basic info
    const examPaperResponse = await fetch(ENDPOINTS.EXAM_PAPERS.FULL_INFO(examPaperId));
    if (!examPaperResponse.ok) {
      throw new Error('Failed to fetch exam paper');
    }
    const examPaper: IExamPaperWithType = await examPaperResponse.json();

    // Fetch sections
    const sectionsResponse = await fetch(ENDPOINTS.EXAM_PAPER_SECTIONS.LIST(examPaperId));
    if (!sectionsResponse.ok) {
      throw new Error('Failed to fetch sections');
    }
    const sectionsData: { data: IExamPaperSectionWithQuestions[] } = await sectionsResponse.json();

    // Fetch questions for each section
    const sectionsWithQuestions: IExamPaperSectionWithQuestions[] = await Promise.all(
      sectionsData.data.map(async (section) => {
        const questionsResponse = await fetch(
          ENDPOINTS.EXAM_PAPER_SECTIONS.GET_WITH_QUESTIONS(section.id)
        );
        if (!questionsResponse.ok) {
          throw new Error(`Failed to fetch questions for section ${section.id}`);
        }
        return await questionsResponse.json();
      })
    );

    // Sort sections by section number
    sectionsWithQuestions.sort((a, b) => a.sectionNumber - b.sectionNumber);

    // Sort questions within each section by question number
    sectionsWithQuestions.forEach(section => {
      if (section.questions) {
        section.questions.sort((a, b) => a.questionNumber - b.questionNumber);
      }
    });

    return {
      examPaper,
      sections: sectionsWithQuestions,
    };
  } catch (error) {
    console.error('Error fetching complete exam paper data:', error);
    throw error;
  }
}