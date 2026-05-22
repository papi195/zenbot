type Props = {
  role: 'user' | 'assistant';
  content: string;
};

export default function MessageBubble({ role, content }: Props) {
  const isUser = role === 'user';

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', maxWidth: 'min(75%, 520px)', alignSelf: isUser ? 'flex-end' : 'flex-start', flexDirection: isUser ? 'row-reverse' : 'row' }}>
      <div style={{ width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0, background: isUser ? '#e8f0fe' : '#e8f5ee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
        {isUser ? '👤' : '🌿'}
      </div>
      <div style={{ padding: '10px 14px', fontSize: '13px', lineHeight: '1.6', whiteSpace: 'pre-line', wordBreak: 'break-word', borderRadius: '18px', borderBottomRightRadius: isUser ? '4px' : '18px', borderBottomLeftRadius: isUser ? '18px' : '4px', background: isUser ? '#2d6a4f' : '#fff', color: isUser ? '#fff' : '#2c3e35', border: isUser ? 'none' : '1px solid #ddeee6' }}>
        {content}
      </div>
    </div>
  );
}