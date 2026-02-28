import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leaderService } from '../services/leader';

export const useLeaderDashboard = () => {
    return useQuery({
        queryKey: ['leader', 'dashboard'],
        queryFn: leaderService.getDashboard
    });
};

export const useLeaderOpenings = () => {
    return useQuery({
        queryKey: ['leader', 'openings'],
        queryFn: leaderService.getOpenings
    });
};

export const useCreateOpeningMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: leaderService.createOpening,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leader', 'openings'] });
        }
    });
};

export const useLeaderUpdates = () => {
    return useQuery({
        queryKey: ['leader', 'updates'],
        queryFn: leaderService.getUpdates
    });
};

export const usePostUpdateMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: leaderService.postUpdate,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leader', 'updates'] });
        }
    });
};

export const useLeaderEvents = () => {
    return useQuery({
        queryKey: ['leader', 'events'],
        queryFn: leaderService.getEvents
    });
};

export const usePostEventMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: leaderService.postEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leader', 'events'] });
        }
    });
};

export const useLeaderTasks = () => {
    return useQuery({
        queryKey: ['leader', 'tasks'],
        queryFn: leaderService.getTasks
    });
};

export const useCreateTaskMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: leaderService.createTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leader', 'tasks'] });
        }
    });
};


export const useLeaderTeams = () => {
    return useQuery({
        queryKey: ['leader', 'teams'],
        queryFn: leaderService.getTeams
    });
};

export const useLeaderMembers = () => {
    return useQuery({
        queryKey: ['leader', 'members'],
        queryFn: leaderService.getMembers
    });
};

export const useLeaderFeedback = () => {
    return useQuery({
        queryKey: ['leader', 'feedback'],
        queryFn: leaderService.getFeedback
    });
};
