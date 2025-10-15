'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Download, Check, X } from 'lucide-react';

interface Challenge {
  _id: string;
  ctfId: string;
  title: string;
  description: string;
  category: string;
  fileUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface FlagSubmission {
  _id: string;
  challengeId: string;
  userId: string;
  flagText: string;
  note: string;
  isCorrect: boolean;
  createdAt: string;
}

export default function ChallengeDetail() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [flagSubmissions, setFlagSubmissions] = useState<FlagSubmission[]>([]);
  const [newFlag, setNewFlag] = useState('');
  const [newNote, setNewNote] = useState('');
  
  // Fetch challenge details and flag submissions
  useEffect(() => {
    if (id) {
      fetchChallenge();
      fetchFlagSubmissions();
    }
  }, [id]);
  
  const fetchChallenge = async () => {
    try {
      const response = await fetch(`/api/challenges/${id}`);
      const data = await response.json();
      if (data.success) {
        setChallenge(data.data);
      }
    } catch (error) {
      console.error('Error fetching challenge:', error);
    }
  };
  
  const fetchFlagSubmissions = async () => {
    try {
      const response = await fetch(`/api/flags?challengeId=${id}`);
      const data = await response.json();
      if (data.success) {
        setFlagSubmissions(data.data);
      }
    } catch (error) {
      console.error('Error fetching flag submissions:', error);
    }
  };
  
  const handleSubmitFlag = async () => {
    if (!newFlag.trim()) return;
    
    try {
      const response = await fetch('/api/flags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          challengeId: id,
          userId: 'user123', // In a real app, this would come from auth
          flagText: newFlag,
          note: newNote
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        setFlagSubmissions([data.data, ...flagSubmissions]);
        setNewFlag('');
        setNewNote('');
      }
    } catch (error) {
      console.error('Error submitting flag:', error);
    }
  };
  
  const handleMarkFlag = async (flagId: string, isCorrect: boolean) => {
    try {
      const response = await fetch(`/api/flags/${flagId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isCorrect }),
      });
      
      const data = await response.json();
      if (data.success) {
        setFlagSubmissions(flagSubmissions.map(flag => 
          flag._id === flagId ? { ...flag, isCorrect } : flag
        ));
      }
    } catch (error) {
      console.error('Error marking flag:', error);
    }
  };
  
  const handleDeleteFlag = async (flagId: string) => {
    try {
      const response = await fetch(`/api/flags/${flagId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      if (data.success) {
        setFlagSubmissions(flagSubmissions.filter(flag => flag._id !== flagId));
      }
    } catch (error) {
      console.error('Error deleting flag:', error);
    }
  };
  
  const getCategoryClass = (category: string) => {
    switch (category.toLowerCase()) {
      case 'crypto': return 'crypto';
      case 'rev': return 'rev';
      case 'osint': return 'osint';
      case 'pwn': return 'pwn';
      case 'binary exploitation': return 'binary';
      case 'forensics': return 'forensics';
      case 'web': return 'web';
      default: return 'misc';
    }
  };
  
  if (!challenge) {
    return (
      <div className="py-8">
        <div className="flex justify-between items-center mb-8">
          <Button variant="outline" onClick={() => router.back()} className="mb-4">
            ← Back to Challenges
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Loading...</h1>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-8">
        <Button variant="outline" onClick={() => router.back()} className="mb-4">
          ← Back to Challenges
        </Button>
        <h1 className="text-3xl font-bold text-foreground">{challenge.title}</h1>
      </div>
      
      <Card className={`mb-8 ${getCategoryClass(challenge.category)}`}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <Badge className={getCategoryClass(challenge.category)}>
                {challenge.category}
              </Badge>
              <CardTitle className="text-2xl mt-2">{challenge.title}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">{challenge.description}</p>
          
          {challenge.fileUrl && (
            <Button asChild>
              <a href={`/api/download?fileId=${challenge.fileUrl}`} download>
                <Download className="mr-2 h-4 w-4" /> Download Challenge File
              </a>
            </Button>
          )}
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Submit Flag</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="flag">Flag</Label>
              <Input
                id="flag"
                value={newFlag}
                onChange={(e) => setNewFlag(e.target.value)}
                placeholder="Enter flag"
              />
            </div>
            
            <div>
              <Label htmlFor="note">Note (How did you solve it?)</Label>
              <Textarea
                id="note"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Describe your solution approach"
                rows={3}
              />
            </div>
            
            <Button onClick={handleSubmitFlag}>Submit Flag</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Flag Submissions ({flagSubmissions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {flagSubmissions.length === 0 ? (
            <p className="text-muted-foreground">No flag submissions yet.</p>
          ) : (
            <div className="space-y-4">
              {flagSubmissions.map((flag) => (
                <div key={flag._id} className={`p-4 rounded-lg border ${flag.isCorrect ? 'border-success bg-success/10' : 'border-border'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-mono break-all">{flag.flagText}</p>
                      {flag.note && (
                        <p className="text-sm text-muted-foreground mt-2">{flag.note}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        Submitted: {new Date(flag.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkFlag(flag._id, !flag.isCorrect)}
                        className={flag.isCorrect ? 'bg-success text-success-foreground' : ''}
                      >
                        {flag.isCorrect ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteFlag(flag._id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}