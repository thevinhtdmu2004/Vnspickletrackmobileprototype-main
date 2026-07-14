import { Users, Plus } from 'lucide-react';

interface EmptyStateStudentsProps {
  onAddStudent: () => void;
}

export function EmptyStateStudents({ onAddStudent }: EmptyStateStudentsProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <Users className="w-16 h-16 text-primary" />
      </div>
      <h2 className="text-xl font-medium mb-2">Chưa có học viên</h2>
      <p className="text-muted-foreground mb-8 max-w-sm">
        Bắt đầu bằng cách thêm học viên đầu tiên vào hệ thống
      </p>
      <button
        onClick={onAddStudent}
        className="bg-primary text-primary-foreground px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Thêm học viên đầu tiên
      </button>
    </div>
  );
}
