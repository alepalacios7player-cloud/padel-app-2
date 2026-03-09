import React, { useState, useEffect } from 'react';
import { firestore } from './firebaseConfig'; // Adjust the path to your firebase config

const App = () => {
    const [data, setData] = useState([]);
    const [input, setInput] = useState(''); // To hold input for adding data

    // Fetch Data from Firestore
    useEffect(() => {
        const fetchData = async () => {
            const snapshot = await firestore.collection('yourCollectionName').get(); // Replace with your collection name
            const fetchedData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setData(fetchedData);
        };
        fetchData();
    }, []);

    // Create Data
    const createData = async () => {
        if (input) {
            await firestore.collection('yourCollectionName').add({ name: input }); // Adjust the data structure as needed
            setInput(''); // Clear input
            await fetchData(); // Refresh data
        }
    };

    // Update Data
    const updateData = async (id) => {
        const newName = prompt('Enter new name:'); // Prompt for new name
        if (newName) {
            await firestore.collection('yourCollectionName').doc(id).update({ name: newName });
            await fetchData(); // Refresh data
        }
    };

    // Delete Data
    const deleteData = async (id) => {
        await firestore.collection('yourCollectionName').doc(id).delete();
        await fetchData(); // Refresh data
    };

    return (
        <div>
            <h1>Firestore CRUD Example</h1>
            <input 
                type="text" 
                value={input} 
                onChange={(e) => setInput(e.target.value)}
                placeholder="Add new item"
            />
            <button onClick={createData}>Add</button>
            <ul>
                {data.map(item => (
                    <li key={item.id}>
                        {item.name} 
                        <button onClick={() => updateData(item.id)}>Edit</button>
                        <button onClick={() => deleteData(item.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;