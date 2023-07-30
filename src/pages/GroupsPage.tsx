import { useCallback, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { onValue, push, ref } from "firebase/database"

import { AuthContext } from "../contexts/AuthProvider"
import { db } from "../firebase";
import CreateGroupModal from "../components/modals/CreateGroupModal";
import JoinGroupModal from "../components/modals/JoinGroupModal";

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


  return (
    <div className="flex justify-center p-4">
      <div className="w-full max-w-lg">
        <h1 className="text-3xl font-semibold text-center text-primary mb-2">
          Groups
        </h1>
        <div className="flex justify-end gap-2 mb-2">
          <button className="btn btn-outline btn-primary btn-sm" onClick={() => {
            window.create_group_modal.showModal();
          }}>
            Create Group
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => {
            window.join_group_modal.showModal();
          }}>
            Join Group
          </button>
        </div>
        <ul className="w-full flex flex-col gap-2 items-center mt-4">
          {groups.map(group => (
            <li key={group.id} className="btn btn-neutral btn-md w-max">
              <Link to={`/group/${group.id}`}>
                {group.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <CreateGroupModal createGroup={createGroup} />
      <JoinGroupModal />
    </div>
  )
}

export default GroupsPage;
