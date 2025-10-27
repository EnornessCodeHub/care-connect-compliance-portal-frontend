import { useState } from "react";
import { FileText, Upload, Download, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  status: string;
  notes?: string;
}

interface DocumentsSetupProps {
  onNext: () => void;
  onBack: () => void;
  onSave: (data: any) => void;
  clientData?: any;
}

const documentTypes = [
  "NDIS Plan",
  "Assessment Report",
  "Medical Certificate",
  "Identity Document",
  "Proof of Address",
  "Consent Form",
  "Emergency Contact Form",
  "Service Agreement",
  "Other"
];

export function DocumentsSetup({ onNext, onBack, onSave, clientData }: DocumentsSetupProps) {
  const [documents, setDocuments] = useState<Document[]>(clientData?.documents || []);
  const [uploadingFile, setUploadingFile] = useState<File | null>(null);
  const [selectedType, setSelectedType] = useState("");
  const [notes, setNotes] = useState("");

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadingFile(file);
    }
  };

  const uploadDocument = () => {
    if (!uploadingFile || !selectedType) return;

    const document: Document = {
      id: Date.now().toString(),
      name: uploadingFile.name,
      type: selectedType,
      size: formatFileSize(uploadingFile.size),
      uploadDate: new Date().toISOString(),
      status: "Uploaded",
      notes: notes || undefined
    };

    setDocuments([...documents, document]);
    setUploadingFile(null);
    setSelectedType("");
    setNotes("");
    
    // Reset file input
    const fileInput = window.document.getElementById("file-upload") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const removeDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleSave = () => {
    onSave({ documents });
    onNext();
  };

  const handleSkip = () => {
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">Documents</h2>
          <p className="text-muted-foreground">Upload required documents and forms</p>
        </div>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Upload Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="file-upload">Select File</Label>
              <Input
                id="file-upload"
                type="file"
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <p className="text-xs text-muted-foreground">
                Supported: PDF, DOC, DOCX, JPG, PNG (max 10MB)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="document-type">Document Type</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="document-notes">Notes (Optional)</Label>
            <Textarea
              id="document-notes"
              placeholder="Add any notes about this document"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          {uploadingFile && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium">Selected File:</p>
              <p className="text-sm text-muted-foreground">
                {uploadingFile.name} ({formatFileSize(uploadingFile.size)})
              </p>
            </div>
          )}

          <Button
            onClick={uploadDocument}
            disabled={!uploadingFile || !selectedType}
            className="hover-scale"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </CardContent>
      </Card>

      {/* Documents List */}
      {documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Uploaded Documents ({documents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline" className="text-xs">
                          {doc.type}
                        </Badge>
                        <span>{doc.size}</span>
                        <span>•</span>
                        <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                      </div>
                      {doc.notes && (
                        <p className="text-xs text-muted-foreground mt-1">{doc.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={doc.status === "Uploaded" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {doc.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDocument(doc.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Required Documents Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Required Documents Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {documentTypes.slice(0, 6).map((type) => {
              const hasDocument = documents.some(doc => doc.type === type);
              return (
                <div key={type} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    hasDocument ? "bg-green-600 border-green-600" : "border-muted-foreground"
                  }`}>
                    {hasDocument && <span className="text-white text-xs">✓</span>}
                  </div>
                  <span className={`text-sm ${hasDocument ? "text-green-600 font-medium" : "text-muted-foreground"}`}>
                    {type}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={handleSkip}>
          Skip for Now
        </Button>
        <Button onClick={handleSave}>
          Save & Continue
        </Button>
      </div>
    </div>
  );
}