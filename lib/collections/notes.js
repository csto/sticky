UserNotes = new Mongo.Collection('userNotes');
Notes = new Mongo.Collection('notes');
Tasks = new Mongo.Collection('tasks');
ShareTokens = new Mongo.Collection('shareTokens');

UserNotes.attachSchema([Schema.UserNotes, Schema.Base]);
Notes.attachSchema([Schema.Notes, Schema.Base]);
Tasks.attachSchema([Schema.Tasks, Schema.Base]);
ShareTokens.attachSchema([Schema.ShareTokens, Schema.Base]);

GroundDB(Meteor.users);
GroundDB(UserNotes);
GroundDB(Notes);
GroundDB(Tasks);
GroundDB(ShareTokens);

Notes.allow({
  update: function (userId, note) {
    return ownsNote(userId, note._id);
  }
});

Notes.deny({
  update: function (userId, note, fieldNames) {
    return (_.without(fieldNames, 'title', 'content', 'archived', 'updatedAt').length > 0);
  }
});

var userNotePosition = function () {
  var topUserNote = UserNotes.findOne({}, { sort: { position: 1 } });
  if (topUserNote) {
    var position = topUserNote.position - 1;
  } else {
    var position = 0;
  }
}

Meteor.methods({
  createNote: function (noteAttributes) {
    if (noteAttributes.task) {
      var task = noteAttributes.task;
      
      noteAttributes = {
        title: '',
        kind: 'list'
      }

      noteId = Notes.insert(noteAttributes);
      
      var taskAttributes = {
        content: task,
        noteId: noteId
      }
      
      Tasks.insert(taskAttributes);
    }else{
      noteAttributes =  _.pick(noteAttributes, 'title', 'content', 'kind');
      noteId = Notes.insert(noteAttributes);
    }

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
        if (userNote) {
          return Messages.insert({ content: email + ' is already sharing.' })
        }
        
        UserNotes.insert({
          userId: user._id, 
          noteId: noteId, 
          accepted: true,
          position: userNotePosition()
        });
      } else {
        var shareToken = ShareTokens.findOne({ noteId: noteId, email: email });

        // Return because token already exists
        if (shareToken) {
          Messages.insert({ content: 'Invite has already been sent.' });
          return;
        }

        var token = Random.hexString(20).toLowerCase();
        ShareTokens.insert({ token: token, noteId: noteId, email: email });
      
        this.unblock();

        var userEmail = Meteor.user().emails[0].address;

        Email.send({
          to: email,
          from: 'no-reply@' + Meteor.absoluteUrl().replace('http://', '').replace('https://', '').replace('/', '').split(':')[0],
          subject: "",
          text: Meteor.absoluteUrl() + "sign-in?token=" + token
        });
      }
    }

  },
  
  deleteCompleted: function (noteId) {
    if (ownsNote(Meteor.userId(), noteId)) {
      Tasks.remove({ noteId: noteId, completed: true });
    }
  } 
});



