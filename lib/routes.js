Router.configure({
  progressSpinner: false,
  progressTick: false,
  loadingTemplate: 'loading'
});

SessionsController = RouteController.extend({
  layoutTemplate: 'sessions',
  data: function () {
    return {
      email: Session.get('email')
    };
  },
  onBeforeAction: function () {
    if (Meteor.userId()) {
      Router.go('notes', {}, { replaceState: true });
    } else {
      this.next();
    }
  }
});

LoggedInController = RouteController.extend({
  layoutTemplate: 'logged_in',
  onBeforeAction: function () {
    $('#menu').removeClass('active');
    this.next();
  }
});

NotesController = LoggedInController.extend({
  template: 'notes',
  waitOn: function () {
    if (Meteor.userId()) {
      return [
        Meteor.subscribe('smartUserNotes', Meteor.userId())
      ]
    }
  },
  onBeforeAction: function () {
    if (! Meteor.userId()) {
      Router.go('/', {}, { replaceState: true });
    } else {
      Session.set('_id', this.params._id);
      if (this.url === '/notes') {
        Session.set('archive', false);
      }
      if (this.url === '/archive') {
        Session.set('archive', true);
      }
      this.next();
    }
  },
  data: function () {
    return {
      archive: Session.get('archive'),
      note: Notes.findOne(this.params._id),
      share: _.contains(this.url.split('/'), 'share'),
      title: Session.get('archive') ? 'Archive' : 'Notes'
    };
  }
});

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
    controller: 'SessionsController'
  });
  
  this.route('register', {
    path: '/register',
    template: 'register',
    controller: 'SessionsController',
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
    controller: 'SessionsController'
  });
  
  this.route('passwordReset', {
    path: '/reset-password/:token',
    template: 'passwordReset',
    layoutTemplate: 'sessions',
    controller: 'SessionsController',
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
    controller: 'NotesController'
  });
  
  this.route('archive', {
    path: '/archive',
    controller: 'NotesController'
  });
  
  this.route('note', {
    path: '/notes/:_id',
    controller: 'NotesController'
  });
  
  this.route('new', {
    path: '/notes/new/:type',
    template: 'new',
    controller: 'NotesController',
    action: function () {
      createNote(this.url);
    }
  });
  
  
  
  this.route('share', {
    path: '/notes/:_id/share',
    template: 'share',
    controller: 'NotesController'
  });
  
  this.route('account', {
    path: 'account',
    template: 'account',
    controller: 'LoggedInController',
    onBeforeAction: function () {
      if (! Meteor.userId()) {
        Router.go('/', {}, { replaceState: true });
      } else {
        this.next();
      }
    },
    data: function () {
      return {
        title: 'Account'
      };
    }
  });
});

var createNote = function (url) {
  note = {
    kind: _.contains(url.split('/'), 'note') ? 'note' : 'list'
  }
  
  noteId = Notes.insert(note);
  
  userNoteId = UserNotes.insert({
    userId: Meteor.userId(),
    noteId: noteId,
    accepted: true,
    ownerId: Meteor.userId(),
    position: userNotePosition()
  });
  
  Router.go('/notes/' + noteId, {}, { replaceState: true });
  
  // console.log(note)
  //
  // Meteor.call('createNote', note, function (error, noteId) {
  //   Router.go('/notes/' + noteId);
  // });
}
