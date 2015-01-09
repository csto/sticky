UserNotes = new Mongo.Collection('userNotes');
Notes = new Mongo.Collection('notes');
Tasks = new Mongo.Collection('tasks');
ShareTokens = new Mongo.Collection('shareTokens');

UserNotes.attachSchema([Schema.UserNotes, Schema.Base]);
Notes.attachSchema([Schema.Notes, Schema.Base]);
Tasks.attachSchema([Schema.Tasks, Schema.Base]);
ShareTokens.attachSchema([Schema.ShareTokens, Schema.Base]);

// GroundDB(Meteor.users);
// GroundDB(UserNotes);
// GroundDB(Notes);
// GroundDB(Tasks);
// GroundDB(ShareTokens);

Notes.allow({
  insert: function (userId) {
    return !! userId;
  },
  
  update: function (userId, note) {
    return ownsNote(userId, note._id);
  },
  
  remove: function (userId, note) {
    return ownsNote(userId, note._id);
  } 
});

Notes.deny({
  update: function (userId, note, fieldNames) {
    return (_.without(fieldNames, 'title', 'content', 'color', 'archived', 'updatedAt').length > 0);
  }
});

userNotePosition = function () {
  var topUserNote = UserNotes.findOne({}, { sort: { position: 1 } });
  if (topUserNote) {
    var position = topUserNote.position - 1;
  } else {
    var position = 0;
  }
}

Meteor.methods({
  createNote: function (noteAttributes) {
    
    noteAttributes = _.pick(noteAttributes, 'title', 'content', 'kind', 'task');
    
    var task = _.pick(noteAttributes, 'task');
    
    noteId = Notes.insert(noteAttributes);
    
    // if (task) {
    //   var taskAttributes = {
    //     content: task,
    //     noteId: noteId
    //   }
    //
    //   Tasks.insert(taskAttributes);
    // }

    userNoteId = UserNotes.insert({
      userId: Meteor.userId(),
      noteId: noteId,
      accepted: true,
      ownerId: Meteor.userId(),
      position: userNotePosition()
    });

    return noteId;
  },
  
  deleteNote: function (noteId) {
    if (ownsNote(Meteor.userId(), noteId)) {
      UserNotes.remove({ noteId: noteId });
      ShareTokens.remove({ noteId: noteId });
      Tasks.remove({ noteId: noteId });
      Notes.remove(noteId);
    }
  },
  
  archive: function (noteId) {
    if (ownsNote(Meteor.userId(), noteId)) {
      var note = Notes.findOne(noteId);
      Notes.update(id, { $set: { archived: !note.archived } });
    }
  },
  
  sendShare: function (noteId, email) {
    if (ownsNote(Meteor.userId(), noteId)) {
      var user = Meteor.users.findOne({ emails: { $elemMatch: { address: email } } });
      if (user) {
        var userNote = UserNotes.findOne({ userId: user._id, noteId: noteId });
        if (!! userNote) {
          throw new Meteor.Error('errorMessage', email + ' is already sharing.');
        }
        
        UserNotes.insert({
          userId: user._id, 
          noteId: noteId, 
          accepted: false,
          position: userNotePosition()
        });
      } else {
        var shareToken = ShareTokens.findOne({ noteId: noteId, email: email });

        // Return because token already exists
        if (shareToken) {
          throw new Meteor.Error('errorMessage', 'Invite has already been sent.');
        }
        
        if (Meteor.isServer) {
          var token = Random.hexString(20).toLowerCase();
          shareTokenId = ShareTokens.insert({ token: token, noteId: noteId, email: email });

          this.unblock();

          var userEmail = Meteor.user().emails[0].address;
          var text = Meteor.absoluteUrl() + 'register/' + token;

          Email.send({
            to: email,
            from: 'no-reply@' + Meteor.absoluteUrl().replace('http://', '').replace('https://', '').replace('/', '').split(':')[0],
            subject: userEmail + ' shared a note on Jot.',
            html: text
          });
        }
      }
    }

  },
  
  createFromToken: function (token) {
    var shareToken = ShareTokens.findOne({ token: token });
    if (shareToken) {
      UserNotes.insert({
        userId: Meteor.userId(),
        noteId: shareToken.noteId,
        accepted: true,
        position:0
      });
      ShareTokens.remove(shareToken._id);
    }
  },
  
  deleteCompleted: function (noteId) {
    if (ownsNote(Meteor.userId(), noteId)) {
      Tasks.remove({ noteId: noteId, completed: true });
    }
  } 
});



