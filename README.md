# Group_16_Wutudu

#API Docs (Reformat Later)

##/login

Methods:
1. POST:
  * AUTHENTICATION: NONE
  * BODY: {"login" : {"email" : <email>, "password" : <password>}}
  * RETURN: <auth-token> if email and password match

##/users
1. GET:
  * AUTHENTICATION: Header: "Authorization Token token=<auth-token>"
  * BODY: NONE
  * RETURN: {"user" : {"email" : <email>, "name" : <name>}}

2. POST:
  * AUTHENTICATION: NONE
  * BODY: {"user" : {"email" : <email>, "name" : <name>, "password" : <password>}}
  * RETURN: <auth-token>