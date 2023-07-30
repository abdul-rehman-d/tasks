
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
    <div className="card w-96 bg-base-100 shadow-xl p-4">
      <div className="flex gap-2">
        <div className="flex-grow">
          <h2 className="text-lg font-semibold">{task.title}</h2>
          <p>{task.description}</p>
        </div>
        <button
          className="btn btn-error btn-xs px-0 h-8 w-8 rounded-full bg-error border-transparent hover:bg-error hover:border-error"
          onClick={(e) => {
            e.preventDefault()
            onDeleteTask(task.id)
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
      </div>
      <div className="flex gap-2 item-end justify-end">
        <span>Status: </span>
        <input
          type="checkbox"
          name="task-status"
          id="task-status"
          checked={task.status}
          className="checkbox checkbox-sm"
          onChange={() => {
            onUpdateTask(task.id, !task.status)
          }}
        />
      </div>
    </div>
  )
}

export default Task;
