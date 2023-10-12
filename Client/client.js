import ShareDBClient from 'sharedb-client'
import ReconnectingWebSocket from 'reconnecting-websocket';

const sharedbPort = 8080;
const opKeyWord = 'op';
const inputKeyWord = 'input';
/** @returns The 'unsubsribe' runnable*/
const subscribeCollab = htmlEditArea => {
    const rws = new ReconnectingWebSocket(`ws://localhost:${sharedbPort}`);
    const connection = new ShareDBClient.Connection(rws);
    const doc = connection.get('documents', 'plaintext');

    const fetch = () => {
        htmlEditArea.value = doc.data.content;
    }

    doc.subscribe((err) => {
        if (err) throw err;
        if (doc.type === null)
            doc.create({ content: '' });
        fetch();
        doc.on(opKeyWord, fetch);
    });

    const sendInput = (e) => {
        const op = [{ p: ['content'], oi: e.target.value }];
        doc.submitOp(op);
    }

    htmlEditArea.addEventListener(inputKeyWord, sendInput);

    return () => {
        doc.removeListener('op', fetch);
        doc.unsubscribe((err) => {
            if (err) console.error('Error unsubscribing:', err);
            else console.log('Unsubscribed successfully');
        });
        rws.close(1000, 'Closing connection normally'); // 1000 is the standard WebSocket close code for normal closure
        htmlEditArea.removeEventListener(inputKeyWord, sendInput);
    }
}

const unsubsribeRunnable = subscribeCollab(document.getElementById('editor')/*,id1,id2 or session_id*/);

//TEST
window.test = unsubsribeRunnable