// Schema = {};

// Schema.base = new SimpleSchema({
//   createdAt: {
//     type: Date,
//     autoValue: function() {
//       if (this.isInsert) {
//         return new Date;
//       }
//     }
//   },

//   updatedAt: {
//     type: Date,
//     autoValue: function() {
//       if (this.isInsert) {
//         return new Date;
//       }
//       if (this.isUpdate) {
//         return new Date;
//       }
//     }
//   }
// });

// Schema.userNotes = new SimpleSchema({
//   userId: {
//     type: String,
//     label: 'User',
//     denyUpdate: true
//   },

//   noteId: {
//     type: String,
//     label: 'Note',
//     denyUpdate: true
//   },

//   isOwner: {
//     type: Boolean,
//     label: 'Owner',
//     defaultValue: false
//   }
// });


// Schema.notes = new SimpleSchema({
//   title: {
//     type: String,
//     label: 'Title',
//     max: 100,
//     optional: true
//   },

//   content: {
//     type: String,
//     label: 'Content',
//     max: 10000,
//     optional: true
//   },

//   kind: {
//     type: String,
//     label: 'Kind',
//     allowedValues: ['note', 'list']
//   },

//   archived: {
//     type: Boolean,
//     label: 'Archived',
//     defaultValue: false
//   },

//   position: {
//     type: Number,
//     label: 'Archived',
//     defaultValue: 0
//   }
// });

// Schema.tasks = new SimpleSchema({
//   content: {
//     type: String,
//     label: 'Content',
//     max: 1000
//   },

//   completed: {
//     type: Boolean,
//     label: 'Completed'
//   }
// });

// Schema.shareTokens = new SimpleSchema({
  
// });
