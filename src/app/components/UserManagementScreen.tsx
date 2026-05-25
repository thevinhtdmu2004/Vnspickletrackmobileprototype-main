import {
  ArrowLeft, Plus, User, ShieldCheck, Dumbbell, Edit2,
  KeyRound, Lock, Unlock, Clock, MoreVertical, CheckCircle2,
  XCircle
} from 'lucide-react';
import { useState } from 'react';

interface UserManagementScreenProps {
  onBack: () => void;
  onAddUser: () => void;
  onEditUser: (userId: number) => void;
}

interface AppUser {
  id: number;
  username: string;
  displayName: string;
  role: 'Admin' | 'Coach';
  status: 'active' | 'locked';
  lastLogin?: string;
}

const USERS: AppUser[] = [
  {
    id: 1,
    username: 'admin',
    displayName: 'Admin',
    role: 'Admin',
    status: 'active',
    lastLogin: '29/04/2026 08:30',
  },
  {
    id: 2,
    username: 'coach',
    displayName: 'Coach Nam',
    role: 'Coach',
    status: 'active',
    lastLogin: '29/04/2026 17:50',
  },
  {
    id: 3,
    username: 'coachhung',
    displayName: 'Coach Hùng',
    role: 'Coach',
    status: 'locked',
    lastLogin: '25/04/2026 14:20',
  },
];

