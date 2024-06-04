import React, { useState , useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

export const Home = () => {
 

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [revealedPrivateKey, setRevealedPrivateKey] = useState("");
  const [userInformation, setUserInformation] = useState({});

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleShowPrivateKey = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setPassword("");
  };

  const handleRevealPrivateKey = () => {
    

    if (password === userInformation.password) {

      setRevealedPrivateKey(userInformation.privateKey);
      handleModalClose();
    }else {
      
      console.error('Invalid password');
    }
  
  };

  const handleCopyPublicKey = () => {
    copyToClipboard(userInformation.publicKey);
    // Optionally, you can provide user feedback here (e.g., a toast notification)
  };

  const handleCopyPrivateKey = () => {
    copyToClipboard(revealedPrivateKey);
   
  };


  


  useEffect(() => {
    // Retrieve user information from localStorage
    const storedUserInformation = localStorage.getItem('userInformation');
    console.log(storedUserInformation, " User Info")

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
    <div className="p-16 mx-40">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold"> Account Detail</h1>
      </div>

      <div className="grid grid-cols-1 gap-8 px-4">
        <div className="bg-black rounded-lg shadow-md p-6 transition-transform transform hover:scale-105 bg-black text-white">
          <h1 className="text-2xl font-semibold mb-4">Wallet Address {":      "} {userInformation.walletAddress}</h1>
          <div className="flex flex-col border border-white p-4 ">
            <div className="text-2xl font-semibold mb-4">
              <span className="font-semibold">Account Holder:</span>{" "}
              {userInformation.userName}
            </div>
            <div className="flex items-center mb-4">
              <span className="font-semibold">Public Key:</span>{" "}
              <span className="ml-2 text-gray-600">
                {userInformation.publicKey}
              </span>
              <button
                className="ml-2 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                onClick={handleCopyPublicKey}
              >
                <FontAwesomeIcon icon={faCopy} />
              </button>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Amount:</span>{" "}
              <span style={{ fontSize: "2rem" }}>{userInformation.bitcoin}</span> BTC
            </div>
            <div className="flex items-center mb-4">
              <span className="font-semibold">Private Key:</span>{" "}
              {revealedPrivateKey ? (
                <>
                  <span className="ml-2 text-gray-600">
                    {revealedPrivateKey}
                  </span>
                  <button
                    className="ml-2 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                    onClick={handleCopyPrivateKey}
                  >
                    <FontAwesomeIcon icon={faCopy} />
                  </button>
                </>
              ) : (
                <button
                  className="ml-2 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                  onClick={handleShowPrivateKey}
                >
                  Show (Enter Password)
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <label htmlFor="password" className="block mb-2">
              Enter Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 mb-2 w-full"
            />
            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors mr-2"
                onClick={handleRevealPrivateKey}
              >
                Reveal Private Key
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                onClick={handleModalClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
