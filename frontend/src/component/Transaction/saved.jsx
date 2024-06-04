import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [userInformation, setUserInformation] = useState({});

  const fetchTransactions = async () => {
    try {
      const publickey = userInformation.publicKey;
      console.log(userInformation.publicKey, " Public key in fetch function")
      const response = await axios.get(`http://localhost:3001/transaction/get?publicKey=${publickey}`);
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };
  


  useEffect(() => {
    // Retrieve user information from localStorage
    const storedUserInformation = localStorage.getItem('userInformation');
  
    console.log(storedUserInformation, " Stored info")
  
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
  
    fetchTransactions();
  
  }, []);
  

  return (
    <div className="p-8 ml-32">
      <h1 className="text-2xl font-bold">Bitcoin Transaction History</h1>

      <div className="p-8">
        <table className="w-full border-collapse border">
          <thead className="bg-black text-white">
            {/* Header row */}
          </thead>
          <tbody>
            {Array.isArray(transactions) && transactions.length > 0 ? (
              transactions.map((transaction) => (
                <tr key={transaction._id} className="border-t hover:bg-gray-100">
                  <td className="p-3 text-center">{transaction.senderAddress}</td>
                  <td className="p-3 text-center">{transaction.recipientAddress}</td>
                  <td className="p-3 text-center">{transaction.amount}</td>
                  <td className="p-3 text-center">{transaction.date}</td>
                  <td className="p-3 text-center">{transaction.fee}</td>
                  <td className="p-3 text-center">{transaction.priority}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-3 text-center">No transactions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};