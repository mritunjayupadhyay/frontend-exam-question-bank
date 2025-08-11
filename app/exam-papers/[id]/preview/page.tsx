'use client';
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Download, 
  Printer, 
  Clock,
  FileText,
  BookOpen,
  User,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';
import { IExamPaperWithType } from 'question-bank-interface';
import { IExamPaperSectionWithQuestions } from '@/api-handler/exam-papers.api';

interface ExamPaperPreviewData {
  examPaper: IExamPaperWithType;
  sections: IExamPaperSectionWithQuestions[];
}

const ExamPaperPreviewPage = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [previewData, setPreviewData] = React.useState<ExamPaperPreviewData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDownloading, setIsDownloading] = React.useState(false);

  React.useEffect(() => {
    const fetchPreviewData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/exam-papers/${params.id}/preview`);
        if (!response.ok) {
          throw new Error('Failed to fetch preview data');
        }
        const data = await response.json();
        setPreviewData(data);
      } catch (error) {
        console.error('Error fetching preview:', error);
        toast.error('Failed to load exam paper preview');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchPreviewData();
    }
  }, [params.id]);

  const handleDownloadPDF = async () => {
    try {
      setIsDownloading(true);
      const response = await fetch(`/api/exam-papers/${params.id}/pdf`);
      
      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${previewData?.examPaper.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_exam_paper.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const stripHtml = (html: string): string => {
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  };

  const getOptionLabel = (index: number): string => {
    return String.fromCharCode(65 + index);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          Loading preview...
        </div>
      </div>
    );
  }

  if (!previewData) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold mb-2">Preview Not Available</h2>
          <p className="text-muted-foreground mb-4">Unable to load the exam paper preview.</p>
          <Button onClick={() => router.push(`/exam-papers/${params.id}`)}>
            Back to Exam Paper
          </Button>
        </div>
      </div>
    );
  }

  const { examPaper, sections } = previewData;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header - Hidden in print */}
      <div className="bg-background border-b print:hidden">
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => router.push(`/exam-papers/${params.id}`)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Exam Paper
              </Button>
              <div>
                <h1 className="text-xl font-semibold">Exam Paper Preview</h1>
                <p className="text-sm text-muted-foreground">
                  Preview how the exam paper will appear to students
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handlePrint}
                className="flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                Print
              </Button>
              <Button 
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="flex items-center gap-2"
              >
                {isDownloading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Download PDF
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="max-w-4xl mx-auto p-6 print:p-0 print:max-w-none">
        <div className="bg-white shadow-lg print:shadow-none print:bg-transparent">
          {/* Paper Content */}
          <div className="p-12 print:p-8">
            {/* Header */}
            <div className="mb-8 pb-6 border-b-2 border-black">
              <h1 className="text-2xl font-bold text-center mb-4 uppercase">
                {examPaper.title}
              </h1>
              
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span className="font-semibold">Type:</span> {examPaper.examTypeName || 'Examination'}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span className="font-semibold">Duration:</span> {examPaper.durationMinutes} minutes
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span className="font-semibold">Total Marks:</span> {examPaper.totalMarks}
                </div>
              </div>

              <div className="text-sm italic space-y-1">
                <p>• Read all instructions carefully before attempting the questions.</p>
                <p>• Answer all questions in the spaces provided.</p>
                <p>• Write clearly and legibly.</p>
                <p>• Use of calculators/electronic devices is not permitted unless specified.</p>
              </div>
            </div>

            {/* Student Information */}
            <div className="mb-6 p-4 border-2 border-black">
              <div className="grid grid-cols-3 gap-8">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="font-semibold">Name:</span>
                  <div className="flex-1 border-b border-black h-6"></div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Roll No:</span>
                  <div className="flex-1 border-b border-black h-6"></div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="font-semibold">Date:</span>
                  <div className="flex-1 border-b border-black h-6"></div>
                </div>
              </div>
            </div>

            {/* Sections */}
            {sections.map((section, sectionIndex) => (
              <div key={section.id} className={`mb-8 ${sectionIndex > 0 ? 'print:break-before-page' : ''}`}>
                {/* Section Header */}
                <div className="bg-gray-100 p-3 mb-6 border border-gray-300">
                  <h2 className="text-lg font-bold mb-1">
                    Section {section.sectionNumber}: {section.title}
                  </h2>
                  <div className="text-sm text-gray-600">
                    {section.marksPerQuestion} mark{section.marksPerQuestion !== 1 ? 's' : ''} per question • 
                    Answer {section.questionsToAnswer} out of {section.totalQuestions} questions • 
                    Total: {section.sectionMarks} marks
                  </div>
                  {section.instructions && (
                    <div className="text-sm italic mt-2 text-gray-700">
                      Instructions: {section.instructions}
                    </div>
                  )}
                </div>

                {/* Questions */}
                {section.questions.map((examPaperQuestion) => {
                  const question = examPaperQuestion.question;
                  if (!question) return null;

                  const isMultipleChoice = question.questionType === 'multiple_choice';

                  return (
                    <div key={examPaperQuestion.id} className="mb-6 pl-2">
                      <div className="font-semibold mb-2">
                        {examPaperQuestion.questionNumber}. 
                        {examPaperQuestion.isOptional && ' (Optional)'} 
                        ({question.marks} mark{question.marks !== 1 ? 's' : ''})
                      </div>
                      
                      <div className="mb-3 leading-relaxed">
                        {stripHtml(question.questionText)}
                      </div>

                      {/* Multiple Choice Options */}
                      {isMultipleChoice && question.questionOptions && (
                        <div className="pl-6 space-y-2">
                          {question.questionOptions.map((option, optionIndex) => (
                            <div key={option.id} className="flex items-start gap-3">
                              <span className="font-semibold min-w-[20px]">
                                {getOptionLabel(optionIndex)})
                              </span>
                              <span className="flex-1">
                                {option.optionText}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Answer Space for Descriptive Questions */}
                      {!isMultipleChoice && (
                        <div className="mt-3 p-3 border-2 border-dashed border-gray-300 min-h-[80px]">
                          <div className="text-sm text-gray-500 italic">
                            Write your answer here:
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Footer */}
            <div className="mt-12 pt-4 border-t border-gray-300 text-center text-sm text-gray-600">
              End of Examination Paper
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPaperPreviewPage;