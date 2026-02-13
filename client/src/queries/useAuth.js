import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginUser, loginAdmin, registerUser } from '../services/auth';
import { useAuthStore } from '../stores/useAuthStore';
import { useNavigate } from 'react-router-dom';

export function useLoginUserMutation() {
    const setUser = useAuthStore((state) => state.setUser);
    const navigate = useNavigate();

    return useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            setUser(data.user);
            navigate('/user'); // Redirect to user dashboard
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
                navigate(data.redirectUrl);
            } else {
                navigate('/'); // Fallback
            }
        },
    });
}

export function useRegisterMutation() {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: registerUser,
        onSuccess: () => {
            navigate('/user_login'); // Redirect to login after signup
        },
    });
}
