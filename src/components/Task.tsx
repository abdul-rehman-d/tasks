
function Task({
  task,
  onDeleteTask,
  onUpdateTask,
} : {
  task: Task;
  onDeleteTask: (id: string) => void;
  onUpdateTask: (id: string, status: boolean) => void;
}) {
  return (
    <div>
      <h1>{task.title}</h1>
      <p>{task.description}</p>
      <button onClick={(e) => {
        e.preventDefault()
        onDeleteTask(task.id)
      }}>delete</button>
      <div>
        <span>Completed: </span>
        <input
          type="checkbox"
          name="task-status"
          id="task-status"
          checked={task.status}
          onChange={() => {
            onUpdateTask(task.id, !task.status)
          }}
        />
      </div>
    </div>
  )
}

export default Task;
