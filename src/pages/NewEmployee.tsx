import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  CalendarIcon,
  Phone,
  Smartphone,
  ChevronLeft,
  Mail,
  Info
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const NewEmployee = () => {
  const navigate = useNavigate();
  
  const [useSalutation, setUseSalutation] = useState(true);
  const [salutation, setSalutation] = useState("mr");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [preferredName, setPreferredName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emergencyMobile, setEmergencyMobile] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [role, setRole] = useState("frontline-employee");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date>();
  const [employmentType, setEmploymentType] = useState("casual");
  const [address, setAddress] = useState("");
  const [sendOnboardingEmail, setSendOnboardingEmail] = useState(true);
  
  // Compliance checkboxes
  const [policeClearance, setPoliceClearance] = useState(false);
  const [ndisWorkerScreening, setNdisWorkerScreening] = useState(false);
  const [ndisWorkerInduction, setNdisWorkerInduction] = useState(false);
  const [firstAidCPR, setFirstAidCPR] = useState(false);
  const [infectionControlTraining, setInfectionControlTraining] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log({
      useSalutation,
      salutation,
      firstName,
      middleName,
      lastName,
      displayName,
      preferredName,
      email,
      mobileNumber,
      phoneNumber,
      emergencyMobile,
      emergencyPhone,
      role,
      gender,
      dateOfBirth,
      employmentType,
      address,
      sendOnboardingEmail,
      policeClearance,
      ndisWorkerScreening,
      ndisWorkerInduction,
      firstAidCPR,
      infectionControlTraining
    });
    navigate("/team");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={() => navigate("/team")}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Staff
        </Button>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">New Employee</h1>
          <p className="text-sm text-muted-foreground">Staff</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Info className="h-4 w-4" />
          <span>No Access</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Staff Detail</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Name Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="name">Name:</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="use-salutation"
                      checked={useSalutation}
                      onCheckedChange={(checked) => setUseSalutation(checked === true)}
                    />
                    <Label htmlFor="use-salutation" className="text-blue-500">Use salutation</Label>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  {useSalutation && (
                    <Select value={salutation} onValueChange={setSalutation}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mr">Mr</SelectItem>
                        <SelectItem value="mrs">Mrs</SelectItem>
                        <SelectItem value="ms">Ms</SelectItem>
                        <SelectItem value="dr">Dr</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                  <Input 
                    placeholder="Enter First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={useSalutation ? "col-span-1" : "col-span-1"}
                  />
                  <Input 
                    placeholder="Enter Middle Name"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                  />
                  <Input 
                    placeholder="Enter Last/Family Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="display-name">Display Name:</Label>
                <Input 
                  id="display-name"
                  placeholder="Enter Display Name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="preferred-name">Preferred Name:</Label>
                <Input 
                  id="preferred-name"
                  placeholder="Enter Preferred Name"
                  value={preferredName}
                  onChange={(e) => setPreferredName(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="email">Email:</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email"
                    type="email"
                    placeholder="Enter Email"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Contact Section */}
              <div className="space-y-4">
                <Label>Contact:</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Enter Mobile Number"
                      className="pl-10"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Enter Phone Number"
                      className="pl-10"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="space-y-4">
                <Label>Emergency Contact:</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Enter Mobile Number"
                      className="pl-10"
                      value={emergencyMobile}
                      onChange={(e) => setEmergencyMobile(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Enter Phone Number"
                      className="pl-10"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Button 
                    type="button"
                    variant={role === "frontline-employee" ? "default" : "outline"}
                    onClick={() => setRole("frontline-employee")}
                  >
                    Frontline Employee
                  </Button>
                  <Button 
                    type="button"
                    variant={role === "office-user" ? "default" : "outline"}
                    onClick={() => setRole("office-user")}
                  >
                    Office User
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gender">Gender:</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="dob">Date Of Birth:</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateOfBirth && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateOfBirth ? format(dateOfBirth, "dd-MM-yyyy") : "23-09-2025"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateOfBirth}
                        onSelect={setDateOfBirth}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div>
                <Label htmlFor="employment-type">Employment Type:</Label>
                <Select value={employmentType} onValueChange={setEmploymentType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contractor">Contractor</SelectItem>
                    <SelectItem value="full-time">Full Time</SelectItem>
                    <SelectItem value="part-time">Part Time</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="address">Address:</Label>
                <Input 
                  id="address"
                  placeholder="Enter Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              {/* Compliance Section */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Compliance</Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="police-clearance"
                      checked={policeClearance}
                      onCheckedChange={(checked) => setPoliceClearance(checked === true)}
                    />
                    <Label htmlFor="police-clearance">Police Clearance</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="ndis-worker-screening"
                      checked={ndisWorkerScreening}
                      onCheckedChange={(checked) => setNdisWorkerScreening(checked === true)}
                    />
                    <Label htmlFor="ndis-worker-screening">NDIS Worker Screening Check</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="ndis-worker-induction"
                      checked={ndisWorkerInduction}
                      onCheckedChange={(checked) => setNdisWorkerInduction(checked === true)}
                    />
                    <Label htmlFor="ndis-worker-induction">NDIS Worker Induction</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="first-aid-cpr"
                      checked={firstAidCPR}
                      onCheckedChange={(checked) => setFirstAidCPR(checked === true)}
                    />
                    <Label htmlFor="first-aid-cpr">First Aid and CPR</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="infection-control"
                      checked={infectionControlTraining}
                      onCheckedChange={(checked) => setInfectionControlTraining(checked === true)}
                    />
                    <Label htmlFor="infection-control">Infection Control Training</Label>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="space-y-4 pt-8">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="send-onboarding"
                    checked={sendOnboardingEmail}
                    onCheckedChange={(checked) => setSendOnboardingEmail(checked === true)}
                  />
                  <Label htmlFor="send-onboarding" className="text-blue-500">Invite Employee Via Email</Label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-500">Invite Staff via SMS</span>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-2 pt-6 border-t">
          <Button type="button" variant="outline" onClick={() => navigate("/team")}>
            Cancel
          </Button>
          <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
            Create
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewEmployee;