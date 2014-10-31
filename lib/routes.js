Router.configure({
  layoutTemplate: 'layout'
});

Router.map(function (){
  this.route('signIn', {
    path: '/',
    template: 'signIn'
  });
  
  this.route('notes', {
    path: '/notes',
    template: 'notes',
    waitOn: function () {
      return [
        Meteor.subscribe('smartUserNotes', Meteor.userId())
      ]
    },
    onBeforeAction: function () {
      if (! Meteor.userId()) {
        this.render('Login');
      } else {
        this.next();
      }
    }
  });
});