import { Search, Plus, Phone, Award, TrendingUp, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface StudentsListScreenProps {
  onAddStudent: () => void;
  onStudentDetail: () => void;
}

type FilterType = 'all' | 'active' | 'expiring' | 'paused' | 'inactive';

interface Student {
  id: number;
  name: string;
  phone: string;
  class: string;
  total: number;
  attended: number;
  remaining: number;
  status: 'active' | 'expiring' | 'expired' | 'paused' | 'inactive';
}

export function StudentsListScreen({ onAddStudent, onStudentDetail }: StudentsListScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const allStudents: Student[] = [
    { id: 1, name: 'Nguyễn Văn A', phone: '0901234567', class: 'Beginner A', total: 12, attended: 5, remaining: 7, status: 'active' },
    { id: 2, name: 'Trần Thị B', phone: '0901234568', class: 'Beginner A', total: 12, attended: 10, remaining: 2, status: 'expiring' },
    { id: 3, name: 'Lê Văn C', phone: '0901234569', class: 'Intermediate B', total: 8, attended: 8, remaining: 0, status: 'expired' },
    { id: 4, name: 'Phạm Thị D', phone: '0901234570', class: 'Beginner A', total: 24, attended: 8, remaining: 16, status: 'active' },
    { id: 5, name: 'Hoàng Văn E', phone: '0901234571', class: 'Beginner A', total: 12, attended: 9, remaining: 3, status: 'expiring' },
    { id: 6, name: 'Võ Thị F', phone: '0901234572', class: 'Intermediate B', total: 12, attended: 0, remaining: 12, status: 'paused' },
    { id: 7, name: 'Đặng Văn G', phone: '0901234573', class: 'Advanced C', total: 12, attended: 12, remaining: 0, status: 'inactive' },
    { id: 8, name: 'Ngô Thị H', phone: '0901234574', class: 'Beginner A', total: 12, attended: 11, remaining: 1, status: 'expiring' },
  ];

  const filters = [
    { id: 'all', label: 'Tất cả', count: allStudents.length },
    { id: 'active', label: 'Đang học', count: allStudents.filter(s => s.status === 'active').length },
    { id: 'expiring', label: 'Sắp hết buổi', count: allStudents.filter(s => s.status === 'expiring').length },
    { id: 'paused', label: 'Tạm nghỉ', count: allStudents.filter(s => s.status === 'paused').length },
    { id: 'inactive', label: 'Đã nghỉ', count: allStudents.filter(s => s.status === 'inactive' || s.status === 'expired').length },
  ];

  const filteredStudents = allStudents.filter(student => {
    // Search filter
    const matchesSearch = searchQuery === '' ||
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.phone.includes(searchQuery);

    // Status filter
    const matchesFilter = activeFilter === 'all' ||
      (activeFilter === 'active' && student.status === 'active') ||
      (activeFilter === 'expiring' && student.status === 'expiring') ||
      (activeFilter === 'paused' && student.status === 'paused') ||
      (activeFilter === 'inactive' && (student.status === 'inactive' || student.status === 'expired'));

    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: Student['status'], remaining: number) => {
    switch (status) {
      case 'active':
        return <span className="bg-success/10 text-success text-xs px-2.5 py-1 rounded-full font-medium">Đang học</span>;
      case 'expiring':
        return (
          <span className="bg-warning/10 text-warning text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Sắp hết buổi
          </span>
        );
      case 'expired':
        return (
          <span className="bg-destructive/10 text-destructive text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Hết buổi
          </span>
        );
      case 'paused':
        return <span className="bg-muted text-muted-foreground text-xs px-2.5 py-1 rounded-full font-medium">Tạm nghỉ</span>;
      case 'inactive':
        return <span className="bg-muted text-muted-foreground text-xs px-2.5 py-1 rounded-full font-medium">Đã nghỉ</span>;
    }
  };

  return (
    <div className="flex flex-col h-screen pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-medium">Học viên</h1>
          <button
            onClick={onAddStudent}
            className="bg-white text-primary p-2 rounded-full shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
          <input
            type="text"
            placeholder="Tìm tên / số điện thoại"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white text-foreground placeholder:text-primary/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-white shadow-sm"
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="bg-background border-b border-border">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 px-4 py-3 min-w-max">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id as FilterType)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeFilter === filter.id
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-card border border-border text-foreground hover:bg-muted'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {filteredStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Search className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">Không tìm thấy học viên</h3>
            <p className="text-sm text-muted-foreground">
              Thử tìm kiếm với từ khóa khác hoặc thay đổi bộ lọc
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-3">
              {filteredStudents.length} học viên
            </p>

            <div className="space-y-3">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  onClick={onStudentDetail}
                  className={`bg-card rounded-xl p-4 shadow-sm border transition-all cursor-pointer hover:shadow-md ${
                    student.status === 'expired' ? 'border-destructive/50 bg-destructive/5' :
                    student.status === 'expiring' ? 'border-warning/50 bg-warning/5' :
                    'border-border hover:border-primary/30'
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium mb-1 text-base">{student.name}</h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{student.class}</span>
                        <span className="text-muted-foreground/50">•</span>
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          <span>{student.phone}</span>
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(student.status, student.remaining)}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="bg-muted/50 rounded-lg p-2.5 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Tổng</p>
                      <p className="font-semibold">{student.total}</p>
                    </div>
                    <div className="bg-primary/5 rounded-lg p-2.5 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Đã học</p>
                      <p className="font-semibold text-primary">{student.attended}</p>
                    </div>
                    <div className={`rounded-lg p-2.5 text-center ${
                      student.remaining === 0 ? 'bg-destructive/10' :
                      student.remaining <= 3 ? 'bg-warning/10' :
                      'bg-success/10'
                    }`}>
                      <p className="text-xs text-muted-foreground mb-1">Còn</p>
                      <p className={`font-semibold ${
                        student.remaining === 0 ? 'text-destructive' :
                        student.remaining <= 3 ? 'text-warning' :
                        'text-success'
                      }`}>
                        {student.remaining}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          student.remaining === 0 ? 'bg-destructive' :
                          student.remaining <= 3 ? 'bg-warning' :
                          'bg-primary'
                        }`}
                        style={{ width: `${(student.attended / student.total) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5 text-right">
                      {Math.round((student.attended / student.total) * 100)}% hoàn thành
                    </p>
                  </div>

                  {/* Warning for expiring students */}
                  {student.status === 'expiring' && (
                    <div className="mt-3 pt-3 border-t border-warning/20">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle renew package
                        }}
                        className="w-full bg-accent text-accent-foreground py-2 rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
                      >
                        <Award className="w-4 h-4" />
                        Gia hạn gói học
                      </button>
                    </div>
                  )}

                  {/* Warning for expired students */}
                  {student.status === 'expired' && (
                    <div className="mt-3 pt-3 border-t border-destructive/20">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle renew package
                        }}
                        className="w-full bg-accent text-accent-foreground py-2 rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
                      >
                        <Award className="w-4 h-4" />
                        Gia hạn gói học
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
