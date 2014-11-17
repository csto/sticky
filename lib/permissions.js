ownsNote = function(userId, noteId) {
  return note && UserNotes.find({ userId: userId, noteId: noteId }).count() > 0;
}