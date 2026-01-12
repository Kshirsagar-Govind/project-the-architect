export type ProjectStatus = 'hold' | 'inactive' | 'in-progress' | 'completed';

export type Project = {
  id: string;
  title: string;
  projectType: "WEB" | "APP";
  client: { email: string, name: string };
  manager: { name: string, email: string, id: string };
  members:[{ name: string, email: string, id: string }],
  status: ProjectStatus;
  totalTesters: number;
  createdOn: string;
};

export type User = {
  id:string;
  name: string;
  email: string;
  role: 'MEMBER' | 'MANAGER'
  accountStatus: 'PENDING' | 'ACTIVE' | 'BLOCKED' | 'DELETED';
};
