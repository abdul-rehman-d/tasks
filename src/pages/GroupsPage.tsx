import { useCallback, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { onValue, push, ref } from "firebase/database"

import { AuthContext } from "../contexts/AuthProvider"
import { db } from "../firebase";

function GroupsPage() {
  const { currentUser } = useContext(AuthContext);
  const [ groups, setGroups ] = useState<Group[]>([]);

  useEffect(() => {
    let unsubscribe: () => void;
    async function getGroups() {
      if (currentUser) {
        console.log(currentUser.uid, 'running query')
        const dbRef = ref(db, 'groups/');
        unsubscribe = onValue(dbRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const newGroups: Group[] = [];
            for (const key in data) {
              if (currentUser.uid in data[key].members) {
                newGroups.push({
                  id: key,
                  name: data[key].name,
                  members: data[key].members,
                });
              }
            }
            setGroups(newGroups);
          }
        });
      }
    }
    getGroups();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    }
  }, [currentUser])

  const createGroup = useCallback(async (name: string) => {
    try {
      console.log('name', name)
      if (currentUser && name) {
        push(ref(db, 'groups/'), {
          name,
          members: {
            [currentUser.uid]: true,
          },
        });
      }
    } catch (e) {
      console.error("Error creating group: ", e);
    }
  }, [currentUser]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = event.currentTarget.groupName.value;
    if (name) {
      createGroup(name);
    }
  }

  return (
    <>
      <h1>Groups</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Group Name</label>
        <input type="text" id="name" name="groupName" />
        <button type="submit">Create</button>
      </form>
      <ul>
        {groups.map(group => (
          <li key={group.id}>
            <Link to={`/group/${group.id}`}>
              {group.name}
            </Link>
          </li>
        ))}
      </ul>

    </>
  )
}

export default GroupsPage;
