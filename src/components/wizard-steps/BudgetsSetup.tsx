import { useState } from "react";
import { DollarSign, Calendar, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  remaining: number;
}

interface BudgetsSetupProps {
  onNext: () => void;
  onBack: () => void;
  onSave: (data: any) => void;
  clientData?: any;
}

const budgetCategories = [
  "Core Supports",
  "Capacity Building",
  "Capital Supports",
  "Support Coordination"
];

const fundingManagementTypes = [
  "Self Managed",
  "Plan Managed", 
  "Agency Managed"
];

export function BudgetsSetup({ onNext, onBack, onSave, clientData }: BudgetsSetupProps) {
  const [ndisNumber, setNdisNumber] = useState(clientData?.budgets?.ndisNumber || "");
  const [planStartDate, setPlanStartDate] = useState(clientData?.budgets?.planStartDate || "");
  const [planEndDate, setPlanEndDate] = useState(clientData?.budgets?.planEndDate || "");
  const [fundingManagement, setFundingManagement] = useState(clientData?.budgets?.fundingManagement || "");
  const [planManager, setPlanManager] = useState(clientData?.budgets?.planManager || "");
  const [supportCoordinator, setSupportCoordinator] = useState(clientData?.budgets?.supportCoordinator || "");
  const [categories, setCategories] = useState<BudgetCategory[]>(
    clientData?.budgets?.categories || []
  );
  const [newCategory, setNewCategory] = useState({
    name: "",
    allocated: ""
  });

  const addCategory = () => {
    if (!newCategory.name || !newCategory.allocated) return;

    const category: BudgetCategory = {
      id: Date.now().toString(),
      name: newCategory.name,
      allocated: parseFloat(newCategory.allocated),
      spent: 0,
      remaining: parseFloat(newCategory.allocated)
    };

    setCategories([...categories, category]);
    setNewCategory({ name: "", allocated: "" });
  };

  const removeCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  const updateCategoryAllocation = (id: string, newAllocated: number) => {
    setCategories(categories.map(cat => 
      cat.id === id 
        ? { ...cat, allocated: newAllocated, remaining: newAllocated - cat.spent }
        : cat
    ));
  };

  const totalAllocated = categories.reduce((sum, cat) => sum + cat.allocated, 0);

  const handleSave = () => {
    const budgetData = {
      ndisNumber,
      planStartDate,
      planEndDate,
      fundingManagement,
      planManager,
      supportCoordinator,
      categories,
      totalAllocated
    };
    
    onSave({ budgets: budgetData });
    onNext();
  };

  const handleSkip = () => {
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <DollarSign className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">NDIS Budgets</h2>
          <p className="text-muted-foreground">Configure funding periods and budget allocations</p>
        </div>
      </div>

      {/* NDIS Plan Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">NDIS Plan Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ndis-number">NDIS Number</Label>
              <Input
                id="ndis-number"
                placeholder="Enter NDIS number"
                value={ndisNumber}
                onChange={(e) => setNdisNumber(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="funding-management">Funding Management</Label>
              <Select value={fundingManagement} onValueChange={setFundingManagement}>
                <SelectTrigger>
                  <SelectValue placeholder="Select funding management" />
                </SelectTrigger>
                <SelectContent>
                  {fundingManagementTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plan-start">Plan Start Date</Label>
              <Input
                id="plan-start"
                type="date"
                value={planStartDate}
                onChange={(e) => setPlanStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan-end">Plan End Date</Label>
              <Input
                id="plan-end"
                type="date"
                value={planEndDate}
                onChange={(e) => setPlanEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plan-manager">Plan Manager</Label>
              <Input
                id="plan-manager"
                placeholder="Plan manager name"
                value={planManager}
                onChange={(e) => setPlanManager(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="support-coordinator">Support Coordinator</Label>
              <Input
                id="support-coordinator"
                placeholder="Support coordinator name"
                value={supportCoordinator}
                onChange={(e) => setSupportCoordinator(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Budget Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Category */}
          <div className="p-4 border rounded-lg bg-muted/50">
            <h4 className="font-medium mb-3">Add Budget Category</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category-name">Category</Label>
                <Select 
                  value={newCategory.name} 
                  onValueChange={(value) => setNewCategory({ ...newCategory, name: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="allocated-amount">Allocated Amount ($)</Label>
                <Input
                  id="allocated-amount"
                  type="number"
                  placeholder="0.00"
                  value={newCategory.allocated}
                  onChange={(e) => setNewCategory({ ...newCategory, allocated: e.target.value })}
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={addCategory}
                  disabled={!newCategory.name || !newCategory.allocated}
                  className="hover-scale"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </div>
            </div>
          </div>

          {/* Categories List */}
          {categories.length > 0 && (
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{category.name}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCategory(category.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      Remove
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-semibold text-green-600">
                        ${category.allocated.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Allocated</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold">
                        ${category.spent.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Spent</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-primary">
                        ${category.remaining.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Remaining</div>
                    </div>
                  </div>
                  
                  <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${(category.spent / category.allocated) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Total Summary */}
          {categories.length > 0 && (
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between">
                <span className="font-medium">Total Plan Value:</span>
                <span className="text-xl font-bold text-primary">
                  ${totalAllocated.toLocaleString()}
                </span>
              </div>
            </div>
          )}
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