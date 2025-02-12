import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { toast } from "sonner";
import supabase from "@/lib/supabaseClient";
import { useSessionContext } from '@/contexts/SessionContext';

interface SessionFormData {
  date: string;
  time: string;
  location: string;
  gameType: string;
  buyIn: number;
  name: string;
  description?: string;
}

const GAME_TYPES = [
  "Texas Hold'em",
  "Omaha",
  "Seven Card Stud",
  "Five Card Draw",
];

interface AddSessionFormProps {
  onSuccess?: () => void;
}

const AddSessionForm = ({ onSuccess }: AddSessionFormProps) => {
  const { fetchSessions } = useSessionContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<SessionFormData>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0], // Default to today’s date
      time: '',
      location: '402',
      gameType: GAME_TYPES[0],
      buyIn: 20,
      name: '',
      description: ''
    }
  });

  const onSubmit = async (data: SessionFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('Sessions')
        .insert([{
          date: data.date,
          time: data.time,
          location: data.location,
          gameType: data.gameType,
          buyIn: data.buyIn,
          name: data.name,
          description: data.description
        }]);

      if (error) throw error;
      await fetchSessions(); // Refresh the sessions list
      toast.success("Session created successfully");
      form.reset(); // Reset form to default values
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating session:", error);
      toast.error("Failed to create session");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Session Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter session name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Enter location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gameType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Game Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select game type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {GAME_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
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
          name="buyIn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Buy-in Amount</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter buy-in amount" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Enter session description (optional)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Session"}
        </Button>
      </form>
    </Form>
  );
};

export default AddSessionForm;