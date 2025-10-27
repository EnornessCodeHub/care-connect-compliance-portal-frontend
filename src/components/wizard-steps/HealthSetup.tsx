import { useState } from "react";
import { Heart, Plus, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface MedicalCondition {
  id: string;
  condition: string;
  severity: string;
  diagnosed: string;
  treatment: string;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  prescriber: string;
}

interface HealthSetupProps {
  onNext: () => void;
  onBack: () => void;
  onSave: (data: any) => void;
  clientData?: any;
}

const severityLevels = ["Mild", "Moderate", "Severe"];
const medicationFrequencies = ["Daily", "Twice Daily", "Three Times Daily", "Weekly", "As Needed"];

export function HealthSetup({ onNext, onBack, onSave, clientData }: HealthSetupProps) {
  const [emergencyContact, setEmergencyContact] = useState(clientData?.health?.emergencyContact || "");
  const [emergencyPhone, setEmergencyPhone] = useState(clientData?.health?.emergencyPhone || "");
  const [gp, setGp] = useState(clientData?.health?.gp || "");
  const [gpPhone, setGpPhone] = useState(clientData?.health?.gpPhone || "");
  const [allergies, setAllergies] = useState(clientData?.health?.allergies || "");
  const [dietaryRequirements, setDietaryRequirements] = useState(clientData?.health?.dietaryRequirements || "");
  const [mobilityAids, setMobilityAids] = useState(clientData?.health?.mobilityAids || []);
  const [conditions, setConditions] = useState<MedicalCondition[]>(clientData?.health?.conditions || []);
  const [medications, setMedications] = useState<Medication[]>(clientData?.health?.medications || []);
  
  const [newCondition, setNewCondition] = useState({
    condition: "",
    severity: "",
    diagnosed: "",
    treatment: ""
  });

  const [newMedication, setNewMedication] = useState({
    name: "",
    dosage: "",
    frequency: "",
    prescriber: ""
  });

  const mobilityAidOptions = [
    "Wheelchair",
    "Walking Frame",
    "Walking Stick",
    "Crutches",
    "Prosthetic",
    "Hearing Aid",
    "Guide Dog",
    "None"
  ];

  const addCondition = () => {
    if (!newCondition.condition || !newCondition.severity) return;

    const condition: MedicalCondition = {
      id: Date.now().toString(),
      condition: newCondition.condition,
      severity: newCondition.severity,
      diagnosed: newCondition.diagnosed,
      treatment: newCondition.treatment
    };

    setConditions([...conditions, condition]);
    setNewCondition({ condition: "", severity: "", diagnosed: "", treatment: "" });
  };

  const addMedication = () => {
    if (!newMedication.name || !newMedication.dosage || !newMedication.frequency) return;

    const medication: Medication = {
      id: Date.now().toString(),
      name: newMedication.name,
      dosage: newMedication.dosage,
      frequency: newMedication.frequency,
      prescriber: newMedication.prescriber
    };

    setMedications([...medications, medication]);
    setNewMedication({ name: "", dosage: "", frequency: "", prescriber: "" });
  };

  const removeCondition = (id: string) => {
    setConditions(conditions.filter(condition => condition.id !== id));
  };

  const removeMedication = (id: string) => {
    setMedications(medications.filter(medication => medication.id !== id));
  };

  const handleMobilityAidChange = (aid: string, checked: boolean) => {
    if (aid === "None") {
      setMobilityAids(checked ? ["None"] : []);
    } else {
      const filtered = mobilityAids.filter(item => item !== "None");
      if (checked) {
        setMobilityAids([...filtered, aid]);
      } else {
        setMobilityAids(filtered.filter(item => item !== aid));
      }
    }
  };

  const handleSave = () => {
    const healthData = {
      emergencyContact,
      emergencyPhone,
      gp,
      gpPhone,
      allergies,
      dietaryRequirements,
      mobilityAids,
      conditions,
      medications
    };
    
    onSave({ health: healthData });
    onNext();
  };

  const handleSkip = () => {
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Heart className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">Health Information</h2>
          <p className="text-muted-foreground">Medical details and emergency contacts</p>
        </div>
      </div>

      {/* Emergency Contacts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            Emergency Contacts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emergency-contact">Emergency Contact Name</Label>
              <Input
                id="emergency-contact"
                placeholder="Emergency contact name"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergency-phone">Emergency Contact Phone</Label>
              <Input
                id="emergency-phone"
                placeholder="Emergency contact phone"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gp">General Practitioner</Label>
              <Input
                id="gp"
                placeholder="GP name"
                value={gp}
                onChange={(e) => setGp(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gp-phone">GP Phone</Label>
              <Input
                id="gp-phone"
                placeholder="GP phone number"
                value={gpPhone}
                onChange={(e) => setGpPhone(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medical Conditions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Medical Conditions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded-lg bg-muted/50">
            <h4 className="font-medium mb-3">Add Medical Condition</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="condition">Condition</Label>
                <Input
                  id="condition"
                  placeholder="Medical condition"
                  value={newCondition.condition}
                  onChange={(e) => setNewCondition({ ...newCondition, condition: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="severity">Severity</Label>
                <Select 
                  value={newCondition.severity} 
                  onValueChange={(value) => setNewCondition({ ...newCondition, severity: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    {severityLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="diagnosed">Date Diagnosed</Label>
                <Input
                  id="diagnosed"
                  type="date"
                  value={newCondition.diagnosed}
                  onChange={(e) => setNewCondition({ ...newCondition, diagnosed: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="treatment">Current Treatment</Label>
                <Input
                  id="treatment"
                  placeholder="Treatment details"
                  value={newCondition.treatment}
                  onChange={(e) => setNewCondition({ ...newCondition, treatment: e.target.value })}
                />
              </div>
            </div>
            <Button
              onClick={addCondition}
              disabled={!newCondition.condition || !newCondition.severity}
              className="mt-3 hover-scale"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Condition
            </Button>
          </div>

          {conditions.length > 0 && (
            <div className="space-y-3">
              {conditions.map((condition) => (
                <div key={condition.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{condition.condition}</span>
                        <Badge variant={
                          condition.severity === "Severe" ? "destructive" :
                          condition.severity === "Moderate" ? "default" : "secondary"
                        }>
                          {condition.severity}
                        </Badge>
                      </div>
                      {condition.diagnosed && (
                        <p className="text-sm text-muted-foreground">
                          Diagnosed: {new Date(condition.diagnosed).toLocaleDateString()}
                        </p>
                      )}
                      {condition.treatment && (
                        <p className="text-sm text-muted-foreground">
                          Treatment: {condition.treatment}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCondition(condition.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Medications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Current Medications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded-lg bg-muted/50">
            <h4 className="font-medium mb-3">Add Medication</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="med-name">Medication Name</Label>
                <Input
                  id="med-name"
                  placeholder="Medication name"
                  value={newMedication.name}
                  onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage</Label>
                <Input
                  id="dosage"
                  placeholder="e.g., 10mg"
                  value={newMedication.dosage}
                  onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select 
                  value={newMedication.frequency} 
                  onValueChange={(value) => setNewMedication({ ...newMedication, frequency: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {medicationFrequencies.map((freq) => (
                      <SelectItem key={freq} value={freq}>
                        {freq}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="prescriber">Prescriber</Label>
                <Input
                  id="prescriber"
                  placeholder="Doctor/Prescriber name"
                  value={newMedication.prescriber}
                  onChange={(e) => setNewMedication({ ...newMedication, prescriber: e.target.value })}
                />
              </div>
            </div>
            <Button
              onClick={addMedication}
              disabled={!newMedication.name || !newMedication.dosage || !newMedication.frequency}
              className="mt-3 hover-scale"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Medication
            </Button>
          </div>

          {medications.length > 0 && (
            <div className="space-y-3">
              {medications.map((medication) => (
                <div key={medication.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-medium">{medication.name}</span>
                      <div className="text-sm text-muted-foreground">
                        {medication.dosage} - {medication.frequency}
                        {medication.prescriber && ` (Prescribed by: ${medication.prescriber})`}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMedication(medication.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Additional Health Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="allergies">Allergies & Reactions</Label>
            <Textarea
              id="allergies"
              placeholder="List any known allergies or adverse reactions"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dietary">Dietary Requirements</Label>
            <Textarea
              id="dietary"
              placeholder="Special dietary requirements or restrictions"
              value={dietaryRequirements}
              onChange={(e) => setDietaryRequirements(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <Label>Mobility Aids & Equipment</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {mobilityAidOptions.map((aid) => (
                <div key={aid} className="flex items-center space-x-2">
                  <Checkbox
                    id={aid}
                    checked={mobilityAids.includes(aid)}
                    onCheckedChange={(checked) => handleMobilityAidChange(aid, checked as boolean)}
                  />
                  <Label htmlFor={aid} className="text-sm font-normal">
                    {aid}
                  </Label>
                </div>
              ))}
            </div>
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