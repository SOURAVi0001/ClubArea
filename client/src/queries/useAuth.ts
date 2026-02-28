import { useMutation } from '@tanstack/react-query';
import { loginUser, loginAdmin, registerUser, loginGoogle } from '../services/auth';
import { useAuthStore } from '../stores/useAuthStore';
import { useNavigate } from '@tanstack/react-router';

export function useLoginUserMutation() {
    const setUser = useAuthStore((state) => state.setUser);
    const navigate = useNavigate();

    return useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            setUser(data.user, data.token);
            navigate({ to: '/user' }); // Redirect to user dashboard
        },
        onError: (error) => {
            console.error("Login user error:", error);
        }
    });
}

export function useLoginAdminMutation() {
    const setUser = useAuthStore((state) => state.setUser);
    const navigate = useNavigate();

    return useMutation({
        mutationFn: loginAdmin,
        onSuccess: (data) => {
            setUser(data.user, data.token);
            if (data.redirectUrl) {
                navigate({ to: data.redirectUrl });
            } else {
                navigate({ to: '/' }); // Fallback
            }
        },
        onError: (error) => {
            console.error("Login admin error:", error);
        }
    });
}

export function useRegisterMutation() {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: registerUser,
        onSuccess: () => {
            navigate({ to: '/user_login' }); // Redirect to login after signup
        },
        onError: (error) => {
            console.error("Register user error:", error);
        }
    });
}

export function useLoginGoogleMutation() {
    const setUser = useAuthStore((state) => state.setUser);
    const navigate = useNavigate();

    return useMutation({
        mutationFn: loginGoogle,
        onSuccess: (data) => {
            setUser(data.user, data.token);
            if (data.redirectUrl) {
                navigate({ to: data.redirectUrl });
            } else {
                navigate({ to: '/user' });
            }
        },
        onError: (error) => {
            console.error("Google login error:", error);
        }
    });
}
