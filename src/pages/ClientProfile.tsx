import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Save, X, User, Phone, Mail, MapPin, Calendar, Shield, Heart, FileText, Globe, Settings, BarChart3, TrendingUp, AlertTriangle, CheckCircle, Clock, DollarSign, Users, Activity, Plus, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Mock client data
const mockClient = {
  id: 'CL001',
  name: 'Sarah Johnson',
  personalInfo: {
    firstName: 'Sarah',
    lastName: 'Johnson',
    dateOfBirth: '1990-05-15',
    preferredName: 'Sarah',
    gender: 'Female',
    email: 'sarah.johnson@email.com',
    phone: '+61 400 123 456',
    address: '123 Main Street, Brisbane QLD 4000',
    emergencyContact: {
      name: 'John Johnson',
      relationship: 'Father',
      phone: '+61 400 654 321'
    }
  },
  ndisInfo: {
    ndisNumber: 'NDIS123456789',
    planStartDate: '2024-01-01',
    planEndDate: '2024-12-31',
    planManager: 'Self Managed',
    supportCoordinator: 'Jane Smith',
    budgetCategories: [
      { 
        name: 'Core Supports', 
        allocated: 25000, 
        spent: 12500, 
        remaining: 12500,
        lineItems: [
          { id: 'cs-001', name: 'Assistance with Daily Personal Activities', code: '01_011_0107_1_1', remaining: 5000 },
          { id: 'cs-002', name: 'Assistance with Daily Life Tasks', code: '01_013_0107_1_1', remaining: 7500 }
        ]
      },
      { 
        name: 'Capacity Building', 
        allocated: 15000, 
        spent: 8000, 
        remaining: 7000,
        lineItems: [
          { id: 'cb-001', name: 'Improved Daily Living Skills', code: '09_012_0125_6_1', remaining: 4000 },
          { id: 'cb-002', name: 'Community Participation', code: '09_013_0125_6_1', remaining: 3000 }
        ]
      },
      { 
        name: 'Capital Supports', 
        allocated: 10000, 
        spent: 3000, 
        remaining: 7000,
        lineItems: [
          { id: 'cap-001', name: 'Assistive Technology', code: '03_012_0103_2_3', remaining: 7000 }
        ]
      }
    ],
    planPeriods: [
      {
        id: 'period-1',
        name: 'Current Plan Period',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        status: 'current',
        isActive: true
      },
      {
        id: 'period-2', 
        name: 'Previous Plan Period',
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        status: 'completed',
        isActive: false
      }
    ]
  },
  healthSafety: {
    allergies: 'Nuts, Dairy',
    medications: 'Ventolin (as needed)',
    medicalConditions: 'Asthma',
    mobilityAids: 'None',
    riskAssessment: 'Low risk',
    emergencyProcedures: 'Standard protocol'
  },
  preferences: {
    communicationMethod: 'Email',
    languagePreference: 'English',
    consentToShare: true,
    photoConsent: true,
    dataRetention: 'Standard',
    privacyLevel: 'Standard'
  },
  cultural: {
    culturalBackground: 'Australian',
    religiousBeliefs: 'None specified',
    dietaryRequirements: 'Vegetarian',
    culturalConsiderations: 'None'
  },
  administrative: {
    enrollmentDate: '2024-01-01',
    caseManager: 'Emma Wilson',
    fundingSource: 'NDIS',
    serviceProvider: 'Care Solutions Ltd',
    reviewDate: '2024-06-01',
    notes: 'Participant is highly motivated and engaged with services.'
  },
  dashboard: {
    budgetUtilization: {
      total: 50000,
      spent: 23500,
      remaining: 26500,
      utilizationRate: 47
    },
    fundingUtilization: {
      categories: [
        { name: 'Core Supports', budget: 25000, spent: 12500, percentage: 50 },
        { name: 'Capacity Building', budget: 15000, spent: 8000, percentage: 53 },
        { name: 'Capital Supports', budget: 10000, spent: 3000, percentage: 30 }
      ]
    },
    serviceDelivery: {
      hoursThisMonth: 45,
      hoursLastMonth: 38,
      trend: 'up',
      averageRating: 4.8
    },
    incidents: {
      total: 2,
      resolved: 1,
      pending: 1,
      recent: [
        { id: 'I001', date: '2024-01-14', type: 'Safety', status: 'Resolved' },
        { id: 'I002', date: '2024-01-09', type: 'Medication', status: 'Pending' }
      ]
    },
    complaints: {
      total: 1,
      resolved: 1,
      pending: 0,
      recent: [
        { id: 'C001', date: '2024-01-12', type: 'Service Quality', status: 'Resolved' }
      ]
    },
    goals: {
      total: 4,
      achieved: 1,
      inProgress: 3,
      notStarted: 0
    },
    individualGoals: [
      {
        id: 1,
        title: 'Improve Independent Living Skills',
        description: 'Develop skills to live more independently including cooking, cleaning, and personal care',
        category: 'Independence',
        priority: 'High',
        status: 'In Progress',
        progress: 65,
        startDate: '2024-01-01',
        targetDate: '2024-08-01',
        milestones: [
          { id: 1, description: 'Complete basic cooking course', completed: true, targetDate: '2024-03-01', completedDate: '2024-02-28' },
          { id: 2, description: 'Establish daily cleaning routine', completed: true, targetDate: '2024-04-01', completedDate: '2024-03-15' },
          { id: 3, description: 'Manage personal finances independently', completed: false, targetDate: '2024-06-01' },
          { id: 4, description: 'Complete independent living assessment', completed: false, targetDate: '2024-08-01' }
        ]
      },
      {
        id: 2,
        title: 'Secure Part-Time Employment',
        description: 'Find and maintain part-time employment in a supported environment',
        category: 'Employment',
        priority: 'Medium',
        status: 'In Progress',
        progress: 30,
        startDate: '2024-02-01',
        targetDate: '2024-10-01',
        milestones: [
          { id: 1, description: 'Complete resume writing workshop', completed: true, targetDate: '2024-03-01', completedDate: '2024-02-25' },
          { id: 2, description: 'Practice interview skills', completed: false, targetDate: '2024-04-01' },
          { id: 3, description: 'Apply for suitable positions', completed: false, targetDate: '2024-06-01' },
          { id: 4, description: 'Secure part-time employment', completed: false, targetDate: '2024-10-01' }
        ]
      }
    ]
  }
};

// Mock appointments data
const mockAppointments = [
  {
    id: 'apt-001',
    title: 'Support Session - Daily Living Skills',
    date: '2024-01-15',
    time: '10:00 AM',
    worker: 'Emma Wilson',
    type: 'In-person'
  },
  {
    id: 'apt-002', 
    title: 'Community Participation Activity',
    date: '2024-01-12',
    time: '2:00 PM',
    worker: 'Michael Brown',
    type: 'Community'
  },
  {
    id: 'apt-003',
    title: 'Case Management Review',
    date: '2024-01-10',
    time: '11:00 AM', 
    worker: 'Sarah Davis',
    type: 'Virtual'
  }
];

