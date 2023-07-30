import { useCallback, useContext, useEffect, useState } from "react"
import InputForm from "../components/InputForm"
import Task from "../components/Task"
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../contexts/AuthProvider";
import { onValue, push, ref, set, update } from "firebase/database";
import { db } from "../firebase";
import Loader from "../components/Loader";
import CopyGroupCodeButton from "../components/CopyGroupCodeButton";

function MainPage() {
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);
  const [ tasks, setTasks ] = useState<Task[]>([])
  const [ isLoading, setIsLoading ] = useState<number>(2);
  const [ groupName, setGroupName ] = useState<string>('');

  const navigate = useNavigate()

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
            setIsLoading((prev) => prev > 0 ? prev - 1 : prev);
          } else {
            console.log('group does not exist')
            navigate('/')
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
            setIsLoading((prev) => prev > 0 ? prev - 1 : prev);
          } else {
            setIsLoading((prev) => prev > 0 ? prev - 1 : prev);
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

  return (
    <div className="flex justify-center p-4">
      {isLoading ? (
        <Loader label="Loading group..." />
      ) : (
        <div className="w-full max-w-lg">
          <h1 className="text-3xl font-semibold text-center text-primary mb-2">
            {groupName}
          </h1>
          <CopyGroupCodeButton id={id} />
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
      )}
    </div>
  )
}

export default MainPage;
