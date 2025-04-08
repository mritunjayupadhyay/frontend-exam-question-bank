'use client';
export default function QuestionFilter() {
  return (
    <div className="mb-4">
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
      <button className="bg-blue-500 text-white rounded p-2 ml-2">Filter</button>
    </div>
  );
}