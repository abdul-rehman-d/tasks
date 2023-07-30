import { useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider"
import { Link } from "react-router-dom";

function GroupsPage() {
  const { groups, createGroup } = useContext(AuthContext);

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
