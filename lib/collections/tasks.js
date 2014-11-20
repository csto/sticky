Tasks.allow({
  update: function (userId, task) {
    return ownsNote(userId, task.noteId);
  },

  remove: function (userId, task) {
    return ownsNote(userId, task.noteId);
  }
});

Tasks.deny({
  update: function (userId, task, fieldNames) {
    return (_.without(fieldNames, 'content', 'position', 'completed', 'updatedAt').length > 0);
  }
});

Meteor.methods({
  createTask: function (taskAttributes) {
    if (ownsNote(Meteor.userId(), taskAttributes.noteId)) {
      var task = _.pick(taskAttributes, 'noteId', 'content', 'position');
      Tasks.insert(task);
    }
  }
});