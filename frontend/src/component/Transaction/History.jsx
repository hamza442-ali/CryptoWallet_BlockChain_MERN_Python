import React, { useState, useEffect } from 'react';
import axios from 'axios';
// ... (imports)
// ... (your existing imports)

export const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [userInformation, setUserInformation] = useState({});

  const viewTransactions = () => {
    const publickey = userInformation.publicKey;

    axios
      .get('http://localhost:3001/transaction/get', {
        params: {
          publicKey: publickey
        }
      })
      .then(response => {
        console.log('Bitcoin sent successfully:', response.data);
        // Update transactions state with the received data
        setTransactions(response.data.data);
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

  // Function to truncate long public keys
  const truncatePublicKey = (key, maxLength = 25) => {
    if (key.length <= maxLength) {
      return key;
    }
    return key.substring(0, maxLength) + '...';
  };

  // Function to format date
  const formatTimestamp = (timestamp) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
    return new Date(timestamp).toLocaleString('en-US', options);
  };

  return (
    <div className="p-8 ml-32">
      <h1 className="text-2xl font-bold">Bitcoin Transaction History</h1>

      {/* Button to trigger viewTransactions */}
      <button className="bg-blue-500 text-white p-2 rounded-md mt-4" onClick={viewTransactions}>
        View Transactions
      </button>

      <div className="p-8">
        <table className="w-full border-collapse border">
          <thead className="bg-black text-white">
            <tr>
              <th className="p-3 text-center">Sender</th>
              <th className="p-3 text-center">Receiver</th>
              <th className="p-3 text-center">Amount (BTC)</th>
              <th className="p-3 text-center">Timestamp</th>
              <th className="p-3 text-center">Fee</th>
              <th className="p-3 text-center">Priority</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction._id} className="border-t hover:bg-gray-100">
                <td className="p-3 text-center">{truncatePublicKey(transaction.senderAddress)}</td>
                <td className="p-3 text-center">{truncatePublicKey(transaction.recipientAddress)}</td>
                <td className="p-3 text-center">{transaction.amount}</td>
                <td className="p-3 text-center">{formatTimestamp(transaction.date)}</td>
                <td className="p-3 text-center">{transaction.fee}</td>
                <td className="p-3 text-center">{transaction.priority}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
