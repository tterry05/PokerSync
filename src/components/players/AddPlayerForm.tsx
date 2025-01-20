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
import { toast } from "sonner";
import supabase from "@/lib/supabaseClient";

interface PlayerFormData {
  name: string;
  earnings: number;
  wins: number;
}

interface AddPlayerFormProps {
  onSubmitComplete?: () => void;
}

const AddPlayerForm = ({ onSubmitComplete }: AddPlayerFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<PlayerFormData>({
    defaultValues: {
      earnings: 0,
      wins: 0
    }
  });

  const onSubmit = async (data: PlayerFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('Players')
        .insert([{ 
          name: data.name,
          earnings: data.earnings,
          wins: data.wins
        }]);

      if (error) throw error;
      
      toast.success("Player added successfully");
      form.reset();
      onSubmitComplete?.();
    } catch (error) {
      console.error("Error adding player:", error);
      toast.error("Failed to add player");
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
              <FormLabel>Player Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter player name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="earnings"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Initial Earnings</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter initial earnings" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="wins"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Initial Wins</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter number of wins" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Player"}
        </Button>
      </form>
    </Form>
  );
};

export default AddPlayerForm;