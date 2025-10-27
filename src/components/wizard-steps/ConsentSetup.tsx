import { useState } from "react";
import { Shield, FileText, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

interface ConsentItem {
  id: string;
  title: string;
  description: string;
  required: boolean;
  consented: boolean;
  dateConsented?: string;
}

interface ConsentSetupProps {
  onNext: () => void;
  onBack: () => void;
  onSave: (data: any) => void;
  clientData?: any;
}

export function ConsentSetup({ onNext, onBack, onSave, clientData }: ConsentSetupProps) {
  const [consentItems, setConsentItems] = useState<ConsentItem[]>(
    clientData?.consent?.items || [
      {
        id: "service-agreement",
        title: "Service Agreement",
        description: "Agreement to receive services as outlined in the service plan",
        required: true,
        consented: false
      },
      {
        id: "privacy-policy",
        title: "Privacy Policy & Data Collection",
        description: "Consent to collect, use and store personal information in accordance with privacy laws",
        required: true,
        consented: false
      },
      {
        id: "medical-information",
        title: "Medical Information Sharing",
        description: "Permission to collect and share relevant medical information with healthcare providers",
        required: true,
        consented: false
      },
      {
        id: "emergency-contact",
        title: "Emergency Contact Authorization",
        description: "Permission to contact nominated emergency contacts when necessary",
        required: true,
        consented: false
      },
      {
        id: "photography-media",
        title: "Photography & Media Consent",
        description: "Permission to take and use photographs/videos for documentation and promotional purposes",
        required: false,
        consented: false
      },
      {
        id: "research-participation",
        title: "Research Participation",
        description: "Optional participation in service improvement research and quality initiatives",
        required: false,
        consented: false
      },
      {
        id: "marketing-communications",
        title: "Marketing Communications",
        description: "Consent to receive newsletters, updates and promotional materials",
        required: false,
        consented: false
      },
      {
        id: "third-party-referrals",
        title: "Third Party Referrals",
        description: "Permission to share information with referred service providers and partners",
        required: false,
        consented: false
      }
    ]
  );

  const [additionalNotes, setAdditionalNotes] = useState(clientData?.consent?.notes || "");
  const [guardianConsent, setGuardianConsent] = useState(clientData?.consent?.guardianConsent || false);
  const [guardianName, setGuardianName] = useState(clientData?.consent?.guardianName || "");

  const handleConsentChange = (id: string, consented: boolean) => {
    setConsentItems(items => 
      items.map(item => 
        item.id === id 
          ? { 
              ...item, 
              consented, 
              dateConsented: consented ? new Date().toISOString() : undefined 
            }
          : item
      )
    );
  };

  const requiredConsents = consentItems.filter(item => item.required);
  const optionalConsents = consentItems.filter(item => !item.required);
  const allRequiredConsented = requiredConsents.every(item => item.consented);

  const handleSave = () => {
    const consentData = {
      items: consentItems,
      notes: additionalNotes,
      guardianConsent,
      guardianName,
      completedDate: new Date().toISOString()
    };
    
    onSave({ consent: consentData });
    onNext();
  };

  const handleSkip = () => {
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">Consent & Permissions</h2>
          <p className="text-muted-foreground">Review and obtain consent for service delivery and data handling</p>
        </div>
      </div>

      {/* Guardian Consent Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Guardian/Representative Consent</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="guardian-consent"
              checked={guardianConsent}
              onCheckedChange={(checked) => setGuardianConsent(checked as boolean)}
            />
            <Label htmlFor="guardian-consent">
              Consent is being provided by a guardian or legal representative
            </Label>
          </div>
          
          {guardianConsent && (
            <div className="space-y-2 ml-6">
              <Label htmlFor="guardian-name">Guardian/Representative Name</Label>
              <div className="max-w-md">
                <input
                  id="guardian-name"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter guardian/representative name"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Required Consents */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            Required Consents
            <Badge variant={allRequiredConsented ? "default" : "destructive"}>
              {requiredConsents.filter(item => item.consented).length}/{requiredConsents.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {requiredConsents.map((item) => (
            <div key={item.id} className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id={item.id}
                  checked={item.consented}
                  onCheckedChange={(checked) => handleConsentChange(item.id, checked as boolean)}
                />
                <div className="flex-1 space-y-1">
                  <Label htmlFor={item.id} className="text-base font-medium">
                    {item.title}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                  {item.consented && item.dateConsented && (
                    <p className="text-xs text-green-600">
                      Consented on {new Date(item.dateConsented).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Optional Consents */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Optional Consents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {optionalConsents.map((item) => (
            <div key={item.id} className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id={item.id}
                  checked={item.consented}
                  onCheckedChange={(checked) => handleConsentChange(item.id, checked as boolean)}
                />
                <div className="flex-1 space-y-1">
                  <Label htmlFor={item.id} className="text-base font-medium">
                    {item.title}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                  {item.consented && item.dateConsented && (
                    <p className="text-xs text-green-600">
                      Consented on {new Date(item.dateConsented).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Additional Notes & Conditions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="consent-notes">Special conditions or additional consent notes</Label>
            <Textarea
              id="consent-notes"
              placeholder="Enter any special conditions, restrictions, or additional notes regarding consent..."
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">Consent Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {consentItems.filter(item => item.consented).length}
              </div>
              <div className="text-sm text-muted-foreground">Total Consents Given</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {requiredConsents.filter(item => item.consented).length}/{requiredConsents.length}
              </div>
              <div className="text-sm text-muted-foreground">Required Consents</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {optionalConsents.filter(item => item.consented).length}/{optionalConsents.length}
              </div>
              <div className="text-sm text-muted-foreground">Optional Consents</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={handleSkip}>
          Save & Skip
        </Button>
        <Button onClick={handleSave} disabled={!allRequiredConsented}>
          Save & Continue
        </Button>
      </div>

      {!allRequiredConsented && (
        <div className="text-sm text-amber-600 text-center">
          All required consents must be obtained before proceeding
        </div>
      )}
    </div>
  );
}