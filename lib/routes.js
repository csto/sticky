Router.configure({
  layoutTemplate: 'layout'
});

Router.map(function (){
  this.route('signIn', {
    path: '/',
    template: 'signIn'
  });
  
  this.route('register', {
    path: '/register',
    template: 'register'
  });
  
  this.route('forgotPassword', {
    path: '/forgot-password',
    template: 'forgotPassword'
  });
  
  this.route('passwordReset', {
    path: '/reset-password/:token',
    template: 'passwordReset',
    onBeforeAction: function () {
      Accounts._resetPasswordToken = this.params.token;
      this.next();
    }
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
        Messages.insert({ content: 'Unauthorized' });
        Router.go('/');
      } else {
        this.next();
      }
    }
  });
});