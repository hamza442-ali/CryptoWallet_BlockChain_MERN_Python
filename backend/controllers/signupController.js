const User = require("../models/signupModel.js");
const { execSync } = require("child_process");
const crypto = require('crypto');
const bs58 = require('bs58');

function generateKeyPair() {
  try {
    const result = execSync("python scripts/assignment3.py pubKey_Sigkey", {
      encoding: "utf-8",
    });

    //  parse the result as JSON
    let parsedResult;
    try {
      // Extract everything within square brackets and then parse
      const jsonString = result.match(/\[.*?\]/);
      parsedResult = JSON.parse(jsonString[0]);
    } catch (jsonError) {
      console.error("Error parsing JSON:", jsonError);
      throw new Error("Invalid JSON format");
    }



    // Destructure the array directly
    const [privateKey, publicKey] = parsedResult;

    return { privateKey, publicKey };
  } catch (error) {
    console.error(error);
    throw new Error("Error generating key pair");
  }
}



const generateWalletAddress = (publicKey) => {
    // Step 1: Apply SHA-256 hashing to the public key
    const sha256Hash = crypto.createHash('sha256').update(publicKey, 'hex').digest('hex');

    // Step 2: Apply RIPEMD-160 hashing to the SHA-256 hash
    const ripemd160Hash = crypto.createHash('ripemd160').update(sha256Hash, 'hex').digest('hex');

    // Step 3: Add network identifier (e.g., Bitcoin mainnet version byte)
    const versionPrefixedHash = `00${ripemd160Hash}`;

    // Step 4: Apply SHA-256 hashing to the version-prefixed hash
    const doubleSha256Hash = crypto.createHash('sha256').update(versionPrefixedHash, 'hex').digest('hex');

    // Step 5: Apply SHA-256 hashing to the double SHA-256 hash
    const doubleSha256HashAgain = crypto.createHash('sha256').update(doubleSha256Hash, 'hex').digest('hex');

    // Step 6: Take the first 4 bytes as the checksum
    const checksum = doubleSha256HashAgain.substring(0, 8);

    // Step 7: Concatenate the version-prefixed hash and checksum
    const binaryAddress = versionPrefixedHash + checksum;

    // Step 8: Base58 encode the binary address
    const walletAddress = bs58.encode(Buffer.from(binaryAddress, 'hex'));

    return walletAddress;
};

const createUser = (req, res) => {
  const KeyPair = generateKeyPair();
  const { privateKey, publicKey } = KeyPair;


  const walletAddress = generateWalletAddress(publicKey);
  const bitcoin = 0
  console.log("Wallet Address" + walletAddress);

//   console.log("public" + publicKey);

  if (!req.body.name) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

        // Create a User
        const user = new User({
            userName: req.body.name,
            userEmail: req.body.email,
            password: req.body.password,
            privateKey,
            publicKey,
            walletAddress,
            bitcoin,
        });

  // Save User in the database
        user
            .save(user)
            .then((data) => {
            res.send(data);
            })
            .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the User.",
            });
            });
};







// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
      const user = await User.findOne({ userEmail: email });

      if (!user) {
          return res.status(404).send({
              message: "User not found with email " + email,
          });
      }

      // Compare hashed password during login
      if (user.password !== password) {
        console.log("Incorrect Password")
        return res.status(404).send({
            message: "Incorrect password",
        });
    }

      console.log(user);
      res.send(user);
  } catch (err) {
      res.status(500).send({
          message: err.message || "Some error occurred while logging in.",
      });
  }
};




module.exports = {
  createUser,
  loginUser,
};
