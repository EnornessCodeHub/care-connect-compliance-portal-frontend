import { useState } from "react";
import { Plus, Target, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  targetDate: string;
  status: string;
}

interface GoalsSetupProps {
  onNext: () => void;
  onBack: () => void;
  onSave: (data: any) => void;
  clientData?: any;
}

const goalCategories = [
  "Personal Development",
  "Health & Wellbeing", 
  "Social & Community",
  "Employment & Education",
  "Independent Living",
  "Recreation & Leisure"
];

const priorities = ["High", "Medium", "Low"];

export function GoalsSetup({ onNext, onBack, onSave, clientData }: GoalsSetupProps) {
  const [goals, setGoals] = useState<Goal[]>(clientData?.goals || []);
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    category: "",
    priority: "Medium",
    status: "Not Started"
  });

  const addGoal = () => {
    if (!newGoal.title || !newGoal.description || !newGoal.category) return;

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description,
      category: newGoal.category,
      priority: newGoal.priority || "Medium",
      targetDate: newGoal.targetDate || "",
      status: "Not Started"
    };

    setGoals([...goals, goal]);
    setNewGoal({
      category: "",
      priority: "Medium", 
      status: "Not Started"
    });
  };

  const removeGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const handleSave = () => {
    onSave({ goals });
    onNext();
  };

  const handleSkip = () => {
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Target className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">Goals & Objectives</h2>
          <p className="text-muted-foreground">Set up goals to track client progress and outcomes</p>
        </div>
      </div>

      {/* Add New Goal */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add New Goal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="goal-title">Goal Title *</Label>
              <Input
                id="goal-title"
                placeholder="Enter goal title"
                value={newGoal.title || ""}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal-category">Category *</Label>
              <Select
                value={newGoal.category}
                onValueChange={(value) => setNewGoal({ ...newGoal, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {goalCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal-description">Description *</Label>
            <Textarea
              id="goal-description"
              placeholder="Describe the goal and how success will be measured"
              value={newGoal.description || ""}
              onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="goal-priority">Priority</Label>
              <Select
                value={newGoal.priority}
                onValueChange={(value) => setNewGoal({ ...newGoal, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal-target-date">Target Date</Label>
              <Input
                id="goal-target-date"
                type="date"
                value={newGoal.targetDate || ""}
                onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
              />
            </div>
          </div>

          <Button
            onClick={addGoal}
            disabled={!newGoal.title || !newGoal.description || !newGoal.category}
            className="hover-scale"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Goal
          </Button>
        </CardContent>
      </Card>

      {/* Goals List */}
      {goals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Current Goals ({goals.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {goals.map((goal) => (
                <div key={goal.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{goal.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {goal.category}
                        </Badge>
                        <Badge 
                          variant={goal.priority === "High" ? "destructive" : goal.priority === "Medium" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {goal.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{goal.description}</p>
                      {goal.targetDate && (
                        <p className="text-xs text-muted-foreground">Target: {new Date(goal.targetDate).toLocaleDateString()}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeGoal(goal.id)}
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

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={handleSkip}>
          Skip for Now
        </Button>
        <Button onClick={handleSave} disabled={goals.length === 0}>
          Save & Continue
        </Button>
      </div>
    </div>
  );
}