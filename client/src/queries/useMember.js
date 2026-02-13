import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { memberService } from '../services/member';

export const useMemberEvents = (page = 1) => {
    return useQuery({
        queryKey: ['member', 'events', page],
        queryFn: () => memberService.getEvents(page)
    });
};

export const useMemberUpdates = (page = 1) => {
    return useQuery({
        queryKey: ['member', 'updates', page],
        queryFn: () => memberService.getUpdates(page)
    });
};

export const useMemberFeedback = () => {
    return useQuery({
        queryKey: ['member', 'feedback'],
        queryFn: memberService.getFeedback
    });
};

export const useSubmitFeedbackMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: memberService.submitFeedback,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['member', 'feedback'] });
        }
    });
};

export const useMemberTasks = (search = '', limit = 10) => {
    return useQuery({
        queryKey: ['member', 'tasks', search, limit],
        queryFn: () => memberService.getTasks(search, limit)
    });
};

export const useMemberTaskDetails = (id) => {
    return useQuery({
        queryKey: ['member', 'task', id],
        queryFn: () => memberService.getTaskDetails(id),
        enabled: !!id
    });
};

export const useMemberContact = () => {
    return useQuery({
        queryKey: ['member', 'contact'],
        queryFn: memberService.getContact
    });
};
