UserNotes = new Mongo.Collection('userNotes');
Notes = new Mongo.Collection('notes');
Tasks = new Mongo.Collection('tasks');
ShareTokens = new Mongo.Collection('shareTokens');

// Notes.attachSchema(Schema.notes);

UserNotes.attachSchema([Schema.UserNotes, Schema.Base]);
Notes.attachSchema([Schema.Notes, Schema.Base]);
Tasks.attachSchema([Schema.Tasks, Schema.Base]);
ShareTokens.attachSchema([Schema.ShareTokens, Schema.Base]);

GroundDB(Meteor.users);
GroundDB(UserNotes);
GroundDB(Notes);
GroundDB(Tasks);
GroundDB(ShareTokens);

// UserNotes.allow({
//   insert: function () {
//     return true;
//   },
//   update: function () {
//     return true;
//   },
//   remove: function () {
//     return true;
//   }
// });

Notes.allow({
  update: function (userId, note) {
    return ownsNote(userId, note._id);
  }
});

Notes.deny({
  update: function (userId, note, fieldNames) {
    console.log('fields', fieldNames);
    return (_.without(fieldNames, 'title', 'content', 'archived').length > 0);
  }
});

Tasks.allow({
  insert: function () {
    return true;
  },

  update: function () {
    return true;
  },

  remove: function (userId, task) {
    return UserNotes.find({ userId: userId, noteId: task.noteId });
  }
});

Meteor.methods({
  createNote: function (noteAttributes) {
    var position = 0;
    var notes = Notes.find().fetch();
    if (notes.length > 0) {
      position = _.min(_.map(notes, function (note) { return note.position || 0 })) - 1;
    }
    
    if (noteAttributes.task) {
      noteAttributes = {
        title: '',
        position: position,
        kind: 'list'
      }

      noteId = Notes.insert(noteAttributes);
      
      var taskAttributes = {
        content: noteAttributes.task,
        noteId: noteId
      }
      
      Tasks.insert(taskAttributes);
    }else{
      noteAttributes = _.extend(
        _.pluck(noteAttributes, 'title', 'content'), { position: position, archived: false }
      );
      noteId = Notes.insert(noteAttributes);
    }

    userNoteId = UserNotes.insert({
      userId: Meteor.userId(),
      noteId: noteId,
      accepted: true,
      ownerId: Meteor.userId()
    });

    return noteId;   
  },
  
  // updateNote: function (noteId, noteAttributes) {    
  //   var note = _.pick(noteAttributes, 'title', 'content', 'archived');
    
  //   Notes.update(noteId, { $set: note });
  // },
  
  deleteNote: function (noteId) {
    if (ownsNote(Meteor.userId(), noteId)) {
      UserNotes.remove({ noteId: noteId });
      ShareTokens.remove({ noteId: noteId });
      Tasks.remove({ noteId: noteId });
      Notes.remove(noteId);
    }
  },
  
  createTask: function (taskAttributes) {
    var task = _.pick(taskAttributes, 'noteId', 'content', 'position');
    
    Tasks.insert(task);
  },
  
  updateTask: function (id, taskAttributes) {
    taskAttributes = _.extend(taskAttributes, {
      updatedAt: new Date().getTime()
    });
    Tasks.update(id, { $set: taskAttributes });
  },
  
  archive: function (id) {
    var note = Notes.findOne(id);
    Notes.update(id, { $set: { archived: !note.archived } });
  },
  
  sendShare: function (noteId, email) {
    var user = Meteor.users.findOne({ emails: { $elemMatch: { address: email } } });
    if (user) {
      var userNote = UserNotes.findOne({ userId: user._id, noteId: noteId });
      if (!userNote) {
        UserNotes.insert({
          userId: user._id, 
          noteId: noteId, 
          accepted: false
        });
      }
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
  },
  
  deleteCompleted: function (noteId) {
    Tasks.remove({ noteId: noteId, completed: true });
  } 
});



