import { useState } from "react";
import { Globe, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface CulturalPreference {
  id: string;
  category: string;
  preference: string;
  importance: string;
  notes?: string;
}

interface CulturalSetupProps {
  onNext: () => void;
  onBack: () => void;
  onSave: (data: any) => void;
  clientData?: any;
}

const culturalCategories = [
  "Religious Practices",
  "Dietary Requirements", 
  "Language Preferences",
  "Communication Style",
  "Personal Care",
  "Social Interactions",
  "Celebrations & Events",
  "Family Dynamics"
];

const importanceLevels = ["Very Important", "Important", "Somewhat Important", "Not Important"];

const commonLanguages = [
  "English", "Mandarin", "Arabic", "Vietnamese", "Italian", "Greek", 
  "Spanish", "Hindi", "Punjabi", "Korean", "Tagalog", "Thai", "Other"
];

const commonReligions = [
  "Christianity", "Islam", "Judaism", "Hinduism", "Buddhism", "Sikhism",
  "No Religion", "Prefer not to say", "Other"
];

export function CulturalSetup({ onNext, onBack, onSave, clientData }: CulturalSetupProps) {
  const [primaryLanguage, setPrimaryLanguage] = useState(clientData?.cultural?.primaryLanguage || "");
  const [otherLanguages, setOtherLanguages] = useState<string[]>(clientData?.cultural?.otherLanguages || []);
  const [interpreterNeeded, setInterpreterNeeded] = useState(clientData?.cultural?.interpreterNeeded || false);
  const [religion, setReligion] = useState(clientData?.cultural?.religion || "");
  const [culturalBackground, setCulturalBackground] = useState(clientData?.cultural?.culturalBackground || "");
  const [preferences, setPreferences] = useState<CulturalPreference[]>(clientData?.cultural?.preferences || []);
  const [dietaryRestrictions, setDietaryRestrictions] = useState(clientData?.cultural?.dietaryRestrictions || "");
  const [communicationStyle, setCommunicationStyle] = useState(clientData?.cultural?.communicationStyle || "");
  const [familyInvolvement, setFamilyInvolvement] = useState(clientData?.cultural?.familyInvolvement || "");
  
  const [newPreference, setNewPreference] = useState({
    category: "",
    preference: "",
    importance: "",
    notes: ""
  });

  const addPreference = () => {
    if (!newPreference.category || !newPreference.preference || !newPreference.importance) return;

    const preference: CulturalPreference = {
      id: Date.now().toString(),
      category: newPreference.category,
      preference: newPreference.preference,
      importance: newPreference.importance,
      notes: newPreference.notes || undefined
    };

    setPreferences([...preferences, preference]);
    setNewPreference({ category: "", preference: "", importance: "", notes: "" });
  };

  const removePreference = (id: string) => {
    setPreferences(preferences.filter(pref => pref.id !== id));
  };

  const handleLanguageChange = (language: string, checked: boolean) => {
    if (checked) {
      setOtherLanguages([...otherLanguages, language]);
    } else {
      setOtherLanguages(otherLanguages.filter(lang => lang !== language));
    }
  };

  const handleSave = () => {
    const culturalData = {
      primaryLanguage,
      otherLanguages,
      interpreterNeeded,
      religion,
      culturalBackground,
      preferences,
      dietaryRestrictions,
      communicationStyle,
      familyInvolvement
    };
    
    onSave({ cultural: culturalData });
    onNext();
  };

  const handleSkip = () => {
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Globe className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">Cultural Information</h2>
          <p className="text-muted-foreground">Cultural preferences and requirements for appropriate service delivery</p>
        </div>
      </div>

      {/* Language & Communication */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Language & Communication</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primary-language">Primary Language</Label>
              <Select value={primaryLanguage} onValueChange={setPrimaryLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select primary language" />
                </SelectTrigger>
                <SelectContent>
                  {commonLanguages.map((language) => (
                    <SelectItem key={language} value={language}>
                      {language}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="religion">Religion/Belief System</Label>
              <Select value={religion} onValueChange={setReligion}>
                <SelectTrigger>
                  <SelectValue placeholder="Select religion" />
                </SelectTrigger>
                <SelectContent>
                  {commonReligions.map((rel) => (
                    <SelectItem key={rel} value={rel}>
                      {rel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Other Languages Spoken</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {commonLanguages.filter(lang => lang !== "Other").map((language) => (
                <div key={language} className="flex items-center space-x-2">
                  <Checkbox
                    id={language}
                    checked={otherLanguages.includes(language)}
                    onCheckedChange={(checked) => handleLanguageChange(language, checked as boolean)}
                  />
                  <Label htmlFor={language} className="text-sm font-normal">
                    {language}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="interpreter-needed"
              checked={interpreterNeeded}
              onCheckedChange={(checked) => setInterpreterNeeded(checked as boolean)}
            />
            <Label htmlFor="interpreter-needed">
              Interpreter services required
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cultural-background">Cultural Background/Heritage</Label>
            <Input
              id="cultural-background"
              placeholder="e.g., Italian-Australian, Lebanese, Aboriginal and Torres Strait Islander"
              value={culturalBackground}
              onChange={(e) => setCulturalBackground(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Cultural Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cultural Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Preference */}
          <div className="p-4 border rounded-lg bg-muted/50">
            <h4 className="font-medium mb-3">Add Cultural Preference</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pref-category">Category</Label>
                <Select 
                  value={newPreference.category} 
                  onValueChange={(value) => setNewPreference({ ...newPreference, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {culturalCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="preference">Preference</Label>
                <Input
                  id="preference"
                  placeholder="Describe preference"
                  value={newPreference.preference}
                  onChange={(e) => setNewPreference({ ...newPreference, preference: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="importance">Importance</Label>
                <Select 
                  value={newPreference.importance} 
                  onValueChange={(value) => setNewPreference({ ...newPreference, importance: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select importance" />
                  </SelectTrigger>
                  <SelectContent>
                    {importanceLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              <Label htmlFor="pref-notes">Additional Notes</Label>
              <Textarea
                id="pref-notes"
                placeholder="Additional details about this preference"
                value={newPreference.notes}
                onChange={(e) => setNewPreference({ ...newPreference, notes: e.target.value })}
                rows={2}
              />
            </div>
            <Button
              onClick={addPreference}
              disabled={!newPreference.category || !newPreference.preference || !newPreference.importance}
              className="mt-3 hover-scale"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Preference
            </Button>
          </div>

          {/* Preferences List */}
          {preferences.length > 0 && (
            <div className="space-y-3">
              {preferences.map((preference) => (
                <div key={preference.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {preference.category}
                        </Badge>
                        <Badge variant={
                          preference.importance === "Very Important" ? "destructive" :
                          preference.importance === "Important" ? "default" : "secondary"
                        }>
                          {preference.importance}
                        </Badge>
                      </div>
                      <p className="font-medium">{preference.preference}</p>
                      {preference.notes && (
                        <p className="text-sm text-muted-foreground mt-1">{preference.notes}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePreference(preference.id)}
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

      {/* Additional Cultural Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Additional Cultural Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dietary-restrictions">Dietary Restrictions & Requirements</Label>
            <Textarea
              id="dietary-restrictions"
              placeholder="Cultural or religious dietary requirements, restrictions, and preferences"
              value={dietaryRestrictions}
              onChange={(e) => setDietaryRestrictions(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="communication-style">Communication Style Preferences</Label>
            <Textarea
              id="communication-style"
              placeholder="Preferred communication approach, formality level, eye contact preferences, etc."
              value={communicationStyle}
              onChange={(e) => setCommunicationStyle(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="family-involvement">Family Involvement & Dynamics</Label>
            <Textarea
              id="family-involvement"
              placeholder="Family structure, decision-making processes, involvement in care, etc."
              value={familyInvolvement}
              onChange={(e) => setFamilyInvolvement(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      {(preferences.length > 0 || primaryLanguage || religion) && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Cultural Profile Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium mb-2">Language</h4>
                <p className="text-sm">{primaryLanguage || "Not specified"}</p>
                {interpreterNeeded && (
                  <Badge variant="outline" className="mt-1 text-xs">Interpreter Required</Badge>
                )}
              </div>
              <div>
                <h4 className="font-medium mb-2">Religion</h4>
                <p className="text-sm">{religion || "Not specified"}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Cultural Preferences</h4>
                <p className="text-sm">{preferences.length} preferences recorded</p>
                <p className="text-xs text-muted-foreground">
                  {preferences.filter(p => p.importance === "Very Important").length} high priority
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={handleSkip}>
          Skip for Now
        </Button>
        <Button onClick={handleSave}>
          Save & Complete
        </Button>
      </div>
    </div>
  );
}