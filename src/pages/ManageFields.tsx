import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Settings, 
  Eye, 
  EyeOff,
  Search,
  Filter,
  MapPin
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const fieldSchema = z.object({
  field_name: z.string().min(1, "Field name is required"),
  field_label: z.string().min(1, "Field label is required"),
  field_type: z.string().min(1, "Field type is required"),
  is_required: z.boolean().default(false),
  default_value: z.string().optional(),
  placeholder_text: z.string().optional(),
  help_text: z.string().optional(),
  options: z.string().optional(),
  display_order: z.number().default(0),
});

type FieldFormData = z.infer<typeof fieldSchema>;

interface CustomField {
  id: string;
  field_name: string;
  field_label: string;
  field_type: string;
  is_required: boolean;
  default_value?: string;
  placeholder_text?: string;
  help_text?: string;
  options: any;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

interface FieldMapping {
  id: string;
  field_id: string;
  screen_name: string;
  screen_section?: string;
  display_order: number;
  is_active: boolean;
  custom_fields: CustomField;
}

const availableScreens = [
  "Client Profile",
  "Employee Profile", 
  "Appointments",
  "Timesheets",
  "Documents",
  "Incidents",
  "Complaints",
  "Invoices"
];

const fieldTypes = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "date", label: "Date" },
  { value: "boolean", label: "Yes/No" },
  { value: "select", label: "Dropdown" },
  { value: "textarea", label: "Text Area" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
];

