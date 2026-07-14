/**
 * MemberContactScreen — VNS PickleTrack
 * Liên hệ Coach / Admin
 */
import { useState } from 'react';
import {
  ArrowLeft, Send, Phone, MessageSquare,
  Star, MapPin, ChevronRight, CheckCircle2, Clock
} from 'lucide-react';

const CONTACTS = [
  {
    id: 1,
    role:    'Huấn luyện viên',
    name:    'Coach Nam',
    initials:'CN',
    class:   'Beginner A',
    phone:   '0912 345 678',
    online:  true,
    color:   '#0E7C7B',
  },
  {
    id: 2,
    role:    'Quản trị viên',
    name:    'Admin VNS',
    initials:'AD',
    class:   'Tất cả các lớp',
    phone:   '0900 111 222',
    online:  false,
    color:   '#264653',
  },
];

const QUICK_QUESTIONS = [
  'Tôi cần điều chỉnh lịch học.',
  'Tôi muốn hỏi về kỹ thuật học.',
  'Tôi muốn gia hạn gói học.',
  'Tôi bị trễ buổi học hôm nay.',
  'Tôi cần xin nghỉ buổi học.',
  'Câu hỏi khác...',
];

interface MemberContactScreenProps {
  onBack: () => void;
}

export function MemberContactScreen({ onBack }: MemberContactScreenProps) {
  const [recipient, setRecipient] = useState<number | null>(1);
  const [message,   setMessage]   = useState('');
  const [quickQ,    setQuickQ]    = useState('');
  const [sent,      setSent]      = useState(false);

  const finalMsg  = message.trim() || quickQ;
  const canSend   = recipient !== null && finalMsg.length > 0 && !sent;
  const chosenContact = CONTACTS.find(c => c.id === recipient);

  function handleSend() {
    if (!canSend) return;
    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex flex-col h-screen items-center justify-center px-8" style={{ background:'#F7F9FA' }}>
        <div
          className="flex items-center justify-center rounded-full mb-6"
          style={{ width:96, height:96, background:'rgba(42,157,143,0.12)', border:'2px solid rgba(42,157,143,0.22)' }}
        >
          <div className="flex items-center justify-center rounded-full" style={{ width:72, height:72, background:'rgba(42,157,143,0.2)' }}>
            <CheckCircle2 style={{ width:34, height:34, color:'#2A9D8F' }} />
          </div>
        </div>
        <h2 style={{ fontSize:22, fontWeight:900, color:'#0E7C7B', textAlign:'center' }}>Đã gửi!</h2>
        <p style={{ fontSize:13, color:'#6B7280', textAlign:'center', marginTop:8, lineHeight:1.6, maxWidth:260 }}>
          Tin nhắn của bạn đã được gửi đến <strong>{chosenContact?.name}</strong>. Họ sẽ phản hồi sớm nhất có thể.
        </p>
        <div className="flex items-center gap-1.5 mt-4 px-3 py-2 rounded-xl" style={{ background:'rgba(42,157,143,0.08)' }}>
          <Clock style={{ width:12, height:12, color:'#2A9D8F' }} />
          <span style={{ fontSize:11, color:'#2A9D8F', fontWeight:600 }}>Thường phản hồi trong 1–2 giờ</span>
        </div>
        <button
          onClick={onBack}
          className="mt-8 px-8 py-3.5 rounded-2xl active:scale-95 transition-all"
          style={{ background:'linear-gradient(135deg,#0E7C7B,#2A9D8F)', boxShadow:'0 8px 24px rgba(14,124,123,0.35)' }}
        >
          <span style={{ fontSize:15, fontWeight:900, color:'white' }}>Về trang chủ</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen" style={{ background:'#F7F9FA' }}>

      {/* ── Header ── */}
      <div className="flex-shrink-0 relative overflow-hidden"
           style={{ background:'linear-gradient(145deg,#054A49 0%,#0E7C7B 100%)' }}>
        <div className="absolute pointer-events-none" style={{ top:-20,right:-10,width:110,height:110,borderRadius:'50%',background:'rgba(255,255,255,0.05)' }} />
        <div className="flex items-center gap-3 px-4 pt-12 pb-5">
          <button onClick={onBack}
                  className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-90 transition-transform"
                  style={{ background:'rgba(255,255,255,0.18)' }}>
            <ArrowLeft style={{ width:18, height:18, color:'white' }} />
          </button>
          <div>
            <p style={{ fontSize:11, color:'rgba(255,255,255,0.55)', fontWeight:600 }}>LIÊN HỆ</p>
            <h1 style={{ fontSize:20, fontWeight:900, color:'white' }}>Liên hệ Coach / Admin</h1>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 overflow-y-auto pb-36">
        <div className="px-4 pt-4 space-y-4">

          {/* Recipient selection */}
          <div>
            <p style={{ fontSize:11, fontWeight:800, color:'#6B7280', letterSpacing:'0.05em', marginBottom:10 }}>GỬI ĐẾN</p>
            <div className="space-y-2.5">
              {CONTACTS.map(contact => {
                const isSelected = recipient === contact.id;
                return (
                  <button
                    key={contact.id}
                    onClick={() => setRecipient(contact.id)}
                    className="w-full text-left transition-all"
                  >
                    <div
                      className="flex items-center gap-3.5 bg-white rounded-2xl px-4 py-4"
                      style={{
                        border:    `2px solid ${isSelected ? contact.color : 'rgba(0,0,0,0.08)'}`,
                        background: isSelected ? `${contact.color}08` : 'white',
                        boxShadow:  isSelected ? `0 6px 18px ${contact.color}22` : '0 2px 8px rgba(0,0,0,0.04)',
                        transition: 'all 0.2s',
                      }}
                    >
                      {/* radio */}
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ border:`2px solid ${isSelected ? contact.color : 'rgba(0,0,0,0.2)'}`, background: isSelected ? contact.color : 'transparent' }}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>

                      {/* Avatar */}
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 relative"
                        style={{ background:`${contact.color}18`, border:`2px solid ${contact.color}30`, fontSize:13, fontWeight:900, color: contact.color }}
                      >
                        {contact.initials}
                        {/* online dot */}
                        {contact.online && (
                          <div
                            className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full"
                            style={{ background:'#2A9D8F', border:'2px solid white' }}
                          />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p style={{ fontSize:14, fontWeight:900, color: isSelected ? contact.color : '#1F2933' }}>{contact.name}</p>
                          {contact.online && (
                            <span className="px-1.5 py-0.5 rounded-full" style={{ fontSize:8, fontWeight:800, background:'rgba(42,157,143,0.15)', color:'#2A9D8F' }}>Online</span>
                          )}
                        </div>
                        <p style={{ fontSize:11, color:'#9CA3AF' }}>{contact.role} · {contact.class}</p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Phone style={{ width:13, height:13, color:'#9CA3AF' }} />
                        <span style={{ fontSize:11, color:'#9CA3AF' }}>{contact.phone}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick questions */}
          <div>
            <p style={{ fontSize:11, fontWeight:800, color:'#6B7280', letterSpacing:'0.05em', marginBottom:10 }}>CHỦ ĐỀ NHANH</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_QUESTIONS.map(q => {
                const active = quickQ === q && !message.trim();
                return (
                  <button
                    key={q}
                    onClick={() => { setQuickQ(q === quickQ ? '' : q); setMessage(''); }}
                    className="px-3 py-2 rounded-xl active:scale-95 transition-all"
                    style={{
                      fontSize:11, fontWeight: active ? 700 : 500,
                      background: active ? 'rgba(14,124,123,0.1)' : 'rgba(0,0,0,0.05)',
                      border:     `1.5px solid ${active ? 'rgba(14,124,123,0.3)' : 'transparent'}`,
                      color:      active ? '#0E7C7B' : '#6B7280',
                    }}
                  >
                    {active && '✓ '}{q}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Message input */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare style={{ width:13, height:13, color:'#6B7280' }} />
              <p style={{ fontSize:11, fontWeight:800, color:'#6B7280', letterSpacing:'0.05em' }}>TIN NHẮN</p>
            </div>
            <div
              className="bg-white rounded-2xl overflow-hidden"
              style={{ border:'1.5px solid rgba(0,0,0,0.09)', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}
            >
              <textarea
                value={message}
                onChange={e => { setMessage(e.target.value); setQuickQ(''); }}
                placeholder={`Nhắn tin cho ${chosenContact?.name ?? 'Coach / Admin'}...`}
                rows={4}
                className="w-full resize-none focus:outline-none px-4 py-3"
                style={{ fontSize:13, color:'#1F2933', lineHeight:1.6, background:'transparent', border:'none' }}
              />
              <div className="flex justify-end px-4 pb-2.5">
                <span style={{ fontSize:10, color:'#C0C7D0' }}>{message.length}/300</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Fixed footer ── */}
      <div
        className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto px-4 pb-8 pt-3 bg-white"
        style={{ borderTop:'1px solid rgba(0,0,0,0.08)', boxShadow:'0 -8px 24px rgba(0,0,0,0.08)' }}
      >
        <button
          onClick={handleSend}
          disabled={!canSend}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl transition-all active:scale-95"
          style={{
            background: canSend ? 'linear-gradient(135deg,#0E7C7B 0%,#2A9D8F 100%)' : 'rgba(0,0,0,0.07)',
            boxShadow:  canSend ? '0 8px 24px rgba(14,124,123,0.4)' : 'none',
          }}
        >
          <Send style={{ width:17, height:17, color: canSend ? 'white' : '#9CA3AF' }} />
          <span style={{ fontSize:15, fontWeight:900, color: canSend ? 'white' : '#9CA3AF' }}>
            Gửi tin nhắn{chosenContact ? ` đến ${chosenContact.name}` : ''}
          </span>
        </button>
      </div>
    </div>
  );
}
