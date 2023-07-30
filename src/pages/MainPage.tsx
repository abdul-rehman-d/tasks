import { useCallback, useState } from "react"
import InputForm from "../components/InputForm"
import Task from "../components/Task"

function MainPage() {
  const [tasks, setTasks] = useState<Task[]>([])

  const handleAddTask = useCallback((task: Task) => {
    setTasks((tasks) => [...tasks, task])
  }, [])

  const handleDeleteTask = useCallback((id: string) => {
    setTasks((tasks) => tasks.filter((task) => task.id !== id))
  }, [])

  const handleUpdateTask = (id: string) => {
    setTasks((tasks) => tasks.map((task) => {
      if (task.id === id) {
        task.status = !task.status
      }
      return task
    }))
  }

  return (
    <div>
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