export default function ManageFields() {
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isMappingDialogOpen, setIsMappingDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState<CustomField | null>(null);
  const [selectedFieldForMapping, setSelectedFieldForMapping] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedScreen, setSelectedScreen] = useState("all");
  const [loading, setLoading] = useState(true);

  const form = useForm<FieldFormData>({
    resolver: zodResolver(fieldSchema),
    defaultValues: {
      field_name: "",
      field_label: "",
      field_type: "text",
      is_required: false,
      default_value: "",
      placeholder_text: "",
      help_text: "",
      options: "",
      display_order: 0,
    },
  });

  useEffect(() => {
    fetchCustomFields();
    fetchFieldMappings();
  }, []);

  const fetchCustomFields = async () => {
    try {
      const { data, error } = await supabase
        .from('custom_fields')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setCustomFields((data || []).map(field => ({
        ...field,
        options: Array.isArray(field.options) ? field.options : []
      })));
    } catch (error) {
      console.error('Error fetching custom fields:', error);
      toast({
        title: "Error",
        description: "Failed to fetch custom fields",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFieldMappings = async () => {
    try {
      const { data, error } = await supabase
        .from('field_screen_mappings')
        .select(`
          *,
          custom_fields (*)
        `)
        .order('screen_name', { ascending: true });

      if (error) throw error;
      setFieldMappings((data || []).map(mapping => ({
        ...mapping,
        custom_fields: {
          ...mapping.custom_fields,
          options: Array.isArray(mapping.custom_fields.options) ? mapping.custom_fields.options : []
        }
      })));
    } catch (error) {
      console.error('Error fetching field mappings:', error);
    }
  };

  const onSubmit = async (data: FieldFormData) => {
    try {
      const fieldData = {
        field_name: data.field_name,
        field_label: data.field_label,
        field_type: data.field_type,
        is_required: data.is_required,
        default_value: data.default_value || null,
        placeholder_text: data.placeholder_text || null,
        help_text: data.help_text || null,
        display_order: data.display_order,
        options: data.field_type === 'select' && data.options ? 
          JSON.stringify(data.options.split(',').map(opt => opt.trim())) : 
          JSON.stringify([]),
      };

      if (editingField) {
        const { error } = await supabase
          .from('custom_fields')
          .update(fieldData)
          .eq('id', editingField.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Custom field updated successfully",
        });
        setIsEditDialogOpen(false);
        setEditingField(null);
      } else {
        const { error } = await supabase
          .from('custom_fields')
          .insert([fieldData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Custom field created successfully",
        });
        setIsCreateDialogOpen(false);
      }

      form.reset();
      fetchCustomFields();
    } catch (error) {
      console.error('Error saving custom field:', error);
      toast({
        title: "Error",
        description: "Failed to save custom field",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (field: CustomField) => {
    setEditingField(field);
    form.reset({
      field_name: field.field_name,
      field_label: field.field_label,
      field_type: field.field_type,
      is_required: field.is_required,
      default_value: field.default_value || "",
      placeholder_text: field.placeholder_text || "",
      help_text: field.help_text || "",
      options: field.options.join(', '),
      display_order: field.display_order,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (fieldId: string) => {
    try {
      const { error } = await supabase
        .from('custom_fields')
        .delete()
        .eq('id', fieldId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Custom field deleted successfully",
      });
      fetchCustomFields();
      fetchFieldMappings();
    } catch (error) {
      console.error('Error deleting custom field:', error);
      toast({
        title: "Error",
        description: "Failed to delete custom field",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (fieldId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('custom_fields')
        .update({ is_active: !isActive })
        .eq('id', fieldId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Field ${!isActive ? 'activated' : 'deactivated'} successfully`,
      });
      fetchCustomFields();
    } catch (error) {
      console.error('Error toggling field status:', error);
      toast({
        title: "Error",
        description: "Failed to update field status",
        variant: "destructive",
      });
    }
  };

  const handleMapToScreen = async (screenName: string) => {
    if (!selectedFieldForMapping) return;

    try {
      const { error } = await supabase
        .from('field_screen_mappings')
        .insert([{
          field_id: selectedFieldForMapping,
          screen_name: screenName,
          display_order: 0,
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Field mapped to ${screenName} successfully`,
      });
      fetchFieldMappings();
      setIsMappingDialogOpen(false);
      setSelectedFieldForMapping(null);
    } catch (error) {
      console.error('Error mapping field to screen:', error);
      toast({
        title: "Error",
        description: "Failed to map field to screen",
        variant: "destructive",
      });
    }
  };

  const filteredFields = customFields.filter(field => {
    const matchesSearch = field.field_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         field.field_label.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredMappings = fieldMappings.filter(mapping => {
    if (selectedScreen === "all") return true;
    return mapping.screen_name === selectedScreen;
  });

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Fields</h1>
          <p className="text-muted-foreground">Create custom fields and map them to different screens</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Field
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Custom Field</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="field_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Field Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., emergency_contact" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="field_label"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Field Label</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Emergency Contact" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="field_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Field Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select field type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {fieldTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="display_order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Order</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="placeholder_text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Placeholder Text</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter placeholder text..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("field_type") === "select" && (
                  <FormField
                    control={form.control}
                    name="options"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Options (comma-separated)</FormLabel>
                        <FormControl>
                          <Input placeholder="Option 1, Option 2, Option 3" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="help_text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Help Text</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Additional help or instructions..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_required"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Required Field</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Field</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="fields" className="space-y-4">
        <TabsList>
          <TabsTrigger value="fields">Custom Fields</TabsTrigger>
          <TabsTrigger value="mappings">Screen Mappings</TabsTrigger>
        </TabsList>

        <TabsContent value="fields">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Custom Fields</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search fields..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Field Name</TableHead>
                      <TableHead>Label</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Required</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFields.map((field) => (
                      <TableRow key={field.id}>
                        <TableCell className="font-mono text-sm">{field.field_name}</TableCell>
                        <TableCell>{field.field_label}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{field.field_type}</Badge>
                        </TableCell>
                        <TableCell>
                          {field.is_required ? 
                            <Badge variant="destructive">Required</Badge> : 
                            <Badge variant="secondary">Optional</Badge>
                          }
                        </TableCell>
                        <TableCell>
                          <Badge variant={field.is_active ? "default" : "secondary"}>
                            {field.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedFieldForMapping(field.id);
                                setIsMappingDialogOpen(true);
                              }}
                            >
                              <MapPin className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleToggleActive(field.id, field.is_active)}
                            >
                              {field.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEdit(field)}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDelete(field.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mappings">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Screen Mappings</CardTitle>
                <Select value={selectedScreen} onValueChange={setSelectedScreen}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by screen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Screens</SelectItem>
                    {availableScreens.map((screen) => (
                      <SelectItem key={screen} value={screen}>{screen}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Field</TableHead>
                    <TableHead>Screen</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMappings.map((mapping) => (
                    <TableRow key={mapping.id}>
                      <TableCell>{mapping.custom_fields.field_label}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{mapping.screen_name}</Badge>
                      </TableCell>
                      <TableCell>{mapping.screen_section || "Default"}</TableCell>
                      <TableCell>{mapping.display_order}</TableCell>
                      <TableCell>
                        <Badge variant={mapping.is_active ? "default" : "secondary"}>
                          {mapping.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Custom Field</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Same form content as create dialog */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="field_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Field Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., emergency_contact" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="field_label"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Field Label</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Emergency Contact" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Field</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Mapping Dialog */}
      <Dialog open={isMappingDialogOpen} onOpenChange={setIsMappingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Map Field to Screen</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Select which screen you want to add this field to:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {availableScreens.map((screen) => (
                <Button
                  key={screen}
                  variant="outline"
                  onClick={() => handleMapToScreen(screen)}
                  className="justify-start"
                >
                  {screen}
                </Button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}