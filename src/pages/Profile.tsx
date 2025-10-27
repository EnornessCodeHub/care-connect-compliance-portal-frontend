import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff } from "lucide-react";

export default function Profile() {
  const [firstName, setFirstName] = useState("Harrisom");
  const [nickname, setNickname] = useState("lyricartifact");
  const [email, setEmail] = useState("harrisom@example.com");
  const [phone, setPhone] = useState("+61 400 000 000");
  const [isEditing, setIsEditing] = useState(false);
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [show, setShow] = useState<{cur:boolean; new:boolean; conf:boolean}>({cur:false, new:false, conf:false});
  const [pwdMsg, setPwdMsg] = useState<string>("");

  const save = () => {
    setIsEditing(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Cover */}
      <div className="rounded-xl overflow-hidden border">
        <div className="h-40 md:h-56 bg-muted relative">
          {/* Avatar */}
          <div className="absolute -bottom-10 left-6">
            <div className="relative">
              <div className="h-24 w-24 md:h-28 md:w-28 rounded-full bg-muted-foreground/10 border flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <span className="absolute right-1 bottom-1 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
            </div>
          </div>
        </div>
        {/* Name line */}
        <div className="pt-12 px-6 pb-6 border-t">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl md:text-3xl font-semibold">{firstName}</h2>
            <Badge variant="secondary">Member</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Joined Oct 2025 • Active now</p>
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
                    <Label>First Name</Label>
                    {isEditing ? (
                      <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    ) : (
                      <div className="text-sm">{firstName}</div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label>Nickname</Label>
                    {isEditing ? (
                      <Input value={nickname} onChange={(e) => setNickname(e.target.value)} />
                    ) : (
                      <div className="text-sm">{nickname}</div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <Label>Email</Label>
                    {isEditing ? (
                      <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    ) : (
                      <div className="text-sm">{email}</div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label>Phone</Label>
                    {isEditing ? (
                      <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
                    ) : (
                      <div className="text-sm">{phone}</div>
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
                <Button onClick={()=>{
                  if(!newPwd || newPwd.length<6){ setPwdMsg("Password must be at least 6 characters."); return; }
                  if(newPwd!==confirmPwd){ setPwdMsg("Passwords do not match."); return; }
                  setPwdMsg("");
                }}>Update Password</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


