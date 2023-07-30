import { useState } from "react";
import { v4 as uuid } from 'uuid';

type Errors = {
  title: string;
  description: string;
}

function InputForm({
  onAddTask,
}: {
  onAddTask: (task: Task) => void
}) {

  const [errors, setErrors] = useState<Errors>({
    title: '',
    description: '',
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget

    let hasError: boolean = false
    const newErrors: Errors = {
      title: '',
      description: '',
    };

    if (!form.titleInput.value) {
      hasError = true
      newErrors.title = 'Title is required';
    }

    if (!form.descriptionInput.value) {
      hasError = true
      newErrors.description = 'Description is required';
    }

    // clear previous errors if no error and had previous errors
    // otherwise set new errors if has error
    setErrors(newErrors)

    if (hasError) {
      return
    }
    
    const task: Task = {
      id: uuid(),
      title: form.titleInput.value,
      description: form.descriptionInput.value,
      status: false,
      createdBy: '1'
    }
    onAddTask(task)
    form.reset()
  }
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          name="titleInput"
          type="text"
          placeholder="Enter Title"
        />
        {errors.title && <span style={{ color: 'red' }}>
          {errors.title}
        </span>}
      </div>
      <div>
        <input
          name="descriptionInput"
          type="text"
          placeholder="Enter Description"
        />
        {errors.description && <span style={{ color: 'red' }}>
          {errors.description}
        </span>}
      </div>
      <button type="submit">Add</button>
    </form>
  )
}

export default InputForm;
