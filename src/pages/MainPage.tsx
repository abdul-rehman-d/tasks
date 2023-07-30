import { useCallback, useContext, useEffect, useState } from "react"
import InputForm from "../components/InputForm"
import Task from "../components/Task"
import { useParams } from "react-router-dom";
import { AuthContext } from "../contexts/AuthProvider";
import { onValue, push, ref, set, update } from "firebase/database";
import { db } from "../firebase";

function MainPage() {
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);
  const [ tasks, setTasks ] = useState<Task[]>([])
  const [ groupName, setGroupName ] = useState<string>('');

  useEffect(() => {
    let unsubscribe: () => void;
    async function getGroupName() {
      if (currentUser && id) {
        console.log(currentUser.uid, 'running query')
        const dbRef = ref(db, `groups/${id}`);
        unsubscribe = onValue(dbRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            setGroupName(data.name);
          }
        });
      }
    }
    getGroupName();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    }
  }, [currentUser, id])

  useEffect(() => {
    let unsubscribe: () => void;
    async function getTasks() {
      if (currentUser && id) {
        console.log(currentUser.uid, 'running query')
        const dbRef = ref(db, `groups/${id}/tasks`);
        unsubscribe = onValue(dbRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const newTasks: Task[] = [];
            for (const key in data) {
              newTasks.push({
                id: key,
                title: data[key].title,
                status: data[key].status,
                description: data[key].description,
                createdBy: data[key].createdBy,
              });
            }
            setTasks(newTasks);
          }
        });
      }
    }
    getTasks();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    }
  }, [currentUser, id])

  const handleAddTask = useCallback((task: Task) => {
    try {
      if (currentUser) {
        push(ref(db, `groups/${id}/tasks`), {
          title: task.title,
          status: task.status,
          description: task.description,
          createdBy: currentUser.uid,
        });
      }
    } catch (e) {
      console.error("Error creating task: ", e);
    }
  }, [currentUser, id])

  const handleDeleteTask = useCallback((taskId: string) => {
    try {
      if (currentUser) {
        set(ref(db, `groups/${id}/tasks/${taskId}`), null);
      }
    } catch (e) {
      console.error("Error deleting task: ", e);
    }
  }, [currentUser, id])

  const handleUpdateTask = useCallback((taskId: string, newStatus: boolean) => {
    try {
      if (currentUser) {
        update(ref(db, `groups/${id}/tasks/${taskId}`), {
          status: newStatus,
        });
      }
    } catch (e) {
      console.error("Error deleting task: ", e);
    }
  }, [currentUser, id])

  if (!groupName) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>{groupName}</h1>
      <InputForm onAddTask={handleAddTask} />
      {tasks.map((task) => (
        <Task
          key={task.id}
          task={task}
          onDeleteTask={handleDeleteTask}
          onUpdateTask={handleUpdateTask}
        />
      ))}
    </div>
  )
}

export default MainPage;
