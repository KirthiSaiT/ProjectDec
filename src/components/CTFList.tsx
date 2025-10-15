'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';

interface CTF {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export default function CTFList() {
  const [ctfs, setCtfs] = useState<CTF[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCTFName, setNewCTFName] = useState('');

  // Fetch CTFs from API
  useEffect(() => {
    fetchCTFs();
  }, []);

  const fetchCTFs = async () => {
    try {
      const response = await fetch('/api/ctfs');
      const data = await response.json();
      if (data.success) {
        setCtfs(data.data);
      }
    } catch (error) {
      console.error('Error fetching CTFs:', error);
    }
  };

  const handleAddCTF = async () => {
    if (!newCTFName.trim()) return;

    try {
      const response = await fetch('/api/ctfs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newCTFName }),
      });

      const data = await response.json();
      if (data.success) {
        setCtfs([data.data, ...ctfs]);
        setNewCTFName('');
        setIsAddDialogOpen(false);
      }
    } catch (error) {
      console.error('Error adding CTF:', error);
    }
  };

  const handleDeleteCTF = async (id: string) => {
    try {
      const response = await fetch(`/api/ctfs/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        setCtfs(ctfs.filter(ctf => ctf._id !== id));
      }
    } catch (error) {
      console.error('Error deleting CTF:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">All CTFs</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add CTF
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New CTF</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="ctfName">CTF Name</Label>
                <Input
                  id="ctfName"
                  value={newCTFName}
                  onChange={(e) => setNewCTFName(e.target.value)}
                  placeholder="Enter CTF name"
                />
              </div>
              <Button onClick={handleAddCTF}>Create CTF</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {ctfs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No CTFs found. Create your first CTF to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ctfs.map((ctf) => (
            <Card key={ctf._id} className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">
                  <a href={`/ctfs/${ctf._id}`} className="hover:underline">
                    {ctf.name}
                  </a>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteCTF(ctf._id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Created: {new Date(ctf.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}