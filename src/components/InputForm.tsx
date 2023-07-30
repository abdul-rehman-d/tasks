import { useState } from "react";
import { v4 as uuid } from 'uuid';
import Input from "./Input";

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
    <form onSubmit={handleSubmit} className="flex text-sm gap-2">
      <Input
        name="titleInput"
        type="text"
        placeholder="Enter Title"
        id="titleInput"
        label=""
        error={errors.title}
      />
      <Input
        name="descriptionInput"
        type="text"
        placeholder="Enter Description"
        id="descriptionInput"
        label=""
        error={errors.description}
      />
      <button className="btn btn-primary mt-4" type="submit">Add</button>
    </form>
  )
}

export default InputForm;
