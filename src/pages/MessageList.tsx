import MessageLayout from '@/components/MessageLayout';
import { Mail } from 'lucide-react';

const MessageList = () => {
  return (
    <MessageLayout>
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 animate-fade-in">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Mail className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-700 mb-1">쪽지를 선택하세요</h3>
        <p className="text-sm text-slate-500 text-center max-w-xs">
          좌측 목록에서 확인하고 싶은 쪽지를 클릭하여 내용을 확인하실 수 있습니다.
        </p>
      </div>
    </MessageLayout>
  );
};

export default MessageList;
