import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { IExamPaperWithType } from 'question-bank-interface';
import { IExamPaperSectionWithQuestions } from '@/api-handler/exam-papers.api';

interface ExamPaperPDFProps {
  examPaper: IExamPaperWithType;
  sections: IExamPaperSectionWithQuestions[];
}

// PDF Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 50,
    fontSize: 12,
    lineHeight: 1.4,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
    paddingBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  examInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  examInfoItem: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  instructions: {
    fontSize: 10,
    marginBottom: 15,
    fontStyle: 'italic',
  },
  studentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#000000',
    padding: 10,
    marginBottom: 20,
  },
  studentInfoItem: {
    fontSize: 10,
    flexDirection: 'row',
  },
  studentInfoLabel: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  studentInfoLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    width: 150,
    height: 12,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    backgroundColor: '#f5f5f5',
    padding: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#cccccc',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  sectionInfo: {
    fontSize: 10,
    color: '#666666',
  },
  sectionInstructions: {
    fontSize: 10,
    fontStyle: 'italic',
    marginTop: 5,
    color: '#444444',
  },
  question: {
    marginBottom: 20,
    paddingLeft: 5,
  },
  questionNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  questionText: {
    fontSize: 12,
    marginBottom: 10,
    lineHeight: 1.5,
  },
  mcqOptions: {
    paddingLeft: 15,
  },
  mcqOption: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  mcqOptionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 10,
    minWidth: 20,
  },
  mcqOptionText: {
    fontSize: 12,
    flex: 1,
    lineHeight: 1.4,
  },
  answerSpace: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderStyle: 'dashed',
    height: 60,
    marginTop: 10,
    padding: 5,
  },
  answerSpaceLabel: {
    fontSize: 10,
    color: '#666666',
    fontStyle: 'italic',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    textAlign: 'center',
    fontSize: 10,
    color: '#666666',
    borderTopWidth: 1,
    borderTopColor: '#cccccc',
    paddingTop: 10,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    right: 50,
    fontSize: 10,
    color: '#666666',
  },
});

// Helper function to strip HTML tags
const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
};

// Helper function to get option label (A, B, C, D)
const getOptionLabel = (index: number): string => {
  return String.fromCharCode(65 + index); // A, B, C, D, etc.
};

const ExamPaperPDF: React.FC<ExamPaperPDFProps> = ({ examPaper, sections }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{examPaper.title}</Text>
          
          <View style={styles.examInfo}>
            <Text style={styles.examInfoItem}>
              Type: {examPaper.examTypeName || 'Examination'}
            </Text>
            <Text style={styles.examInfoItem}>
              Duration: {examPaper.durationMinutes} minutes
            </Text>
            <Text style={styles.examInfoItem}>
              Total Marks: {examPaper.totalMarks}
            </Text>
          </View>

          <Text style={styles.instructions}>
            • Read all instructions carefully before attempting the questions.
            • Answer all questions in the spaces provided.
            • Write clearly and legibly.
            • Use of calculators/electronic devices is not permitted unless specified.
          </Text>
        </View>

        {/* Student Information */}
        <View style={styles.studentInfo}>
          <View style={styles.studentInfoItem}>
            <Text style={styles.studentInfoLabel}>Name:</Text>
            <View style={styles.studentInfoLine}></View>
          </View>
          <View style={styles.studentInfoItem}>
            <Text style={styles.studentInfoLabel}>Roll No:</Text>
            <View style={styles.studentInfoLine}></View>
          </View>
          <View style={styles.studentInfoItem}>
            <Text style={styles.studentInfoLabel}>Date:</Text>
            <View style={styles.studentInfoLine}></View>
          </View>
        </View>

        {/* Sections */}
        {sections.map((section, sectionIndex) => (
          <View key={section.id} style={styles.section} break={sectionIndex > 0}>
            {/* Section Header */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Section {section.sectionNumber}: {section.title}
              </Text>
              <Text style={styles.sectionInfo}>
                {section.marksPerQuestion} mark{section.marksPerQuestion !== 1 ? 's' : ''} per question • 
                Answer {section.questionsToAnswer} out of {section.totalQuestions} questions • 
                Total: {section.sectionMarks} marks
              </Text>
              {section.instructions && (
                <Text style={styles.sectionInstructions}>
                  Instructions: {section.instructions}
                </Text>
              )}
            </View>

            {/* Questions */}
            {section.questions.map((examPaperQuestion) => {
              const question = examPaperQuestion.question;
              if (!question) return null;

              const isMultipleChoice = question.questionType === 'multiple_choice';

              return (
                <View key={examPaperQuestion.id} style={styles.question}>
                  <Text style={styles.questionNumber}>
                    {examPaperQuestion.questionNumber}. 
                    {examPaperQuestion.isOptional && ' (Optional)'}
                    {' '}({question.marks} mark{question.marks !== 1 ? 's' : ''})
                  </Text>
                  
                  <Text style={styles.questionText}>
                    {stripHtml(question.questionText)}
                  </Text>

                  {/* Multiple Choice Options */}
                  {isMultipleChoice && question.questionOptions && (
                    <View style={styles.mcqOptions}>
                      {question.questionOptions.map((option, optionIndex) => (
                        <View key={option.id} style={styles.mcqOption}>
                          <Text style={styles.mcqOptionLabel}>
                            {getOptionLabel(optionIndex)})
                          </Text>
                          <Text style={styles.mcqOptionText}>
                            {option.optionText}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Answer Space for Descriptive Questions */}
                  {!isMultipleChoice && (
                    <View style={styles.answerSpace}>
                      <Text style={styles.answerSpaceLabel}>
                        Write your answer here:
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        ))}

        {/* Footer */}
        <Text style={styles.footer}>
          End of Examination Paper
        </Text>
        
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => 
          `Page ${pageNumber} of ${totalPages}`
        } fixed />
      </Page>
    </Document>
  );
};

export default ExamPaperPDF;