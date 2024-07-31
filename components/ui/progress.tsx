// components/ui/progress.tsx

interface ProgressProps {
    value: number;
    total: number;
  }
  
  export const Progress = ({ value, total }: ProgressProps) => {
    const percentage = total > 0 ? (value / total) * 100 : 0;
  
    return (
      <div className="relative w-full h-4 bg-gray-200 rounded">
        <div
          className="absolute top-0 left-0 h-full bg-blue-500 rounded"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    );
  };
  