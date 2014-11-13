Router.map(function (){
  this.route('landing', {
    path: '/',
    template: 'landing',
    onBeforeAction: function () {
      if (Meteor.isCordova) {
        this.render('/sign-in');
      }
      this.next();
    }
  });
  
  this.route('signIn', {
    path: '/sign-in',
    template: 'signIn',
    layoutTemplate: 'sessions',
    onBeforeAction: function () {
      if (Meteor.user()) {
        this.render('/notes');
      }
      var token = this.params.query.token;
      Session.set('token', token);
      this.next();
    }
  });
  
  this.route('register', {
    path: '/register',
    template: 'register',
    layoutTemplate: 'sessions'
  });
  
  this.route('forgotPassword', {
    path: '/forgot-password',
    template: 'forgotPassword',
    layoutTemplate: 'sessions'
  });
  
  this.route('passwordReset', {
    path: '/reset-password/:token',
    template: 'passwordReset',
    layoutTemplate: 'sessions',
    onBeforeAction: function () {
      Accounts._resetPasswordToken = this.params.token;
      this.next();
    }
  });
  
  this.route('notes', {
    path: '/notes',
    template: 'notes',
    layoutTemplate: 'logged_in',
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
        Session.set('search', '');
        Session.set('archive', this.params.query.archive ? true : false);
        this.next();
      }
    }
  });
  
  this.route('account', {
    path: 'account',
    template: 'account',
    layoutTemplate: 'logged_in',
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
