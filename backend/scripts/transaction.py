
import sys
import json

# Read data from stdin
data = sys.stdin.read()

# Parse JSON data
input_data = json.loads(data)



# Transaction 
class Transaction:
    def __init__(self, sender, receiver, amount, signature=None):
        self.sender = sender
        self.receiver = receiver
        self.amount = amount
        self.signature = signature

    def __str__(self):
        return f"{self.sender} -> {self.receiver}: {self.amount}"

# Key Pairs

def generate_keys_for_nodes(num_nodes):
    with open("public_keys.txt", "w") as f:
        for i in range(num_nodes):
            private_key, public_key = generate_keypair()
            
            # Convert public key to PEM format
            pem = public_key.public_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PublicFormat.SubjectPublicKeyInfo
            )
            
            # Write the public key to the file with a block number
            f.write(f"Block {i}:\n")
            f.write(pem.decode() + "\n\n")

 # 1. Genesis Block:
from datetime import datetime
import hashlib

class Block:
    def __init__(self, index, timestamp, transactions, previous_hash):
        self.index = index
        self.timestamp = timestamp
        self.transactions = transactions
        self.previous_hash = previous_hash
        self.nonce = 0
        self.hash = self.hash_block()

    def hash_block(self):
        # Combine all transaction data into one string
        combined_data = ''.join(str(tx) for tx in self.transactions)
        return hashlib.sha256(f"{self.index}{self.timestamp}{combined_data}{self.previous_hash}{self.nonce}".encode()).hexdigest()



def make_genesis_block():
    """Make the first block in a block-chain."""
    return Block(index=0, timestamp=datetime.now(), transactions=["Genesis Block"], previous_hash="0")

# 2. Key Pair Generation:

# Using the cryptography library:


from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import ec

def generate_keypair():
    private_key = ec.generate_private_key(ec.SECP256R1(), default_backend())
    public_key = private_key.public_key()

    return private_key, public_key


# 3. Digital Signature:
from cryptography.hazmat.primitives import hashes

def sign_transaction(private_key, data):
    signature = private_key.sign(data.encode(), ec.ECDSA(hashes.SHA256()))
    return signature



import json

def create_block_with_transaction(pre_block, signed_transaction):
    """Create a new block with a single signed transaction."""
    index = pre_block.index + 1
    timestamp = datetime.now()

    # Create a Transaction object with the provided signed_transaction
    transaction = Transaction(
        sender=signed_transaction['sender'],
        receiver=signed_transaction['receiver'],
        amount=signed_transaction['amount'],
        signature=signed_transaction['signature']
    )

    # Read the hash of the previous block from preBlock.json
    pre_block_filename = "preBlock.json"
    with open(pre_block_filename, 'r') as pre_block_file:
        pre_block_data = json.load(pre_block_file)
        previous_hash = pre_block_data['hash']

    # Create a new Block
    block = Block(index, timestamp, [transaction], previous_hash)

    # Mining process to find a valid nonce
    target_difficulty = "00000"
    start_time = time.time()
    increment = 1  # Initialize increment value

    while not block.hash.startswith(target_difficulty):
        block.nonce += increment  # Adjust the nonce by the increment value
        block.hash = block.hash_block()
        if time.time() - start_time > 600:  # 10 minutes
            print("Refreshing timestamp and retrying...")
            block.timestamp = datetime.now()  # Refresh the timestamp
            start_time = time.time()  # Reset the start time
            increment += 1  

    # Print mining information
    print(f"Block #{index} mined successfully.")
    print(f"Hash: {block.hash}")
    print(f"Nonce: {block.nonce}")
    print(f"Time taken: {time.time() - start_time} seconds")

    return block


# 4. Mining and New Blocks:
import time

def next_block(pre_block, transactions=[]):
    index = pre_block.index + 1
    timestamp = datetime.now()

    # Sign each transaction
    private_key, _ = generate_keypair()
    for transaction in transactions:
        signature = sign_transaction(private_key, str(transaction))
        transaction.signature = signature

    block = Block(index, timestamp, transactions, pre_block.hash)


    # Print block information
    print(f"Creating Block #{index}")
    print(f"Timestamp: {timestamp}")
    # print(f"Data: {data}")
    print(f"Previous Hash: {pre_block.hash}")

    # Mining
    target_difficulty = "000"
    start_time = time.time()
    increment = 1  # Initialize increment value

    while not block.hash.startswith(target_difficulty):
        block.nonce += increment  # Adjust the nonce by the increment value
        block.hash = block.hash_block()
        if time.time() - start_time > 600:  # 10 minutes
            print("Refreshing timestamp and retrying...")
            block.timestamp = datetime.now()  # Refresh the timestamp
            start_time = time.time()  # Reset the start time
            increment += 1  

    # Print mining information
    print(f"Block #{index} mined successfully.")
    print(f"Hash: {block.hash}")
    print(f"Nonce: {block.nonce}")
    print(f"Time taken: {time.time() - start_time} seconds")

    return block
# 5. Chain of Blocks:
def create_blockchain():
    blockchain = [make_genesis_block()]

    for i in range(1, 2):
        # Generate a list of demo transactions for each block
        transactions = []
        for j in range(20):  # 20 transactions
            sender = f"Alice_{j}"
            receiver = f"Bob_{j}"
            amount = (i * 100) + j  # example amount
            transaction = Transaction(sender, receiver, amount)
            transactions.append(transaction)

        blockchain.append(next_block(blockchain[-1], transactions))

    return blockchain

