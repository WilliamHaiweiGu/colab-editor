import ShareDBClient from 'sharedb-client'
import ReconnectingWebSocket from 'reconnecting-websocket';

const sharedb_port = 8080;
const subscribe_collab = html_edit_area => {
    const rws = new ReconnectingWebSocket(`ws://localhost:${sharedb_port}`);
    const connection = new ShareDBClient.Connection(rws);
    const doc = connection.get('documents', 'plaintext');

    doc.subscribe((err) => {
        if (err) throw err;
        if (doc.type === null)
            doc.create({ content: '' });

        doc.on('op', () => {
            console.log('Received change');
            html_edit_area.value = doc.data.content;
            console.log('Applied received change');
        });
    });

    html_edit_area.addEventListener('input', (e) => {
        console.log('Detected change');
        const op = [{ p: ['content'], oi: e.target.value }];
        doc.submitOp(op);
        console.log('Sent change');
    });
}

subscribe_collab(document.getElementById('editor'));