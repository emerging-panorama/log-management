import Layout from '@/components/layout/Layout';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download, Filter, Trash2, Play, Terminal } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  addDoc, 
  serverTimestamp,
  getDocs,
  writeBatch,
  doc
} from 'firebase/firestore';
import { db } from '@/services/firebase';
import { LogEntry, LogLevel } from '@/types';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { handleFirestoreError, OperationType } from '@/lib/firestore-error';

export default function ProjectDetails() {
  const { id } = useParams();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const logsRef = collection(db, 'projects', id, 'logs');
    const q = query(logsRef, orderBy('timestamp', 'desc'), limit(100));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LogEntry[];
      setLogs(logsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `projects/${id}/logs`);
    });

    return unsubscribe;
  }, [id]);

  const simulateLog = async () => {
    if (!id) return;
    const levels: LogLevel[] = ['info', 'warn', 'error', 'debug'];
    const messages = [
      'User login successful',
      'Database connection timeout',
      'API request failed with 500',
      'Cache cleared for project',
      'New order received: #ORD-992',
      'Failed to send email notification'
    ];
    
    const randomLevel = levels[Math.floor(Math.random() * levels.length)];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    try {
      await addDoc(collection(db, 'projects', id, 'logs'), {
        projectId: id,
        level: randomLevel,
        message: randomMessage,
        timestamp: serverTimestamp(),
        metadata: {
          userAgent: navigator.userAgent,
          ip: '127.0.0.1'
        }
      });
    } catch (error) {
      toast.error('Failed to simulate log');
    }
  };

  const clearLogs = async () => {
    if (!id || !confirm('Are you sure you want to clear all logs for this project?')) return;
    
    try {
      const logsRef = collection(db, 'projects', id, 'logs');
      const snapshot = await getDocs(logsRef);
      const batch = writeBatch(db);
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      toast.success('Logs cleared');
    } catch (error) {
      toast.error('Failed to clear logs');
    }
  };

  return (
    <Layout title={`Project Logs`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" className="gap-2" onClick={simulateLog}>
            <Play className="w-4 h-4" />
            Simulate Log
          </Button>
          <Button variant="destructive" size="sm" className="gap-2" onClick={clearLogs}>
            <Trash2 className="w-4 h-4" />
            Clear Logs
          </Button>
        </div>
      </div>

      <div className="bg-background border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Timestamp</TableHead>
                <TableHead className="w-[100px]">Level</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="w-[150px]">Metadata</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading logs...
                  </TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                    <Terminal className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    No logs found for this project.
                  </TableCell>
                </TableRow>
              ) : logs.map((log) => (
                <TableRow key={log.id} className="font-mono text-xs hover:bg-muted/50 transition-colors">
                  <TableCell className="text-muted-foreground whitespace-nowrap">
                    {log.timestamp?.toDate ? format(log.timestamp.toDate(), 'yyyy-MM-dd HH:mm:ss') : 'Just now'}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "font-bold uppercase text-[10px] px-1.5 py-0",
                        log.level === 'error' && "border-destructive text-destructive bg-destructive/5",
                        log.level === 'warn' && "border-yellow-500 text-yellow-500 bg-yellow-500/5",
                        log.level === 'info' && "border-blue-500 text-blue-500 bg-blue-500/5",
                        log.level === 'debug' && "border-muted-foreground text-muted-foreground bg-muted/5",
                      )}
                    >
                      {log.level}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-sans text-sm break-all">
                    {log.message}
                  </TableCell>
                  <TableCell className="text-muted-foreground truncate max-w-[150px]">
                    {log.metadata ? JSON.stringify(log.metadata) : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
}
