"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { assignCommittee } from "@/actions";

export function CommitteeSelect({ userId }: { userId: string }) {
  const router = useRouter();

  const handleChange = async (value: string) => {
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("committee", value);

    const res = await assignCommittee(formData);

    if (res?.success) {
      toast.success("Committee assigned successfully!");
      router.refresh();
    }
  };

  return (
    <Select onValueChange={handleChange}>
      <SelectTrigger className="w-60">
        <SelectValue placeholder="Assign committee" />
      </SelectTrigger>
      <SelectContent align="end">
        <SelectItem value="Livelihood">Livelihood</SelectItem>
        <SelectItem value="Sports & Recreation">Sports & Recreation</SelectItem>
        <SelectItem value="Gender & Development">
          Gender & Development
        </SelectItem>
        <SelectItem value="Education">Education</SelectItem>
        <SelectItem value="Public Health">Public Health</SelectItem>
        <SelectItem value="Drug Prevention">Drug Prevention</SelectItem>
        <SelectItem value="Environment">Environment</SelectItem>
      </SelectContent>
    </Select>
  );
}
