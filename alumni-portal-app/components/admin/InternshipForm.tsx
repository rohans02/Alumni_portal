"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { createInternship } from "@/lib/db/actions/internship.actions";

export default function InternshipForm({ onSubmitSuccess }: { onSubmitSuccess?: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "Full-time",
    duration: "",
    stipend: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date) {
      toast.error("Please select an application deadline");
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Save the internship to the database
      await createInternship({
        ...formData,
        deadline: date,
      });
      
      toast.success("Internship opportunity added successfully!");
      
      // Reset the form
      setFormData({
        title: "",
        company: "",
        location: "",
        type: "Full-time",
        duration: "",
        stipend: "",
        description: "",
      });
      setDate(undefined);
      
      // Call the success callback if provided
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      console.error("Error adding internship:", error);
      toast.error("Failed to add internship. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-800">Add New Internship Opportunity</h2>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-700">Internship Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Software Development Intern"
              className="border-gray-300 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company" className="text-gray-700">Company Name</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="e.g. TechCorp Solutions"
              className="border-gray-300 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-gray-700">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Pune, Maharashtra or Remote"
              className="border-gray-300 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="text-gray-700">Type</Label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              required
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration" className="text-gray-700">Duration</Label>
            <Input
              id="duration"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              placeholder="e.g. 3 months"
              className="border-gray-300 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stipend" className="text-gray-700">Stipend</Label>
            <Input
              id="stipend"
              value={formData.stipend}
              onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
              placeholder="e.g. ₹15,000/month"
              className="border-gray-300 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline" className="text-gray-700">Application Deadline</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Select deadline</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-gray-700">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the internship opportunity, responsibilities, and requirements..."
            className="min-h-[150px] border-gray-300 focus:ring-orange-500 focus:border-orange-500"
            required
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button 
            type="submit" 
            className="bg-orange-600 hover:bg-orange-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding Internship..." : "Add Internship"}
          </Button>
        </div>
      </form>
    </div>
  );
} 