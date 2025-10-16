'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Download, Trash2, Check } from 'lucide-react';

interface Challenge {
  _id: string;
  ctfId: string;
  title: string;
  description: string;
  category: string;
  fileUrl: string;
  createdAt: string;
  updatedAt: string;
  // Add flag count property
  flagCount?: number;
  // Add property to indicate if any flags are confirmed correct
  hasCorrectFlags?: boolean;
}

interface CTF {
  _id: string;
  name: string;
}

interface Flag {
  _id: string;
  isCorrect: boolean;
}

export default function CTFDetail() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  
  const [ctfName, setCtfName] = useState('');
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Form state for new challenge
  const [newChallenge, setNewChallenge] = useState({
    title: '',
    description: '',
    category: 'Crypto',
    file: null as File | null
  });
  
  // Fetch CTF details and challenges
  const fetchCTFDetails = useCallback(async () => {
    try {
      const response = await fetch('/api/ctfs');
      const data = await response.json();
      if (data.success) {
        const ctf = data.data.find((c: CTF) => c._id === id);
        if (ctf) {
          setCtfName(ctf.name);
        }
      }
    } catch (error) {
      console.error('Error fetching CTF details:', error);
    }
  }, [id]);
  
  const fetchChallenges = useCallback(async () => {
    try {
      const response = await fetch(`/api/challenges?ctfId=${id}`);
      const data = await response.json();
      if (data.success) {
        // Get flag count for each challenge
        const challengesWithFlags = await Promise.all(
          data.data.map(async (challenge: Challenge) => {
            try {
              const flagResponse = await fetch(`/api/flags?challengeId=${challenge._id}`);
              const flagData = await flagResponse.json();
              if (flagData.success) {
                const flags: Flag[] = flagData.data;
                const correctFlags = flags.filter((flag: Flag) => flag.isCorrect);
                return {
                  ...challenge,
                  flagCount: flags.length,
                  hasCorrectFlags: correctFlags.length > 0
                };
              }
            } catch (error) {
              console.error('Error fetching flags for challenge:', error);
            }
            return {
              ...challenge,
              flagCount: 0,
              hasCorrectFlags: false
            };
          })
        );
        setChallenges(challengesWithFlags);
      }
    } catch (error) {
      console.error('Error fetching challenges:', error);
    }
  }, [id]);
  
  useEffect(() => {
    if (id) {
      fetchCTFDetails();
      fetchChallenges();
    }
  }, [id, fetchCTFDetails, fetchChallenges]);
  
  const handleAddChallenge = async () => {
    if (!newChallenge.title.trim() || !newChallenge.description.trim()) return;
    
    try {
      let fileUrl = '';
      
      // Upload file if provided
      if (newChallenge.file) {
        const formData = new FormData();
        formData.append('file', newChallenge.file);
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        const uploadData = await uploadResponse.json();
        if (uploadData.success) {
          fileUrl = uploadData.fileId;
        }
      }
      
      // Create challenge
      const response = await fetch('/api/challenges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ctfId: id,
          title: newChallenge.title,
          description: newChallenge.description,
          category: newChallenge.category,
          fileUrl
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        setChallenges([data.data, ...challenges]);
        setNewChallenge({
          title: '',
          description: '',
          category: 'Crypto',
          file: null
        });
        setIsAddDialogOpen(false);
      }
    } catch (error) {
      console.error('Error adding challenge:', error);
    }
  };
  
  const handleDeleteChallenge = async (challengeId: string) => {
    try {
      const response = await fetch(`/api/challenges/${challengeId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      if (data.success) {
        setChallenges(challenges.filter(challenge => challenge._id !== challengeId));
      }
    } catch (error) {
      console.error('Error deleting challenge:', error);
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
  
  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Button variant="outline" onClick={() => router.back()} className="mb-4">
            ← Back to CTFs
          </Button>
          <h1 className="text-3xl font-bold text-foreground">{ctfName || 'CTF Challenges'}</h1>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Challenge
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Challenge</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newChallenge.title}
                  onChange={(e) => setNewChallenge({...newChallenge, title: e.target.value})}
                  placeholder="Challenge title"
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newChallenge.category} onValueChange={(value) => setNewChallenge({...newChallenge, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Crypto">Crypto</SelectItem>
                    <SelectItem value="Rev">Rev</SelectItem>
                    <SelectItem value="OSINT">OSINT</SelectItem>
                    <SelectItem value="PWN">PWN</SelectItem>
                    <SelectItem value="Binary Exploitation">Binary Exploitation</SelectItem>
                    <SelectItem value="Forensics">Forensics</SelectItem>
                    <SelectItem value="Web">Web</SelectItem>
                    <SelectItem value="Misc">Misc</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newChallenge.description}
                  onChange={(e) => setNewChallenge({...newChallenge, description: e.target.value})}
                  placeholder="Challenge description"
                  rows={4}
                />
              </div>
              
              <div>
                <Label htmlFor="file">File (optional)</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={(e) => setNewChallenge({...newChallenge, file: e.target.files?.[0] || null})}
                />
              </div>
              
              <Button onClick={handleAddChallenge}>Create Challenge</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {challenges.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No challenges found. Create your first challenge to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <Card 
              key={challenge._id} 
              className={`bg-card border-2 ${
                challenge.hasCorrectFlags 
                  ? 'border-green-500 bg-green-500/5' 
                  : 'border-border'
              } ${getCategoryClass(challenge.category)}`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">
                  <a href={`/challenges/${challenge._id}`} className="hover:underline">
                    {challenge.title}
                  </a>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteChallenge(challenge._id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <Badge className={`mb-2 ${getCategoryClass(challenge.category)}`}>
                  {challenge.category}
                </Badge>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {challenge.description}
                </p>
                {challenge.flagCount !== undefined && challenge.flagCount > 0 && (
                  <div className="mt-2 flex items-center text-sm">
                    <span className="text-muted-foreground">
                      {challenge.flagCount} flag submission{challenge.flagCount !== 1 ? 's' : ''}
                      {challenge.hasCorrectFlags && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                          <Check className="mr-1 h-3 w-3" /> Solved
                        </span>
                      )}
                    </span>
                  </div>
                )}
                {challenge.fileUrl && (
                  <Button variant="outline" size="sm" className="mt-3" asChild>
                    <a href={`/api/download?fileId=${challenge.fileUrl}`} download>
                      <Download className="mr-2 h-4 w-4" /> Download File
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}