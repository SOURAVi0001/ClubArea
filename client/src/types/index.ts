export interface User {
  _id: string;
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'leader' | 'member' | 'user';
  clubId?: string;
  clubName?: string;
  teamName?: string;
  avatar?: string;
  title?: string;
}

export interface Club {
  _id: string;
  id: string;
  name: string;
  description: string;
  photo?: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'Pending' | 'Ongoing' | 'Done';
  deadline: string;
  assignedTo: string;
  assignedBy: string;
  clubId: string;
  teamName: string;
  priority?: string;
}

export interface Event {
  _id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  clubId: string;
  clubName: string;
  organizer: string;
  status: 'Upcoming' | 'Past';
  photos?: string[];
}
