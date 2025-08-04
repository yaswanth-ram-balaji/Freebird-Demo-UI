
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Users, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { users as allUsers } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const ParticipantTile = ({ user, isMuted, hasVideo }: { user: typeof allUsers[0], isMuted: boolean, hasVideo: boolean }) => {
    return (
        <Card className="relative overflow-hidden aspect-video flex flex-col items-center justify-center bg-gray-800 text-white shadow-lg">
            {hasVideo ? (
                 <Avatar className="h-24 w-24 border-4 border-gray-600">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
            ) : (
                <div className="h-24 w-24 rounded-full bg-gray-700 flex items-center justify-center border-4 border-gray-600">
                     <Avatar className="h-full w-full">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                </div>
            )}
            <div className="absolute bottom-2 left-2 bg-black/50 p-1.5 rounded-md text-xs font-semibold flex items-center gap-2">
                {isMuted ? <MicOff className="h-4 w-4 text-red-500" /> : <Mic className="h-4 w-4" />}
                <span>{user.name}</span>
            </div>
        </Card>
    );
};


export default function MeetingPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const roomCode = params.code as string;

  // Simulate meeting state
  const [isMuted, setIsMuted] = React.useState(false);
  const [hasVideo, setHasVideo] = React.useState(true);

  // For this demo, we'll just show a subset of users.
  const participants = React.useMemo(() => allUsers.slice(0, 6), []);
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    toast({
      title: 'Room Code Copied!',
      description: `The code ${roomCode} has been copied to your clipboard.`,
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-4">
            <Users className="h-6 w-6" />
            <h1 className="text-xl font-bold">Meeting Room</h1>
             <Badge variant="outline" className="cursor-pointer border-gray-500" onClick={handleCopyCode}>
                {roomCode}
                <Copy className="ml-2 h-3 w-3" />
            </Badge>
        </div>
         <p className="text-sm text-gray-400">{participants.length} Participants</p>
      </header>

      <main className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 overflow-y-auto">
        {participants.map((user, index) => (
            <ParticipantTile 
                key={user.id} 
                user={user}
                // Randomly mute some participants for demo purposes
                isMuted={index % 3 === 0}
                hasVideo={index % 4 !== 0}
            />
        ))}
      </main>

      <footer className="flex items-center justify-center p-4 border-t border-gray-700 bg-gray-800/50 gap-4">
         <Button variant="secondary" size="lg" className="bg-gray-700 hover:bg-gray-600" onClick={() => setIsMuted(!isMuted)}>
             {isMuted ? <MicOff className="h-6 w-6"/> : <Mic className="h-6 w-6"/>}
             <span className="ml-2 hidden sm:inline">{isMuted ? 'Unmute' : 'Mute'}</span>
         </Button>
         <Button variant="secondary" size="lg" className="bg-gray-700 hover:bg-gray-600" onClick={() => setHasVideo(!hasVideo)}>
             {hasVideo ? <VideoOff className="h-6 w-6"/> : <Video className="h-6 w-6"/>}
             <span className="ml-2 hidden sm:inline">{hasVideo ? 'Stop Video' : 'Start Video'}</span>
         </Button>
         <Link href="/" passHref>
            <Button variant="destructive" size="lg">
                <PhoneOff className="h-6 w-6" />
                <span className="ml-2 hidden sm:inline">Leave</span>
            </Button>
         </Link>
      </footer>
    </div>
  );
}
