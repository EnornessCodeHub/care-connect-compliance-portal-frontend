import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Calendar, DollarSign, CheckCircle, Clock, AlertTriangle, FileText, Upload, Download } from "lucide-react";

const ndisClaims = [
  {
    id: "NDIS-CLM-2024-001",
    participant: "Sarah Johnson",
    participantId: "NDIS-001234567",
    planNumber: "PLN-2024-001",
    claimAmount: 2850.00,
    supportCategory: "Core Support",
    servicePeriod: "01/01/2024 - 31/01/2024",
    submissionDate: "2024-02-01",
    status: "Approved",
    paymentDate: "2024-02-05",
    provider: "Your Care Service",
    budgetCode: "01_001_0107_1_1",
  },
  {
    id: "NDIS-CLM-2024-002",
    participant: "Robert Smith",
    participantId: "NDIS-002345678",
    planNumber: "PLN-2024-002",
    claimAmount: 1920.50,
    supportCategory: "Capacity Building",
    servicePeriod: "01/01/2024 - 31/01/2024",
    submissionDate: "2024-02-02",
    status: "Under Review",
    paymentDate: null,
    provider: "Your Care Service",
    budgetCode: "02_001_0117_1_1",
  },
  {
    id: "NDIS-CLM-2024-003",
    participant: "Maria Garcia",
    participantId: "NDIS-003456789",
    planNumber: "PLN-2024-003",
    claimAmount: 3245.75,
    supportCategory: "Capital",
    servicePeriod: "15/01/2024 - 14/02/2024",
    submissionDate: "2024-02-15",
    status: "Pending Submission",
    paymentDate: null,
    provider: "Your Care Service",
    budgetCode: "03_001_0128_1_1",
  },
  {
    id: "NDIS-CLM-2024-004",
    participant: "John Williams",
    participantId: "NDIS-004567890",
    planNumber: "PLN-2024-004",
    claimAmount: 1675.00,
    supportCategory: "Core Support",
    servicePeriod: "01/02/2024 - 28/02/2024",
    submissionDate: "2024-03-01",
    status: "Rejected",
    paymentDate: null,
    provider: "Your Care Service",
    budgetCode: "01_001_0107_1_1",
  },
];

export default function NDISClaims() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "secondary";
      case "Under Review": return "default";
      case "Pending Submission": return "outline";
      case "Rejected": return "destructive";
      default: return "outline";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount);
  };

  const totalClaimed = ndisClaims.reduce((sum, claim) => sum + claim.claimAmount, 0);
  const approvedAmount = ndisClaims.filter(claim => claim.status === "Approved").reduce((sum, claim) => sum + claim.claimAmount, 0);
  const pendingAmount = ndisClaims.filter(claim => claim.status === "Under Review" || claim.status === "Pending Submission").reduce((sum, claim) => sum + claim.claimAmount, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">NDIS Claims</h1>
          <p className="text-muted-foreground">
            Manage NDIS participant claims and payment processing
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Bulk Upload
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Claims
          </Button>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            New Claim
          </Button>
        </div>
      </div>

      <Alert className="border-blue-200 bg-blue-50">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>NDIS Portal Integration:</strong> Claims are automatically submitted to the NDIS Portal. 
          Ensure all participant plan details are current before submission.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalClaimed)}</div>
            <p className="text-xs text-muted-foreground">This financial year</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Claims</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(approvedAmount)}</div>
            <p className="text-xs text-muted-foreground">Ready for payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{formatCurrency(pendingAmount)}</div>
            <p className="text-xs text-muted-foreground">Under NDIS review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">75%</div>
            <p className="text-xs text-muted-foreground">Claims approval rate</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>NDIS Claims Management</CardTitle>
          <CardDescription>
            Track and manage NDIS participant claims and payment status
          </CardDescription>
          <div className="flex gap-4">
            <Input placeholder="Search by participant or claim ID..." className="max-w-sm" />
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="review">Under Review</SelectItem>
                <SelectItem value="pending">Pending Submission</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Support category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="core">Core Support</SelectItem>
                <SelectItem value="capacity">Capacity Building</SelectItem>
                <SelectItem value="capital">Capital</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Claim ID</TableHead>
                <TableHead>Participant</TableHead>
                <TableHead>Plan Number</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Support Category</TableHead>
                <TableHead>Service Period</TableHead>
                <TableHead>Submission Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ndisClaims.map((claim) => (
                <TableRow key={claim.id}>
                  <TableCell className="font-medium">{claim.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{claim.participant}</div>
                      <div className="text-xs text-muted-foreground">{claim.participantId}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{claim.planNumber}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(claim.claimAmount)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{claim.supportCategory}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{claim.servicePeriod}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {claim.submissionDate}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(claim.status) as any}>
                      {claim.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {claim.paymentDate ? (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {claim.paymentDate}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {claim.status === "Pending Submission" && (
                        <Button size="sm">
                          <Upload className="h-4 w-4 mr-1" />
                          Submit
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common NDIS claims management tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Upload className="h-4 w-4 mr-2" />
              Submit Pending Claims
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Download Payment Advice
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Generate Claims Report
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Shield className="h-4 w-4 mr-2" />
              Validate Plan Details
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Claims by Support Category</CardTitle>
            <CardDescription>Breakdown of claims by NDIS support type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span className="font-medium">Core Support</span>
              </div>
              <div className="text-right">
                <div className="font-medium">{formatCurrency(4525.00)}</div>
                <div className="text-xs text-muted-foreground">2 claims</div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="font-medium">Capacity Building</span>
              </div>
              <div className="text-right">
                <div className="font-medium">{formatCurrency(1920.50)}</div>
                <div className="text-xs text-muted-foreground">1 claim</div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full" />
                <span className="font-medium">Capital</span>
              </div>
              <div className="text-right">
                <div className="font-medium">{formatCurrency(3245.75)}</div>
                <div className="text-xs text-muted-foreground">1 claim</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}