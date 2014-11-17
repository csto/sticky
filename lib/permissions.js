ownsNote = function(userId, noteId) {
  return UserNotes.find({ userId: userId, noteId: noteId }).count() > 0;
}