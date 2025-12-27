export type ProjectStatus = 'hold' | 'inactive' | 'in-progress' | 'completed';

export type Project = {
  _id: string;
  title: string;
  projectType: "WEB" | "APP";
  client: { email: string, name: string };
  manager: { name: string, email: string, _id: string };
  members:[{ name: string, email: string, _id: string }],
  status: ProjectStatus;
  totalTesters: number;
  createdOn: string;
};

export type User = {
  _id:string;
  id: string;
  name: string;
  email: string;
  role: 'MEMBER' | 'MANAGER'
  accountStatus: 'PENDING' | 'ACTIVE' | 'BLOCKED' | 'DELETED';
};
