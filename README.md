# Group_16_Wutudu

#API Docs (Reformat Later)

##/login

```
1. POST:
  * AUTHENTICATION: NONE
  * BODY: {"login" : {"email" : email, "password" : password}}
  * RETURN: {"token" : token} 200 or
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
                                    "Logout Unsuccessful" 400,
                                   ]
```

##/users

```
1. GET:
  * AUTHENTICATION: Header: "Authorization Token token=auth-token"
  * BODY: NONE
  * RETURN: {"user" : {"email" : email, "name" : name}}

2. POST:
  * AUTHENTICATION: NONE
  * BODY: {"user" : {"email" : email, "name" : name, "password" : password}}
  * RETURN: {"token" : token}
```

##/friends

```
1. GET:

  * AUTHENTICATION: Header: "Authorization Token token=auth-token"
  * BODY: NONE
  * RETURN: {
             "friendship" : {
                                "friends" : [{"name" : name, "email" : email}...],
                                "sent_requests" : [{"name" : name, "email" : email}...],
                                "received_requests" : [[{"name" : name, "email" : email}...]
                             }
            }

2. POST:

  * AUTHENTICATION: Header: "Authorization Token token=auth-token"
  * BODY: {"friendship" : {"email" : email}}
  * RETURN: Request status. One of [
                                    "Friend Request Sent" 200,
                                    "Alrady A Friend" 400,
                                    "Friend Request Already Sent" 400,
                                    "Exisitng Friend Request From User" 400,
                                    "Unable To Send Friend Request" 400,
                                    "User With Email Not found" 404
                                   ]
  * NOTE: Used to send request to user

3. PUT:

  * AUTHENTICATION: Header: "Authorization Token token=auth-token"
  * BODY: {"friendship" : {"email" : email}}
  * RETURN: Request status. One of [
                                    "Friend Accepted" 200,
                                    "Alrady A Friend" 400,
                                    "Unable To Accept Friend" 400,
                                    "Friend Request Not Found" 404,
                                    "Friend Not Found" 404
                                   ]
  * NOTE: Used to accept confirm friend request from user

4. DELETE:

  * AUTHENTICATION: Header: "Authorization Token token=auth-token"
  * BODY: {"friendship" : {"email" : email}}
  * RETURN: Request status. One of [
                                    "Unfriended" 200,
                                    "Request Declined" 200,
                                    "Not A Friend" 400,
                                    "Friend Not Found" 404
                                   ]
  * NOTE: Used to delete friend
```