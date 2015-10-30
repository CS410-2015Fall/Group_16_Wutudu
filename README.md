# Group_16_Wutudu

#API Docs (Reformat Later)

##/login

```
1. POST:

  * AUTHENTICATION: NONE
  * DEVICE-TOKEN: "Device-Token token"
  * BODY: {"login" : {"email" : email, "password" : password}}
  * RETURN: {
              "token" : token,
              "user" : {"id" : id, "email" : email, "name" : name}
            }
            200 or
            Request status. One of [
                                    "Incorrect Password" 400,
                                    "User With Email Not Found" 404,
                                    "No Device Token" 400,
                                    "Failed To Log In" 400
                                   ]
  * NOTE: Send login request with device token to register for push notification
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
  * Note: Used to get the active and pending groups for a user (not to be confused with /groups/:gid)
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

##/groups/:gid

```
1. GET:

  * AUTHENTICATION: Header: "Authorization Token token=auth-token"
  * BODY: NONE
  * RETURN: {
             "group_users" : {
                                "active_users" : [{"id" : id, "name" : name, "email" : email}...],
                                "pending_users" : [{"id" : id, "name" : name, "email" : email}...]
                             },
              "pre_wutudus" : [{
                                "pre_wutudu_id": pre_wutudu_id,
                                "event_date": "YYYY-MM-DDT00:00:00.000Z",
                                "latitude": latitude,
                                "longitude": longitude,
                                "questions": {
                                    "0": {
                                        "id": question_id,
                                        "question_text": question,
                                        "a0_text": answer_0,
                                        "a1_text": answer_1,
                                        "a2_text": answer_2,
                                        "a3_text": answer_3
                                      }
                                      (...)
                                    "9": {
                                        "id": question_id,
                                        "question_text": question,
                                        "a0_text": answer_0,
                                        "a1_text": answer_1,
                                        "a2_text": answer_2,
                                        "a3_text": answer_3
                                      }
                                  }
                             } ... ]
            }, 200
            or
            Request status ["User Not In Group" 400] when the user is not in the group

  * Note: Used to get all the basic information for a group
```

##/groups/:gid/users

```
NOTE: If requester not in group with :gid, then always returns ["Not In Group", 404] for any actions
```
```
1. POST:

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
2. PUT:

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
3. DELETE:

  * AUTHENTICATION: Header: "Authorization Token token=auth-token"
  * BODY: NONE
  * RETURN: Request status. One of [
                                    "Request Declined" 200,
                                    "Left Group" 200
                                   ]
  * NOTE: Used to decline group invitation or leave group
```


##/groups/:gid/prewutudu

```
NOTE: If requester not in group with :gid, then always returns ["Not In Group", 404] for any actions
```
```
1. POST:

  * AUTHENTICATION: Header: "Authorization Token token=auth-token"
  * BODY: {"pre_wutudu" : {"event_date" : "DD-MMM-YYYY", "latitude" : latitude, "longitude" : longitude}}
  * RETURN: Request status. {
              "pre_wutudu" : {
                                "pre_wutudu_id": pre_wutudu_id,
                                "event_date": "YYYY-MM-DDT00:00:00.000Z",
                                "latitude": latitude,
                                "longitude": longitude,
                                "questions": {
                                    "0": {
                                        "id": question_id,
                                        "question_text": question,
                                        "a0_text": answer_0,
                                        "a1_text": answer_1,
                                        "a2_text": answer_2,
                                        "a3_text": answer_3
                                      }
                                      (...)
                                    "9": {
                                        "id": question_id,
                                        "question_text": question,
                                        "a0_text": answer_0,
                                        "a1_text": answer_1,
                                        "a2_text": answer_2,
                                        "a3_text": answer_3
                                      }
                                  }
                             },
              "message" : "PreWutudu Created"
            } 200
            or
            Request Status ["Failed To Create PreWutudu" 400] if the creation failed
            or
            Request status ["User Not In Group" 400] when the user is not in the group
```

##/groups/:gid/prewutudu/:id

```
NOTE: If requester not in group with :group_id, then always returns ["User Not In Group", 404] for any actions
```
```
1. GET:

  * AUTHENTICATION: Header: "Authorization Token token=auth-token"
  * BODY: NONE
  * RETURN: Request status. One of [
                                    {"pre_wutudu" : {
                                        "pre_wutudu_id": pre_wutudu_id,
                                        "event_date": "YYYY-MM-DDT00:00:00.000Z",
                                        "latitude": latitude,
                                        "longitude": longitude,
                                        "questions": {
                                            "0": {
                                                "id": question_id,
                                                "question_text": question,
                                                "a0_text": answer_0,
                                                "a1_text": answer_1,
                                                "a2_text": answer_2,
                                                "a3_text": answer_3
                                              }
                                              (...)
                                            "9": {
                                                "id": question_id,
                                                "question_text": question,
                                                "a0_text": answer_0,
                                                "a1_text": answer_1,
                                                "a2_text": answer_2,
                                                "a3_text": answer_3
                                              }
                                          }
                                      }} 200,
                                    "PreWutudu Not Found In Group" 404,
                                   ]
  * NOTE: Used to get the information of a pre_wutudu
```
```
3. DELETE:

  * AUTHENTICATION: Header: "Authorization Token token=auth-token"
  * BODY: NONE
  * RETURN: Request status. One of [
                                    "PreWutudu Deleted" 200,
                                    "Failed To Delete PreWutudu" 400,
                                   ]
  * NOTE: Used to delete a pre wutudu
```

##/groups/:gid/prewutudu/:id/answers

```
NOTE: If requester not in group with :group_id, then always returns ["User Not In Group", 404] for any actions
```
```
1. POST:

  * AUTHENTICATION: Header: "Authorization Token token=auth-token"
  * BODY: {"answers" : [(Ten elements, 0 to 3)] or (Ten -1s, if declined)}
  * RETURN: Request status. One of [
                                    "PreWutudu Declined" 200,
                                    "User Answer Saved" 200,
                                    "User Already Answered" 400,
                                    "User Answer Invalid" 400,
                                    "Failed To Save Answers" 400
                                   ]
  * NOTE: Used to submit answers to the prewutudu 
```
```
2. GET:

  * AUTHENTICATION: Header: "Authorization Token token=auth-token"
  * BODY: NONE
  * RETURN: Request status. One of [
                                    {
                                      "user_answer": {
                                        "id": id, 
                                        "declined": true or false
                                        "answers" : [(Ten elements, 0 to 3)]
                                      }, 
                                    } 200,
                                    or
                                    "User Has Not Answered" 400
                                   ]
```

##/groups/:gid/prewutudu/:id/finish

```
NOTE: If group not found, then always returns ["Group Not Found", 400]
If requester not in group with :group_id, then always returns ["User Not In Group", 400] for any actions. 
If pre_wutudu not in group get ["PreWutudu Not Found In Group", 404]
```
```
#TEMPORARY - Will be changing later, once we get #magic working
1. POST:

  * AUTHENTICATION: Header: "Authorization Token token=auth-token"
  * BODY: NONE
  * RETURN: Request status. One of [
                                    {
                                      "weights":{
                                        cat_id: weight, cat_id: weight, ...
                                        },
                                      "top":{
                                        "id": id,
                                        "category_name": name,
                                        "yelp_id": yelp_id,
                                        "cat_id": cat_id
                                      }
                                    } 200,
                                    or
                                    "No Answers Completed" 400
                                   ]
