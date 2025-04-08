'use client';

import { useQuery } from '@tanstack/react-query';

// Simulated API function
const fetchQuestions = async () => {
    const res = await fetch('http://localhost:8000/local/ex-p/questions/filter');
    if (!res.ok) throw new Error('Failed to fetch questions');
    return res.json();
};

export function useQuestions() {
    return useQuery({
        queryKey: ['questions'],
        queryFn: fetchQuestions,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}