'use client';

const QuestionList = ({questions}: {questions: unknown[]}) => {
    console.log({questions});
    
    return (
        <div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {questions.map((_question, index) => (
                    <div key={index}>{index + 1}</div>
                ))}
            </div>
        </div>
    );
};

export default QuestionList;