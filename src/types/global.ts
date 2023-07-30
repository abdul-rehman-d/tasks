// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Task = {
  id: string;
  title: string;
  description: string;
  status: boolean;
  order: number;
  createdBy: string;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Group = {
  id: string;
  name: string;

  members: {
    [key: string]: string;
  };
}
