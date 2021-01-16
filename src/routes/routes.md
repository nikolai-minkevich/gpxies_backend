+---------+------------------------------+--------------------------------+--------+
| Methods |             Urls             |            Actions             |  Role  |
+---------+------------------------------+--------------------------------+--------+
| Users                                                                            |
+---------+------------------------------+--------------------------------+--------+
| Get     | /api/v1/users                | Get all users                  | User   |+
| Get     | /api/v1/users/id/:1          | Get user with id=1             | User   |+
| Get     | /api/v1/users/username/:ann  | Get user with username='ann'   | User   |+
| Get     | /api/v1/users/whoami         | Get the current user details   | User   |+
| Post    | /api/v1/users                | Create new user                |        |+
| Patch   | /api/v1/users/id/:1          | Update user with id=1          | User   |+
| Delete  | /api/v1/users/id/:1          | Delete user with id=1          | User   |+
| Post    | /api/v1/users/login          | Login with email and password  |        |+
+---------+------------------------------+--------------------------------+--------+
| Tracks                                                                           |
+---------+------------------------------+--------------------------------+--------+
| Get     | /api/v1/tracks               | Get all tracks                 | User   |+
| Get     | /api/v1/tracks/id/:1         | Get track with id=1            | User   |+
| Get     | /api/v1/tracks/username/:1   | Get all tracks with user.id=1  | User   |+
| Get     | /api/v1/tracks/:60f6d7       | Get track with hash=60f6d7     | User   |+
| Post    | /api/v1/tracks               | Create new track               | User   |+
| Patch   | /api/v1/tracks/id/:1         | Update track with id=1         | User   |+
| Delete  | /api/v1/tracks/id/:1         | Delete track with id=1         | User   |
+---------+------------------------------+--------------------------------+--------+ 
