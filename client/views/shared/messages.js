Messages = new Mongo.Collection(null);

Template.message.rendered = function() {
    var message = this.data;
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
    Meteor.call(this.call, this.undoId, this.undo);
    Messages.remove(this._id);
  }
});