export function UserManagementScreen({ onBack, onAddUser, onEditUser }: UserManagementScreenProps) {
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);

  function handleToggleExpand(userId: number) {
    setExpandedUserId(expandedUserId === userId ? null : userId);
  }

  const activeUsers = USERS.filter(u => u.status === 'active');
  const lockedUsers = USERS.filter(u => u.status === 'locked');

  return (
    <div className="flex flex-col h-screen bg-[#F7F9FA]">
      {/* ══ Header ══ */}
      <div
        className="flex-shrink-0 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg,#054A49 0%,#075E5D 50%,#0E7C7B 100%)' }}
      >
        <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute top-14 -right-3 w-20 h-20 rounded-full bg-white/4 pointer-events-none" />

        <div className="flex items-center gap-3 px-4 pt-10 pb-6">
          <button
            onClick={onBack}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/15 active:bg-white/25 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white" style={{ fontSize: '18px', fontWeight: 700 }}>
              Người dùng
            </h1>
            <p className="text-white/60" style={{ fontSize: '11px' }}>
              {USERS.length} tài khoản
            </p>
          </div>
          <button
            onClick={onAddUser}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/15 active:bg-white/25 transition-colors flex-shrink-0"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* ══ Scrollable body ══ */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        
        {/* Active Users */}
        {activeUsers.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 px-1">
              Đang hoạt động ({activeUsers.length})
            </p>
            <div className="space-y-3">
              {activeUsers.map(user => (
                <UserCard
                  key={user.id}
                  user={user}
                  isExpanded={expandedUserId === user.id}
                  onToggleExpand={() => handleToggleExpand(user.id)}
                  onEdit={() => onEditUser(user.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Locked Users */}
        {lockedUsers.length > 0 && (
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 px-1">
              Tạm khóa ({lockedUsers.length})
            </p>
            <div className="space-y-3">
              {lockedUsers.map(user => (
                <UserCard
                  key={user.id}
                  user={user}
                  isExpanded={expandedUserId === user.id}
                  onToggleExpand={() => handleToggleExpand(user.id)}
                  onEdit={() => onEditUser(user.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── User Card Component ── */
interface UserCardProps {
  user: AppUser;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
}

function UserCard({ user, isExpanded, onToggleExpand, onEdit }: UserCardProps) {
  const isActive = user.status === 'active';
  const isAdmin = user.role === 'Admin';

  function handleResetPin() {
    console.log('Reset PIN for user:', user.id);
    alert(`Đặt lại PIN cho ${user.displayName}`);
  }

  function handleToggleLock() {
    console.log('Toggle lock for user:', user.id);
    const action = isActive ? 'Khóa' : 'Mở khóa';
    alert(`${action} tài khoản ${user.displayName}`);
  }

  return (
    <div
      className="bg-white rounded-2xl border shadow-sm overflow-hidden transition-all"
      style={{
        borderColor: isActive ? '#E5E7EB' : '#F3F4F6',
        opacity: isActive ? 1 : 0.75,
      }}
    >
      {/* Card Header */}
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          {/* Avatar */}
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              background: isAdmin
                ? 'linear-gradient(135deg, #815AD5, #9B7FE8)'
                : 'linear-gradient(135deg, #F4A261, #F7B984)',
            }}
          >
            {isAdmin ? (
              <ShieldCheck className="w-6 h-6 text-white" />
            ) : (
              <Dumbbell className="w-6 h-6 text-white" />
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-gray-900 mb-0.5">
              {user.displayName}
            </h3>
            <p className="text-xs text-gray-500 mb-2">
              @{user.username}
            </p>

            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Role Badge */}
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                style={{
                  background: isAdmin ? 'rgba(129,90,213,0.1)' : 'rgba(244,162,97,0.1)',
                }}
              >
                {isAdmin ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-[#815AD5]" />
                ) : (
                  <Dumbbell className="w-3.5 h-3.5 text-[#F4A261]" />
                )}
                <span
                  className="text-xs font-bold"
                  style={{ color: isAdmin ? '#815AD5' : '#F4A261' }}
                >
                  {user.role}
                </span>
              </div>

              {/* Status Badge */}
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                style={{
                  background: isActive ? 'rgba(42,157,143,0.1)' : 'rgba(156,163,175,0.15)',
                }}
              >
                {isActive ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2A9D8F]" />
                    <span className="text-xs font-bold text-[#2A9D8F]">Đang hoạt động</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-xs font-bold text-gray-500">Tạm khóa</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Menu Button */}
          <button
            onClick={onToggleExpand}
            className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200
              flex items-center justify-center transition-all flex-shrink-0"
            style={{
              transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
            }}
          >
            <MoreVertical className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Last Login */}
        {user.lastLogin && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50">
            <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <p className="text-xs text-gray-600">
              Đăng nhập lần cuối: <span className="font-semibold">{user.lastLogin}</span>
            </p>
          </div>
        )}
      </div>

      {/* Expanded Actions */}
      {isExpanded && (
        <div
          className="border-t p-3"
          style={{ background: 'rgba(249,250,251,0.9)', borderColor: '#F3F4F6' }}
        >
          <div className="space-y-2">
            {/* Edit */}
            <button
              onClick={onEdit}
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200
                hover:bg-gray-50 active:bg-gray-100 transition-colors
                flex items-center gap-3"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(14,124,123,0.1)' }}
              >
                <Edit2 className="w-4 h-4 text-[#0E7C7B]" />
              </div>
              <span className="text-sm font-semibold text-gray-900">Chỉnh sửa</span>
            </button>

            {/* Reset PIN */}
            <button
              onClick={handleResetPin}
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200
                hover:bg-gray-50 active:bg-gray-100 transition-colors
                flex items-center gap-3"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(244,162,97,0.1)' }}
              >
                <KeyRound className="w-4 h-4 text-[#F4A261]" />
              </div>
              <span className="text-sm font-semibold text-gray-900">Đặt lại PIN</span>
            </button>

            {/* Lock / Unlock */}
            <button
              onClick={handleToggleLock}
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200
                hover:bg-gray-50 active:bg-gray-100 transition-colors
                flex items-center gap-3"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: isActive ? 'rgba(231,111,81,0.1)' : 'rgba(42,157,143,0.1)',
                }}
              >
                {isActive ? (
                  <Lock className="w-4 h-4 text-[#E76F51]" />
                ) : (
                  <Unlock className="w-4 h-4 text-[#2A9D8F]" />
                )}
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {isActive ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}