import { useCallback, useContext, useEffect, useState } from "react"
import InputForm from "../components/InputForm"
import Task from "../components/Task"
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../contexts/AuthProvider";
import { onValue, orderByChild, push, query, ref, set, update } from "firebase/database";
import { db } from "../firebase";
import Loader from "../components/Loader";
import CopyGroupCodeButton from "../components/CopyGroupCodeButton";
import { useToast } from "../contexts/ToastContainer";
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

function MainPage() {
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);
  const [ tasks, setTasks ] = useState<Task[]>([])
  const [ isLoading, setIsLoading ] = useState<number>(2);
  const [ groupName, setGroupName ] = useState<string>('');

  const navigate = useNavigate();

  const toast = useToast();

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
        const dbRef = query(ref(db, `groups/${id}/tasks`), orderByChild('order'));
        unsubscribe = onValue(dbRef, (snapshot) => {
          if (snapshot.exists()) {
            const newTasks: Task[] = [];
            snapshot.forEach((child) => {
              const data = child.val();
              newTasks.push({
                id: child.key,
                title: data.title,
                status: data.status,
                description: data.description,
                order: data.order,
                createdBy: data.createdBy,
              });
            })
            console.log('newTasks:', newTasks)
            setTasks(newTasks);
            setIsLoading((prev) => prev > 0 ? prev - 1 : prev);
          } else {
            setTasks([]);
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

  const handleAddTask = useCallback((task: {
    title: string;
    description: string;
    status: boolean;
  }) => {
    try {
      if (currentUser) {
        push(ref(db, `groups/${id}/tasks`), {
          title: task.title,
          status: task.status,
          description: task.description,
          createdBy: currentUser.uid,
          order: tasks.length,
        });
        toast('Task created successfully!', { type: 'success' });
      }
    } catch (e) {
      console.error("Error creating task: ", e);
    }
  }, [currentUser, id, tasks])

  const handleDeleteTask = useCallback((taskId: string) => {
    try {
      if (currentUser) {
        set(ref(db, `groups/${id}/tasks/${taskId}`), null);
        toast('Task deleted successfully!', { type: 'info' });
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
        toast('Task updated successfully!', { type: 'info' });
      }
    } catch (e) {
      console.error("Error deleting task: ", e);
    }
  }, [currentUser, id])

  const handleReorderTask = useCallback((tasks: Task[]) => {
    try {
      if (currentUser) {
        const docs: {[k: string]: Omit<Task, 'id'>} = {}
        for (let i = 0; i < tasks.length; i++) {
          docs[tasks[i].id] = {
            order: i,
            createdBy: tasks[i].createdBy,
            description: tasks[i].description,
            status: tasks[i].status,
            title: tasks[i].title,
          };
        }
        set(ref(db, `groups/${id}/tasks`), docs);
        toast('Task updated successfully!', { type: 'info' });
      }
    } catch (e) {
      console.error("Error deleting task: ", e);
    }
  }, [currentUser, id])

  return (
    <div className="flex justify-center p-4 bg-base-200" style={{ minHeight: 'calc(100vh - 64px)'}}>
      {isLoading ? (
        <Loader label="Loading group..." />
      ) : (
        <div className="w-full max-w-lg">
          <h1 className="text-3xl font-semibold text-center text-primary mb-2">
            {groupName}
          </h1>
          <CopyGroupCodeButton id={id} />
          <InputForm onAddTask={handleAddTask} />
          <DragDropContext
            onDragEnd={(result) => {
              if (!result.destination) {
                return;
              }
              console.log('result:', result)
              const items = Array.from(tasks);
              const [reorderedItem] = items.splice(result.source.index, 1);
              items.splice(result.destination.index, 0, reorderedItem);
              console.log('result items:', items);
              handleReorderTask(items);
            }}
          >
            <Droppable droppableId="droppable-1" type="PERSON">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={{ backgroundColor: snapshot.isDraggingOver ? '' : '' }}
                  className={
                    "flex flex-col gap-4 my-4 items-center"
                    + (snapshot.isDraggingOver ? ' bg-primary-content' : '')
                  }
                  {...provided.droppableProps}
                >
                  {provided.placeholder}
                  {tasks.map((task, index) => (
                    <Draggable draggableId={"draggable-" + index} index={index} key={task.id}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Task
                            task={task}
                            onDeleteTask={handleDeleteTask}
                            onUpdateTask={handleUpdateTask}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}
    </div>
  )
}

export default MainPage;
