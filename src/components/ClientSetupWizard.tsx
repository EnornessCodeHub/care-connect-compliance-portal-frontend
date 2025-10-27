import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Check, Target, FileText, DollarSign, Heart, Shield, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// Import individual setup components
import { GoalsSetup } from "./wizard-steps/GoalsSetup";
import { DocumentsSetup } from "./wizard-steps/DocumentsSetup";
import { BudgetsSetup } from "./wizard-steps/BudgetsSetup";
import { HealthSetup } from "./wizard-steps/HealthSetup";
import { ConsentSetup } from "./wizard-steps/ConsentSetup";
import { CulturalSetup } from "./wizard-steps/CulturalSetup";

interface SetupStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType<{ onNext: () => void; onBack: () => void; onSave: (data: any) => void; clientData?: any }>;
  completed: boolean;
}

interface ClientSetupWizardProps {
  clientId: string;
  clientName: string;
}

export function ClientSetupWizard({ clientId, clientName }: ClientSetupWizardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] = useState<Record<string, any>>({});

  const steps: SetupStep[] = [
    {
      id: "goals",
      title: "Goals & Objectives",
      description: "Set up client goals and objectives",
      icon: Target,
      component: GoalsSetup,
      completed: false,
    },
    {
      id: "documents",
      title: "Documents",
      description: "Upload required documents",
      icon: FileText,
      component: DocumentsSetup,
      completed: false,
    },
    {
      id: "budgets",
      title: "NDIS Budgets",
      description: "Configure funding and budgets",
      icon: DollarSign,
      component: BudgetsSetup,
      completed: false,
    },
    {
      id: "health",
      title: "Health Information",
      description: "Medical and health details",
      icon: Heart,
      component: HealthSetup,
      completed: false,
    },
    {
      id: "consent",
      title: "Consent & Permissions",
      description: "Privacy and consent settings",
      icon: Shield,
      component: ConsentSetup,
      completed: false,
    },
    {
      id: "cultural",
      title: "Cultural Information",
      description: "Cultural preferences and needs",
      icon: Globe,
      component: CulturalSetup,
      completed: false,
    },
  ];

  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepSave = (stepId: string, data: any) => {
    setStepData(prev => ({
      ...prev,
      [stepId]: data
    }));
    setCompletedSteps(prev => new Set([...prev, stepId]));
    
    toast({
      title: "Step Saved",
      description: `${steps[currentStep].title} information has been saved.`,
    });
  };

  const handleSkipStep = () => {
    toast({
      title: "Step Skipped",
      description: `${steps[currentStep].title} has been skipped. You can complete it later from the client profile.`,
    });
    handleNext();
  };

  const handleComplete = () => {
    toast({
      title: "Client Setup Complete",
      description: `${clientName} has been successfully set up with all provided information.`,
    });
    navigate(`/clients/${clientId}`);
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const currentStepData = steps[currentStep];
  const StepComponent = currentStepData.component;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Client Setup Wizard</h1>
              <p className="text-muted-foreground">Complete the setup for {clientName}</p>
            </div>
            <Badge variant="outline" className="px-3 py-1">
              Step {currentStep + 1} of {steps.length}
            </Badge>
          </div>
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <div className="w-64 space-y-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Setup Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      currentStep === index
                        ? "bg-primary/10 border border-primary/20"
                        : completedSteps.has(step.id)
                        ? "bg-green-50 hover:bg-green-100"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => goToStep(index)}
                  >
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      completedSteps.has(step.id)
                        ? "bg-green-600 text-white"
                        : currentStep === index
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {completedSteps.has(step.id) ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <step.icon className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        currentStep === index ? "text-primary" : ""
                      }`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <currentStepData.icon className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle>{currentStepData.title}</CardTitle>
                    <CardDescription>{currentStepData.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <StepComponent
                  onNext={handleNext}
                  onBack={handleBack}
                  onSave={(data) => handleStepSave(currentStepData.id, data)}
                  clientData={stepData}
                />
              </CardContent>
            </Card>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between mt-6">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="hover-scale"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={handleSkipStep}
                  className="hover-scale"
                >
                  Skip Step
                </Button>
                
                <Button
                  onClick={handleNext}
                  className="hover-scale"
                >
                  {currentStep === steps.length - 1 ? (
                    <>
                      Complete Setup
                      <Check className="h-4 w-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}