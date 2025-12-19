import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { getMessages } from '@/data/messages';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, ArrowRight } from 'lucide-react';

const MessageWidget = () => {
    const navigate = useNavigate();
    const { userName, team, rank, spamMessageDeleted, securityMessageTriggered } = useUserStore();

    const allMessages = getMessages(userName, team, rank, securityMessageTriggered);

    const messages = spamMessageDeleted
        ? allMessages.filter(m => m.id !== '2')
        : allMessages;

    const handleMessageClick = (messageId: string) => {
        navigate(`/messages/${messageId}`);
    };

    return (
        <Card className="border-none shadow-md bg-white h-full flex flex-col">
            <CardHeader className="pb-3 border-b border-slate-50">
                <CardTitle
                    className="flex items-center justify-between text-base cursor-pointer group"
                    onClick={() => navigate('/messages')}
                >
                    <div className="flex items-center gap-2 text-slate-800 group-hover:text-primary transition-colors">
                        <Mail className="h-5 w-5 text-primary" />
                        <span>쪽지함</span>
                    </div>
                    <Badge variant="secondary" className="bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                        {messages.length}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-4">
                <div className="space-y-3">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            onClick={() => handleMessageClick(message.id)}
                            className={`p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md cursor-pointer transition-all duration-200 group relative overflow-hidden ${message.isSpam ? 'hover:border-red-200' : 'hover:border-blue-200'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-1 relative z-10">
                                <span className="text-xs font-bold text-slate-600">{message.sender}</span>
                                <span className="text-[10px] text-slate-400">{message.time}</span>
                            </div>
                            <p className={`relative z-10 text-sm text-slate-800 line-clamp-2 ${message.isSpam ? 'group-hover:text-red-600' : 'group-hover:text-primary'} transition-colors`}>
                                {message.title}
                            </p>
                            {message.isSpam && (
                                <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            )}
                        </div>
                    ))}
                </div>
                <Button variant="ghost" className="w-full mt-4 text-xs text-muted-foreground hover:text-primary" onClick={() => navigate('/messages')}>
                    모든 쪽지 보기 <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
            </CardContent>
        </Card>
    );
};

export default MessageWidget;
