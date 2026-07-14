import { Search, Plus, AlertTriangle, Phone, Mail } from 'lucide-react';
import { useState } from 'react';

export function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const students = [
    { id: 1, name: 'Nguyễn Văn A', phone: '0901234567', email: 'vana@email.com', package: 'Gói 12 buổi', remaining: 8, status: 'active' },
    { id: 2, name: 'Trần Thị B', phone: '0901234568', email: 'thib@email.com', package: 'Gói 24 buổi', remaining: 12, status: 'active' },
    { id: 3, name: 'Lê Văn C', phone: '0901234569', email: 'vanc@email.com', package: 'Gói 12 buổi', remaining: 2, status: 'warning' },
    { id: 4, name: 'Phạm Thị D', phone: '0901234570', email: 'thid@email.com', package: 'Gói 36 buổi', remaining: 15, status: 'active' },
    { id: 5, name: 'Hoàng Văn E', phone: '0901234571', email: 'vane@email.com', package: 'Gói 12 buổi', remaining: 3, status: 'warning' },
    { id: 6, name: 'Võ Thị F', phone: '0901234572', email: 'thif@email.com', package: 'Gói 24 buổi', remaining: 10, status: 'active' },
    { id: 7, name: 'Đặng Văn G', phone: '0901234573', email: 'vang@email.com', package: 'Gói 12 buổi', remaining: 0, status: 'expired' },
    { id: 8, name: 'Ngô Thị H', phone: '0901234574', email: 'thih@email.com', package: 'Gói 12 buổi', remaining: 1, status: 'warning' },
  ];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.phone.includes(searchQuery);
    const matchesFilter = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col gap-4 pb-20">
      <div className="bg-primary text-primary-foreground p-6 rounded-b-3xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl">Học viên</h1>
          <button className="bg-white text-primary p-2 rounded-full shadow-md hover:shadow-lg transition-shadow">
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc SĐT..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white text-primary placeholder:text-primary/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>
      </div>

      <div className="px-4">
        <div className="flex gap-2 overflow-x-auto mb-4 pb-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              filterStatus === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-foreground'
            }`}
          >
            Tất cả ({students.length})
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              filterStatus === 'active'
                ? 'bg-success text-success-foreground'
                : 'bg-card border border-border text-foreground'
            }`}
          >
            Đang học ({students.filter(s => s.status === 'active').length})
          </button>
          <button
            onClick={() => setFilterStatus('warning')}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              filterStatus === 'warning'
                ? 'bg-warning text-warning-foreground'
                : 'bg-card border border-border text-foreground'
            }`}
          >
            Sắp hết ({students.filter(s => s.status === 'warning').length})
          </button>
          <button
            onClick={() => setFilterStatus('expired')}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              filterStatus === 'expired'
                ? 'bg-destructive text-destructive-foreground'
                : 'bg-card border border-border text-foreground'
            }`}
          >
            Đã hết ({students.filter(s => s.status === 'expired').length})
          </button>
        </div>

        <div className="space-y-3">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              className={`bg-card border rounded-xl p-4 shadow-sm ${
                student.status === 'warning' ? 'border-warning' :
                student.status === 'expired' ? 'border-destructive' :
                'border-border'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                  {student.name.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium truncate">{student.name}</h3>
                    {student.status === 'warning' && (
                      <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0" />
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mb-2">{student.package}</p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      <span>{student.phone}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${
                      student.status === 'expired' ? 'text-destructive' :
                      student.status === 'warning' ? 'text-warning' :
                      'text-success'
                    }`}>
                      {student.remaining > 0 ? `Còn ${student.remaining} buổi` : 'Đã hết buổi'}
                    </span>

                    {student.status === 'warning' || student.status === 'expired' ? (
                      <button className="bg-accent text-accent-foreground px-4 py-1.5 rounded-lg text-sm">
                        Gia hạn
                      </button>
                    ) : (
                      <button className="text-primary text-sm">Xem chi tiết</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
