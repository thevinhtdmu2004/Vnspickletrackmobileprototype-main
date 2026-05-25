import { Search, CheckCircle2, XCircle, AlertTriangle, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export function AttendancePage() {
  const [selectedClass, setSelectedClass] = useState('class1');
  const [searchQuery, setSearchQuery] = useState('');

  const classes = [
    { id: 'class1', name: 'Lớp Cơ bản A1', time: '07:00 - 08:30', students: 8 },
    { id: 'class2', name: 'Lớp Nâng cao B2', time: '09:00 - 10:30', students: 6 },
    { id: 'class3', name: 'Lớp Cơ bản A2', time: '17:00 - 18:30', students: 10 },
  ];

  const students = [
    { id: 1, name: 'Nguyễn Văn A', avatar: 'A', remaining: 8, status: 'present', warning: false },
    { id: 2, name: 'Trần Thị B', avatar: 'B', remaining: 12, status: 'present', warning: false },
    { id: 3, name: 'Lê Văn C', avatar: 'C', remaining: 2, status: 'absent', warning: true },
    { id: 4, name: 'Phạm Thị D', avatar: 'D', remaining: 15, status: 'present', warning: false },
    { id: 5, name: 'Hoàng Văn E', avatar: 'E', remaining: 3, status: 'present', warning: true },
    { id: 6, name: 'Võ Thị F', avatar: 'F', remaining: 10, status: null, warning: false },
    { id: 7, name: 'Đặng Văn G', avatar: 'G', remaining: 6, status: null, warning: false },
    { id: 8, name: 'Ngô Thị H', avatar: 'H', remaining: 1, status: null, warning: true },
  ];

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4 pb-20">
      <div className="bg-primary text-primary-foreground p-6 rounded-b-3xl shadow-lg">
        <h1 className="text-xl mb-4">Điểm danh</h1>

        <div className="space-y-2">
          {classes.map((cls) => (
            <button
              key={cls.id}
              onClick={() => setSelectedClass(cls.id)}
              className={`w-full text-left p-4 rounded-xl transition-all ${
                selectedClass === cls.id
                  ? 'bg-white text-primary shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{cls.name}</p>
                  <p className={`text-sm ${selectedClass === cls.id ? 'text-primary/70' : 'text-white/70'}`}>
                    {cls.time}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${selectedClass === cls.id ? 'text-primary' : 'text-white'}`}>
                    {cls.students} học viên
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="px-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm học viên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-muted-foreground">{filteredStudents.length} học viên</p>
          <button className="text-sm text-primary">Điểm danh tất cả</button>
        </div>

        <div className="space-y-3">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              className={`bg-card border rounded-xl p-4 shadow-sm ${
                student.warning ? 'border-warning' : 'border-border'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center font-semibold">
                  {student.avatar}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{student.name}</p>
                    {student.warning && (
                      <AlertTriangle className="w-4 h-4 text-warning" />
                    )}
                  </div>
                  <p className={`text-sm ${student.warning ? 'text-warning' : 'text-muted-foreground'}`}>
                    Còn {student.remaining} buổi
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {}}
                    className={`p-2 rounded-lg transition-colors ${
                      student.status === 'present'
                        ? 'bg-success text-success-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-success/20'
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {}}
                    className={`p-2 rounded-lg transition-colors ${
                      student.status === 'absent'
                        ? 'bg-destructive text-destructive-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-destructive/20'
                    }`}
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
