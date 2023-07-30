import { useCallback, useState } from "react"
import InputForm from "./components/InputForm"
import Task from "./components/Task"

function App() {
  const [tasks, setTasks] = useState<Task[]>([])

  const handleAddTask = useCallback((task: Task) => {
    setTasks((tasks) => [...tasks, task])
  }, [])

  const handleDeleteTask = useCallback((id: number) => {
    setTasks((tasks) => tasks.filter((task) => task.id !== id))
  }, [])

  return (
    <div>
      <InputForm onAddTask={handleAddTask} />
      {tasks.map((task) => (
        <Task key={task.id} task={task} onDeleteTask={handleDeleteTask} />
      ))}
    </div>
  )
}

export default App
