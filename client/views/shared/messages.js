Messages = new Mongo.Collection(null);

Template.message.rendered = function() {
  var message = this.data;
  Messages.remove({ _id: { $ne: message._id } });
  
  Meteor.setTimeout(function () {
    Messages.remove(message._id);
  }, 3000);
};

Template.messages.helpers({
  messages: function () {
    return Messages.find();
  },

  undo: function () {
    return this.undo;
  }
});

Template.messages.events({
  'click .undo': function (e) {
    e.preventDefault();
    if (this.call) {
      Meteor.call(this.call, this.undoId, this.undo);
    } else {
      Notes.update(this.undoId, { $set: this.undo });
    }
    Messages.remove(this._id);
  }
});