def hash_key(key):
    sha256 = hashlib.sha256()
    sha256.update(key)
    return sha256.hexdigest()

def pubKey_Sigkey():
    # Generate key pair
    private_key, public_key = generate_keypair()

    # Convert private key to raw bytes and hash
    private_key_hash = hash_key(private_key.private_bytes(
        encoding=serialization.Encoding.DER,
        format=serialization.PrivateFormat.TraditionalOpenSSL,
        encryption_algorithm=serialization.NoEncryption()
    ))

    # Convert public key to raw bytes and hash
    public_key_hash = hash_key(public_key.public_bytes(
        encoding=serialization.Encoding.DER,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    ))

    print(private_key_hash, public_key_hash)
    # Return the hashed private and public keys
    return private_key_hash, public_key_hash



def write_block_to_file(block):
    filename = "blockchain.json"
    pre_block_filename = "preBlock.json"
    
    # Write to blockchain.json
    with open(filename, 'a') as f:  # Use append mode 'a'
        block_data = {
            'index': block.index,
            'timestamp': str(block.timestamp),
            'transactions': [],
            'previous_hash': block.previous_hash,
            'nonce': block.nonce,
            'hash': block.hash
        }

        for tx in block.transactions:
            if isinstance(tx, Transaction):
                tx_data = {
                    'sender': tx.sender,
                    'receiver': tx.receiver,
                    'amount': tx.amount,
                    'signature': tx.signature.hex() if tx.signature else None  # Convert bytes to hexadecimal
                }
                block_data['transactions'].append(tx_data)

        # Check if the file is empty (new file), if not, add a comma to separate blocks
        if f.tell() != 0:  # Check if it's not the first block
            f.write(',')

        json.dump(block_data, f, indent=2)

    print(f"Block #{block.index} written to {filename}")

    # Write to preBlock.json, overwriting the previous block
    with open(pre_block_filename, 'w') as pre_block_file:  # Use write mode 'w'
        pre_block_data = {
            'index': block.index,
            'timestamp': str(block.timestamp),
            'transactions': [],
            'previous_hash': block.previous_hash,
            'nonce': block.nonce,
            'hash': block.hash
        }

        for tx in block.transactions:
            if isinstance(tx, Transaction):
                tx_data = {
                    'sender': tx.sender,
                    'receiver': tx.receiver,
                    'amount': tx.amount,
                    'signature': tx.signature.hex() if tx.signature else None  # Convert bytes to hexadecimal
                }
                pre_block_data['transactions'].append(tx_data)

        json.dump(pre_block_data, pre_block_file, indent=2)

    print(f"Block #{block.index} written to {pre_block_filename}")








import json

# Main
# Main
if __name__ == "__main__":
    num_nodes = 20  # or any number you want
    generate_keys_for_nodes(num_nodes)

    # blockchain = create_blockchain()

    blockchain = [make_genesis_block()]

    # # Displaying transactions for each block
    # for block in blockchain:
    #     print(f"Block #{block.index} Transactions:")
    #     for tx in block.transactions:
    #         if isinstance(tx, Transaction):  # Check if it's a Transaction object
    #             print(f"Sender: {tx.sender}")
    #             print(f"Receiver: {tx.receiver}")
    #             print(f"Amount: {tx.amount}")
    #             print(f"Signature: {tx.signature}")
    #             print("------")
    #     print("\n")


 

    # Access individual values
    receiver_public_key =input_data['receiverPublicKey']
    amount = input_data['amount']
    public_key = input_data['publickey']
    private_key = input_data['privatekey']

    # Print or use the values as needed
    # print("Receiver Public Key:", receiver_public_key)
    # print("Amount:", amount)
    # print("Public Key:", public_key)
    # print("Private Key:", private_key)

    private_key_bytes = bytes.fromhex(private_key)

    private_key = ec.derive_private_key(
        int.from_bytes(private_key_bytes, 'big'),
        ec.SECP256R1(),
        default_backend()
    )

    data = receiver_public_key + str(amount) + public_key
    signedTransaction = sign_transaction(private_key,data )

    print(signedTransaction, " Signed Transaction")

    signed_transaction = {

        'sender': public_key,
        'receiver': receiver_public_key,
        'amount': amount,
        'signature': sign_transaction(private_key, data)
    }

    blockchain.append(create_block_with_transaction(blockchain[-1], signed_transaction))
    write_block_to_file(blockchain[-1])

    print()
    latest_block = blockchain[-1]
    print(f"Block #{latest_block.index} Transactions:")
   
    for tx in latest_block.transactions:
        if isinstance(tx, Transaction):  # Check if it's a Transaction object
            print(f"Sender: {tx.sender}")
            print(f"Receiver: {tx.receiver}")
            print(f"Amount: {tx.amount}")
            print(f"Nounce: {latest_block.nonce}")
            print(f"Previous Hash: {latest_block.previous_hash}")
            print(f"Current Hash: {latest_block.hash}")
            print(f"Signature: {tx.signature}")
            print("------")
    print("\n")
  









