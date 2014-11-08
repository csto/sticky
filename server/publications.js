// Meteor.publish('userNotes', function (options) {
//   return UserNotes.find({}, options);
// });
//
// Meteor.publish('notes', function (options) {
//   return Notes.find({}, options);
// });
//
// Meteor.publish('tasks', function (options) {
//   return Tasks.find({}, options);
// });
//
// Meteor.publish('images', function (options) {
//   return Images.find({}, options);
// });

Meteor.publish('shareTokens', function (options) {
  return ShareTokens.find({}, options);
});

// Meteor.smartPublish('notes', function() {
//   this.addDependency('notes', 'tasks', function (note) {
//     return [Tasks.find({ noteId: note._id })];
//   });
//
//   return Notes.find({});
// });

Meteor.smartPublish('smartUserNotes', function(userId) {
  this.addDependency('userNotes', 'notes', function (userNote) {
    return Notes.find({ _id: userNote.noteId });
  });
  
  this.addDependency('notes', 'tasks', function (note) {
    return Tasks.find({ noteId: note._id });
  });

  return UserNotes.find({ userId: userId });
});

// Meteor.smartPublish('userNotes', function () {
//   this.addDependency('userNotes', 'notes', function (userNote) {
//     return Notes.find({ userNoteId: userNote._id });
//   });
//
//   this.addDependency('notes', 'tasks', function (note) {
//     return Tasks.find({ noteId: note._id });
//   });
//
//   return Notes.find({});
// });