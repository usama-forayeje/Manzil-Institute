'use client';

import { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Search,
  MoreHorizontal,
  Edit2,
  Trash2,
  DoorOpen,
  Users,
  LayoutGrid,
  Loader2,
  RefreshCcw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { boardingRoomsQueryOptions } from '@/features/admission/api/queries';
import { createBoardingRoom, updateBoardingRoom, deleteBoardingRoom } from '@/features/admission/api/service';
import { convertEnglishToBengali, cn } from '@/lib/utils';

// --- Form Schema ---
const roomSchema = z.object({
  roomNo: z.string().min(1, "রুম নম্বর আবশ্যক"),
  roomName: z.string().min(1, "রুমের নাম আবশ্যক").max(100, "নাম ১০০টি অক্ষরের মধ্যে হতে হবে"),
  floor: z.string().min(1, "তলা নির্বাচন করুন"),
  capacity: z.number().min(1, "ন্যূনতম ১টি সিট থাকতে হবে"),
  isActive: z.boolean(),
});

type RoomFormValues = z.infer<typeof roomSchema>;

// Helper to translate floor names for UI
const floorMap: Record<string, string> = {
  'Ground Floor': 'নিচ তলা',
  '1st Floor': '১ম তলা',
  '2nd Floor': '২য় তলা',
  '3rd Floor': '৩য় তলা',
  '4th Floor': '৪র্থ তলা',
  '5th Floor': '৫ম তলা',
  '6th Floor': '৬ষ্ঠ তলা',
};

const floorOptions = [
  { value: 'Ground Floor', label: 'নিচ তলা' },
  { value: '1st Floor', label: '১ম তলা' },
  { value: '2nd Floor', label: '২য় তলা' },
  { value: '3rd Floor', label: '৩য় তলা' },
  { value: '4th Floor', label: '৪র্থ তলা' },
  { value: '5th Floor', label: '৫ম তলা' },
];

export default function HallRoomsPage() {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any>(null);
  const queryClient = useQueryClient();

  // --- Queries ---
  const { data, isLoading, isError, refetch, isRefetching } = useQuery(boardingRoomsQueryOptions);

  // --- Form ---
  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema) as any,
    defaultValues: {
      roomNo: "",
      roomName: "",
      floor: "Ground Floor",
      capacity: 1,
      isActive: true,
    },
  });

  // Handle setting initial values when editing
  useEffect(() => {
    if (editingRoom) {
      form.reset({
        roomNo: editingRoom.roomNo || "",
        roomName: editingRoom.roomName || "",
        floor: editingRoom.floor || "Ground Floor",
        capacity: editingRoom.capacity || 1,
        isActive: editingRoom.isActive ?? true,
      });
    } else {
      form.reset({
        roomNo: "",
        roomName: "",
        floor: "Ground Floor",
        capacity: 1,
        isActive: true,
      });
    }
  }, [editingRoom, form]);

  // --- Mutations ---
  const saveMutation = useMutation({
    mutationFn: async (values: RoomFormValues) => {
      if (editingRoom) {
        return updateBoardingRoom(editingRoom.$id, values);
      }
      return createBoardingRoom(values);
    },
    onSuccess: (res) => {
      if (res.success) {
        toast.success(editingRoom ? "তথ্য সফলভাবে আপডেট করা হয়েছে!" : "নতুন রুম সফলভাবে যোগ করা হয়েছে!");
        queryClient.invalidateQueries({ queryKey: boardingRoomsQueryOptions.queryKey });
        setIsOpen(false);
        setEditingRoom(null);
        form.reset();
      } else {
        toast.error(res.error || "তথ্য সংরক্ষণ করতে সমস্যা হয়েছে");
      }
    },
    onError: (error: any) => {
      toast.error("সার্ভার সমস্যা: " + error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (roomId: string) => deleteBoardingRoom(roomId, true), // true for permanent delete for now
    onSuccess: (res) => {
      if (res.success) {
        toast.success("রুমটি সফলভাবে ডিলিট করা হয়েছে");
        queryClient.invalidateQueries({ queryKey: boardingRoomsQueryOptions.queryKey });
      } else {
        toast.error(res.error || "ডিলিট করতে সমস্যা হয়েছে");
      }
    }
  });

  const onSubmit: SubmitHandler<RoomFormValues> = (values) => {
    saveMutation.mutate(values);
  };

  const handleEdit = (room: any) => {
    setEditingRoom(room);
    setIsOpen(true);
  };

  const handleAddNew = () => {
    setEditingRoom(null);
    setIsOpen(true);
  };

  const rooms = data?.rooms || [];
  const filteredRooms = rooms.filter((r: any) =>
    r.roomName?.toLowerCase().includes(search.toLowerCase()) ||
    r.roomNo?.includes(search)
  );

  const totalRoomsCount = rooms.length;
  const totalSeats = rooms.reduce((acc: number, curr: any) => acc + (curr.capacity || 0), 0);
  const occupiedSeats = rooms.reduce((acc: number, curr: any) => acc + (curr.occupiedSeats || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10 solaiman-lipi">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-md">
              <Building2 className="h-7 w-7 text-primary" />
            </div>
            হল ও কক্ষ ব্যবস্থাপনা
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">
            প্রতিষ্ঠানের সকল হল এবং রুমের তথ্য ডাটাবেস থেকে ম্যানেজ করুন।
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isLoading || isRefetching}
            className="h-11 w-11 rounded-md shadow-sm transition-all"
          >
            <RefreshCcw className={cn("h-5 w-5 opacity-70", isRefetching && "animate-spin")} />
          </Button>

          <Dialog open={isOpen} onOpenChange={(val) => {
            setIsOpen(val);
            if (!val) setEditingRoom(null);
          }}>
            <DialogTrigger asChild>
              <Button onClick={handleAddNew} className="h-11 px-6 rounded-md font-bold gap-2 shadow-md shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95">
                <Plus className="h-5 w-5" /> কক্ষ যোগ করুন
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-[24px] p-0 overflow-hidden border-none shadow-2xl bg-background solaiman-lipi">
              <DialogHeader className="p-8 bg-primary text-primary-foreground relative solaiman-lipi">
                <div className="absolute -top-6 -right-6 opacity-10 rotate-12 text-white">
                  <Building2 size={140} />
                </div>
                <DialogTitle className="text-2xl font-bold solaiman-lipi relative z-10">
                  {editingRoom ? "তথ্য এডিট করুন" : "নতুন কক্ষ যোগ করুন"}
                </DialogTitle>
                <DialogDescription className="text-primary-foreground/80 font-medium solaiman-lipi relative z-10">
                  {editingRoom ? "রুমের বর্তমান তথ্য পরিবর্তন করে সংরক্ষণ করুন।" : "সঠিক তথ্য দিয়ে নতুন একটি কক্ষ ডাটাবেসে সেভ করুন।"}
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-6 solaiman-lipi">
                  <div className="grid grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="roomNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider solaiman-lipi">রুম নম্বর</FormLabel>
                          <FormControl>
                            <Input placeholder="যেমন: ১০১" className="h-11 rounded-lg bg-secondary/30 border-secondary focus:ring-primary focus:border-primary font-bold solaiman-lipi" {...field} />
                          </FormControl>
                          <FormMessage className="text-[10px] solaiman-lipi" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="capacity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider solaiman-lipi">সিট ক্যাপাসিটি</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              className="h-11 rounded-lg bg-secondary/30 border-secondary font-bold solaiman-lipi"
                              {...field}
                              onChange={e => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage className="text-[10px] solaiman-lipi" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="roomName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider solaiman-lipi flex justify-between items-center">
                          হলের নাম / কক্ষের নাম
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="যেমন: আবু বকর (রা.) হল" className="h-11 rounded-lg bg-secondary/30 border-secondary font-bold solaiman-lipi" {...field} />
                        </FormControl>
                        <FormMessage className="text-[10px] solaiman-lipi" />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="floor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider solaiman-lipi">অবস্থান (তলা)</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11 rounded-lg bg-secondary/30 border-secondary font-bold solaiman-lipi">
                                <SelectValue placeholder="তলা নির্বাচন" className="solaiman-lipi" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-md solaiman-lipi">
                              {floorOptions.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value} className="font-bold solaiman-lipi">{opt.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="solaiman-lipi" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg bg-secondary/30 p-3 h-11 border border-secondary solaiman-lipi">
                          <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0 solaiman-lipi">অ্যাক্টিভ?</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <DialogFooter className="pt-2">
                    <Button
                      type="submit"
                      disabled={saveMutation.isPending}
                      className="w-full h-11 rounded-md text-lg font-bold shadow-lg shadow-primary/20 gap-2 transition-all active:scale-[0.98] solaiman-lipi"
                    >
                      {saveMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
                      {editingRoom ? "তথ্য আপডেট করুন" : "তথ্য সংরক্ষণ করুন"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[
          { label: 'মোট রুম', value: `${convertEnglishToBengali(totalRoomsCount)}টি`, icon: DoorOpen, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'মোট সিট', value: `${convertEnglishToBengali(totalSeats)}টি`, icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'ফাঁকা সিট', value: `${convertEnglishToBengali(totalSeats - occupiedSeats)}টি`, icon: LayoutGrid, color: 'text-orange-500', bg: 'bg-orange-500/10' },
        ].map((stat, i) => (
          <Card key={i} className="border-none bg-card hover:bg-accent/5 transition-colors shadow-sm rounded-md overflow-hidden ring-1 ring-border">
            <CardContent className="p-6 flex items-center gap-5">
              <div className={cn(stat.bg, "p-4 rounded-md flex items-center justify-center")}>
                <stat.icon className={cn(stat.color, "h-6 w-6")} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest solaiman-lipi">{stat.label}</p>
                <p className="text-2xl font-bold mt-1 text-foreground leading-none solaiman-lipi">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Table/Grid Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 bg-card border border-border p-1.5 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <div className="pl-4"><Search className="h-5 w-5 text-muted-foreground/50" /></div>
          <Input
            placeholder="রুমের নাম বা নম্বর দিয়ে খুঁজুন..."
            className="border-0 bg-transparent shadow-none focus-visible:ring-0 text-md font-bold placeholder:text-muted-foreground/50 solaiman-lipi"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="h-[350px] flex flex-col items-center justify-center gap-4 bg-muted/20 rounded-[32px] border border-dashed border-border mt-8">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-muted-foreground font-bold animate-pulse text-sm tracking-widest uppercase solaiman-lipi">ডাটা লোড হচ্ছে...</p>
          </div>
        ) : isError ? (
          <div className="h-[350px] flex flex-col items-center justify-center gap-4 bg-destructive/5 rounded-[32px] border border-dashed border-destructive/20 mt-8">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <div className="text-center">
              <p className="text-destructive font-bold text-lg solaiman-lipi">সমস্যা হয়েছে</p>
              <p className="text-muted-foreground text-sm solaiman-lipi">আবার চেষ্টা করুন</p>
            </div>
            <Button onClick={() => refetch()} variant="outline" className="rounded-md border-destructive/20 text-destructive hover:bg-destructive hover:text-white transition-all solaiman-lipi">
              <RefreshCcw className="h-4 w-4 mr-2" /> পুনরায় লোড করুন
            </Button>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="h-[350px] flex flex-col items-center justify-center gap-6 bg-muted/20 rounded-[32px] border border-dashed border-border mt-8">
            <div className="p-6 bg-secondary/50 rounded-full">
              <DoorOpen className="h-10 w-10 text-muted-foreground/30" />
            </div>
            <div className="text-center">
              <p className="text-foreground font-bold text-lg solaiman-lipi">কোন কক্ষ নেই</p>
              <p className="text-muted-foreground text-sm mt-1 solaiman-lipi">সার্চ ফিল্টার পরিবর্তন করুন</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room: any) => (
              <div
                key={room.$id}
              >
                <Card className="group border-border bg-card hover:border-primary/30 transition-all rounded-[28px] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/5">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="p-3 bg-secondary/80 rounded-md group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                        <DoorOpen className="h-6 w-6" />
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-9 w-9 p-0 rounded-full hover:bg-secondary transition-all opacity-0 group-hover:opacity-100"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-md p-1.5 min-w-[150px] shadow-xl solaiman-lipi">
                          <DropdownMenuItem onClick={() => handleEdit(room)} className="rounded-lg gap-2 font-bold focus:bg-primary/10 focus:text-primary solaiman-lipi cursor-pointer"><Edit2 className="h-3.5 w-3.5" /> এডিট করুন</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            if (confirm('আপনি কি নিশ্চিতভাবে এই রুমটি ডিলিট করতে চান?')) {
                              deleteMutation.mutate(room.$id);
                            }
                          }} className="rounded-lg gap-2 font-bold text-destructive focus:bg-destructive/10 focus:text-destructive solaiman-lipi cursor-pointer"><Trash2 className="h-3.5 w-3.5" /> ডিলিট করুন</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="mt-6 space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold tracking-tight text-foreground truncate solaiman-lipi">{room.roomName}</h3>
                        <Badge variant={room.isActive ? "default" : "secondary"} className={cn("rounded-full text-[8px] uppercase tracking-widest font-black px-2 solaiman-lipi", !room.isActive && "opacity-50")}>
                          {room.isActive ? 'Active' : 'Offline'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground tracking-tight solaiman-lipi">
                        <span className="solaiman-lipi">রুম: {convertEnglishToBengali(room.roomNo)}</span>
                        <span className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
                        <span className="solaiman-lipi">{floorMap[room.floor] || room.floor}</span>
                      </div>
                    </div>

                    <div className="mt-6 space-y-2.5 p-4 bg-muted/40 rounded-md ring-1 ring-inset ring-border/50 group-hover:ring-primary/20">
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 solaiman-lipi">
                        <span className="solaiman-lipi">সিট অকুপেন্সি</span>
                        <span className="text-foreground solaiman-lipi">{convertEnglishToBengali(room.occupiedSeats || 0)} / {convertEnglishToBengali(room.capacity)} পূর্ণ</span>
                      </div>
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
