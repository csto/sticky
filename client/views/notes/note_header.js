Template.note_header.events({
  'click #close-note ': function (e) {
    e.preventDefault();
    var newNote = Session.get('newNote');

    if (newNote && (newNote === 'note' || newNote === 'list')) {
      Messages.insert({content: 'Empty note discarded.'});
    }
    Session.set('note', null);
    Session.set('newNote', null);
    $('.note').css({ top: 0, left: 0, width: 'auto', height: 'auto' });
    Meteor.setTimeout(function () {
      $('textarea').trigger('autosize.resizeIncludeStyle');
    }, 0); 
  },

  'click #delete': function (e) {
    e.preventDefault();
    var note = Session.get('note');
    console.log('deleting', note);
    if (note) {
      Session.set('note', null);
      Notes.remove({ _id: note });
      Messages.insert({content: 'Note deleted.'});
    }
  },
  
  'click #archive': function (e) {
    e.preventDefault();
    var note = Session.get('note');
    if (note) {
      Session.set('note', null);
      Meteor.call('archive', note);
      Messages.insert({content: 'Note archived.'});
    }
  },

  'click .dropdown-toggle': function (e) {
    e.preventDefault();
    $(e.currentTarget).next().toggleClass('active');
  },

  'click #share': function (e) {
    e.preventDefault();

    $('.modal').modal('show');  
    // close modal and display message
  },

  'click #send-share': function (e) {
    var email = $('#share-email').val();
    // validate email in call, error if invalid email or share token exists

    Meteor.call('sendShare', currentNote(), email);
    $('#share-email').val('');
    $('.modal').modal('hide');
  }
});

Template.note_header.helpers({
  notePresent: function () {
    var note = Session.get('note');
    var newNote = Session.get('newNote');
    return (note || newNote) ? 'show' : 'hide';
  }
});