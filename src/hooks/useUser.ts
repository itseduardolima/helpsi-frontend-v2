import { useQuery } from '@tanstack/react-query';
import { userService } from '../services/user';

export function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => userService.findUserDetails(),
  
  });
} 