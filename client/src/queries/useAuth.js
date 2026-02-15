import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginUser, loginAdmin, registerUser } from '../services/auth';
import { useAuthStore } from '../stores/useAuthStore';
import { useNavigate } from '@tanstack/react-router';

export function useLoginUserMutation() {
    const setUser = useAuthStore((state) => state.setUser);
    const navigate = useNavigate();

    return useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            setUser(data.user);
            navigate({ to: '/user' }); // Redirect to user dashboard
        },
    });
}

export function useLoginAdminMutation() {
    const setUser = useAuthStore((state) => state.setUser);
    const navigate = useNavigate();

    return useMutation({
        mutationFn: loginAdmin,
        onSuccess: (data) => {
            setUser(data.user);
            if (data.redirectUrl) {
                navigate({ to: data.redirectUrl });
            } else {
                navigate({ to: '/' }); // Fallback
            }
        },
    });
}

export function useRegisterMutation() {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: registerUser,
        onSuccess: () => {
            navigate({ to: '/user_login' }); // Redirect to login after signup
        },
    });
}
