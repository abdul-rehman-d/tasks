
function Task({
  task,
  onDeleteTask,
} : {
  task: Task;
  onDeleteTask: (id: string) => void;
}) {
  return (
    <div>
      <h1>{task.title}</h1>
      <p>{task.description}</p>
      <button onClick={(e) => {
        e.preventDefault()
        onDeleteTask(task.id)
      }}>delete</button>
    </div>
  )
}

export default Task;
