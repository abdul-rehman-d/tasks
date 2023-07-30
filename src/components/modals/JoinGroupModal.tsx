import React, { useContext, useState } from 'react'
import Input from '../Input';
import { AuthContext } from '../../contexts/AuthProvider';
import { db } from '../../firebase';
import { get, ref, set } from 'firebase/database';
import { closeModal } from '../../utils/modal';

function JoinGroupModal() {

  const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
  const [ error, setError ] = useState<string>('');
  const { currentUser } = useContext(AuthContext);

  const joinGroup = (groupCode: string) => {
    return new Promise((resolve, reject) => {
      setIsSubmitting(true);
      if (currentUser) {
        const dbRef = ref(db, `groups/${groupCode}`);
        get(dbRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.val();
              const members = data.members;
              if (members[currentUser.uid] === true) {
                setError('You are already a member of this group');
                reject(false);
              } else {
                set(ref(db, `groups/${groupCode}/members/${currentUser.uid}`), true).then(() => {
                  resolve(true);
                }).catch((e) => {
                  console.error('Error joining group: ', e);
                  reject(e);
                });
              }
            } else {
              setError('Group does not exist');
              reject(false);
            }
          })
      }
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const code = event.currentTarget.groupCode.value;
    let error = '';

    if (!code) {
      error = 'Group Code is required';
    }

    setError(error);
    if (error) {
      return
    }

    joinGroup(code)
      .then(() => {
        event.currentTarget?.reset();
        closeModal('join_group_modal');
      })
      .finally(() => {
        setIsSubmitting(false);
      })
  }

  return (
    <dialog id="join_group_modal" className="modal">
      <form className="modal-box" onSubmit={handleSubmit}>
        <h2 className='text-xl font-semibold text-center mb-2'>
          Join Group
        </h2>
        <Input
          id='group_name'
          name='groupCode'
          label=''
          type='text'
          placeholder='Enter Group Code'
          error={error}
        />
        <div className="flex justify-center">
          <button
            className='btn btn-primary btn-sm mt-2'
            type="submit"
            disabled={isSubmitting}
          >Join</button>
        </div>
      </form>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}

export default JoinGroupModal