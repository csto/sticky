Router.map(function (){
  this.route('landing', {
    path: '/',
    template: 'landing',
    layoutTemplate: 'sessions',
    onBeforeAction: function () {
      if (Meteor.user()) {
        Router.go('notes', {}, { replaceState: true });
      } else {
        if (Meteor.isCordova) {
          this.layoutTemplate = 'sessions';
          this.render('signIn');
        } else {
          this.next();
        }
      }
      
    }
  });
  
  this.route('signIn', {
    path: '/sign-in',
    template: 'signIn',
    layoutTemplate: 'sessions',
    onBeforeAction: function () {
      if (Meteor.userId()) {
        Router.go('notes', {}, { replaceState: true });
      } else {
        this.next();
      }
    }
  });
  
  this.route('register', {
    path: '/register',
    template: 'register',
    layoutTemplate: 'sessions',
    onBeforeAction: function () {
      if (Meteor.userId()) {
        Router.go('notes', {}, { replaceState: true });
      } else {
        var token = this.params.query.token;
        Session.set('token', token);
        this.next();
      }
    }
  });
  
  this.route('forgotPassword', {
    path: '/forgot-password',
    template: 'forgotPassword',
    layoutTemplate: 'sessions',
    onBeforeAction: function () {
      if (Meteor.userId()) {
        Router.go('notes', {}, { replaceState: true });
      } else {
        this.next();
      }
    }
  });
  
  this.route('passwordReset', {
    path: '/reset-password/:token',
    template: 'passwordReset',
    layoutTemplate: 'sessions',
    onBeforeAction: function () {
      if (Meteor.userId()) {
        Router.go('notes', {}, { replaceState: true });
      } else {
        Accounts._resetPasswordToken = this.params.token;
        this.next();
      }
    }
  });
  
  this.route('notes', {
    path: '/notes',
    template: 'notes',
    layoutTemplate: 'logged_in',
    waitOn: function () {
      if (Meteor.userId()) {
        return [
          Meteor.subscribe('smartUserNotes', Meteor.userId())
        ]
      }
      
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
        Router.go('/', {}, { replaceState: true });
      } else {
        this.next();
      }
    }
  });
});
