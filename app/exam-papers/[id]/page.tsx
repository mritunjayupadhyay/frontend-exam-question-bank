'use client';
import { useExamPaperById } from '@/react-query-hooks/hooks/use-exam-papers';
import { useExamPaperSections } from '@/react-query-hooks/hooks/use-exam-paper-sections';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Clock, 
  FileText, 
  BookOpen,
  ChevronRight,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { formatDate } from '@/utils/date.util';
import ExamPaperSectionForm from '@/components/exam-papers/exam-paper-section-form';
import { useDeleteExamPaperSection } from '@/react-query-hooks/hooks/use-exam-paper-sections';
import { useExamPaperSectionWithQuestions } from '@/react-query-hooks/hooks/use-exam-paper-sections';
import { useRemoveExamPaperQuestionById } from '@/react-query-hooks/hooks/use-exam-paper-questions';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { IExamPaperSection } from '@/api-handler/exam-papers.api';

const ExamPaperDetailsPage = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [showSectionForm, setShowSectionForm] = React.useState(false);
  const [editingSection, setEditingSection] = React.useState<IExamPaperSection | null>(null);
  const [expandedSection, setExpandedSection] = React.useState<string | null>(null);

  const { data: examPaper, isLoading: isLoadingExamPaper } = useExamPaperById(params.id);
  const { data: sectionsData, isLoading: isLoadingSections } = useExamPaperSections(params.id);
  const deleteSectionMutation = useDeleteExamPaperSection();
  const removeQuestionMutation = useRemoveExamPaperQuestionById();

  const sections = sectionsData?.data || [];

  const handleDeleteSection = async (section: IExamPaperSection) => {
    try {
      await deleteSectionMutation.mutateAsync({
        sectionId: section.id,
        examPaperId: section.examPaperId,
      });
      toast.success('Section deleted successfully!');
    } catch {
      toast.error('Failed to delete section. Please try again.');
    }
  };

  const handleRemoveQuestion = async (examPaperQuestionId: string, sectionId: string) => {
    try {
      await removeQuestionMutation.mutateAsync({
        examPaperQuestionId,
        sectionId,
      });
      toast.success('Question removed from section!');
    } catch {
      toast.error('Failed to remove question. Please try again.');
    }
  };

  if (isLoadingExamPaper || isLoadingSections) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          Loading exam paper details...
        </div>
      </div>
    );
  }

  if (!examPaper) {
    return (
      <div className="p-4">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold mb-2">Exam Paper Not Found</h2>
          <p className="text-muted-foreground">The exam paper you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  const totalSectionMarks = sections.reduce((sum, section) => sum + section.sectionMarks, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Exam Paper Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{examPaper.title}</CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {examPaper.durationMinutes} minutes
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  {examPaper.totalMarks} marks
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {examPaper.examTypeName}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push(`/exam-papers/${params.id}/preview`)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Paper
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Total Sections</p>
              <p className="text-2xl font-bold">{sections.length}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Section Marks</p>
              <p className="text-2xl font-bold">{totalSectionMarks}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Expected Marks</p>
              <p className="text-2xl font-bold">{examPaper.totalMarks}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Created</p>
              <p className="text-sm text-muted-foreground">{examPaper.createdAt}</p>
            </div>
          </div>
          
          {totalSectionMarks !== examPaper.totalMarks && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Section marks ({totalSectionMarks}) don&apos;t match expected paper marks ({examPaper.totalMarks}).
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sections Management */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Exam Paper Sections</h2>
        <Dialog open={showSectionForm} onOpenChange={setShowSectionForm}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Section
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Section</DialogTitle>
            </DialogHeader>
            <ExamPaperSectionForm
              examPaperId={params.id}
              onSuccess={() => setShowSectionForm(false)}
              onCancel={() => setShowSectionForm(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Sections List */}
      {sections.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Sections Yet</h3>
            <p className="text-muted-foreground mb-4">
              Start by creating sections for your exam paper. Each section can contain multiple questions.
            </p>
            <Dialog open={showSectionForm} onOpenChange={setShowSectionForm}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Section
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create First Section</DialogTitle>
                </DialogHeader>
                <ExamPaperSectionForm
                  examPaperId={params.id}
                  onSuccess={() => setShowSectionForm(false)}
                  onCancel={() => setShowSectionForm(false)}
                />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sections.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              isExpanded={expandedSection === section.id}
              onToggleExpand={() => 
                setExpandedSection(expandedSection === section.id ? null : section.id)
              }
              onEdit={() => {
                setEditingSection(section);
                setShowSectionForm(true);
              }}
              onDelete={() => handleDeleteSection(section)}
              onAddQuestions={() => router.push(`/exam-papers/${params.id}/sections/${section.id}/add-questions`)}
              onRemoveQuestion={handleRemoveQuestion}
            />
          ))}
        </div>
      )}

      {/* Edit Section Dialog */}
      <Dialog open={!!editingSection} onOpenChange={() => setEditingSection(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Section</DialogTitle>
          </DialogHeader>
          {editingSection && (
            <ExamPaperSectionForm
              examPaperId={params.id}
              section={editingSection}
              onSuccess={() => setEditingSection(null)}
              onCancel={() => setEditingSection(null)}
            />
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
};

// Section Card Component
function SectionCard({ 
  section, 
  isExpanded, 
  onToggleExpand, 
  onEdit, 
  onDelete, 
  onAddQuestions,
  onRemoveQuestion 
}: {
  section: IExamPaperSection;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddQuestions: () => void;
  onRemoveQuestion: (examPaperQuestionId: string, sectionId: string) => void;
}) {
  const { data: sectionWithQuestions } = useExamPaperSectionWithQuestions(section.id);
  const questions = sectionWithQuestions?.questions || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleExpand}
              className="p-1"
            >
              <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
            </Button>
            <div>
              <CardTitle className="text-lg">
                Section {section.sectionNumber}: {section.title}
              </CardTitle>
              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                <span>{section.marksPerQuestion} marks per question</span>
                <span>Answer {section.questionsToAnswer} of {section.totalQuestions}</span>
                <Badge variant="success">{section.sectionMarks} marks</Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{questions.length} questions added</Badge>
            <Button variant="outline" size="sm" onClick={onAddQuestions}>
              <Plus className="h-4 w-4 mr-1" />
              Add Questions
            </Button>
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Section</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this section? This will also remove all questions from this section.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      
      {section.instructions && (
        <CardContent className="pt-0">
          <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
            <strong>Instructions:</strong> {section.instructions}
          </div>
        </CardContent>
      )}

      {isExpanded && (
        <CardContent className="pt-2">
          <Separator className="mb-4" />
          {questions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-2" />
              <p>No questions added to this section yet.</p>
              <Button variant="link" onClick={onAddQuestions} className="mt-2">
                Add the first question
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <h4 className="font-semibold">Questions in this section:</h4>
              {questions.map((examPaperQuestion) => (
                <div key={examPaperQuestion.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">Q{examPaperQuestion.questionNumber}</Badge>
                      {examPaperQuestion.question && (
                        <>
                          <Badge variant="secondary">{examPaperQuestion.question.questionType}</Badge>
                          <Badge variant="success">{examPaperQuestion.question.marks} marks</Badge>
                        </>
                      )}
                      {examPaperQuestion.isOptional && (
                        <Badge variant="outline">Optional</Badge>
                      )}
                    </div>
                    {examPaperQuestion.question && (
                      <div 
                        className="prose prose-sm max-w-none text-sm"
                        dangerouslySetInnerHTML={{ __html: examPaperQuestion.question.questionText }}
                      />
                    )}
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove Question</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove this question from the section?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => onRemoveQuestion(examPaperQuestion.id, section.id)}
                        >
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

export default ExamPaperDetailsPage;