import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Plus, Trash2, Calculator, Send, Save, User, DollarSign, Calendar, AlertTriangle, Clock } from "lucide-react";

const serviceItems = [
  { id: "PERS_CARE", name: "Personal Care", rate: 65.00, unit: "hour" },
  { id: "DOM_SUPP", name: "Domestic Support", rate: 55.00, unit: "hour" },
  { id: "COMM_ACCESS", name: "Community Access", rate: 72.50, unit: "hour" },
  { id: "TRANSPORT", name: "Transport", rate: 0.85, unit: "km" },
  { id: "NURSING", name: "Nursing Care", rate: 85.00, unit: "hour" },
  { id: "PHYSIO", name: "Physiotherapy", rate: 120.00, unit: "session" },
  { id: "SOCIAL_SUPP", name: "Social Support", rate: 62.00, unit: "hour" },
  { id: "MEAL_PREP", name: "Meal Preparation", rate: 58.00, unit: "hour" },
];

const clients = [
  { id: "CLI-001", name: "Sarah Johnson", ndisNumber: "NDIS-001234567", plan: "Self-Managed" },
  { id: "CLI-002", name: "Robert Smith", ndisNumber: "NDIS-002345678", plan: "Plan Managed" },
  { id: "CLI-003", name: "Maria Garcia", ndisNumber: "NDIS-003456789", plan: "NDIA Managed" },
  { id: "CLI-004", name: "John Williams", ndisNumber: "NDIS-004567890", plan: "Self-Managed" },
  { id: "CLI-005", name: "Emma Davis", ndisNumber: "NDIS-005678901", plan: "Plan Managed" },
];

const recentInvoices = [
  {
    id: "INV-DRAFT-001",
    client: "Sarah Johnson",
    amount: 1245.50,
    status: "Draft",
    created: "2024-01-20",
    items: 3,
  },
  {
    id: "INV-DRAFT-002", 
    client: "Robert Smith",
    amount: 890.25,
    status: "Draft",
    created: "2024-01-19",
    items: 2,
  },
  {
    id: "INV-DRAFT-003",
    client: "Maria Garcia",
    amount: 2156.75,
    status: "Ready to Send",
    created: "2024-01-18",
    items: 5,
  },
];

export default function GenerateInvoices() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft": return "outline";
      case "Ready to Send": return "default";
      default: return "secondary";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Generate Invoices</h1>
          <p className="text-muted-foreground">
            Create and manage client invoices with automated NDIS integration
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
        </div>
      </div>

      <Tabs defaultValue="create" className="space-y-4">
        <TabsList>
          <TabsTrigger value="create">Create Invoice</TabsTrigger>
          <TabsTrigger value="drafts">Draft Invoices</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Generation</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Details</CardTitle>
                <CardDescription>Enter client and billing information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="client">Select Client</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name} - {client.ndisNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="invoice-date">Invoice Date</Label>
                    <Input type="date" id="invoice-date" defaultValue="2024-01-20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="due-date">Due Date</Label>
                    <Input type="date" id="due-date" defaultValue="2024-02-04" />
                  </div>
                </div>

                  <div className="space-y-2">
                    <Label htmlFor="service-period">Service Period</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input type="date" placeholder="From" defaultValue="2024-01-01" />
                      <Input type="date" placeholder="To" defaultValue="2024-01-31" />
                    </div>
                  </div>

                <div className="space-y-2">
                  <Label htmlFor="reference">Reference/PO Number</Label>
                  <Input id="reference" placeholder="Optional reference number" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" placeholder="Additional notes for this invoice" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Items</CardTitle>
                <CardDescription>Add services provided to the client</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-12 gap-2 text-sm font-medium">
                    <div className="col-span-4">Service</div>
                    <div className="col-span-2">Quantity</div>
                    <div className="col-span-2">Rate</div>
                    <div className="col-span-3">Total</div>
                    <div className="col-span-1"></div>
                  </div>
                  
                  <Separator />
                  
                  {/* Sample service items */}
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-4">
                      <Select>
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Select service" />
                        </SelectTrigger>
                        <SelectContent>
                          {serviceItems.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name} - ${item.rate}/{item.unit}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Input type="number" placeholder="0" className="h-8" />
                    </div>
                    <div className="col-span-2">
                      <Input type="number" placeholder="0.00" className="h-8" />
                    </div>
                    <div className="col-span-3">
                      <div className="text-sm font-medium">$0.00</div>
                    </div>
                    <div className="col-span-1">
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Service Item
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (10%):</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>$0.00</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate Total
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Send className="h-4 w-4 mr-2" />
                    Generate & Send
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="drafts">
          <Card>
            <CardHeader>
              <CardTitle>Draft Invoices</CardTitle>
              <CardDescription>
                Manage saved invoice drafts and pending invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {invoice.client}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{formatCurrency(invoice.amount)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(invoice.status) as any}>
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {invoice.created}
                        </div>
                      </TableCell>
                      <TableCell>{invoice.items} items</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          {invoice.status === "Ready to Send" && (
                            <Button size="sm">
                              <Send className="h-4 w-4 mr-1" />
                              Send
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Invoice Generation</CardTitle>
              <CardDescription>
                Generate multiple invoices for recurring services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Bulk generation will create invoices for all selected clients based on their service schedules for the specified period.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Billing Period</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input type="date" defaultValue="2024-01-01" />
                      <Input type="date" defaultValue="2024-01-31" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Invoice Date</Label>
                    <Input type="date" defaultValue="2024-02-01" />
                  </div>

                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Input type="date" defaultValue="2024-02-15" />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Select Clients</Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-3">
                    {clients.map((client) => (
                      <div key={client.id} className="flex items-center space-x-2">
                        <Checkbox id={client.id} />
                        <Label htmlFor={client.id} className="flex-1">
                          {client.name} ({client.plan})
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">
                  <Calculator className="h-4 w-4 mr-2" />
                  Preview Invoices
                </Button>
                <Button variant="outline" className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Drafts
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}