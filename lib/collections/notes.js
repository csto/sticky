UserNotes = new Meteor.Collection('userNotes');
Notes = new Meteor.Collection('notes');
Tasks = new Meteor.Collection('tasks');
ShareTokens = new Meteor.Collection('shareTokens');

UserNotes.allow({
  insert: function () {
    return true;
  },
  update: function () {
    return true;
  },
  remove: function () {
    return true;
  }
});

Notes.allow({
  insert: function () {
    return true;
  },
  update: function () {
    return true;
  },
  remove: function () {
    return true;
  }
});

Tasks.allow({
  insert: function () {
    return true;
  },
  
  update: function () {
    return true;
  },
  
  remove: function () {
    return true;
  }
});

Meteor.methods({
  createNote: function (noteAttributes) {
    console.log('creating note');
    var position = 0;
    var notes = Notes.find().fetch();
    if (notes.length > 0) {
      position = _.min(_.map(notes, function (note) { return note.position || 0 })) - 1;
    }
    
    if (noteAttributes.task) {
      var task = noteAttributes.task
      
      noteAttributes = {
        title: '',
        position: position,
        kind: 'list',
        archived: false,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime()
      }
      
      var taskAttributes = {
        content: task,
        position: 0,
        completed: false,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime()
      }
      
      noteId = Notes.insert(noteAttributes);
      Tasks.insert(_.extend(taskAttributes, { noteId: noteId }));
    }else{
      noteAttributes = _.extend(noteAttributes, { position: position, archived: false });
      noteId = Notes.insert(noteAttributes);
    }
    userNoteId = UserNotes.insert({
      userId: Meteor.userId(),
      noteId: noteId,
      accepted: true
    });
    return noteId;   
  },
  
  createTask: function (taskAttributes) {
    var task = _.extend(_.pick(taskAttributes, 'noteId', 'content', 'position'), {
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
      completed: false
    });
    
    Tasks.insert(task);
  },
  
  updateTask: function (id, taskAttributes) {
    taskAttributes = _.extend(taskAttributes, {
      updatedAt: new Date().getTime()
    });
    Tasks.update(id, { $set: taskAttributes })
  },
  
  archive: function (id) {
    var note = Notes.findOne(id);
    Notes.update(id, { $set: { archived: !note.archived } });
  },
  
  share: function (noteId, email) {
    var email = Random.hexString(20).toLowerCase();
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
    }else{
      var token = Random.hexString(20).toLowerCase();
      
      // check to see if share token already exists
      ShareTokens.insert({ token: token, noteId: noteId });
      
      this.unblock();

      Email.send({
        to: email,
        from: "corey@example.com",
        subject: "",
        text: Meteor.absoluteUrl() + "sign-in?token=" + token
      });
    }
  }
});



