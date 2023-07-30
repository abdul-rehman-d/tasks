
function InputForm({
  onAddTask,
}: {
  onAddTask: (task: Task) => void
}) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget

    if (!form.titleInput.value || !form.descriptionInput.value) {
      return
    }
    
    const task: Task = {
      id: new Date().getTime(),
      title: form.titleInput.value,
      description: form.descriptionInput.value,
      status: false,
      createdBy: '1'
    }
    onAddTask(task)
    form.reset()
  }
  return (
    <form onSubmit={handleSubmit}>InputForm</form>
  )
}

export default InputForm;
