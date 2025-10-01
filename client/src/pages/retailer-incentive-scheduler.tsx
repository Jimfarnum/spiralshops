import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Edit, 
  Trash2, 
  Clock, 
  Users, 
  Gift, 
  Tag,
  Bell,
  DollarSign,
  Percent,
  ShoppingBag,
  Target,
  Zap
} from "lucide-react";
// Using native Date API instead of date-fns
const formatDateDate = (date: string | Date, formatDateType: string = 'short') => {
  const d = new Date(date);
  if (formatDateType === 'PPp') return d.toLocaleString();
  if (formatDateType === 'PP') return d.toLocaleDateString();
  return d.toLocaleDateString();
};

const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const startOfWeek = (date: Date) => {
  const result = new Date(date);
  const day = result.getDay();
  const diff = result.getDate() - day;
  result.setDate(diff);
  return result;
};

const endOfWeek = (date: Date) => {
  const result = new Date(date);
  const day = result.getDay();
  const diff = result.getDate() + (6 - day);
  result.setDate(diff);
  return result;
};

const startOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const endOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};
import { useToast } from "@/hooks/use-toast";

interface Perk {
  id: string;
  title: string;
  description: string;
  type: 'discount' | 'freeItem' | 'buyOneGetOne' | 'cashback' | 'spiralBonus';
  value: number;
  unit: 'percent' | 'dollar' | 'spirals';
  schedule: {
    type: 'daily' | 'weekly' | 'monthly' | 'oneTime';
    startDate: Date;
    endDate?: Date;
    daysOfWeek?: number[];
    timeSlots?: { start: string; end: string }[];
  };
  triggers: {
    minCartValue?: number;
    minParticipants?: number;
    specificProducts?: string[];
    newCustomersOnly?: boolean;
  };
  isActive: boolean;
  usageLimit?: number;
  currentUsage: number;
  createdAt: Date;
}

