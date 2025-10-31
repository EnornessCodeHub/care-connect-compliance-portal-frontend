import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Camera, X } from "lucide-react";
import authService from "@/services/authService";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [show, setShow] = useState<{cur:boolean; new:boolean; conf:boolean}>({cur:false, new:false, conf:false});
  const [pwdMsg, setPwdMsg] = useState<string>("");

  // Load user data from localStorage
  useEffect(() => {
    const userData = authService.getUserData();
    if (userData) {
      setFullname(userData.fullname || "");
      setUsername(userData.username || "");
      setEmail(userData.email || "");
      setRole(userData.role || "");
      setProfileImage(userData.profile_img || null);
      setImagePreview(userData.profile_img || null);
    }
  }, []);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: "Invalid File",
          description: "Please select an image file.",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File Too Large",
          description: "Please select an image smaller than 5MB.",
        });
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageUpload = async () => {
    if (!imagePreview) return;

    try {
      // TODO: Implement actual API call to upload image
      // For now, we'll store it in localStorage
      const userData = authService.getUserData();
      if (userData) {
        const updatedUserData = {
          ...userData,
          profile_img: imagePreview
        };
        localStorage.setItem('user_data', JSON.stringify(updatedUserData));
        setProfileImage(imagePreview);
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new Event('profileUpdated'));
        
        toast({
          title: "Profile Image Updated",
          description: "Your profile image has been updated successfully.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "Failed to update profile image. Please try again.",
      });
    }
  };

  const save = () => {
    // Save logic here - would typically call an API to update user profile
    const userData = authService.getUserData();
    if (userData) {
      const updatedUserData = {
        ...userData,
        fullname,
        username,
        email,
      };
      localStorage.setItem('user_data', JSON.stringify(updatedUserData));
    }
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
    setIsEditing(false);
  };

  const handleUpdatePassword = () => {
    if(!currentPwd) { 
      setPwdMsg("Current password is required."); 
      return; 
    }
    if(!newPwd || newPwd.length<6) { 
      setPwdMsg("Password must be at least 6 characters."); 
      return; 
    }
    if(newPwd!==confirmPwd) { 
      setPwdMsg("Passwords do not match."); 
      return; 
    }
    setPwdMsg("");
    
    // Password update logic here - would typically call an API
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
    });
    
    // Clear password fields
    setCurrentPwd("");
    setNewPwd("");
    setConfirmPwd("");
  };

  // Format role for display
  const getRoleBadgeText = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const getRoleBadgeVariant = (role: string): "default" | "secondary" | "destructive" | "outline" => {
    return role === "admin" ? "default" : "secondary";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Cover */}
      <div className="rounded-xl overflow-hidden border">
        <div className="h-40 md:h-56 bg-muted relative">
          {/* Avatar */}
          <div className="absolute -bottom-10 left-6">
            <div className="relative group">
              <div className="h-24 w-24 md:h-28 md:w-28 rounded-full bg-muted-foreground/10 border flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                )}
              </div>
              
              {/* Camera button overlay */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                title="Change profile picture"
              >
                <Camera className="h-6 w-6 text-white" />
              </button>
              
              {/* Active status indicator */}
              <span className="absolute right-1 bottom-1 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
              
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>
          </div>
        </div>
        {/* Name line */}
        <div className="pt-12 px-6 pb-6 border-t">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl md:text-3xl font-semibold">{fullname || username}</h2>
                {role && (
                  <Badge variant={getRoleBadgeVariant(role)}>
                    {getRoleBadgeText(role)}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Joined Oct 2025 • Active now</p>
            </div>
            
            {/* Image upload actions */}
            {imagePreview && imagePreview !== profileImage && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveImage}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleImageUpload}
                  className="bg-blue-600 hover:bg-blue-500"
                >
                  <Camera className="h-4 w-4 mr-1" />
                  Save Image
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 gap-6">
        {/* Details */}
        <div>
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Details</CardTitle>
              <div className="flex items-center gap-2">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} className="bg-slate-900 text-white hover:bg-slate-800">Edit</Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button onClick={save} className="bg-blue-600 hover:bg-blue-500">Save</Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <Label>Full Name</Label>
                    {isEditing ? (
                      <Input value={fullname} onChange={(e) => setFullname(e.target.value)} placeholder="Enter your full name" />
                    ) : (
                      <div className="text-sm">{fullname || "-"}</div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label>Username</Label>
                    {isEditing ? (
                      <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" />
                    ) : (
                      <div className="text-sm">{username || "-"}</div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <Label>Email</Label>
                    {isEditing ? (
                      <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" />
                    ) : (
                      <div className="text-sm">{email || "-"}</div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Change Password */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label>Current Password</Label>
                  <div className="relative">
                    <Input type={show.cur?"text":"password"} value={currentPwd} onChange={(e)=>setCurrentPwd(e.target.value)} className="pr-10" />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={()=>setShow(s=>({...s,cur:!s.cur}))}>
                      {show.cur? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>New Password</Label>
                  <div className="relative">
                    <Input type={show.new?"text":"password"} value={newPwd} onChange={(e)=>setNewPwd(e.target.value)} className="pr-10" />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={()=>setShow(s=>({...s,new:!s.new}))}>
                      {show.new? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>Confirm Password</Label>
                  <div className="relative">
                    <Input type={show.conf?"text":"password"} value={confirmPwd} onChange={(e)=>setConfirmPwd(e.target.value)} className="pr-10" />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={()=>setShow(s=>({...s,conf:!s.conf}))}>
                      {show.conf? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                    </button>
                  </div>
                </div>
              </div>
              {pwdMsg && <div className="text-sm text-destructive mt-2">{pwdMsg}</div>}
              <div className="pt-4 flex justify-end">
                <Button onClick={handleUpdatePassword}>Update Password</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
