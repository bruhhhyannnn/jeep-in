import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUser, updateUser } from "@/api";
import type { User } from "@/types";

export const useUser = (uid: string | null) => {
  return useQuery({
    queryKey: ["user", uid],
    queryFn: () => getUser(uid!),
    enabled: !!uid,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ uid, data }: { uid: string; data: Partial<User> }) => updateUser(uid, data),
    onSuccess: (_, { uid }) => {
      queryClient.invalidateQueries({ queryKey: ["user", uid] });
    },
  });
};
