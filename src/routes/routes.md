+---------+------------------------------+--------------------------------+--------------+
| Methods |             Urls             |            Actions             |     Role     |
+---------+------------------------------+--------------------------------+--------------+
| Get     | /api/v1/users                | Get all users                  | Admin
| Get     | /api/v1/users/id/1           | Get user with id=1             | 
| Get     | /api/v1/users/username/julia | Get user with username='julia' | 
| Get     | /api/v1/users/whoami         | Get the current user details   | 
| Post    | /api/v1/users                | Create new user                | All
| Patch   | /api/v1/users/users/id/1     | Update user with id=1          | 
| Delete  | /api/v1/users/id/1           | Delete user with id=1          | 
| Post    | /api/v1/users/login          | Login with email and password  | 
+---------+------------------------------+--------------------------------+--------------+