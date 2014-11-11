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
  }
});