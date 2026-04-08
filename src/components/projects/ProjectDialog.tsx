import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Project } from '@/types';
import { addDoc, collection, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface ProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null;
}

export default function ProjectDialog({ isOpen, onClose, project }: ProjectDialogProps) {
  const { user } = useAuth();
  const [name, setName] = useState(project?.name || '');
  const [apiUrl, setApiUrl] = useState(project?.apiUrl || '');
  const [apiKey, setApiKey] = useState(project?.apiKey || '');
  const [description, setDescription] = useState(project?.description || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      if (project) {
        await updateDoc(doc(db, 'projects', project.id), {
          name,
          apiUrl,
          apiKey,
          description,
        });
        toast.success('Project updated successfully');
      } else {
        await addDoc(collection(db, 'projects'), {
          name,
          apiUrl,
          apiKey,
          description,
          status: 'active',
          createdAt: serverTimestamp(),
          createdBy: user.uid,
        });
        toast.success('Project created successfully');
      }
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{project ? 'Edit Project' : 'Add Project'}</DialogTitle>
          <DialogDescription>
            Enter the details of the website project you want to monitor.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Project Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="My Awesome App" 
              required 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="apiUrl">Log API URL</Label>
            <Input 
              id="apiUrl" 
              value={apiUrl} 
              onChange={(e) => setApiUrl(e.target.value)} 
              placeholder="https://api.example.com/logs" 
              required 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="apiKey">API Key (Optional)</Label>
            <Input 
              id="apiKey" 
              value={apiKey} 
              onChange={(e) => setApiKey(e.target.value)} 
              placeholder="Secret key for secure access" 
              type="password"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Brief description of the project" 
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Project'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
