import React, { useState } from 'react'
import Input from '../Input';

function CreateGroupModal({
  createGroup,
}: {
  createGroup: (name: string) => void;
}) {
  const [ error, setError ] = useState<string>('');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = event.currentTarget.groupName.value;
    let error = '';

    if (!name) {
      error = 'Group Name is required';
    }

    setError(error);
    if (error) {
      return
    }

    createGroup(name);
    window.create_group_modal.close();
    event.currentTarget.reset();
  }

  return (
    <dialog id="create_group_modal" className="modal">
      <form className="modal-box" onSubmit={handleSubmit}>
        <h2 className='text-xl font-semibold text-center mb-2'>
          Create Group
        </h2>
        <Input
          id='group_name'
          name='groupName'
          label=''
          type='text'
          placeholder='Enter Group Name'
          error={error}
        />
        <div className="flex justify-center">
          <button className='btn btn-primary btn-sm mt-2' type="submit">Create</button>
        </div>
      </form>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}

export default CreateGroupModal