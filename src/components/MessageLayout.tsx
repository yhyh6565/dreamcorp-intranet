import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { getMessages } from '@/data/messages';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';
import { Search } from 'lucide-react';

interface MessageLayoutProps {
    children: React.ReactNode;
}

const MessageLayout = ({ children }: MessageLayoutProps) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { userName, team, rank, spamMessageDeleted, isNavigationDisabled } = useUserStore();

    const allMessages = getMessages(userName, team, rank);
    const messages = spamMessageDeleted
        ? allMessages.filter(m => m.id !== '2')
        : allMessages;

    return (
        <Layout>
            <div className="flex h-[calc(100vh-8rem)] rounded-xl overflow-hidden border border-border shadow-sm bg-background">
                {/* Left Sidebar - Message List */}
                <div className={cn(
                    "w-full md:w-[350px] flex-col border-r border-border bg-slate-50/50",
                    id ? "hidden md:flex" : "flex",
                    isNavigationDisabled && "pointer-events-none opacity-50 select-none grayscale"
                )}>
                    <div className="p-4 border-b border-border bg-white">
                        <h1 className="text-xl font-bold mb-4">쪽지함</h1>
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="검색..."
                                className="w-full h-9 pl-9 pr-4 rounded-md border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
                            />
                        </div>
                    </div>

                    <ScrollArea className="flex-1">
                        <div className="divide-y divide-border">
                            {messages.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground text-sm">
                                    보관된 쪽지가 없습니다.
                                </div>
                            ) : (
                                messages.map((message) => (
                                    <div
                                        key={message.id}
                                        onClick={() => navigate(`/messages/${message.id}`)}
                                        className={cn(
                                            "flex flex-col gap-1 p-4 cursor-pointer hover:bg-white transition-colors border-l-4 border-l-transparent",
                                            id === message.id
                                                ? "bg-white border-l-primary shadow-[inset_0_1px_4px_rgba(0,0,0,0.05)]"
                                                : "text-muted-foreground hover:border-l-slate-300",
                                            message.isSpam && "hover:bg-red-50/50"
                                        )}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className={cn(
                                                "font-semibold text-sm",
                                                !message.isSpam && id === message.id ? "text-primary" : "text-foreground"
                                            )}>
                                                {message.sender}
                                            </span>
                                            <span className="text-xs text-muted-foreground">{message.date}</span>
                                        </div>
                                        <span className={cn(
                                            "text-sm font-medium truncate",
                                            id === message.id ? "text-foreground" : "text-slate-600"
                                        )}>
                                            {message.title}
                                        </span>
                                        <p className="text-xs text-muted-foreground line-clamp-1">
                                            {message.preview}
                                        </p>
                                        {message.isSpam && (
                                            <Badge variant="outline" className="w-fit mt-1 text-[10px] h-5 border-red-200 text-red-500 bg-red-50">스팸 의심</Badge>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </div>

                {/* Right Content */}
                <div className={cn(
                    "flex-1 bg-white flex flex-col",
                    !id ? "hidden md:flex" : "flex"
                )}>
                    {children}
                </div>
            </div>
        </Layout>
    );
};

export default MessageLayout;
