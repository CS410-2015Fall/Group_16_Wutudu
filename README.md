# Group_16_Wutudu

#API Docs (Reformat Later)

##/login

```
1. POST:

  * AUTHENTICATION: NONE
  * BODY: {"login" : {"email" : email, "password" : password}}
  * RETURN: {
              "token" : token,
              "user" : {"id" : id, "email" : email, "name" : name}
            }
            200 or
            Request status. One of [
                                    "Incorrect Password" 400,
                                    "User With Email Not Found" 404,
                                   ]
```

##/logout

```
1. DELETE:

  * AUTHENTICATION: Header: "Authorization Token token=auth-token"
  * BODY: NONE
  * RETURN: Request status. One of [
                                    "Logout Successful" 200,
                                    "Logout Failed" 400,
                                   ]
```

##/users

```
1. GET:

  * AUTHENTICATION: Header: "Authorization Token token=auth-token"
  * BODY: NONE
  * RETURN: {"user" : {"id" : id, "email" : email, "name" : name}}
```
```
2. POST:

  * AUTHENTICATION: NONE
  * BODY: {"user" : {"email" : email, "name" : name, "password" : password}}
  * RETURN: {"token" : token}
```

##/friends

```
NOTE: If requested email does not exist, then always returns ["User With Email Not found", 404] for any actions except GET
```
```
1. GET:

  * AUTHENTICATION: Header: "Authorization Token token=auth-token"
  * BODY: NONE
  * RETURN: {
             "friendships" : {
                                "friends" : [{"id" : id, "name" : name, "email" : email}...],
                                "sent_requests" : [{"id" : id, "name" : name, "email" : email}...],
                                "received_requests" : [{"id" : id, "name" : name, "email" : email}...]
                             }
            }
```
```
2. POST:

  * AUTHENTICATION: Header: "Authorization Token token=auth-token"
  * BODY: {"friendship" : {"email" : email}}
  * RETURN: Request status. One of [
                                    "Friend Request Sent" 200,
                                    "Already A Friend" 400,
                                    "Friend Request Already Sent" 400,
                                    "Exisitng Friend Request From User" 400,
                                    "Unable To Send Friend Request" 400
                                   ]
  * NOTE: Used to send request to user
```
```
3. PUT:

  * AUTHENTICATION: Header: "Authorization Token token=auth-token"
  * BODY: {"friendship" : {"email" : email}}
  * RETURN: Request status. One of [
                                    "Friend Accepted" 200,
                                    "Friend Request Not Found" 404,
                                    "Already A Friend" 400,
                                    "Unable To Accept Friend" 400
                                   ]
  * NOTE: Used to accept confirm friend request from user
```
```
4. DELETE:

  * AUTHENTICATION: Header: "Authorization Token token=auth-token"
  * BODY: {"friendship" : {"email" : email}}
  * RETURN: Request status. One of [
                                    "Unfriended" 200,
                                    "Request Declined/Cancelled" 200,
                                    "Not A Friend" 404
                                   ]
  * NOTE: Used to delete friend/friend request or decline a friend request
```

##/groups

```
1. GET:

  * AUTHENTICATION: Header: "Authorization Token token=auth-token"
  * BODY: NONE
  * RETURN: {
             "groups" : {
                                "active_groups" : [{"id" : id, "name" : name}...],
                                "pending_groups" : [{"id" : id, "name" : name}...]
                             }
            }
```
```
2. POST:

  * AUTHENTICATION: Header: "Authorization Token token=auth-token"
  * BODY: {"group" : {"name" : name, "emails" : [emails]}}
  * RETURN: Request status. One of [
                                    {"group_id" : group_id, message: "Group Created"} 200,
                                    {"group_id" : group_id, message: "All Users Invited"} 200,
                                    "Failed To Create Group" 400,
                                    "Group Not Found" 404,
                                    "No Users Were Invited" 400,
                                    "Failed To Invite At Least One User" 400,
                                    "Failed To Create Group and Add User" 400
                                   ]
  * NOTE: Used to initiate a group with client and/or selected users in it
```
```
3. PUT (Unvailable and WIP):

  * AUTHENTICATION: Header: "Authorization Token token=auth-token"
  * BODY: {"group" : {"id" : id, "name" : name}}
  * RETURN: Request status. One of [
                                    "Group Name Changed" 200,
                                    "Group Name Change Failed" 400,
                                    "Not In Group" 404
                                   ]
  * NOTE: Used to change name of the group
```

##/groups/:id/users

```
NOTE: If requester not in group with :id, then always returns ["Not In Group", 404] for any actions
```
```
1. GET:

  * AUTHENTICATION: Header: "Authorization Token token=auth-token"
  * BODY: NONE
  * RETURN: {
              "group_users" : {
                                "active_users" : [{"id" : id, "name" : name, "email" : email}...],
                                "pending_users" : [{"id" : id, "name" : name, "email" : email}...]
                             }
            }
            or
            Request status ["Not Accepted To Group" 400] when the user has yet to accept group invitation
```
```
2. POST:

  * AUTHENTICATION: Header: "Authorization Token token=auth-token"
  * BODY: {"group_user" : {"emails" : [emails]}}
  * RETURN: Request status. One of [
                                    {"group_id" : group_id, message: "All Users Invited"} 200,
                                    "Group Not Found" 404,
                                    "No Users Were Invited" 400,
                                    "Failed To Invite At Least One User" 400
                                   ]
  * NOTE: Used to invite users to the group (assuming these users are friends)
```
```
3. PUT:

  * AUTHENTICATION: Header: "Authorization Token token=auth-token"
  * BODY: NONE
  * RETURN: Request status. One of [
                                    "Group Joined" 200,
                                    "Already In Group" 400,
                                    "Failed To Join Group" 400
                                   ]
  * NOTE: Used to accept confirm group invitation
```
```
4. DELETE:

  * AUTHENTICATION: Header: "Authorization Token token=auth-token"
  * BODY: NONE
  * RETURN: Request status. One of [
                                    "Request Declined" 200,
                                    "Left Group" 200
                                   ]
  * NOTE: Used to decline group invitation or leave group
```