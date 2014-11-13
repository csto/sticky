TODO

note needs to not get pushed down when new note is added from other user

note needs a wrapper with no positioning
positioning goes up to the #content or #wrapper
drag should be on .cover and stop propogation
on note click, set height of note-wrapper, position absolute note, position top over note wrapper, left:15, right 15
  animate to top: 0, left:0, right:0, bottom: 0
on close, set note-wrapper height to auto, position static note, set top, left, right, bottom to auto

schema

account
  sign in only with google?
  change password
  change email settings?
    email
    name

remove archive method and switch to updateNote
permissions?
add more message undos
  - delete
slide for menu
loading style
sortable notes

Notification
  userId
  noteId
  sharedBy

notifications??
  separate notification from userNote
  add sharedBy id to user notes
  userNote where accepted = false
  create notification when you share if user exists
  left of search, notificaitons button
  dropdown with notifications
    [Image] Corey shared Title with you [√][x]
shared user list at bottom of note
delete completed tasks

email
  - share
    if user exists
      send invite
    else
      send
  - task added
    wait 10 minutes and add task?
resizing width

pick colors, apply design

kadira

splash screen
icons
favicon

Names: Take, Jot, Blot