const ClientProfile = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [hasFundingPeriods, setHasFundingPeriods] = useState(true);
  const [numberOfPeriods, setNumberOfPeriods] = useState(3);
  const [selectedBudgetItems, setSelectedBudgetItems] = useState<Record<string, boolean>>({
    'assistance-with-daily-life': true,
    'capacity-building': true,
    'capital': true
  });
  const [fundingManagement, setFundingManagement] = useState('');
  const [supportDetails, setSupportDetails] = useState('');
  const [fundingPeriodDates, setFundingPeriodDates] = useState<Record<number, { startDate: string; endDate: string }>>({});

  // Pricing data state
  const [pricingSchedules, setPricingSchedules] = useState<any[]>([]);
  const [pricingItems, setPricingItems] = useState<any[]>([]);
  const [loadingPricing, setLoadingPricing] = useState(false);
  const [supportCategories, setSupportCategories] = useState<string[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [selectedRegGroups, setSelectedRegGroups] = useState<Record<string, string>>({});
  const [selectedSupportItems, setSelectedSupportItems] = useState<Record<string, string>>({});
  
  const [allocatedHours, setAllocatedHours] = useState<Record<string, string>>({});
  const [savedAllocations, setSavedAllocations] = useState<Record<string, Array<{
    id: string;
    supportItemNumber: string;
    supportItemName: string;
    allocatedAmount: number;
    allocatedHours: number;
    unitPrice: number;
    calculatedTotal: number;
    fundingPeriod: string;
    priority: string;
    notes: string;
    unit: string;
  }>>>({});
  const [currentAllocation, setCurrentAllocation] = useState<Record<string, {
    fundingPeriod: string;
    priority: string;
    notes: string;
  }>>({});

  // New Goal form state
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'Medium',
    targetDate: '',
    milestones: []
  });

  // Action button states
  const [showCaseNoteDialog, setShowCaseNoteDialog] = useState(false);
  const [showCostDialog, setShowCostDialog] = useState(false);
  const [showIncidentDialog, setShowIncidentDialog] = useState(false);
  const [showComplaintDialog, setShowComplaintDialog] = useState(false);

  // Form states for action dialogs
  const [caseNoteForm, setCaseNoteForm] = useState({
    type: 'Progress Update',
    note: '',
    isPrivate: false
  });

  const [costForm, setCostForm] = useState({
    serviceTitle: '',
    selectedPricingItem: '',
    unitPrice: '',
    duration: '', // HH:MM format
    totalAmount: '',
    date: '',
    status: 'Uninvoiced', // Automatically set to Uninvoiced
    budgetCategory: '',
    lineItem: '',
    planPeriod: '',
    notes: '',
    appointmentId: '',
    uploadedDocument: null // For document uploads
  });

  const [incidentForm, setIncidentForm] = useState({
    type: 'Safety Incident',
    description: '',
    severity: 'Low',
    actionTaken: ''
  });

  const [complaintForm, setComplaintForm] = useState({
    type: 'Service Quality',
    description: '',
    priority: 'Medium'
  });

  // Document management states
  const [documents, setDocuments] = useState([]);
  const [showDocumentDialog, setShowDocumentDialog] = useState(false);
  const [documentForm, setDocumentForm] = useState({
    title: '',
    documentType: '',
    file: null,
    notes: ''
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadPricingData();
    loadFundingAllocations();
  }, []);

  const loadFundingAllocations = async () => {
    try {
      const { data, error } = await supabase
        .from('client_funding_allocations')
        .select('*')
        .eq('client_id', 'CLI-001')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group allocations by budget category
      const groupedAllocations: Record<string, Array<any>> = {};
      data?.forEach(allocation => {
        if (!groupedAllocations[allocation.budget_category]) {
          groupedAllocations[allocation.budget_category] = [];
        }
        groupedAllocations[allocation.budget_category].push({
          id: allocation.id,
          supportItemNumber: allocation.support_item_number,
          supportItemName: allocation.support_item_name,
          allocatedAmount: allocation.allocated_amount,
          allocatedHours: allocation.allocated_hours,
          unitPrice: allocation.unit_price,
          calculatedTotal: allocation.calculated_total,
          fundingPeriod: allocation.funding_period,
          priority: allocation.priority,
          notes: allocation.notes,
          unit: allocation.unit
        });
      });

      setSavedAllocations(groupedAllocations);
    } catch (error) {
      console.error('Error loading funding allocations:', error);
      toast({
        title: "Error",
        description: "Failed to load funding allocations",
        variant: "destructive"
      });
    }
  };

  const loadPricingData = async () => {
    setLoadingPricing(true);
    try {
      // Load pricing schedules that apply to all funding periods
      const { data: schedules, error: scheduleError } = await supabase
        .from('pricing_schedules')
        .select('*')
        .eq('applies_to_all_periods', true)
        .order('year_period', { ascending: false });

      if (scheduleError) throw scheduleError;
      setPricingSchedules(schedules || []);

      // Set the most recent active schedule as default
      const activeSchedule = schedules?.find(s => s.is_active) || schedules?.[0];
      if (activeSchedule) {
        setSelectedSchedule(activeSchedule.id);
        await loadPricingItems(activeSchedule.id);
      }
    } catch (error) {
      console.error('Error loading pricing schedules:', error);
    } finally {
      setLoadingPricing(false);
    }
  };

  const loadPricingItems = async (scheduleId: string) => {
    try {
      const { data, error } = await supabase
        .from('pricing_items')
        .select('*')
        .eq('pricing_schedule_id', scheduleId)
        .eq('is_active', true)
        .order('support_item_number', { ascending: true });

      if (error) throw error;
      setPricingItems(data || []);
      
      // Extract unique support categories
      const categories = [...new Set(data?.map(item => item.support_category_name).filter(Boolean) || [])];
      setSupportCategories(categories);
    } catch (error) {
      console.error('Error loading pricing items:', error);
    } finally {
      setLoadingPricing(false);
    }
  };

  // Helper function to convert HH:MM to decimal hours
  const convertDurationToHours = (duration) => {
    if (!duration || !duration.includes(':')) return 0;
    const [hours, minutes] = duration.split(':').map(Number);
    return hours + (minutes / 60);
  };

  // Helper function to calculate total amount
  const calculateTotalAmount = (unitPrice, duration) => {
    const hours = convertDurationToHours(duration);
    const price = parseFloat(unitPrice) || 0;
    return (price * hours).toFixed(2);
  };

  // Helper function to format date as DD-MM-YYYY
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Action button handlers
  const handleAddCaseNote = () => {
    if (!caseNoteForm.note.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a case note.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Case Note Added",
      description: "Case note has been saved successfully.",
    });

    setCaseNoteForm({ type: 'Progress Update', note: '', isPrivate: false });
    setShowCaseNoteDialog(false);
  };

  const handleAddCost = async () => {
    if (!costForm.serviceTitle.trim() || !costForm.selectedPricingItem || !costForm.duration || !costForm.date || !costForm.budgetCategory || !costForm.lineItem || !costForm.planPeriod) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields including pricing item, duration, and plan period.",
        variant: "destructive",
      });
      return;
    }

    // Validate duration format (HH:MM)
    const durationPattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!durationPattern.test(costForm.duration)) {
      toast({
        title: "Invalid Duration",
        description: "Please enter duration in HH:MM format (e.g., 02:30).",
        variant: "destructive",
      });
      return;
    }

    const selectedCategory = mockClient.ndisInfo.budgetCategories.find(cat => cat.name === costForm.budgetCategory);
    const selectedLineItem = selectedCategory?.lineItems.find(item => item.id === costForm.lineItem);
    const selectedPricingItem = pricingItems.find(item => item.id === costForm.selectedPricingItem);
    const costAmount = parseFloat(costForm.totalAmount);

    // Check if there's sufficient budget
    if (selectedLineItem && costAmount > selectedLineItem.remaining) {
      toast({
        title: "Insufficient Budget",
        description: `Cost of $${costForm.totalAmount} exceeds remaining budget of $${selectedLineItem.remaining.toLocaleString()}.`,
        variant: "destructive",
      });
      return;
    }

    // Deduct from budget (in a real app, this would update the database)
    if (selectedCategory && selectedLineItem) {
      const categoryIndex = mockClient.ndisInfo.budgetCategories.findIndex(cat => cat.name === costForm.budgetCategory);
      const lineItemIndex = selectedCategory.lineItems.findIndex(item => item.id === costForm.lineItem);
      
      // Update the budget amounts
      mockClient.ndisInfo.budgetCategories[categoryIndex].spent += costAmount;
      mockClient.ndisInfo.budgetCategories[categoryIndex].remaining -= costAmount;
      mockClient.ndisInfo.budgetCategories[categoryIndex].lineItems[lineItemIndex].remaining -= costAmount;
    }

    try {
      // Upload document if one is attached
      let uploadedDocument = null;
      if (costForm.uploadedDocument) {
        uploadedDocument = await handleDocumentUpload(
          costForm.uploadedDocument,
          `Cost Receipt - ${costForm.serviceTitle}`,
          'Receipt',
          `Supporting document for cost entry: ${costForm.serviceTitle}`,
          null // costEntryId would be set in a real implementation
        );
        
        // Add to documents list
        setDocuments(prev => [uploadedDocument, ...prev]);
      }

      toast({
        title: "Cost Added",
        description: `Cost of $${costForm.totalAmount} for ${costForm.duration} duration has been recorded as Uninvoiced under ${selectedLineItem?.name}.${uploadedDocument ? ' Document uploaded successfully.' : ''}`,
      });
    } catch (error) {
      toast({
        title: "Cost Added with Warning",
        description: `Cost recorded successfully, but document upload failed. Please try uploading the document separately.`,
        variant: "default",
      });
    }

    setCostForm({ 
      serviceTitle: '',
      selectedPricingItem: '',
      unitPrice: '',
      duration: '',
      totalAmount: '',
      date: '', 
      status: 'Uninvoiced', // Always reset to Uninvoiced
      budgetCategory: '',
      lineItem: '',
      planPeriod: '',
      notes: '',
      appointmentId: '',
      uploadedDocument: null
    });
    setShowCostDialog(false);
  };

  // Document upload handler
  const handleDocumentUpload = async (file, title, documentType, notes = '', costEntryId = null) => {
    if (!file) return null;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${clientId}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('client-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: documentData, error: insertError } = await supabase
        .from('documents')
        .insert({
          client_id: clientId,
          title: title,
          document_type: documentType,
          file_name: file.name,
          file_path: uploadData.path,
          file_size: file.size,
          mime_type: file.type,
          cost_entry_id: costEntryId,
          notes: notes
        })
        .select()
        .single();

      if (insertError) throw insertError;

      return documentData;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  };

  // Handle document form submission
  const handleAddDocument = async () => {
    if (!documentForm.title.trim() || !documentForm.documentType || !documentForm.file) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and select a file.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const newDocument = await handleDocumentUpload(
        documentForm.file,
        documentForm.title,
        documentForm.documentType,
        documentForm.notes
      );

      setDocuments(prev => [newDocument, ...prev]);
      
      toast({
        title: "Document Uploaded",
        description: `${documentForm.title} has been uploaded successfully.`,
      });

      setDocumentForm({
        title: '',
        documentType: '',
        file: null,
        notes: ''
      });
      setShowDocumentDialog(false);
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleAddIncident = () => {
    if (!incidentForm.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter incident description.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Incident Reported",
      description: "Incident has been logged successfully.",
    });

    setIncidentForm({ type: 'Safety Incident', description: '', severity: 'Low', actionTaken: '' });
    setShowIncidentDialog(false);
  };

  const handleAddComplaint = () => {
    if (!complaintForm.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter complaint description.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Complaint Logged",
      description: "Complaint has been submitted successfully.",
    });

    setComplaintForm({ type: 'Service Quality', description: '', priority: 'Medium' });
    setShowComplaintDialog(false);
  };

  const handleAddNewGoal = () => {
    if (!newGoal.title || !newGoal.description || !newGoal.category || !newGoal.targetDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Create new goal with auto-generated ID
    const goal = {
      id: Date.now(),
      title: newGoal.title,
      description: newGoal.description,
      category: newGoal.category,
      priority: newGoal.priority,
      status: 'Not Started',
      progress: 0,
      startDate: new Date().toISOString().split('T')[0],
      targetDate: newGoal.targetDate,
      milestones: []
    };

    // In a real app, you would save this to your backend
    // For now, we'll just show a success message
    toast({
      title: "Goal Added",
      description: `"${newGoal.title}" has been added successfully.`,
    });

    // Reset form
    setNewGoal({
      title: '',
      description: '',
      category: '',
      priority: 'Medium',
      targetDate: '',
      milestones: []
    });
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save the data to your backend
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Here you would typically reset the form data
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/clients')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Clients
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{mockClient.name}</h1>
              <p className="text-muted-foreground">Client ID: {mockClient.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleSave} size="sm" className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
                <Button onClick={handleCancel} variant="outline" size="sm" className="flex items-center gap-2">
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => setIsEditing(true)} size="sm" className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2 hover-scale"
                  onClick={() => setShowCaseNoteDialog(true)}
                >
                  <Plus className="h-4 w-4" />
                  Case Note
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2 hover-scale"
                  onClick={() => setShowCostDialog(true)}
                >
                  <DollarSign className="h-4 w-4" />
                  Cost
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2 hover-scale"
                  onClick={() => setShowIncidentDialog(true)}
                >
                  <AlertTriangle className="h-4 w-4" />
                  Incident
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2 hover-scale"
                  onClick={() => setShowComplaintDialog(true)}
                >
                  <FileText className="h-4 w-4" />
                  Complaint
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Profile Summary */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                    <p className="font-medium">{mockClient.personalInfo.firstName} {mockClient.personalInfo.lastName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                    <p className="font-medium">{mockClient.personalInfo.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="font-medium">{mockClient.personalInfo.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">NDIS Number</p>
                    <p className="font-medium">{mockClient.ndisInfo.ndisNumber}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:grid-cols-12 gap-1">
            <TabsTrigger value="overview" className="text-xs lg:text-sm">Overview</TabsTrigger>
            <TabsTrigger value="goals" className="text-xs lg:text-sm">Goals</TabsTrigger>
            <TabsTrigger value="case-notes" className="text-xs lg:text-sm">Case Notes</TabsTrigger>
            <TabsTrigger value="complaints" className="text-xs lg:text-sm">Complaints</TabsTrigger>
            <TabsTrigger value="incidents" className="text-xs lg:text-sm">Incidents</TabsTrigger>
            <TabsTrigger value="documents" className="text-xs lg:text-sm">Documents</TabsTrigger>
            <TabsTrigger value="ndis-budgets" className="text-xs lg:text-sm">Budgets</TabsTrigger>
            <TabsTrigger value="personal" className="text-xs lg:text-sm">Personal</TabsTrigger>
            <TabsTrigger value="health" className="text-xs lg:text-sm">Health</TabsTrigger>
            <TabsTrigger value="consent" className="text-xs lg:text-sm">Consent</TabsTrigger>
            <TabsTrigger value="cultural" className="text-xs lg:text-sm">Cultural</TabsTrigger>
            <TabsTrigger value="admin" className="text-xs lg:text-sm">Admin</TabsTrigger>
          </TabsList>

          {/* Client Overview Dashboard Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Actions - Moved to top */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col items-center gap-2 hover-scale">
                    <FileText className="h-6 w-6" />
                    <span className="text-sm">Add Case Note</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center gap-2 hover-scale">
                    <Calendar className="h-6 w-6" />
                    <span className="text-sm">Schedule Visit</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center gap-2 hover-scale">
                    <BarChart3 className="h-6 w-6" />
                    <span className="text-sm">View Reports</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center gap-2 hover-scale">
                    <Users className="h-6 w-6" />
                    <span className="text-sm">Team Meeting</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Dashboard Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Budget Utilization */}
              <Card className="animate-fade-in hover-scale">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Budget Utilization</p>
                      <p className="text-2xl font-bold">{mockClient.dashboard.budgetUtilization.utilizationRate}%</p>
                      <p className="text-sm text-muted-foreground">
                        ${mockClient.dashboard.budgetUtilization.spent.toLocaleString()} / ${mockClient.dashboard.budgetUtilization.total.toLocaleString()}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              {/* Service Hours */}
              <Card className="animate-fade-in hover-scale">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Service Hours</p>
                      <p className="text-2xl font-bold">{mockClient.dashboard.serviceDelivery.hoursThisMonth}h</p>
                      <p className="text-sm text-green-600 flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        +{mockClient.dashboard.serviceDelivery.hoursThisMonth - mockClient.dashboard.serviceDelivery.hoursLastMonth}h from last month
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              {/* Active Goals */}
              <Card className="animate-fade-in hover-scale">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Goals</p>
                      <p className="text-2xl font-bold">{mockClient.dashboard.goals.inProgress}</p>
                      <p className="text-sm text-muted-foreground">
                        {mockClient.dashboard.goals.achieved} completed
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              {/* Service Rating */}
              <Card className="animate-fade-in hover-scale">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Service Rating</p>
                      <p className="text-2xl font-bold">{mockClient.dashboard.serviceDelivery.averageRating}/5</p>
                      <p className="text-sm text-muted-foreground">Excellent service</p>
                    </div>
                    <Users className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Funding Utilization Chart */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Funding Utilization by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockClient.dashboard.fundingUtilization.categories.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{category.name}</span>
                        <span>${category.spent.toLocaleString()} / ${category.budget.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            category.percentage >= 80 ? 'bg-red-600' :
                            category.percentage >= 60 ? 'bg-yellow-600' :
                            'bg-green-600'
                          }`}
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {category.percentage}% utilized
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Incidents */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Recent Incidents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockClient.dashboard.incidents.recent.slice(0, 3).map((incident, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Incident #{incident.id}</p>
                          <p className="text-sm text-muted-foreground">{incident.type} - {incident.date}</p>
                        </div>
                        <Badge variant={incident.status === 'Resolved' ? 'default' : 'secondary'}>
                          {incident.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Complaints */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Recent Complaints
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockClient.dashboard.complaints.recent.length > 0 ? (
                      mockClient.dashboard.complaints.recent.map((complaint, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">Complaint #{complaint.id}</p>
                            <p className="text-sm text-muted-foreground">{complaint.type} - {complaint.date}</p>
                          </div>
                          <Badge variant={complaint.status === 'Resolved' ? 'default' : 'secondary'}>
                            {complaint.status}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No recent complaints</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions removed from here - moved to top */}
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-6">
            {/* Goals Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="hover-scale">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Goals</p>
                      <p className="text-2xl font-bold">{mockClient.dashboard.goals.total}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover-scale">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Achieved</p>
                      <p className="text-2xl font-bold text-green-600">{mockClient.dashboard.goals.achieved}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover-scale">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                      <p className="text-2xl font-bold text-orange-600">{mockClient.dashboard.goals.inProgress}</p>
                    </div>
                    <Clock className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Individual Goals */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Individual Goals</h3>
                {isEditing && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="hover-scale">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Goal
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add New Goal</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="goal-title">Title*</Label>
                          <Input
                            id="goal-title"
                            value={newGoal.title}
                            onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Enter goal title"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="goal-description">Description*</Label>
                          <Textarea
                            id="goal-description"
                            value={newGoal.description}
                            onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Describe the goal"
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="goal-category">Category*</Label>
                            <Select
                              value={newGoal.category}
                              onValueChange={(value) => setNewGoal(prev => ({ ...prev, category: value }))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Employment">Employment</SelectItem>
                                <SelectItem value="Independence">Independence</SelectItem>
                                <SelectItem value="Health">Health</SelectItem>
                                <SelectItem value="Social">Social</SelectItem>
                                <SelectItem value="Education">Education</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="goal-priority">Priority</Label>
                            <Select
                              value={newGoal.priority}
                              onValueChange={(value) => setNewGoal(prev => ({ ...prev, priority: value }))}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Low">Low</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="High">High</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="goal-target-date">Target Date*</Label>
                          <Input
                            id="goal-target-date"
                            type="date"
                            value={newGoal.targetDate}
                            onChange={(e) => setNewGoal(prev => ({ ...prev, targetDate: e.target.value }))}
                          />
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                          <DialogTrigger asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogTrigger>
                          <Button onClick={handleAddNewGoal}>Add Goal</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
              
              <div className="grid gap-4">
                {mockClient.dashboard.individualGoals.map((goal) => (
                  <Card key={goal.id} className="animate-fade-in hover-scale">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{goal.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">{goal.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            goal.status === 'Achieved' ? 'default' :
                            goal.status === 'In Progress' ? 'secondary' :
                            'outline'
                          }>
                            {goal.status}
                          </Badge>
                          <Badge variant="outline" className={
                            goal.priority === 'High' ? 'border-red-200 text-red-700' :
                            goal.priority === 'Medium' ? 'border-orange-200 text-orange-700' :
                            'border-green-200 text-green-700'
                          }>
                            {goal.priority}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-muted-foreground">Category:</span>
                          <p>{goal.category}</p>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Start Date:</span>
                          <p>{new Date(goal.startDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Target Date:</span>
                          <p>{new Date(goal.targetDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{goal.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              goal.progress === 100 ? 'bg-green-600' :
                              goal.progress >= 50 ? 'bg-blue-600' :
                              'bg-orange-600'
                            }`}
                            style={{ width: `${goal.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Milestones */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm">Milestones</h4>
                        <div className="space-y-2">
                          {goal.milestones.map((milestone) => (
                            <div key={milestone.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                milestone.completed ? 'bg-green-600' : 'bg-gray-300'
                              }`}>
                                {milestone.completed && (
                                  <CheckCircle className="h-3 w-3 text-white" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className={`text-sm ${milestone.completed ? 'line-through text-muted-foreground' : ''}`}>
                                  {milestone.description}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {milestone.completed 
                                    ? `Completed: ${new Date(milestone.completedDate).toLocaleDateString()}`
                                    : `Target: ${new Date(milestone.targetDate).toLocaleDateString()}`
                                  }
                                </p>
                              </div>
                              {isEditing && (
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Edit className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {isEditing && (
                        <div className="flex gap-2 pt-2 border-t">
                          <Button variant="outline" size="sm" className="hover-scale">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Goal
                          </Button>
                          <Button variant="outline" size="sm" className="hover-scale">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Add Milestone
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Case Notes and Billing Tab */}
          <TabsContent value="case-notes" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Case Notes Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Recent Case Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    {[
                      { id: 1, date: '2024-01-15', author: 'Sarah Wilson', note: 'Client attended scheduled appointment. Discussed progress towards employment goal. Client is motivated and engaged.', type: 'Progress Update' },
                      { id: 2, date: '2024-01-10', author: 'Mike Johnson', note: 'Family meeting conducted. Reviewed support plan and updated goals based on client preferences.', type: 'Family Meeting' },
                      { id: 3, date: '2024-01-05', author: 'Emma Davis', note: 'Service delivery completed. Client demonstrated improved independent living skills.', type: 'Service Delivery' }
                    ].map((note) => (
                      <div key={note.id} className="border-l-4 border-primary/20 pl-4 py-2">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{note.type}</Badge>
                          <span className="text-sm text-muted-foreground">{note.date}</span>
                        </div>
                        <p className="text-sm mb-2">{note.note}</p>
                        <p className="text-xs text-muted-foreground">By: {note.author}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Billing Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Recent Billing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    {[
                      { id: 1, date: '2024-01-15', service: 'Personal Care Support', amount: 285.50, status: 'Invoiced', hours: 3.5 },
                      { id: 2, date: '2024-01-10', service: 'Community Participation', amount: 152.00, status: 'Paid', hours: 2.0 },
                      { id: 3, date: '2024-01-05', service: 'Capacity Building', amount: 420.75, status: 'Pending', hours: 4.5 }
                    ].map((billing) => (
                      <div key={billing.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{billing.service}</p>
                          <p className="text-sm text-muted-foreground">{billing.date} • {billing.hours} hours</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${billing.amount}</p>
                          <Badge variant={billing.status === 'Paid' ? 'default' : billing.status === 'Pending' ? 'secondary' : 'outline'}>
                            {billing.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Complaints Tab */}
          <TabsContent value="complaints" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Complaint History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { 
                      id: 'C001', 
                      date: '2024-01-12', 
                      type: 'Service Quality', 
                      description: 'Concern raised about punctuality of support worker', 
                      status: 'Resolved', 
                      priority: 'Medium',
                      resolvedDate: '2024-01-18'
                    },
                    { 
                      id: 'C002', 
                      date: '2024-01-08', 
                      type: 'Communication', 
                      description: 'Request for better communication about schedule changes', 
                      status: 'In Progress', 
                      priority: 'Low',
                      resolvedDate: null
                    }
                  ].map((complaint) => (
                    <Card key={complaint.id} className="hover-scale">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium">Complaint #{complaint.id}</h4>
                            <p className="text-sm text-muted-foreground">{complaint.date}</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant={complaint.priority === 'High' ? 'destructive' : complaint.priority === 'Medium' ? 'secondary' : 'outline'}>
                              {complaint.priority}
                            </Badge>
                            <Badge variant={complaint.status === 'Resolved' ? 'default' : 'secondary'}>
                              {complaint.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm font-medium">Type: </span>
                            <span className="text-sm">{complaint.type}</span>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Description: </span>
                            <span className="text-sm">{complaint.description}</span>
                          </div>
                          {complaint.resolvedDate && (
                            <div>
                              <span className="text-sm font-medium">Resolved: </span>
                              <span className="text-sm text-green-600">{complaint.resolvedDate}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Incidents Tab */}
          <TabsContent value="incidents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Incident Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { 
                      id: 'I001', 
                      date: '2024-01-14', 
                      type: 'Safety Incident', 
                      description: 'Minor slip in bathroom - no injury occurred, preventive measures discussed', 
                      severity: 'Low', 
                      status: 'Closed',
                      reportedBy: 'Support Worker'
                    },
                    { 
                      id: 'I002', 
                      date: '2024-01-09', 
                      type: 'Medication Error', 
                      description: 'Incorrect dosage administered - corrected immediately, doctor notified', 
                      severity: 'Medium', 
                      status: 'Under Investigation',
                      reportedBy: 'Nursing Staff'
                    }
                  ].map((incident) => (
                    <Card key={incident.id} className="hover-scale">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium">Incident #{incident.id}</h4>
                            <p className="text-sm text-muted-foreground">{incident.date}</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant={incident.severity === 'High' ? 'destructive' : incident.severity === 'Medium' ? 'secondary' : 'outline'}>
                              {incident.severity} Severity
                            </Badge>
                            <Badge variant={incident.status === 'Closed' ? 'default' : 'secondary'}>
                              {incident.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm font-medium">Type: </span>
                            <span className="text-sm">{incident.type}</span>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Description: </span>
                            <span className="text-sm">{incident.description}</span>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Reported by: </span>
                            <span className="text-sm">{incident.reportedBy}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Documents
                  </div>
                  <Button onClick={() => setShowDocumentDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {documents.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No documents uploaded yet.</p>
                      <p className="text-sm">Upload your first document to get started.</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {documents.map((doc) => (
                        <Card key={doc.id} className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium">{doc.title}</h4>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                <span>{doc.document_type}</span>
                                <span>{formatDate(doc.upload_date)}</span>
                                <span>{(doc.file_size / 1024 / 1024).toFixed(2)} MB</span>
                              </div>
                              {doc.notes && (
                                <p className="text-sm text-muted-foreground mt-2">{doc.notes}</p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  const { data } = supabase.storage
                                    .from('client-documents')
                                    .getPublicUrl(doc.file_path);
                                  window.open(data.publicUrl, '_blank');
                                }}
                              >
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={async () => {
                                  const { data } = await supabase.storage
                                    .from('client-documents')
                                    .download(doc.file_path);
                                  if (data) {
                                    const url = URL.createObjectURL(data);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = doc.file_name;
                                    a.click();
                                  }
                                }}
                              >
                                Download
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* NDIS Budgets Tab */}
          <TabsContent value="ndis-budgets" className="space-y-6">

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Plan Periods
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockClient.ndisInfo.planPeriods.map((period) => (
                    <Card key={period.id} className={`p-4 ${period.isActive ? 'border-primary' : 'border-border'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h4 className="font-medium">{period.name}</h4>
                            <Badge variant={period.isActive ? "default" : "secondary"}>
                              {period.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Start: {new Date(period.startDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              End: {new Date(period.endDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {period.isActive && (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              Current
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Plan Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Plan Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ndisNumber">NDIS Number</Label>
                  {isEditing ? (
                    <Input id="ndisNumber" defaultValue={mockClient.ndisInfo.ndisNumber} />
                  ) : (
                    <div className="p-2 bg-muted rounded-md">{mockClient.ndisInfo.ndisNumber}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="planStartDate">Plan Start Date</Label>
                  {isEditing ? (
                    <Input id="planStartDate" type="date" defaultValue={mockClient.ndisInfo.planStartDate} />
                  ) : (
                    <div className="p-2 bg-muted rounded-md">{new Date(mockClient.ndisInfo.planStartDate).toLocaleDateString()}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="planEndDate">Plan End Date</Label>
                  {isEditing ? (
                    <Input id="planEndDate" type="date" defaultValue={mockClient.ndisInfo.planEndDate} />
                  ) : (
                    <div className="p-2 bg-muted rounded-md">{new Date(mockClient.ndisInfo.planEndDate).toLocaleDateString()}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="planManager">Plan Manager</Label>
                  {isEditing ? (
                    <Input id="planManager" defaultValue={mockClient.ndisInfo.planManager} />
                  ) : (
                    <div className="p-2 bg-muted rounded-md">{mockClient.ndisInfo.planManager}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supportCoordinator">Support Coordinator</Label>
                  {isEditing ? (
                    <Input id="supportCoordinator" defaultValue={mockClient.ndisInfo.supportCoordinator} />
                  ) : (
                    <div className="p-2 bg-muted rounded-md">{mockClient.ndisInfo.supportCoordinator}</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Funding Periods Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Funding Periods Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Funding Periods Toggle */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="has-funding-periods">Enable Funding Periods</Label>
                    {isEditing ? (
                      <input
                        type="checkbox"
                        id="has-funding-periods"
                        checked={hasFundingPeriods}
                        onChange={(e) => setHasFundingPeriods(e.target.checked)}
                        className="h-4 w-4"
                      />
                    ) : (
                      <Badge variant={hasFundingPeriods ? "default" : "secondary"}>
                        {hasFundingPeriods ? "Enabled" : "Disabled"}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Number of Periods */}
                  {hasFundingPeriods && (
                    <div className="space-y-2">
                      <Label htmlFor="number-of-periods">Number of Funding Periods</Label>
                      {isEditing ? (
                        <Select
                          value={numberOfPeriods.toString()}
                          onValueChange={(value) => setNumberOfPeriods(parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 Period</SelectItem>
                            <SelectItem value="2">2 Periods</SelectItem>
                            <SelectItem value="3">3 Periods</SelectItem>
                            <SelectItem value="4">4 Periods</SelectItem>
                            <SelectItem value="6">6 Periods</SelectItem>
                            <SelectItem value="12">12 Periods</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="p-2 bg-muted rounded-md">{numberOfPeriods} periods</div>
                      )}
                    </div>
                  )}

                  {/* Funding Period Dates Configuration */}
                  {hasFundingPeriods && (
                    <Card className="p-4">
                      <h4 className="font-medium mb-4">Funding Period Dates</h4>
                      <div className="space-y-4">
                        {Array.from({ length: numberOfPeriods }, (_, index) => {
                          const periodIndex = index + 1;
                          return (
                            <div key={periodIndex} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 border rounded-lg">
                              <div className="flex items-center">
                                <Badge variant="outline" className="mr-2">Period {periodIndex}</Badge>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`period-${periodIndex}-start`}>Start Date</Label>
                                {isEditing ? (
                                  <Input
                                    id={`period-${periodIndex}-start`}
                                    type="date"
                                    value={fundingPeriodDates[periodIndex]?.startDate || ''}
                                    onChange={(e) => setFundingPeriodDates(prev => ({
                                      ...prev,
                                      [periodIndex]: { ...prev[periodIndex], startDate: e.target.value }
                                    }))}
                                  />
                                ) : (
                                  <div className="p-2 bg-muted rounded-md text-sm">
                                    {fundingPeriodDates[periodIndex]?.startDate ? 
                                      new Date(fundingPeriodDates[periodIndex].startDate).toLocaleDateString() : 
                                      'Not set'
                                    }
                                  </div>
                                )}
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`period-${periodIndex}-end`}>End Date</Label>
                                {isEditing ? (
                                  <Input
                                    id={`period-${periodIndex}-end`}
                                    type="date"
                                    value={fundingPeriodDates[periodIndex]?.endDate || ''}
                                    onChange={(e) => setFundingPeriodDates(prev => ({
                                      ...prev,
                                      [periodIndex]: { ...prev[periodIndex], endDate: e.target.value }
                                    }))}
                                  />
                                ) : (
                                  <div className="p-2 bg-muted rounded-md text-sm">
                                    {fundingPeriodDates[periodIndex]?.endDate ? 
                                      new Date(fundingPeriodDates[periodIndex].endDate).toLocaleDateString() : 
                                      'Not set'
                                    }
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </Card>
                  )}

                  {/* Budget Items Selection */}
                  <div className="space-y-2">
                    <Label>Budget Categories to Include</Label>
                    {isEditing ? (
                      <div className="space-y-2">
                        {Object.entries(selectedBudgetItems).map(([key, value]) => {
                          const displayName = key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                          return (
                            <div key={key} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id={key}
                                checked={value}
                                onChange={(e) => setSelectedBudgetItems(prev => ({
                                  ...prev,
                                  [key]: e.target.checked
                                }))}
                                className="h-4 w-4"
                              />
                              <Label htmlFor={key}>{displayName}</Label>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(selectedBudgetItems)
                          .filter(([_, value]) => value)
                          .map(([key, _]) => {
                            const displayName = key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                            return (
                              <Badge key={key} variant="secondary">
                                {displayName}
                              </Badge>
                            );
                          })}
                      </div>
                    )}
                  </div>

                  {/* Funding Management */}
                  <div className="space-y-2">
                    <Label htmlFor="funding-management">Funding Management</Label>
                    {isEditing ? (
                      <Select
                        value={fundingManagement}
                        onValueChange={setFundingManagement}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select funding management type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="agency-managed">Agency Managed</SelectItem>
                          <SelectItem value="plan-managed">Plan Managed</SelectItem>
                          <SelectItem value="self-managed">Self Managed</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="p-2 bg-muted rounded-md">
                        {fundingManagement ? fundingManagement.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Not set'}
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {fundingManagement === 'agency-managed' && 'Invoices will be included in NDIA bulk upload document'}
                      {fundingManagement === 'plan-managed' && 'Invoices will be sent to the plan manager on file'}
                      {fundingManagement === 'self-managed' && 'Invoices will be sent to the client or representative'}
                    </p>
                  </div>

                  {/* Support Details */}
                  <div className="space-y-2">
                    <Label htmlFor="support-details">Support Details & Notes</Label>
                    {isEditing ? (
                      <Textarea
                        id="support-details"
                        value={supportDetails}
                        onChange={(e) => setSupportDetails(e.target.value)}
                        placeholder="Enter details about the support services, pricing schedules, and any relevant notes..."
                        rows={4}
                      />
                    ) : (
                      <div className="p-3 bg-muted rounded-md min-h-[100px] whitespace-pre-wrap">
                        {supportDetails || 'No support details entered'}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Budget Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Budget Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockClient.ndisInfo.budgetCategories.map((category) => (
                    <Card key={category.name} className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{category.name}</h4>
                        <div className="text-right">
                          <div className="text-sm font-medium">${category.allocated.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Allocated</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-green-600">${category.remaining.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Remaining</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold">${category.spent.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Spent</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold">{Math.round((category.spent / category.allocated) * 100)}%</div>
                          <div className="text-xs text-muted-foreground">Used</div>
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(category.spent / category.allocated) * 100}%` }}
                        ></div>
                      </div>

                      {/* Line Items */}
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium text-muted-foreground">Line Items</h5>
                        {category.lineItems.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                            <div>
                              <div className="text-sm font-medium">{item.name}</div>
                              <div className="text-xs text-muted-foreground">{item.code}</div>
                            </div>
                            <div className="text-sm font-medium">${item.remaining.toLocaleString()}</div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pricing Schedule Integration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Pricing Schedule Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Pricing Schedule Selection */}
                <div className="space-y-2">
                  <Label htmlFor="pricing-schedule">Select Pricing Schedule</Label>
                  <Select
                    value={selectedSchedule}
                    onValueChange={(value) => {
                      setSelectedSchedule(value);
                      loadPricingItems(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a pricing schedule" />
                    </SelectTrigger>
                    <SelectContent>
                      {pricingSchedules.map((schedule) => (
                        <SelectItem key={schedule.id} value={schedule.id}>
                          {schedule.schedule_name} ({schedule.year_period})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Registration Groups and Support Items with Allocation */}
                {selectedSchedule && (
                  <div className="space-y-4">
                    {supportCategories.map((category) => {
                      const categoryItems = pricingItems.filter(item => 
                        item.support_category_name === category
                      );
                      // Get unique registration groups (without duplicates)
                      const uniqueRegGroups = [...new Set(categoryItems.map(item => item.registration_group_name))].filter(Boolean);

                      return (
                        <Card key={category} className="p-4">
                          <h4 className="font-medium mb-3">{category}</h4>
                          
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Registration Group</Label>
                              <Select
                                value={selectedRegGroups[category] || ''}
                                onValueChange={(value) => {
                                  setSelectedRegGroups(prev => ({
                                    ...prev,
                                    [category]: value
                                  }));
                                  // Clear support item selection when changing registration group
                                  setSelectedSupportItems(prev => ({
                                    ...prev,
                                    [category]: ''
                                  }));
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select registration group" />
                                </SelectTrigger>
                                <SelectContent>
                                  {uniqueRegGroups.map((regGroup) => {
                                    // Get the first item from this registration group to show the number
                                    const groupItem = categoryItems.find(item => item.registration_group_name === regGroup);
                                    return (
                                      <SelectItem key={regGroup} value={regGroup}>
                                        {groupItem?.registration_group_number} - {regGroup}
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Support Item Selection - only show if registration group is selected */}
                            {selectedRegGroups[category] && (
                              <div className="space-y-2">
                                <Label>Support Item</Label>
                                <Select
                                  value={selectedSupportItems[category] || ''}
                                  onValueChange={(value) => setSelectedSupportItems(prev => ({
                                    ...prev,
                                    [category]: value
                                  }))}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select support item" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {categoryItems
                                      .filter(item => item.registration_group_name === selectedRegGroups[category])
                                      .map((item) => (
                                        <SelectItem key={item.id} value={item.support_item_number}>
                                          {item.support_item_number} - {item.support_item_name}
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}

                            {/* Show pricing information when support item is selected */}
                            {selectedSupportItems[category] && (
                              <div className="p-3 bg-muted/50 rounded-lg">
                                {(() => {
                                  const selectedItem = categoryItems.find(item => 
                                    item.support_item_number === selectedSupportItems[category]
                                  );
                                  if (!selectedItem) return null;
                                  
                                  return (
                                    <div className="space-y-2">
                                      <h6 className="font-medium text-sm">Pricing Information</h6>
                                      <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                          <span className="text-muted-foreground">Unit: </span>
                                          <span className="font-medium">{selectedItem.unit}</span>
                                        </div>
                                        <div>
                                          <span className="text-muted-foreground">Price (NSW): </span>
                                          <span className="font-medium">
                                            {selectedItem.quote_required ? 'Quote Required' : `$${selectedItem.price_nsw}`}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })()}
                              </div>
                            )}

                            {/* Funding Allocation Form - only show if support item is selected */}
                            {selectedSupportItems[category] && (() => {
                              const selectedItem = categoryItems.find(item => 
                                item.support_item_number === selectedSupportItems[category]
                              );
                              if (!selectedItem) return null;

                               const allocatedHour = parseFloat(allocatedHours[category] || '0');
                               const unitPrice = parseFloat(selectedItem.price_nsw || selectedItem.price_act || '0');
                               const allocatedAmount = allocatedHour * unitPrice; // Auto-calculated

                              return (
                                <Card className="p-4 bg-primary/5 border-primary/20">
                                  <h6 className="font-medium mb-3">Add Funding Allocation</h6>
                                  
                                   <div className="space-y-4">
                                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                      
                                      {/* Allocated Hours */}
                                      <div className="space-y-2">
                                        <Label htmlFor={`hours-${category}`}>Allocated Hours</Label>
                                        <Input
                                          id={`hours-${category}`}
                                          type="number"
                                          placeholder="0"
                                          min="0"
                                          step="0.5"
                                          value={allocatedHours[category] || ''}
                                          onChange={(e) => setAllocatedHours(prev => ({
                                            ...prev,
                                            [category]: e.target.value
                                          }))}
                                        />
                                      </div>
                                      
                                      {/* Unit Price */}
                                      <div className="space-y-2">
                                        <Label>Unit Price ({selectedItem.unit})</Label>
                                        <div className="p-2 bg-background rounded-md border text-sm">
                                          {selectedItem.quote_required ? 'Quote Required' : `$${unitPrice.toFixed(2)}`}
                                        </div>
                                      </div>
                                      
                                       {/* Calculated Total */}
                                       <div className="space-y-2">
                                         <Label>Calculated Total</Label>
                                         <div className="p-2 bg-primary/10 rounded-md border text-sm font-medium">
                                           ${allocatedAmount.toFixed(2)}
                                         </div>
                                       </div>
                                    </div>

                                    {/* Additional Options */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <div className="space-y-2">
                                       <Label htmlFor={`period-${category}`}>Funding Period</Label>
                                       <Select
                                         value={currentAllocation[category]?.fundingPeriod || (hasFundingPeriods ? 'period-1' : 'full-year')}
                                         onValueChange={(value) => setCurrentAllocation(prev => ({
                                           ...prev,
                                           [category]: { ...prev[category], fundingPeriod: value }
                                         }))}
                                       >
                                         <SelectTrigger>
                                           <SelectValue placeholder="Select period" />
                                         </SelectTrigger>
                                         <SelectContent>
                                           {!hasFundingPeriods ? (
                                             <SelectItem value="full-year">Full Year</SelectItem>
                                           ) : (
                                             Array.from({ length: numberOfPeriods }, (_, index) => {
                                               const periodIndex = index + 1;
                                               const periodDates = fundingPeriodDates[periodIndex];
                                               const dateRange = periodDates?.startDate && periodDates?.endDate 
                                                 ? ` (${new Date(periodDates.startDate).toLocaleDateString()} - ${new Date(periodDates.endDate).toLocaleDateString()})`
                                                 : '';
                                               return (
                                                 <SelectItem key={periodIndex} value={`period-${periodIndex}`}>
                                                   Period {periodIndex}{dateRange}
                                                 </SelectItem>
                                               );
                                             })
                                           )}
                                         </SelectContent>
                                       </Select>
                                     </div>
                                      
                                      <div className="space-y-2">
                                        <Label htmlFor={`priority-${category}`}>Priority Level</Label>
                                        <Select
                                          value={currentAllocation[category]?.priority || 'medium'}
                                          onValueChange={(value) => setCurrentAllocation(prev => ({
                                            ...prev,
                                            [category]: { ...prev[category], priority: value }
                                          }))}
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select priority" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="high">High</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="low">Low</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                    
                                    {/* Notes */}
                                    <div className="space-y-2">
                                      <Label htmlFor={`notes-${category}`}>Allocation Notes</Label>
                                      <Textarea
                                        id={`notes-${category}`}
                                        placeholder="Add any notes about this funding allocation..."
                                        rows={2}
                                        value={currentAllocation[category]?.notes || ''}
                                        onChange={(e) => setCurrentAllocation(prev => ({
                                          ...prev,
                                          [category]: { ...prev[category], notes: e.target.value }
                                        }))}
                                      />
                                    </div>

                                    {/* Save Button */}
                                    <div className="flex justify-end">
                                      <Button
                                         onClick={async () => {
                                           if (!allocatedHours[category] || parseFloat(allocatedHours[category]) <= 0) {
                                             toast({
                                               title: "Validation Error", 
                                               description: "Please enter allocated hours greater than 0",
                                               variant: "destructive"
                                             });
                                             return;
                                           }

                                           try {
                                             const newAllocation = {
                                               client_id: 'CLI-001',
                                               support_item_number: selectedItem.support_item_number,
                                               support_item_name: selectedItem.support_item_name,
                                               budget_category: category,
                                               allocated_amount: allocatedAmount,
                                               allocated_hours: allocatedHour,
                                               unit_price: unitPrice,
                                               calculated_total: allocatedAmount,
                                               funding_period: currentAllocation[category]?.fundingPeriod || 'full-year',
                                               priority: currentAllocation[category]?.priority || 'medium',
                                               notes: currentAllocation[category]?.notes || '',
                                               unit: selectedItem.unit
                                             };

                                             // Save to database
                                             const { data, error } = await supabase
                                               .from('client_funding_allocations')
                                               .insert(newAllocation)
                                               .select()
                                               .single();

                                             if (error) throw error;

                                             // Update local state
                                             const localAllocation = {
                                               id: data.id,
                                               supportItemNumber: data.support_item_number,
                                               supportItemName: data.support_item_name,
                                               allocatedAmount: data.allocated_amount,
                                               allocatedHours: data.allocated_hours,
                                               unitPrice: data.unit_price,
                                               calculatedTotal: data.calculated_total,
                                               fundingPeriod: data.funding_period,
                                               priority: data.priority,
                                               notes: data.notes,
                                               unit: data.unit
                                             };

                                             setSavedAllocations(prev => ({
                                               ...prev,
                                               [category]: [...(prev[category] || []), localAllocation]
                                             }));

                                             // Clear form
                                             setAllocatedHours(prev => ({ ...prev, [category]: '' }));
                                             setCurrentAllocation(prev => ({ 
                                               ...prev, 
                                               [category]: { fundingPeriod: 'full-year', priority: 'medium', notes: '' }
                                             }));

                                             toast({
                                               title: "Allocation Saved",
                                               description: `Funding allocation for ${selectedItem.support_item_name} has been saved.`
                                             });
                                           } catch (error) {
                                             console.error('Error saving allocation:', error);
                                             toast({
                                               title: "Error",
                                               description: "Failed to save funding allocation",
                                               variant: "destructive"
                                             });
                                           }
                                         }}
                                        className="hover-scale"
                                      >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Save Allocation
                                      </Button>
                                    </div>
                                  </div>
                                </Card>
                              );
                            })()}

                            {/* Saved Allocations List */}
                            {savedAllocations[category] && savedAllocations[category].length > 0 && (
                              <Card className="p-4">
                                <h6 className="font-medium mb-3">Saved Allocations for {category}</h6>
                                <div className="space-y-3">
                                  {savedAllocations[category].map((allocation) => (
                                    <div key={allocation.id} className="p-3 bg-muted/30 rounded-lg">
                                      <div className="flex items-start justify-between mb-2">
                                        <div>
                                          <div className="font-medium text-sm">{allocation.supportItemName}</div>
                                          <p className="text-xs text-muted-foreground">{allocation.supportItemNumber}</p>
                                        </div>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                           onClick={async () => {
                                             try {
                                               // Delete from database
                                               const { error } = await supabase
                                                 .from('client_funding_allocations')
                                                 .delete()
                                                 .eq('id', allocation.id);

                                               if (error) throw error;

                                               // Update local state
                                               setSavedAllocations(prev => ({
                                                 ...prev,
                                                 [category]: prev[category].filter(a => a.id !== allocation.id)
                                               }));
                                               
                                               toast({
                                                 title: "Allocation Removed",
                                                 description: "Funding allocation has been removed."
                                               });
                                             } catch (error) {
                                               console.error('Error deleting allocation:', error);
                                               toast({
                                                 title: "Error",
                                                 description: "Failed to delete funding allocation",
                                                 variant: "destructive"
                                               });
                                             }
                                           }}
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>
                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                        <div>
                                          <span className="text-muted-foreground">Amount: </span>
                                          <span className="font-medium">${allocation.allocatedAmount.toFixed(2)}</span>
                                        </div>
                                        <div>
                                          <span className="text-muted-foreground">Hours: </span>
                                          <span className="font-medium">{allocation.allocatedHours} {allocation.unit}</span>
                                        </div>
                                        <div>
                                          <span className="text-muted-foreground">Unit Price: </span>
                                          <span className="font-medium">${allocation.unitPrice.toFixed(2)}</span>
                                        </div>
                                        <div>
                                          <span className="text-muted-foreground">Total: </span>
                                          <span className="font-medium">${allocation.calculatedTotal.toFixed(2)}</span>
                                        </div>
                                      </div>
                                      {allocation.notes && (
                                        <div className="mt-2 text-sm">
                                          <span className="text-muted-foreground">Notes: </span>
                                          <span>{allocation.notes}</span>
                                        </div>
                                      )}
                                       <div className="flex gap-2 mt-2">
                                         <Badge variant="outline" className="text-xs">
                                           {(() => {
                                             if (allocation.fundingPeriod.startsWith('period-')) {
                                               const periodNumber = allocation.fundingPeriod.split('-')[1];
                                               const periodDates = fundingPeriodDates[parseInt(periodNumber)];
                                               const dateRange = periodDates?.startDate && periodDates?.endDate 
                                                 ? ` (${new Date(periodDates.startDate).toLocaleDateString()} - ${new Date(periodDates.endDate).toLocaleDateString()})`
                                                 : '';
                                               return `Period ${periodNumber}${dateRange}`;
                                             }
                                             return allocation.fundingPeriod.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
                                           })()}
                                         </Badge>
                                         <Badge variant="outline" className="text-xs">
                                           {allocation.priority.charAt(0).toUpperCase() + allocation.priority.slice(1)} Priority
                                         </Badge>
                                       </div>
                                    </div>
                                  ))}
                                </div>
                              </Card>
                            )}
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Overall Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Overall Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      ${Object.values(savedAllocations).flat().reduce((sum, allocation) => sum + allocation.allocatedAmount, 0).toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Allocated</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {Object.values(savedAllocations).flat().reduce((sum, allocation) => sum + allocation.allocatedHours, 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Hours</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      ${Object.values(savedAllocations).flat().reduce((sum, allocation) => sum + allocation.calculatedTotal, 0).toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Calculated Cost</div>
                  </div>
                </div>
              </CardContent>
            </Card>


            {/* Budget Allocation by Funding Period */}
            {hasFundingPeriods && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Budget Allocation by Funding Period
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from({ length: numberOfPeriods }, (_, index) => {
                      const periodIndex = index + 1;
                      const periodKey = `period-${periodIndex}`;
                      const periodAllocations = Object.values(savedAllocations).flat().filter(allocation => 
                        allocation.fundingPeriod === periodKey
                      );
                      const periodDates = fundingPeriodDates[periodIndex];
                      const totalAmount = periodAllocations.reduce((sum, allocation) => sum + allocation.allocatedAmount, 0);
                      const totalHours = periodAllocations.reduce((sum, allocation) => sum + allocation.allocatedHours, 0);

                      return (
                        <Card key={periodIndex} className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-medium">Period {periodIndex}</h4>
                              {periodDates?.startDate && periodDates?.endDate && (
                                <p className="text-sm text-muted-foreground">
                                  {new Date(periodDates.startDate).toLocaleDateString()} - {new Date(periodDates.endDate).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-primary">${totalAmount.toFixed(2)}</div>
                              <div className="text-sm text-muted-foreground">{totalHours} hours</div>
                            </div>
                          </div>
                          
                          {periodAllocations.length > 0 ? (
                            <div className="space-y-2">
                              {periodAllocations.map((allocation) => (
                                <div key={allocation.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                                  <div>
                                    <div className="text-sm font-medium">{allocation.supportItemName}</div>
                                    <div className="text-xs text-muted-foreground">{allocation.supportItemNumber}</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm font-medium">${allocation.allocatedAmount.toFixed(2)}</div>
                                    <div className="text-xs text-muted-foreground">{allocation.allocatedHours} hrs</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-4 text-muted-foreground">
                              <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">No allocations for this period</p>
                            </div>
                          )}
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Personal Information Tab */}
          <TabsContent value="personal" className="space-y-6">
            {/* Personal Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  {isEditing ? (
                    <Input id="firstName" defaultValue={mockClient.personalInfo.firstName} />
                  ) : (
                    <div className="p-2 bg-muted rounded-md">{mockClient.personalInfo.firstName}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  {isEditing ? (
                    <Input id="lastName" defaultValue={mockClient.personalInfo.lastName} />
                  ) : (
                    <div className="p-2 bg-muted rounded-md">{mockClient.personalInfo.lastName}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  {isEditing ? (
                    <Input id="dateOfBirth" type="date" defaultValue={mockClient.personalInfo.dateOfBirth} />
                  ) : (
                    <div className="p-2 bg-muted rounded-md">{new Date(mockClient.personalInfo.dateOfBirth).toLocaleDateString()}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferredName">Preferred Name</Label>
                  {isEditing ? (
                    <Input id="preferredName" defaultValue={mockClient.personalInfo.preferredName} />
                  ) : (
                    <div className="p-2 bg-muted rounded-md">{mockClient.personalInfo.preferredName}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  {isEditing ? (
                    <Input id="gender" defaultValue={mockClient.personalInfo.gender} />
                  ) : (
                    <div className="p-2 bg-muted rounded-md">{mockClient.personalInfo.gender}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  {isEditing ? (
                    <Input id="email" type="email" defaultValue={mockClient.personalInfo.email} />
                  ) : (
                    <div className="p-2 bg-muted rounded-md">{mockClient.personalInfo.email}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  {isEditing ? (
                    <Input id="phone" defaultValue={mockClient.personalInfo.phone} />
                  ) : (
                    <div className="p-2 bg-muted rounded-md">{mockClient.personalInfo.phone}</div>
                  )}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  {isEditing ? (
                    <Textarea id="address" defaultValue={mockClient.personalInfo.address} />
                  ) : (
                    <div className="p-2 bg-muted rounded-md">{mockClient.personalInfo.address}</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Emergency Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyName">Name</Label>
                  {isEditing ? (
                    <Input id="emergencyName" defaultValue={mockClient.personalInfo.emergencyContact.name} />
                  ) : (
                    <div className="p-2 bg-muted rounded-md">{mockClient.personalInfo.emergencyContact.name}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyRelationship">Relationship</Label>
                  {isEditing ? (
                    <Input id="emergencyRelationship" defaultValue={mockClient.personalInfo.emergencyContact.relationship} />
                  ) : (
                    <div className="p-2 bg-muted rounded-md">{mockClient.personalInfo.emergencyContact.relationship}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">Phone</Label>
                  {isEditing ? (
                    <Input id="emergencyPhone" defaultValue={mockClient.personalInfo.emergencyContact.phone} />
                  ) : (
                    <div className="p-2 bg-muted rounded-md">{mockClient.personalInfo.emergencyContact.phone}</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>


          {/* Health & Safety Tab */}
          <TabsContent value="health" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Health & Safety Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies</Label>
                  {isEditing ? (
                    <Textarea id="allergies" defaultValue={mockClient.healthSafety.allergies} />
                  ) : (
                    <div className="p-2 bg-muted rounded-md">{mockClient.healthSafety.allergies}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medications">Current Medications</Label>
                  {isEditing ? (
                    <Textarea id="medications" defaultValue={mockClient.healthSafety.medications} />
                  ) : (
                    <div className="p-2 bg-muted rounded-md">{mockClient.healthSafety.medications}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medicalConditions">Medical Conditions</Label>
                  {isEditing ? (
                    <Textarea id="medicalConditions" defaultValue={mockClient.healthSafety.medicalConditions} />
                  ) : (
                    <div className="p-2 bg-muted rounded-md">{mockClient.healthSafety.medicalConditions}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobilityAids">Mobility Aids</Label>
                  {isEditing ? (
                    <Input id="mobilityAids" defaultValue={mockClient.healthSafety.mobilityAids} />
                  ) : (
                    <div className="p-2 bg-muted rounded-md">{mockClient.healthSafety.mobilityAids}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="riskAssessment">Risk Assessment</Label>
                  {isEditing ? (
                    <Input id="riskAssessment" defaultValue={mockClient.healthSafety.riskAssessment} />
                  ) : (
                    <div className="p-2 bg-muted rounded-md">{mockClient.healthSafety.riskAssessment}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyProcedures">Emergency Procedures</Label>
                  {isEditing ? (
                    <Textarea id="emergencyProcedures" defaultValue={mockClient.healthSafety.emergencyProcedures} />
                  ) : (
                    <div className="p-2 bg-muted rounded-md">{mockClient.healthSafety.emergencyProcedures}</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Consent & Preferences Tab */}
          <TabsContent value="consent" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Consent & Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="communicationMethod">Preferred Communication Method</Label>
                      {isEditing ? (
                        <Select defaultValue={mockClient.preferences.communicationMethod}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Email">Email</SelectItem>
                            <SelectItem value="Phone">Phone</SelectItem>
                            <SelectItem value="SMS">SMS</SelectItem>
                            <SelectItem value="Letter">Letter</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="p-2 bg-muted rounded-md">{mockClient.preferences.communicationMethod}</div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="languagePreference">Language Preference</Label>
                      {isEditing ? (
                        <Input id="languagePreference" defaultValue={mockClient.preferences.languagePreference} />
                      ) : (
                        <div className="p-2 bg-muted rounded-md">{mockClient.preferences.languagePreference}</div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="privacyLevel">Privacy Level</Label>
                      {isEditing ? (
                        <Select defaultValue={mockClient.preferences.privacyLevel}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Standard">Standard</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Maximum">Maximum</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="p-2 bg-muted rounded-md">{mockClient.preferences.privacyLevel}</div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Consent to Share Information</Label>
                      <input 
                        type="checkbox" 
                        checked={mockClient.preferences.consentToShare}
                        disabled={!isEditing}
                        className="h-4 w-4"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Photo Consent</Label>
                      <input 
                        type="checkbox" 
                        checked={mockClient.preferences.photoConsent}
                        disabled={!isEditing}
                        className="h-4 w-4"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dataRetention">Data Retention Period</Label>
                      {isEditing ? (
                        <Select defaultValue={mockClient.preferences.dataRetention}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Standard">Standard (7 years)</SelectItem>
                            <SelectItem value="Extended">Extended (10 years)</SelectItem>
                            <SelectItem value="Minimal">Minimal (5 years)</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="p-2 bg-muted rounded-md">{mockClient.preferences.dataRetention}</div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cultural Considerations Tab */}
          <TabsContent value="cultural" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Cultural Considerations
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="culturalBackground">Cultural Background</Label>
                  {isEditing ? (
                    <Input id="culturalBackground" defaultValue={mockClient.cultural.culturalBackground} />
                  ) : (
                    <div className="p-2 bg-muted rounded-md">{mockClient.cultural.culturalBackground}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="religiousBeliefs">Religious Beliefs</Label>
                  {isEditing ? (
                    <Input id="religiousBeliefs" defaultValue={mockClient.cultural.religiousBeliefs} />
                  ) : (
                    <div className="p-2 bg-muted rounded-md">{mockClient.cultural.religiousBeliefs}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dietaryRequirements">Dietary Requirements</Label>
                  {isEditing ? (
                    <Input id="dietaryRequirements" defaultValue={mockClient.cultural.dietaryRequirements} />
                  ) : (
                    <div className="p-2 bg-muted rounded-md">{mockClient.cultural.dietaryRequirements}</div>
                  )}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="culturalConsiderations">Cultural Considerations</Label>
                  {isEditing ? (
                    <Textarea id="culturalConsiderations" defaultValue={mockClient.cultural.culturalConsiderations} />
                  ) : (
                    <div className="p-2 bg-muted rounded-md">{mockClient.cultural.culturalConsiderations}</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Administrative Tab */}
          <TabsContent value="admin" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Administrative Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="caseManager">Case Manager</Label>
                  {isEditing ? (
                    <Input id="caseManager" defaultValue={mockClient.administrative.caseManager} />
                  ) : (
                    <div className="p-2 bg-muted rounded-md">{mockClient.administrative.caseManager}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fundingSource">Funding Source</Label>
                  {isEditing ? (
                    <Input id="fundingSource" defaultValue={mockClient.administrative.fundingSource} />
                  ) : (
                    <div className="p-2 bg-muted rounded-md">{mockClient.administrative.fundingSource}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serviceProvider">Service Provider</Label>
                  {isEditing ? (
                    <Input id="serviceProvider" defaultValue={mockClient.administrative.serviceProvider} />
                  ) : (
                    <div className="p-2 bg-muted rounded-md">{mockClient.administrative.serviceProvider}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reviewDate">Review Date</Label>
                  {isEditing ? (
                    <Input id="reviewDate" type="date" defaultValue={mockClient.administrative.reviewDate} />
                  ) : (
                    <div className="p-2 bg-muted rounded-md">{new Date(mockClient.administrative.reviewDate).toLocaleDateString()}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="enrollmentDate">Enrollment Date</Label>
                  <div className="p-2 bg-muted rounded-md">{mockClient.administrative.enrollmentDate}</div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminNotes">Notes</Label>
                  {isEditing ? (
                    <Textarea id="adminNotes" defaultValue={mockClient.administrative.notes} rows={4} />
                  ) : (
                    <div className="p-2 bg-muted rounded-md min-h-[100px]">{mockClient.administrative.notes}</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Case Note Dialog */}
        <Dialog open={showCaseNoteDialog} onOpenChange={setShowCaseNoteDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Case Note</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="case-note-type">Type</Label>
                <Select
                  value={caseNoteForm.type}
                  onValueChange={(value) => setCaseNoteForm(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Progress Update">Progress Update</SelectItem>
                    <SelectItem value="Family Meeting">Family Meeting</SelectItem>
                    <SelectItem value="Service Delivery">Service Delivery</SelectItem>
                    <SelectItem value="Support Planning">Support Planning</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="case-note">Note*</Label>
                <Textarea
                  id="case-note"
                  value={caseNoteForm.note}
                  onChange={(e) => setCaseNoteForm(prev => ({ ...prev, note: e.target.value }))}
                  placeholder="Enter case note details..."
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowCaseNoteDialog(false)}>Cancel</Button>
                <Button onClick={handleAddCaseNote}>Add Case Note</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Cost Dialog */}
        <Dialog open={showCostDialog} onOpenChange={setShowCostDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Cost</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Plan Period Selection */}
              <div className="space-y-2">
                <Label htmlFor="cost-plan-period">Plan Period*</Label>
                <Select
                  value={costForm.planPeriod}
                  onValueChange={(value) => setCostForm(prev => ({ ...prev, planPeriod: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select plan period" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockClient.ndisInfo.planPeriods
                      .filter(period => period.isActive)
                      .map((period) => (
                      <SelectItem key={period.id} value={period.id}>
                        {period.name} ({period.startDate} to {period.endDate})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Budget Category Selection */}
              <div className="space-y-2">
                <Label htmlFor="cost-budget-category">Budget Category*</Label>
                <Select
                  value={costForm.budgetCategory}
                  onValueChange={(value) => {
                    setCostForm(prev => ({ ...prev, budgetCategory: value, lineItem: '' }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget category" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockClient.ndisInfo.budgetCategories.map((category) => (
                      <SelectItem key={category.name} value={category.name}>
                        {category.name} (${category.remaining.toLocaleString()} remaining)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Line Item Selection */}
              {costForm.budgetCategory && (
                <div className="space-y-2">
                  <Label htmlFor="cost-line-item">Line Item*</Label>
                  <Select
                    value={costForm.lineItem}
                    onValueChange={(value) => setCostForm(prev => ({ ...prev, lineItem: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select line item" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockClient.ndisInfo.budgetCategories
                        .find(cat => cat.name === costForm.budgetCategory)
                        ?.lineItems.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name} - {item.code} (${item.remaining.toLocaleString()} remaining)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Pricing Item Selection */}
              <div className="space-y-2">
                <Label htmlFor="cost-pricing-item">NDIS Support Item*</Label>
                <Select
                  value={costForm.selectedPricingItem}
                  onValueChange={(value) => {
                    const selectedItem = pricingItems.find(item => item.id === value);
                    const unitPrice = selectedItem?.price_qld || selectedItem?.price_nsw || selectedItem?.price_act || selectedItem?.price_vic || 0;
                    const totalAmount = calculateTotalAmount(unitPrice, costForm.duration);
                    setCostForm(prev => ({ 
                      ...prev, 
                      selectedPricingItem: value,
                      unitPrice: unitPrice.toString(),
                      totalAmount: totalAmount
                    }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select NDIS support item" />
                  </SelectTrigger>
                  <SelectContent>
                    {pricingItems.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.support_item_number} - {item.support_item_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cost-service-title">Service Title*</Label>
                <Input
                  id="cost-service-title"
                  value={costForm.serviceTitle}
                  onChange={(e) => setCostForm(prev => ({ ...prev, serviceTitle: e.target.value }))}
                  placeholder="Enter service title"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cost-duration">Duration (HH:MM)*</Label>
                  <Input
                    id="cost-duration"
                    type="text"
                    value={costForm.duration}
                    onChange={(e) => {
                      const duration = e.target.value;
                      setCostForm(prev => {
                        const totalAmount = calculateTotalAmount(prev.unitPrice, duration);
                        return { ...prev, duration: duration, totalAmount: totalAmount };
                      });
                    }}
                    placeholder="02:30"
                    pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost-unit-price">Unit Price*</Label>
                  <Input
                    id="cost-unit-price"
                    type="number"
                    step="0.01"
                    value={costForm.unitPrice}
                    onChange={(e) => {
                      const unitPrice = e.target.value;
                      const totalAmount = calculateTotalAmount(unitPrice, costForm.duration);
                      setCostForm(prev => ({ ...prev, unitPrice: unitPrice, totalAmount: totalAmount }));
                    }}
                    placeholder="0.00"
                    readOnly={!!costForm.selectedPricingItem}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost-total-amount">Total Amount</Label>
                  <Input
                    id="cost-total-amount"
                    type="text"
                    value={`$${costForm.totalAmount}`}
                    readOnly
                    className="bg-muted"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cost-date">Date*</Label>
                <Input
                  id="cost-date"
                  type="date"
                  value={costForm.date}
                  onChange={(e) => setCostForm(prev => ({ ...prev, date: e.target.value }))}
                />
                {costForm.date && (
                  <p className="text-sm text-muted-foreground">
                    Display: {formatDate(costForm.date)}
                  </p>
                )}
              </div>

              {/* Appointment Link (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="cost-appointment">Link to Appointment (Optional)</Label>
                <Select
                  value={costForm.appointmentId}
                  onValueChange={(value) => setCostForm(prev => ({ ...prev, appointmentId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select related appointment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No appointment</SelectItem>
                    {mockAppointments.map((appointment) => (
                      <SelectItem key={appointment.id} value={appointment.id}>
                        {appointment.title} - {appointment.date} at {appointment.time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Notes Section */}
              <div className="space-y-2">
                <Label htmlFor="cost-notes">Notes</Label>
                <Textarea
                  id="cost-notes"
                  value={costForm.notes}
                  onChange={(e) => setCostForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any additional notes about this cost..."
                  rows={3}
                />
              </div>

              {/* Document Upload (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="cost-document">Upload Supporting Document (Optional)</Label>
                <Input
                  id="cost-document"
                  type="file"
                  onChange={(e) => setCostForm(prev => ({ ...prev, uploadedDocument: e.target.files?.[0] || null }))}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
                />
                <p className="text-xs text-muted-foreground">
                  Supported formats: PDF, DOC, DOCX, JPG, PNG, XLS, XLSX
                </p>
              </div>

              {/* Status is automatically set to "Uninvoiced" - no manual selection needed */}

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowCostDialog(false)}>Cancel</Button>
                <Button onClick={handleAddCost}>Add Cost</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Document Upload Dialog */}
        <Dialog open={showDocumentDialog} onOpenChange={setShowDocumentDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="document-title">Document Title*</Label>
                <Input
                  id="document-title"
                  value={documentForm.title}
                  onChange={(e) => setDocumentForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter document title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="document-type">Document Type*</Label>
                <Select
                  value={documentForm.documentType}
                  onValueChange={(value) => setDocumentForm(prev => ({ ...prev, documentType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Assessment Report">Assessment Report</SelectItem>
                    <SelectItem value="Medical Certificate">Medical Certificate</SelectItem>
                    <SelectItem value="Plan Review">Plan Review</SelectItem>
                    <SelectItem value="Service Agreement">Service Agreement</SelectItem>
                    <SelectItem value="Invoice">Invoice</SelectItem>
                    <SelectItem value="Receipt">Receipt</SelectItem>
                    <SelectItem value="ID Document">ID Document</SelectItem>
                    <SelectItem value="Consent Form">Consent Form</SelectItem>
                    <SelectItem value="Progress Report">Progress Report</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="document-file">File*</Label>
                <Input
                  id="document-file"
                  type="file"
                  onChange={(e) => setDocumentForm(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
                />
                <p className="text-xs text-muted-foreground">
                  Supported formats: PDF, DOC, DOCX, JPG, PNG, XLS, XLSX (Max 20MB)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="document-notes">Notes</Label>
                <Textarea
                  id="document-notes"
                  value={documentForm.notes}
                  onChange={(e) => setDocumentForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any additional notes about this document..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowDocumentDialog(false)}>Cancel</Button>
                <Button onClick={handleAddDocument} disabled={uploading}>
                  {uploading ? "Uploading..." : "Upload Document"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Incident Dialog */}
        <Dialog open={showIncidentDialog} onOpenChange={setShowIncidentDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Report Incident</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="incident-type">Type</Label>
                <Select
                  value={incidentForm.type}
                  onValueChange={(value) => setIncidentForm(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Safety Incident">Safety Incident</SelectItem>
                    <SelectItem value="Medication Error">Medication Error</SelectItem>
                    <SelectItem value="Equipment Failure">Equipment Failure</SelectItem>
                    <SelectItem value="Behavioral Incident">Behavioral Incident</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="incident-severity">Severity</Label>
                <Select
                  value={incidentForm.severity}
                  onValueChange={(value) => setIncidentForm(prev => ({ ...prev, severity: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="incident-description">Description*</Label>
                <Textarea
                  id="incident-description"
                  value={incidentForm.description}
                  onChange={(e) => setIncidentForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what happened..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="incident-action">Action Taken</Label>
                <Textarea
                  id="incident-action"
                  value={incidentForm.actionTaken}
                  onChange={(e) => setIncidentForm(prev => ({ ...prev, actionTaken: e.target.value }))}
                  placeholder="What action was taken..."
                  rows={2}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowIncidentDialog(false)}>Cancel</Button>
                <Button onClick={handleAddIncident}>Report Incident</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Complaint Dialog */}
        <Dialog open={showComplaintDialog} onOpenChange={setShowComplaintDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Log Complaint</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="complaint-type">Type</Label>
                <Select
                  value={complaintForm.type}
                  onValueChange={(value) => setComplaintForm(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Service Quality">Service Quality</SelectItem>
                    <SelectItem value="Communication">Communication</SelectItem>
                    <SelectItem value="Staff Conduct">Staff Conduct</SelectItem>
                    <SelectItem value="Billing">Billing</SelectItem>
                    <SelectItem value="Access">Access</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="complaint-priority">Priority</Label>
                <Select
                  value={complaintForm.priority}
                  onValueChange={(value) => setComplaintForm(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="complaint-description">Description*</Label>
                <Textarea
                  id="complaint-description"
                  value={complaintForm.description}
                  onChange={(e) => setComplaintForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the complaint..."
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowComplaintDialog(false)}>Cancel</Button>
                <Button onClick={handleAddComplaint}>Log Complaint</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ClientProfile;
