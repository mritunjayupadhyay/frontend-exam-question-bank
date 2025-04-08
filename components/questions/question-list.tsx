'use client';

export default function QuestionList() {
    return (
        <div className="mb-4">
            <table className="min-w-full border border-gray-300">
                <thead>
                    <tr>
                        <th className="border-b p-2">Question</th>
                        <th className="border-b p-2">Category</th>
                        <th className="border-b p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Map through questions here */}
                    {/* Example row */}
                    <tr>
                        <td className="border-b p-2">What is 2 + 2?</td>
                        <td className="border-b p-2">Math</td>
                        <td className="border-b p-2">
                            <button className="bg-blue-500 text-white rounded p-1 mr-2">Edit</button>
                            <button className="bg-red-500 text-white rounded p-1">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}