// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Task = {
  id: string;
  title: string;
  description: string;
  status: boolean;
  createdBy: string;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// type User = {
//   id: string;
//   email: string;
//   password: string;

//   groups: string[];
// }
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Group = {
  id: string;
  name: string;

  tasks: Task[];
}
