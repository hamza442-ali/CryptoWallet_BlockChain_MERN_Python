import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const Send = () => {
  const [receiverPublicKey, setReceiverPublicKey] = useState('');
  const [amount, setAmount] = useState('');
  const [priority, setPriority] = useState('low'); // Default priority is set to 'low'
  const [userInformation, setUserInformation] = useState({});

  const handleSendBitcoin = () => {
    const publickey = userInformation.publicKey;
    const privatekey = userInformation.privateKey;
  
    const requestData = {
      receiverPublicKey,
      amount: parseFloat(amount),
      publickey,
      privatekey,
      priority, // Include priority in the request data
    };
  
    axios
      .post('http://localhost:3001/transaction/create', requestData)
      .then(response => {
        console.log('Bitcoin sent successfully:', response.data);
  
        // Clear form fields after successful submission
        setReceiverPublicKey('');
        setAmount('');
        setPriority('low');
      })
      .catch(error => {
        // Handle errors from the backend
        console.error('Error sending Bitcoin:', error);
      });
  };

  useEffect(() => {
    // Retrieve user information from localStorage
    const storedUserInformation = localStorage.getItem('userInformation');

    if (storedUserInformation) {
      try {
        // Parse the JSON string to get the user object
        const user = JSON.parse(storedUserInformation);
        // Update the component state with the user information
        setUserInformation(user);
      } catch (error) {
        console.error('Error parsing user information:', error);
      }
    }
  }, []);

  return (
    <div className="p-8 mx-auto max-w-md">
      <h1 className="text-2xl font-bold mb-4">Send Bitcoin</h1>

      <div className="mb-4">
        <label htmlFor="receiverPublicKey" className="block text-sm font-semibold mb-2">
          Receiver's Public Key:
        </label>
        <input
          type="text"
          id="receiverPublicKey"
          className="w-full border rounded p-2"
          value={receiverPublicKey}
          onChange={(e) => setReceiverPublicKey(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="amount" className="block text-sm font-semibold mb-2">
          Amount (BTC):
        </label>
        <input
          type="number"
          id="amount"
          className="w-full border rounded p-2"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="priority" className="block text-sm font-semibold mb-2">
          Priority:
        </label>
        <select
          id="priority"
          className="w-full border rounded p-2"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="low">Low</option>
          <option value="high">High</option>
        </select>
      </div>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        onClick={handleSendBitcoin}
      >
        Send Bitcoin
      </button>
    </div>
  );
};
