import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Calendar, User, Clock, FileText, Download, Plus, Eye, Send, AlertTriangle } from "lucide-react";

const invoices = [
  {
    id: "INV-2024-001",
    client: "Sarah Johnson",
    clientId: "CLI-001",
    amount: 2850.00,
    status: "Paid",
    dueDate: "2024-01-15",
    issueDate: "2024-01-01",
    services: "Personal Care, Transport",
    paymentMethod: "NDIS Direct",
    daysOutstanding: 0,
  },
  {
    id: "INV-2024-002",
    client: "Robert Smith",
    clientId: "CLI-002",
    amount: 1920.50,
    status: "Overdue",
    dueDate: "2024-01-18",
    issueDate: "2024-01-04",
    services: "Nursing Care, Medication Support",
    paymentMethod: "Self-Managed",
    daysOutstanding: 3,
  },
  {
    id: "INV-2024-003",
    client: "Maria Garcia",
    clientId: "CLI-003",
    amount: 3245.75,
    status: "Pending",
    dueDate: "2024-01-25",
    issueDate: "2024-01-11",
    services: "Complex Care, Physiotherapy",
    paymentMethod: "Plan Managed",
    daysOutstanding: 0,
  },
  {
    id: "INV-2024-004",
    client: "John Williams",
    clientId: "CLI-004",
    amount: 1675.00,
    status: "Draft",
    dueDate: "2024-01-30",
    issueDate: "2024-01-16",
    services: "Social Support, Community Access",
    paymentMethod: "NDIS Direct",
    daysOutstanding: 0,
  },
  {
    id: "INV-2024-005",
    client: "Emma Davis",
    clientId: "CLI-005",
    amount: 2340.25,
    status: "Sent",
    dueDate: "2024-01-28",
    issueDate: "2024-01-14",
    services: "Personal Care, Domestic Support",
    paymentMethod: "Self-Managed",
    daysOutstanding: 0,
  },
];

export default function Invoices() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid": return "secondary";
      case "Sent": return "default";
      case "Pending": return "outline";
      case "Draft": return "secondary";
      case "Overdue": return "destructive";
      default: return "outline";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount);
  };

  const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidAmount = invoices.filter(inv => inv.status === "Paid").reduce((sum, invoice) => sum + invoice.amount, 0);
  const overdueAmount = invoices.filter(inv => inv.status === "Overdue").reduce((sum, invoice) => sum + invoice.amount, 0);
  const pendingAmount = invoices.filter(inv => inv.status === "Pending" || inv.status === "Sent").reduce((sum, invoice) => sum + invoice.amount, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Invoices</h1>
          <p className="text-muted-foreground">
            Manage client invoices, payments, and NDIS billing
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalAmount)}</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Invoices</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(paidAmount)}</div>
            <p className="text-xs text-muted-foreground">1 invoice paid</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{formatCurrency(pendingAmount)}</div>
            <p className="text-xs text-muted-foreground">Awaiting payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(overdueAmount)}</div>
            <p className="text-xs text-muted-foreground">Requires follow-up</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Invoices</TabsTrigger>
          <TabsTrigger value="pending">Pending Payment</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Invoices</CardTitle>
              <CardDescription>
                Complete list of client invoices across all payment statuses
              </CardDescription>
              <div className="flex gap-4">
                <Input placeholder="Search by client or invoice ID..." className="max-w-sm" />
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Methods</SelectItem>
                    <SelectItem value="ndis">NDIS Direct</SelectItem>
                    <SelectItem value="self">Self-Managed</SelectItem>
                    <SelectItem value="plan">Plan Managed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Services</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{invoice.client}</div>
                            <div className="text-xs text-muted-foreground">{invoice.clientId}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{formatCurrency(invoice.amount)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(invoice.status) as any}>
                          {invoice.status}
                          {invoice.status === "Overdue" && ` (${invoice.daysOutstanding}d)`}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {invoice.issueDate}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {invoice.dueDate}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{invoice.paymentMethod}</Badge>
                      </TableCell>
                      <TableCell className="max-w-[150px] truncate">
                        {invoice.services}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          {(invoice.status === "Draft" || invoice.status === "Pending") && (
                            <Button variant="outline" size="sm">
                              <Send className="h-4 w-4 mr-1" />
                              Send
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            PDF
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Payment Invoices</CardTitle>
              <CardDescription>
                Invoices that have been sent and are awaiting payment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Pending Payments</h3>
                <p className="text-muted-foreground">
                  Invoices sent to clients awaiting payment processing
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdue">
          <Card>
            <CardHeader>
              <CardTitle>Overdue Invoices</CardTitle>
              <CardDescription>
                Invoices that are past their due date and require follow-up
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <AlertTriangle className="h-12 w-12 mx-auto text-red-500 mb-4" />
                <h3 className="text-lg font-medium mb-2">Overdue Invoices</h3>
                <p className="text-muted-foreground">
                  Invoices requiring immediate attention and follow-up
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paid">
          <Card>
            <CardHeader>
              <CardTitle>Paid Invoices</CardTitle>
              <CardDescription>
                Successfully processed and paid invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <DollarSign className="h-12 w-12 mx-auto text-green-500 mb-4" />
                <h3 className="text-lg font-medium mb-2">Paid Invoices</h3>
                <p className="text-muted-foreground">
                  Completed invoices with successful payment processing
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}