import { useEffect, useState } from "react";
import "./App.css";

function App() {
  //Convention is set-subject and setter method
  //Here -- it is : users and 'set'Users where set denotes setter method
  const [users, setUsers] = useState([]);
  const hostUrl = import.meta.env.PROD
    ? window.location.href
    : "http://localhost:8080/";

  const fetchUsers = async () => {
    const response = await fetch(`${hostUrl}api/users`);
    const usersToJson = await response.json();
    console.log(usersToJson)
    setUsers(usersToJson);
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const createUser = async (e) => {
    e.preventDefault()
    const response = await fetch(`${hostUrl}api/users`, {
    method: "POST",
    headers: {
        "Content-type": "application/json",
    },
    body: JSON.stringify ({
      name: e.target.name.value,
      isAdmin: e.target.isAdmin.checked,
      company: e.target.company.value,
      telephone: e.target.telephone.value,
      location: e.target.location.value,
      }),
    });
    console.log ("target", {
      name: e.target.name.value,
      isAdmin: e.target.isAdmin.checked,
      company: e.target.company.value,
      telephone: e.target.telephone.value,
      location: e.target.location.value
    });
    
    const newUser = await response.json();

    setUsers([...users, newUser]);
  }

  const deleteUser = async (e) => {
    await fetch(`${hostUrl}api/users/${e.target.dataset.id}`, {
    method: "DELETE",
    headers: {
        "Content-type": "application/json",
    },
    });
    await fetchUsers();
  }

  const [editingUserId, setEditingUserId] = useState(null);
  const [newUserName, setNewUserName] = useState('');

  const handleUpdateClick = async (e) => {
      console.log('USERID for target user-to-update is: %d', e.target.dataset.id);
      setEditingUserId(parseInt(e.target.dataset.id));
      console.log('Editing USERID set to: %s', editingUserId);
  };

  const handleInputChange = (event) => {
      setNewUserName(event.target.value);
      //console.log('We gave input and .. new user name is: %s', newUserName);
    };

  const handleKeyPress = async (event) => {
      if (event.key === 'Enter') {
            console.log('We pressed enter and now we want to pass .. userID : %d AND newName: %s', editingUserId, newUserName);
            await updateUserName(newUserName);
            setEditingUserId(null);
            setNewUserName('');
          }
    };

  const updateUserName = async (newUserName) => {
      try {
            console.log('We are here to update .. editingID is: %d', editingUserId);
            console.log('We are here update block!! .. new user name is: %s', newUserName);
            const response = await fetch(`${hostUrl}api/users/${event.target.dataset.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: newUserName }),
          });

            if (!response.ok) {
            throw new Error('Network response was not ok');
          };
          // We refetch the user list to refresh the screen post update
          await fetchUsers();

          
           } catch (error) {
               console.error('Error updating user name:', error);
           }
        };
  /*
  const updateUserName = async (e) => {
    await fetch(`${hostUrl}api/users/${e.target.dataset.id}`, {
    method: "PUT",
    headers: {
        "Content-type": "application/json",
    },
    });
    await fetchUsers();
  }
  */

  return (
    <>
      <h1>Users</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Is Admin</th>
            <th>COMPANY</th>
            <th>TELEPHONE</th>
            <th>LOCATION</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                {editingUserId === user.id ? (
                <input
                  data-id={user.id}
                  type="text"
                  value={newUserName}
                  onChange={handleInputChange}
                  onKeyPress={(event) => handleKeyPress(event)}
                />
                ) : (
                  user.name
                )}
              </td>
              <td>{user.isAdmin.toString()}</td>
              <td>{user.company}</td>
              <td>{user.telephone}</td>
              <td>{user.location}</td>
              <td>
                <button style={{ backgroundColor: 'red' }} data-id={user.id} onClick={deleteUser}>
                  Delete
                </button>
              </td>
              <td>
                <button style={{ backgroundColor: 'blue' }} data-id={user.id} onClick={handleUpdateClick}>
                  Click-To-Update-Name
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>New User Form</h2>
      <form onSubmit={createUser}>
        <label htmlFor="name">Name</label>
        <input type="text" name="name" id="name"/><br></br>

        <label htmlfor="company">Company Name</label>
        <input type="text" name="Company" id="company"/><br></br>
        
        <label htmlfor="telephone">Telephone Number</label>
        <input type="text" name="Telephone" id="telephone"/><br></br>

        <label htmlfor="location">Office Location</label>
        <input type="text" name="Location" id="location"/><br></br>

        <label htmlFor="isAdmin">Is Admin</label>
        <input type="checkbox" name="isAdmin"/><br></br>
        <input type="submit" value="SUBMIT"/>
      </form>
    </>
  );
};


export default App;