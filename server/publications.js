Meteor.publish('shareTokens', function (options) {
  return ShareTokens.find({}, options);
});

Meteor.smartPublish('smartUserNotes', function(userId) {
  this.addDependency('userNotes', 'notes', function (userNote) {
    return Notes.find({ _id: userNote.noteId });
  });
  
  this.addDependency('notes', 'tasks', function (note) {
    return Tasks.find({ noteId: note._id });
  });

  return UserNotes.find({ userId: userId });
});