export default function RetailerIncentiveScheduler() {
  const [perks, setPerks] = useState<Perk[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPerk, setEditingPerk] = useState<Perk | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const { toast } = useToast();

  // Form state for creating/editing perks
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'discount' as const,
    value: 0,
    unit: 'percent' as const,
    scheduleType: 'daily' as const,
    startDate: new Date(),
    endDate: undefined as Date | undefined,
    daysOfWeek: [] as number[],
    timeSlots: [{ start: '09:00', end: '17:00' }],
    minCartValue: 0,
    minParticipants: 1,
    newCustomersOnly: false,
    usageLimit: undefined as number | undefined
  });

  useEffect(() => {
    loadPerks();
  }, []);

  const loadPerks = async () => {
    try {
      const response = await fetch('/api/retailer-perks');
      if (response.ok) {
        const data = await response.json();
        setPerks(data.perks || []);
      }
    } catch (error) {
      console.error('Failed to load perks:', error);
    }
  };

  const savePerk = async () => {
    try {
      const perkData = {
        ...formData,
        id: editingPerk?.id || `perk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        schedule: {
          type: formData.scheduleType,
          startDate: formData.startDate,
          endDate: formData.endDate,
          daysOfWeek: formData.daysOfWeek,
          timeSlots: formData.timeSlots
        },
        triggers: {
          minCartValue: formData.minCartValue || undefined,
          minParticipants: formData.minParticipants || 1,
          newCustomersOnly: formData.newCustomersOnly
        },
        isActive: true,
        currentUsage: editingPerk?.currentUsage || 0,
        createdAt: editingPerk?.createdAt || new Date()
      };

      const response = await fetch('/api/retailer-perks', {
        method: editingPerk ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(perkData)
      });

      if (response.ok) {
        toast({
          title: editingPerk ? "Perk Updated" : "Perk Created",
          description: `${formData.title} has been ${editingPerk ? 'updated' : 'created'} successfully.`
        });
        
        setIsCreateDialogOpen(false);
        setEditingPerk(null);
        resetForm();
        loadPerks();
      } else {
        throw new Error('Failed to save perk');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save perk. Please try again.",
        variant: "destructive"
      });
    }
  };

  const deletePerk = async (perkId: string) => {
    try {
      const response = await fetch(`/api/retailer-perks/${perkId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast({
          title: "Perk Deleted",
          description: "The perk has been removed successfully."
        });
        loadPerks();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete perk.",
        variant: "destructive"
      });
    }
  };

  const togglePerkStatus = async (perkId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/retailer-perks/${perkId}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive })
      });

      if (response.ok) {
        toast({
          title: isActive ? "Perk Activated" : "Perk Deactivated",
          description: `The perk is now ${isActive ? 'active' : 'inactive'}.`
        });
        loadPerks();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update perk status.",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'discount',
      value: 0,
      unit: 'percent',
      scheduleType: 'daily',
      startDate: new Date(),
      endDate: undefined,
      daysOfWeek: [],
      timeSlots: [{ start: '09:00', end: '17:00' }],
      minCartValue: 0,
      minParticipants: 1,
      newCustomersOnly: false,
      usageLimit: undefined
    });
  };

  const getPerksForDate = (date: Date) => {
    return perks.filter(perk => {
      const perkStart = new Date(perk.schedule.startDate);
      const perkEnd = perk.schedule.endDate ? new Date(perk.schedule.endDate) : null;
      
      if (date < perkStart || (perkEnd && date > perkEnd)) {
        return false;
      }

      if (perk.schedule.type === 'daily') {
        return true;
      } else if (perk.schedule.type === 'weekly' && perk.schedule.daysOfWeek) {
        return perk.schedule.daysOfWeek.includes(date.getDay());
      } else if (perk.schedule.type === 'oneTime') {
        return formatDate(date, 'yyyy-MM-dd') === formatDate(perkStart, 'yyyy-MM-dd');
      }
      
      return false;
    });
  };

  const getPerkTypeIcon = (type: string) => {
    switch (type) {
      case 'discount': return <Percent className="h-4 w-4" />;
      case 'freeItem': return <Gift className="h-4 w-4" />;
      case 'buyOneGetOne': return <ShoppingBag className="h-4 w-4" />;
      case 'cashback': return <DollarSign className="h-4 w-4" />;
      case 'spiralBonus': return <Zap className="h-4 w-4" />;
      default: return <Tag className="h-4 w-4" />;
    }
  };

  const getPerkStatusColor = (perk: Perk) => {
    if (!perk.isActive) return 'bg-gray-100 text-gray-600';
    
    const now = new Date();
    const startDate = new Date(perk.schedule.startDate);
    const endDate = perk.schedule.endDate ? new Date(perk.schedule.endDate) : null;
    
    if (now < startDate) return 'bg-blue-100 text-blue-600';
    if (endDate && now > endDate) return 'bg-red-100 text-red-600';
    if (perk.usageLimit && perk.currentUsage >= perk.usageLimit) return 'bg-orange-100 text-orange-600';
    
    return 'bg-green-100 text-green-600';
  };

  const renderCalendarView = () => {
    const calendarDays = [];
    const startDate = startOfMonth(selectedDate);
    const endDate = endOfMonth(selectedDate);
    
    for (let date = startDate; date <= endDate; date = addDays(date, 1)) {
      const dayPerks = getPerksForDate(date);
      calendarDays.push(
        <div key={date.toISOString()} className="border border-gray-200 rounded-lg p-2 min-h-[120px]">
          <div className="font-semibold text-sm text-gray-600 mb-2">
            {formatDate(date, 'd')}
          </div>
          <div className="space-y-1">
            {dayPerks.slice(0, 3).map(perk => (
              <div key={perk.id} className={`text-xs p-1 rounded ${getPerkStatusColor(perk)}`}>
                {perk.title}
              </div>
            ))}
            {dayPerks.length > 3 && (
              <div className="text-xs text-gray-500">+{dayPerks.length - 3} more</div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="font-semibold text-center p-2 text-gray-600">
            {day}
          </div>
        ))}
        {calendarDays}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Incentive Scheduler</h1>
            <p className="text-gray-600 mt-2">Manage perks and incentives for shopping trips</p>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setViewMode(viewMode === 'calendar' ? 'list' : 'calendar')}
            >
              {viewMode === 'calendar' ? 'List View' : 'Calendar View'}
            </Button>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Perk
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingPerk ? 'Edit Perk' : 'Create New Perk'}</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Perk Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="e.g., Weekend Flash Sale"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="type">Perk Type</Label>
                      <Select value={formData.type} onValueChange={(value: any) => setFormData({...formData, type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="discount">Percentage Discount</SelectItem>
                          <SelectItem value="freeItem">Free Item</SelectItem>
                          <SelectItem value="buyOneGetOne">Buy One Get One</SelectItem>
                          <SelectItem value="cashback">Cashback</SelectItem>
                          <SelectItem value="spiralBonus">SPIRAL Bonus</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Describe the perk details..."
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="value">Value</Label>
                      <Input
                        id="value"
                        type="number"
                        value={formData.value}
                        onChange={(e) => setFormData({...formData, value: Number(e.target.value)})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="unit">Unit</Label>
                      <Select value={formData.unit} onValueChange={(value: any) => setFormData({...formData, unit: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percent">Percentage (%)</SelectItem>
                          <SelectItem value="dollar">Dollar Amount ($)</SelectItem>
                          <SelectItem value="spirals">SPIRAL Points</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="usageLimit">Usage Limit</Label>
                      <Input
                        id="usageLimit"
                        type="number"
                        value={formData.usageLimit || ''}
                        onChange={(e) => setFormData({...formData, usageLimit: e.target.value ? Number(e.target.value) : undefined})}
                        placeholder="Unlimited"
                      />
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">Schedule Settings</h3>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor="scheduleType">Schedule Type</Label>
                        <Select value={formData.scheduleType} onValueChange={(value: any) => setFormData({...formData, scheduleType: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="oneTime">One Time</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={formatDate(formData.startDate, 'yyyy-MM-dd')}
                          onChange={(e) => setFormData({...formData, startDate: new Date(e.target.value)})}
                        />
                      </div>
                    </div>

                    {formData.scheduleType === 'weekly' && (
                      <div className="mb-4">
                        <Label>Days of Week</Label>
                        <div className="flex gap-2 mt-2">
                          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                            <Button
                              key={day}
                              variant={formData.daysOfWeek.includes(index) ? "default" : "outline"}
                              size="sm"
                              onClick={() => {
                                const newDays = formData.daysOfWeek.includes(index)
                                  ? formData.daysOfWeek.filter(d => d !== index)
                                  : [...formData.daysOfWeek, index];
                                setFormData({...formData, daysOfWeek: newDays});
                              }}
                            >
                              {day}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">Trip Triggers</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="minCartValue">Minimum Cart Value ($)</Label>
                        <Input
                          id="minCartValue"
                          type="number"
                          value={formData.minCartValue}
                          onChange={(e) => setFormData({...formData, minCartValue: Number(e.target.value)})}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="minParticipants">Minimum Participants</Label>
                        <Input
                          id="minParticipants"
                          type="number"
                          value={formData.minParticipants}
                          onChange={(e) => setFormData({...formData, minParticipants: Number(e.target.value)})}
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex items-center space-x-2">
                      <Switch
                        id="newCustomersOnly"
                        checked={formData.newCustomersOnly}
                        onCheckedChange={(checked) => setFormData({...formData, newCustomersOnly: checked})}
                      />
                      <Label htmlFor="newCustomersOnly">New customers only</Label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={savePerk}>
                      {editingPerk ? 'Update Perk' : 'Create Perk'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList>
            <TabsTrigger value="active">Active Perks</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="expired">Expired</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            {viewMode === 'calendar' ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    {formatDate(selectedDate, 'MMMM yyyy')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {renderCalendarView()}
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {perks.filter(p => p.isActive).map(perk => (
                  <Card key={perk.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getPerkTypeIcon(perk.type)}
                            <h3 className="font-semibold text-lg">{perk.title}</h3>
                            <Badge className={getPerkStatusColor(perk)}>
                              {perk.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          
                          <p className="text-gray-600 mb-3">{perk.description}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Value:</span>
                              <div>{perk.value}{perk.unit === 'percent' ? '%' : perk.unit === 'dollar' ? '$' : ' SPIRALs'}</div>
                            </div>
                            
                            <div>
                              <span className="font-medium">Schedule:</span>
                              <div className="capitalize">{perk.schedule.type}</div>
                            </div>
                            
                            <div>
                              <span className="font-medium">Usage:</span>
                              <div>{perk.currentUsage}{perk.usageLimit ? `/${perk.usageLimit}` : ''}</div>
                            </div>
                            
                            <div>
                              <span className="font-medium">Triggers:</span>
                              <div>
                                {perk.triggers.minCartValue ? `$${perk.triggers.minCartValue}+` : ''}
                                {perk.triggers.minParticipants && perk.triggers.minParticipants > 1 ? ` ${perk.triggers.minParticipants}+ people` : ''}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingPerk(perk);
                              setFormData({
                                title: perk.title,
                                description: perk.description,
                                type: perk.type,
                                value: perk.value,
                                unit: perk.unit,
                                scheduleType: perk.schedule.type,
                                startDate: new Date(perk.schedule.startDate),
                                endDate: perk.schedule.endDate ? new Date(perk.schedule.endDate) : undefined,
                                daysOfWeek: perk.schedule.daysOfWeek || [],
                                timeSlots: perk.schedule.timeSlots || [{ start: '09:00', end: '17:00' }],
                                minCartValue: perk.triggers.minCartValue || 0,
                                minParticipants: perk.triggers.minParticipants || 1,
                                newCustomersOnly: perk.triggers.newCustomersOnly || false,
                                usageLimit: perk.usageLimit
                              });
                              setIsCreateDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => togglePerkStatus(perk.id, !perk.isActive)}
                          >
                            {perk.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deletePerk(perk.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Active Perks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{perks.filter(p => p.isActive).length}</div>
                  <p className="text-gray-600">Currently running</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Total Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {perks.reduce((sum, perk) => sum + perk.currentUsage, 0)}
                  </div>
                  <p className="text-gray-600">Times used</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Trip Triggers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {perks.filter(p => p.triggers.minCartValue || p.triggers.minParticipants > 1).length}
                  </div>
                  <p className="text-gray-600">Connected to trips</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}