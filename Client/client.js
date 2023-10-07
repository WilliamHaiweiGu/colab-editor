import ShareDBClient from 'sharedb/lib/client'


const socket = new WebSocket('ws://localhost:8080');
const connection = new ShareDBClient.Connection(socket);
const doc = connection.get('documents', 'plaintext');


doc.subscribe((err) => {
    if (err) throw err;
    if (doc.type === null)
        doc.create({content: ''});  // Initialize the document if it doesn't exist

    doc.on('op', () => {
        console.log('Received change');
        document.getElementById('editor').value = doc.data.content;
        console.log('Applied received change');
    });
});

document.getElementById('editor').addEventListener('input', (e) => {
    console.log('Detected change');
    const op = [{p: ['content'], oi: e.target.value}];
    doc.submitOp(op);
    console.log('Sent change');
});
