Schema = {};

Schema.Base = new SimpleSchema({
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      }
    }
  },

  updatedAt: {
    type: Date,
    autoValue: function() {
      return new Date();
    }
  }
});

Schema.UserNotes = new SimpleSchema({
  userId: {
    type: String,
    label: 'User',
    denyUpdate: true
  },

  noteId: {
    type: String,
    label: 'Note',
    denyUpdate: true
  },

  isOwner: {
    type: Boolean,
    label: 'Owner',
    defaultValue: false
  },
  
  accepted: {
    type: Boolean,
    label: 'Accepted',
    defaultValue: false
  },
  
  position: {
    type: Number,
    label: 'Position',
    defaultValue: 0
  }
});


Schema.Notes = new SimpleSchema({
  title: {
    type: String,
    label: 'Title',
    max: 100,
    optional: true,
    defaultValue: ''
  },

  content: {
    type: String,
    label: 'Content',
    max: 10000,
    optional: true,
    defaultValue: ''
  },

  kind: {
    type: String,
    label: 'Kind',
    allowedValues: ['note', 'list']
  },

  archived: {
    type: Boolean,
    label: 'Archived',
    defaultValue: false
  }
});

Schema.Tasks = new SimpleSchema({
  noteId: {
    type: String,
    label: 'Note',
    denyUpdate: true
  },
  
  content: {
    type: String,
    label: 'Content',
    max: 1000
  },
  
  position: {
    type: Number,
    label: 'Position',
    defaultValue: 0
  },

  completed: {
    type: Boolean,
    label: 'Completed',
    defaultValue: false
  },
});

Schema.ShareTokens = new SimpleSchema({
  noteId: {
    type: String,
    label: 'Note',
    denyUpdate: true
  },
  
  token: {
    type: String,
    label: 'Token',
    min: 20,
    max: 20
  },

  email: {
    type: String,
    label: 'Email',
    regEx: SimpleSchema.RegEx.Email
  }
});
