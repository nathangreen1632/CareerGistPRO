import { useAuthContext } from '../context/AuthContext';
import type { AuthContextType } from '../context/AuthContext'; // 👈 import type separately (optional best practice)

export const useAuth = (): AuthContextType => {
  return useAuthContext();
};
