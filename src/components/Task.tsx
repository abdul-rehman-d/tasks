
function Task({
  task,
  onDeleteTask,
} : {
  task: Task;
  onDeleteTask: (id: number) => void;
}) {
  return (
    <div>
      <h1>{task.title}</h1>
      <button onClick={(e) => {
        e.preventDefault()
        onDeleteTask(task.id)
      }}>delete</button>
    </div>
  )
}

export default Task;
