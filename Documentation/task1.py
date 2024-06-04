# Import the hashlib library to use SHA hashing and itertools for combinations.
import hashlib
import itertools

# Define a function to calculate a truncated SHA0.125 hash from input data.
def sha0_125(input_data):
    # Calculate the SHA256 hash of the input data.
    sha256_hash = hashlib.sha256(input_data.encode()).hexdigest()
    
    # Truncate it to the first 4 bytes (8 hex digits).
    truncated_hash = sha256_hash[:8]
    
    return truncated_hash

# Define a function to find a collision in the truncated hashes.
def find_collision():
    # Create a dictionary to store hash results mapped to input data.
    hash_to_input = {}
    
    # Get the character set and input length from the user.
    input_chars = input("Enter the character set: ")  # Characters to use in input data.
    input_length = int(input("Enter the input length: "))  # Length of input data.
    
    # Generate all possible combinations of input strings using the provided character set and length.
    for combination in itertools.product(input_chars, repeat=input_length):
        input_data = "".join(combination)
        
        # Calculate the SHA0.125 hash for the current input data.
        hash_result = sha0_125(input_data)
        
        # Check if this hash has been seen before and if it's not the same as the current input.
        if hash_result in hash_to_input and hash_to_input[hash_result] != input_data:
            # A collision is found! Print the details.
            print("Collision found!")
            print("Input 1:", hash_to_input[hash_result])
            print("Hash 1:", hash_result)
            print("Input 2:", input_data)
            print("Hash 2:", sha0_125(input_data))
            return
        else:
            # Store the hash result mapped to the current input data.
            hash_to_input[hash_result] = input_data

if __name__ == "__main__":
    # Call the find_collision function to search for hash collisions.
    find_collision()
