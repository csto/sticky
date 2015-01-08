// Meteor.publish('shareTokens', function (userId) {
//   return ShareTokens.find({});
// });
//
// Meteor.smartPublish('smartUserNotes', function(userId) {
//   this.addDependency('userNotes', 'notes', function (userNote) {
//     return Notes.find({ _id: userNote.noteId });
//   });
//
//   this.addDependency('notes', 'tasks', function (note) {
//     return Tasks.find({ noteId: note._id });
//   });
//
//   this.addDependency('notes', 'userNotes', function (note) {
//     return UserNotes.find();
//   });
//
//   this.addDependency('notes', 'users', function (note) {
//     var userNotes = UserNotes.find({ noteId: note._id }).fetch();
//     console.log(_.pluck(userNotes, 'userId'))
//     return Meteor.users.find({ _id: { $in: _.pluck(userNotes, 'userId')} });
//   });
//
//   return UserNotes.find({ userId: userId });
// });

Meteor.publishComposite('smartUserNotes', function (userId) {
  return {
    find: function () {
      return UserNotes.find({ userId: userId });
    },
    children: [
      {
        find: function (userNote) {
          return Notes.find({ _id: userNote.noteId });
        },
        children: [
          {
            find: function (note) {
              return Tasks.find({ noteId: note._id });
            }
          },
          {
            find: function (note) {
              return UserNotes.find({ noteId: note._id });
            },
            children: [
              {
                find: function (userNote) {
                  return Meteor.users.find({ _id: userNote.userId });
                }
              }
            ]
          }
        ]
      }
    ]
  }
});