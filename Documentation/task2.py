# Import the hashlib library to use SHA-256 hashing.
import hashlib

# Define a function to calculate the SHA-256 hash of a given value.
def hash_function(value):
    return hashlib.sha256(value.encode()).hexdigest()

# Define a function to build a Merkle tree from a list of transactions.
def build_merkle_tree(transactions):
    # Calculate the hash of each transaction and store them in a list.
    tree = [hash_function(transaction) for transaction in transactions]

    # Continue hashing pairs of transactions until there's only one root hash left.
    while len(tree) > 1:
        tree = [hash_function(tree[i] + tree[i + 1]) for i in range(0, len(tree), 2)]

    # Return the root hash of the Merkle tree.
    return tree[0]

# Define a function to print the structure of the Merkle tree.
def print_tree_structure(tree, indent=""):
    # If there's only one hash, print it with a "+" symbol.
    if len(tree) == 1:
        print(indent + "+-- " + tree[0])
    else:
        # If there are more hashes, split them into left and right subtrees and print them.
        mid = len(tree) // 2
        left_tree = tree[:mid]
        right_tree = tree[mid:]

        # Print the current hash with a "|" symbol and recurse into left and right subtrees.
        print(indent + "|-- " + tree[0])
        print_tree_structure(left_tree, indent + "|   ")
        print_tree_structure(right_tree, indent + "|   ")

# Define a function to generate dummy transactions based on the given number.
def generate_dummy_transactions(num_transactions):
    return [f"Tx{i}" for i in range(1, num_transactions+1)]

def generate_proof(transactions, target_transaction):
    # Check if the target transaction exists in the list of transactions.
    if target_transaction not in transactions:
        return ["Transaction not found"]

    # Find the index of the target transaction.
    target_index = transactions.index(target_transaction)
    
    # Calculate the hash of all transactions and build the proof list.
    tree = [hash_function(transaction) for transaction in transactions]
    proof = []

    while len(tree) > 1:
        # Determine the sibling hash and add it to the proof.
        if target_index % 2 == 0:
            sibling = tree[target_index + 1]
        else:
            sibling = tree[target_index - 1]

        proof.append(sibling)
        target_index = target_index // 2

        # Recalculate the tree by hashing pairs of hashes.
        tree = [hash_function(tree[i] + tree[i + 1]) for i in range(0, len(tree), 2)]

    # Return the proof for the target transaction.
    return proof

def verify_proof(root_hash, target_transaction, proof):
    computed_hash = hash_function(target_transaction)

    print(f"\nVerification Steps:")
    print(f"Initial Hash (Target Transaction): {computed_hash}")

    for i, proof_hash in enumerate(proof):
        # Determine the order of concatenation and recompute the hash.
        if computed_hash < proof_hash:
            combined = computed_hash + proof_hash
        else:
            combined = proof_hash + computed_hash
        computed_hash = hash_function(combined)

        print(f"Step {i + 1}: Concatenate {computed_hash} and {proof_hash} -> {combined}")
        print(f"         Recompute Hash: {computed_hash}")

    # Check if the computed hash matches the root hash.
    print(f"\nFinal Computed Hash: {computed_hash}")
    print(f"Root Hash: {root_hash}")
    return computed_hash == root_hash



# Take the number of transactions as input from the user.
num_transactions = int(input("Enter the number of transactions: "))

# Generate dummy transactions based on the user's input.
transactions = generate_dummy_transactions(num_transactions)

# Build the Merkle tree and calculate its root hash.
root_hash = build_merkle_tree(transactions)

# Take the target transaction as input from the user.
target_transaction = input("Enter the target transaction: ")

# Generate a proof for the target transaction.
proof = generate_proof(transactions, target_transaction)

# Print the structure of the Merkle tree.
print("\nMerkle Tree Structure:")
print_tree_structure([hash_function(transaction) for transaction in transactions])

# Verify the proof and check if it's valid.
is_valid = verify_proof(root_hash, target_transaction, proof)

# Display the results to the user.
print(f"\nRoot hash: {root_hash}")
print(f"Target transaction: {target_transaction}")
print(f"Target transaction Hash: {hash_function(target_transaction)}")

print("\nMerkle proof:")
for i, item in enumerate(proof):
    print(f"Level {i+1}: {item}")

print(f"Is valid proof: {is_valid}")
