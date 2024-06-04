from flask import Flask, jsonify, render_template, request
from flask_cors import CORS
from datetime import datetime
import hashlib
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization, hashes  # Add this line
from cryptography.hazmat.primitives.asymmetric import ec
import time
from flask import request
from cryptography.hazmat.primitives.asymmetric.ec import EllipticCurvePublicKey



app = Flask(__name__)
CORS(app)

# Transaction class
class Transaction:
    def __init__(self, sender, receiver, amount, signature=None):
        self.sender = sender
        self.receiver = receiver
        self.amount = amount
        self.signature = signature

    def __str__(self):
        return f"{self.sender} -> {self.receiver}: {self.amount}"

# Blockchain-related classes and functions
class Block:
    def __init__(self, index, timestamp, transactions, previous_hash):
        self.index = index
        self.timestamp = timestamp
        self.transactions = transactions
        self.previous_hash = previous_hash
        self.nonce = 0
        self.hash = self.hash_block()

    def hash_block(self):
        combined_data = ''.join(str(tx) for tx in self.transactions)
        return hashlib.sha256(f"{self.index}{self.timestamp}{combined_data}{self.previous_hash}{self.nonce}".encode()).hexdigest()

def make_genesis_block():
    return Block(index=0, timestamp=datetime.now(), transactions=["Genesis Block"], previous_hash="0")

def generate_keys_for_nodes(num_nodes):
    with open("public_keys.txt", "w") as f:
        for i in range(num_nodes):
            private_key, public_key = generate_keypair()

            pem = public_key.public_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PublicFormat.SubjectPublicKeyInfo
            )

            f.write(f"Block {i}:\n")
            f.write(pem.decode() + "\n\n")

def generate_keypair():
    private_key = ec.generate_private_key(ec.SECP256R1(), default_backend())
    public_key = private_key.public_key()

    # Return the key objects instead of their PEM representations
    return private_key, public_key



@app.route('/user/createUser', methods=['POST'])
def create_user():
    try:
        # Retrieve user details from the request
        user_data = request.get_json()

        # Generate key pair
        private_key, public_key = generate_keypair()

        # Add public key to user data
        user_data['publicKey'] = public_key

        # Note: Do not add the private key to the user_data dictionary

        # Save user in the database (your existing code)

        # Return only the public key in the response
        return jsonify({public_key, private_key})

    except Exception as e:
        print(f"Error creating user: {e}")
        return jsonify({"error": str(e)}), 500  # Return a 500 Internal Server Error response





def sign_transaction(private_key, data):
    signature = private_key.sign(data.encode(), ec.ECDSA(hashes.SHA256()))
    return signature

def next_block(pre_block, transactions=[]):
    index = pre_block.index + 1
    timestamp = datetime.now()

    private_key, _ = generate_keypair()
    for transaction in transactions:
        signature = sign_transaction(private_key, str(transaction))
        transaction.signature = signature

    block = Block(index, timestamp, transactions, pre_block.hash)

    target_difficulty = "000"
    start_time = time.time()
    increment = 1

    while not block.hash.startswith(target_difficulty):
        block.nonce += increment
        block.hash = block.hash_block()
        if time.time() - start_time > 600:
            print("Refreshing timestamp and retrying...")
            block.timestamp = datetime.now()
            start_time = time.time()
            increment += 1

    print(f"Block #{index} mined successfully.")
    print(f"Hash: {block.hash}")
    print(f"Nonce: {block.nonce}")
    print(f"Time taken: {time.time() - start_time} seconds")

    return block

def create_blockchain():
    blockchain = [make_genesis_block()]

    for i in range(1, 20):
        transactions = []
        for j in range(20):
            sender = f"Alice_{j}"
            receiver = f"Bob_{j}"
            amount = (i * 100) + j
            transaction = Transaction(sender, receiver, amount)
            transactions.append(transaction)

        blockchain.append(next_block(blockchain[-1], transactions))

    return blockchain

# Routes
@app.route('/get_blockchain', methods=['GET'])
def get_blockchain():
    return jsonify([block.__dict__ for block in blockchain])

@app.route('/')
def index():
    return render_template('index.html')  # Adjust the template path as needed

if __name__ == "__main__":
    num_nodes = 20  # or any number you want
    generate_keys_for_nodes(num_nodes)

    blockchain = create_blockchain()

    app.run(port=5000)  # Run Flask on port 5000
