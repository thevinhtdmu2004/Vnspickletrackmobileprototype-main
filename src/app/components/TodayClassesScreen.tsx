import { Calendar, MapPin, Users, ClipboardCheck, Plus, Clock } from 'lucide-react';

interface TodayClassesScreenProps {
  onAttendance: () => void;
  onCreateClass: () => void;
}

export function TodayClassesScreen({ onAttendance, onCreateClass }: TodayClassesScreenProps) {
  const hasClasses = true; // Toggle to false to see empty state

  const classes = [
    {
      id: 1,
      time: '07:00 - 08:30',
      name: 'Beginner A1',
      court: 'Sân 1',
      coach: 'Coach Nam',
      students: 8,
      maxStudents: 10,
      status: 'completed',
    },
    {
      id: 2,
      time: '09:00 - 10:30',
      name: 'Intermediate B2',
      court: 'Sân 2',
      coach: 'Coach Nam',
      students: 6,
      maxStudents: 8,
      status: 'ongoing',
    },
    {
      id: 3,
      time: '17:00 - 18:30',
      name: 'Beginner A2',
      court: 'Sân 1',
      coach: 'Coach Hùng',
      students: 10,
      maxStudents: 12,
      status: 'upcoming',
    },
    {
      id: 4,
      time: '18:00 - 19:30',
      name: 'Beginner A',
      court: 'Sân 1',
      coach: 'Coach Nam',
      students: 8,
      maxStudents: 10,
      status: 'upcoming',
    },
    {
      id: 5,
      time: '19:30 - 21:00',
      name: 'Intermediate B',
      court: 'Sân 2',
      coach: 'Coach Hùng',
      students: 6,
      maxStudents: 8,
      status: 'upcoming',
    },
  ];

  return (
    <div className="flex flex-col h-screen pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-medium">Lớp hôm nay</h1>
          <div className="bg-white/20 p-2 rounded-lg">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
        <p className="text-sm opacity-90">Thứ Ba, 29/04/2026</p>
      </div>

      {hasClasses ? (
        <>
          {/* Classes List */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">{classes.length} buổi học</p>
              <button
                onClick={onCreateClass}
                className="text-sm text-primary font-medium flex items-center gap-1 hover:underline"
              >
                <Plus className="w-4 h-4" />
                Tạo buổi học
              </button>
            </div>

            <div className="space-y-3">
              {classes.map((classItem) => (
                <div
                  key={classItem.id}
                  className={`bg-card rounded-xl p-4 shadow-sm transition-all ${
                    classItem.status === 'ongoing'
                      ? 'border-2 border-primary shadow-md'
                      : classItem.status === 'completed'
                      ? 'border border-success/30 bg-success/5'
                      : 'border border-border'
                  }`}
                >
                  {/* Time & Status */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Clock className={`w-5 h-5 ${
                        classItem.status === 'ongoing' ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                      <span className={`font-semibold ${
                        classItem.status === 'ongoing' ? 'text-primary' : 'text-foreground'
                      }`}>
                        {classItem.time}
                      </span>
                    </div>
                    {classItem.status === 'ongoing' && (
                      <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-medium">
                        Đang diễn ra
                      </span>
                    )}
                    {classItem.status === 'completed' && (
                      <span className="bg-success/10 text-success text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                        <ClipboardCheck className="w-3 h-3" />
                        Đã điểm danh
                      </span>
                    )}
                  </div>

                  {/* Class Name */}
                  <h3 className="text-lg font-medium mb-2">{classItem.name}</h3>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{classItem.court}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span className={classItem.students >= classItem.maxStudents ? 'text-warning font-medium' : ''}>
                        {classItem.students}/{classItem.maxStudents} học viên
                      </span>
                    </div>
                    <div className="col-span-2 text-sm text-muted-foreground">
                      {classItem.coach}
                    </div>
                  </div>

                  {/* Action Button */}
                  {classItem.status !== 'completed' ? (
                    <button
                      onClick={onAttendance}
                      className={`w-full py-3.5 rounded-xl font-medium shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${
                        classItem.status === 'ongoing'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-primary/10 text-primary hover:bg-primary/20'
                      }`}
                    >
                      <ClipboardCheck className="w-5 h-5" />
                      {classItem.status === 'ongoing' ? 'Điểm danh ngay' : 'Điểm danh'}
                    </button>
                  ) : (
                    <button
                      className="w-full py-3 rounded-xl font-medium bg-muted text-muted-foreground flex items-center justify-center gap-2 hover:bg-muted/80 transition-colors"
                    >
                      Xem chi tiết
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Floating Add Button */}
          <button
            onClick={onCreateClass}
            className="fixed bottom-24 right-6 bg-accent text-accent-foreground w-14 h-14 rounded-full shadow-xl hover:shadow-2xl transition-all flex items-center justify-center active:scale-95"
          >
            <Plus className="w-6 h-6" />
          </button>
        </>
      ) : (
        // Empty State
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center">
            <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-16 h-16 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-medium mb-2">Hôm nay chưa có buổi học nào</h2>
            <p className="text-muted-foreground mb-8 max-w-sm">
              Tạo buổi học mới từ danh sách lớp hoặc thêm buổi học riêng lẻ
            </p>
            <button
              onClick={onCreateClass}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              Tạo buổi học từ lớp
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
