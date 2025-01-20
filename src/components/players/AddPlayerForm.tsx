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

interface PlayerFormData {
  name: string;
  earnings: number;
  wins: number;
}

const AddPlayerForm = () => {
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
      // TODO: Replace with actual API call
      console.log("Adding player:", data);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success("Player added successfully");
      form.reset();
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