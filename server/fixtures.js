// Fixtures data
if (Notes.find().count() === 0) {
  Notes.insert({
    kind: 'note',
    title: 'Example Title',
    content: 'Do not forget.',
    position: 1,
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
    archived: false
  });
  
  var noteId = Notes.insert({
    kind: 'list',
    title: 'Note with tasks',
    position: 2,
    archived: false,
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
    archived: false
  });
  
  Tasks.insert({
    noteId: noteId,
    position: 1,
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
    content: '1',
    completed: false
  });
}