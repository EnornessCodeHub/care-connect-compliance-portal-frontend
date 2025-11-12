import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Loader2,
  Users,
  Mail,
  GripVertical,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';
import eSignatureService, { ESignatureDocument, Workflow } from '@/services/eSignatureService';
import staffService, { Staff } from '@/services/staffService';
import authService from '@/services/authService';

interface WorkflowSigner {
  userId?: number;
  email?: string;
  type: 'internal' | 'external';
  order: number;
  status: 'pending' | 'signed' | 'skipped';
  signedAt?: string;
  name?: string;
}

export default function FormWorkflow() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isAdmin = authService.isAdmin();

  const documentId = searchParams.get('documentId');
  const [document, setDocument] = useState<ESignatureDocument | null>(null);
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [signers, setSigners] = useState<WorkflowSigner[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Staff list for internal signers
  const [staffList, setStaffList] = useState<Staff[]>([]);

  // Add signer dialog
  const [isAddSignerOpen, setIsAddSignerOpen] = useState(false);
  const [newSignerType, setNewSignerType] = useState<'internal' | 'external'>('internal');
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
  const [externalEmail, setExternalEmail] = useState('');

  useEffect(() => {
    if (documentId) {
      loadDocument();
      loadWorkflow();
    } else {
      loadDocuments();
    }
    loadStaff();
  }, [documentId]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const response = await eSignatureService.getDocuments();
      if (response.success && response.data && response.data.length > 0) {
        // Auto-select first document if no documentId provided
        const firstDoc = response.data[0];
        navigate(`/forms/workflow?documentId=${firstDoc.id}`);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to load documents',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadDocument = async () => {
    if (!documentId) return;

    try {
      const response = await eSignatureService.getDocumentById(documentId);
      if (response.success && response.data) {
        setDocument(response.data);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to load document',
      });
    }
  };

  const loadWorkflow = async () => {
    if (!documentId) return;

    try {
      const response = await eSignatureService.getWorkflow(documentId);
      if (response.success && response.data) {
        setWorkflow(response.data);
        setSigners(response.data.signingOrder || []);
      } else {
        // Initialize empty workflow
        setSigners([]);
      }
    } catch (error: any) {
      // If workflow doesn't exist, start with empty
      setSigners([]);
    }
  };

  const loadStaff = async () => {
    try {
      const response = await staffService.listStaff();
      if (response.success && response.data) {
        setStaffList(response.data);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load staff list',
      });
    }
  };

  const handleAddSigner = () => {
    if (newSignerType === 'internal' && !selectedStaffId) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select a staff member',
      });
      return;
    }

    if (newSignerType === 'external' && !externalEmail.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter an email address',
      });
      return;
    }

    const selectedStaff = staffList.find(s => s.id === selectedStaffId);
    const newSigner: WorkflowSigner = {
      userId: newSignerType === 'internal' ? selectedStaffId! : undefined,
      email: newSignerType === 'external' ? externalEmail : selectedStaff?.email,
      type: newSignerType,
      order: signers.length + 1,
      status: 'pending',
      name: newSignerType === 'internal' ? (selectedStaff?.fullname || selectedStaff?.username) : externalEmail,
    };

    setSigners([...signers, newSigner]);
    setIsAddSignerOpen(false);
    setSelectedStaffId(null);
    setExternalEmail('');
    setNewSignerType('internal');
  };

  const handleRemoveSigner = (index: number) => {
    const updated = signers.filter((_, i) => i !== index).map((s, i) => ({
      ...s,
      order: i + 1,
    }));
    setSigners(updated);
  };

  const handleMoveSigner = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= signers.length) return;

    const updated = [...signers];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    updated[index].order = index + 1;
    updated[newIndex].order = newIndex + 1;
    setSigners(updated);
  };

  const handleSave = async () => {
    if (!documentId) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Document ID is required',
      });
      return;
    }

    try {
      setSaving(true);
      const workflowData: Workflow = {
        id: workflow?.id || `workflow_${Date.now()}`,
        documentId,
        signingOrder: signers,
      };

      const response = await eSignatureService.updateWorkflow(documentId, workflowData);
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Workflow saved successfully',
        });
        setWorkflow(workflowData);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to save workflow',
      });
    } finally {
      setSaving(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'signed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'skipped':
        return <XCircle className="h-4 w-4 text-gray-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      signed: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      skipped: 'bg-gray-100 text-gray-800 border-gray-200',
    };

    return (
      <Badge className={colors[status] || 'bg-gray-100 text-gray-800'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/forms')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Workflow</h1>
            <p className="text-muted-foreground mt-1">
              Configure signing order and track document progress
            </p>
          </div>
        </div>
        {documentId && (
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <Save className="h-4 w-4 mr-2" />
            Save Workflow
          </Button>
        )}
      </div>

      {/* Document Selector */}
      {!documentId && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Please select a document to configure its workflow
            </p>
          </CardContent>
        </Card>
      )}

      {documentId && document && (
        <>
          {/* Document Info */}
          <Card>
            <CardHeader>
              <CardTitle>Document Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <Label className="text-sm text-muted-foreground">Document Name</Label>
                  <p className="font-medium">{document.fileName}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    {getStatusBadge(document.status)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Signing Order */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Signing Order</CardTitle>
                {isAdmin && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAddSignerOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Signer
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {signers.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No signers configured</p>
                  {isAdmin && (
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setIsAddSignerOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Signer
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {signers.map((signer, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-5 w-5 text-muted-foreground" />
                          <Badge variant="outline">#{signer.order}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          {signer.type === 'internal' ? (
                            <Users className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Mail className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="font-medium">
                            {signer.name || signer.email || 'Unknown'}
                          </span>
                          <Badge variant="secondary" className="ml-2">
                            {signer.type}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(signer.status)}
                        {getStatusBadge(signer.status)}
                      </div>
                      {isAdmin && (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMoveSigner(index, 'up')}
                            disabled={index === 0}
                          >
                            ↑
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMoveSigner(index, 'down')}
                            disabled={index === signers.length - 1}
                          >
                            ↓
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveSigner(index)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Add Signer Dialog */}
      <Dialog open={isAddSignerOpen} onOpenChange={setIsAddSignerOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Signer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Signer Type</Label>
              <Select
                value={newSignerType}
                onValueChange={(value) => setNewSignerType(value as 'internal' | 'external')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="internal">Internal Staff</SelectItem>
                  <SelectItem value="external">External User</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newSignerType === 'internal' ? (
              <div>
                <Label>Staff Member</Label>
                <Select
                  value={selectedStaffId?.toString() || ''}
                  onValueChange={(value) => setSelectedStaffId(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    {staffList.map((staff) => (
                      <SelectItem key={staff.id} value={staff.id.toString()}>
                        {staff.fullname || staff.username} ({staff.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div>
                <Label>Email Address</Label>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={externalEmail}
                  onChange={(e) => setExternalEmail(e.target.value)}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddSignerOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSigner}>Add Signer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
