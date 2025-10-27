import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search, 
  Plus, 
  ArrowLeft,
  AlertTriangle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const Outlets = () => {
  const [isNewOutletDialogOpen, setIsNewOutletDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [recordsPerPage, setRecordsPerPage] = useState("10");

  // Mock data - empty for now as shown in screenshot
  const outlets: any[] = [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Outlet List</h1>
        <Dialog open={isNewOutletDialogOpen} onOpenChange={setIsNewOutletDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-500 hover:bg-blue-600">
              New Outlet
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center space-x-2">
                <ArrowLeft className="h-5 w-5" />
                <DialogTitle>New Outlet</DialogTitle>
              </div>
            </DialogHeader>
            <NewOutletForm onClose={() => setIsNewOutletDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="search">Search Outlet</Label>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            id="search"
            placeholder="Search by Outlet Name"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Outlet Name</TableHead>
              <TableHead>Sub Outlets</TableHead>
              <TableHead>Staff</TableHead>
              <TableHead>Clients</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {outlets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                  No Outlets Present
                </TableCell>
              </TableRow>
            ) : (
              outlets.map((outlet) => (
                <TableRow key={outlet.id}>
                  <TableCell>{outlet.name}</TableCell>
                  <TableCell>{outlet.subOutlets}</TableCell>
                  <TableCell>{outlet.staff}</TableCell>
                  <TableCell>{outlet.clients}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            Showing 0 of 0 items.
          </span>
          <Select value={recordsPerPage} onValueChange={setRecordsPerPage}>
            <SelectTrigger className="w-16">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">records per page.</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-blue-500">1</span>
          <Button variant="outline" size="sm" disabled>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// New Outlet Form Component
const NewOutletForm = ({ onClose }: { onClose: () => void }) => {
  const [outletName, setOutletName] = useState("");
  const [outletDescription, setOutletDescription] = useState("");
  const [propertyType, setPropertyType] = useState("provider-owned");
  const [outletType, setOutletType] = useState("");
  const [maxClients, setMaxClients] = useState(0);
  const [maxStaff, setMaxStaff] = useState(0);
  const [address, setAddress] = useState("");
  const [unitNumber, setUnitNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log({
      outletName,
      outletDescription,
      propertyType,
      outletType,
      maxClients,
      maxStaff,
      address,
      unitNumber
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Outlet Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="outlet-name">Outlet Name</Label>
              <Input 
                id="outlet-name"
                placeholder="Enter Outlet Name"
                value={outletName}
                onChange={(e) => setOutletName(e.target.value)}
              />
            </div>

            <div>
              <Label>Outlet Property Type</Label>
              <RadioGroup value={propertyType} onValueChange={setPropertyType} className="mt-2">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="provider-owned" id="provider-owned" />
                    <Label htmlFor="provider-owned">Provider Owned</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rented" id="rented" />
                    <Label htmlFor="rented">Rented</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="max-clients">Maximum Clients</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Button 
                  type="button"
                  variant="outline" 
                  size="sm"
                  onClick={() => setMaxClients(Math.max(0, maxClients - 1))}
                >
                  -
                </Button>
                <Input 
                  id="max-clients"
                  type="number"
                  value={maxClients}
                  onChange={(e) => setMaxClients(parseInt(e.target.value) || 0)}
                  className="text-center w-20"
                />
                <Button 
                  type="button"
                  variant="outline" 
                  size="sm"
                  onClick={() => setMaxClients(maxClients + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="address" className="flex items-center space-x-2">
                <span>Address</span>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </Label>
              <Input 
                id="address"
                placeholder="Enter Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="unit-number">Unit Number</Label>
              <Input 
                id="unit-number"
                placeholder="Enter Unit Number"
                value={unitNumber}
                onChange={(e) => setUnitNumber(e.target.value)}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="outlet-description">Outlet Description</Label>
              <Textarea 
                id="outlet-description"
                placeholder="Enter Outlet Description"
                rows={4}
                value={outletDescription}
                onChange={(e) => setOutletDescription(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="outlet-type">Outlet Type</Label>
              <Select value={outletType} onValueChange={setOutletType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="day-center">Day Center</SelectItem>
                  <SelectItem value="community">Community</SelectItem>
                  <SelectItem value="office">Office</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="max-staff">Maximum staff number in the property at any given time</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Button 
                  type="button"
                  variant="outline" 
                  size="sm"
                  onClick={() => setMaxStaff(Math.max(0, maxStaff - 1))}
                >
                  -
                </Button>
                <Input 
                  id="max-staff"
                  type="number"
                  value={maxStaff}
                  onChange={(e) => setMaxStaff(parseInt(e.target.value) || 0)}
                  className="text-center w-20"
                />
                <Button 
                  type="button"
                  variant="outline" 
                  size="sm"
                  onClick={() => setMaxStaff(maxStaff + 1)}
                >
                  +
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
          Submit
        </Button>
      </div>
    </form>
  );
};

export default Outlets;