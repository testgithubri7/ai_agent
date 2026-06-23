import faiss
import json
import numpy as np
import sys

# Load FAISS index
import os

current_dir = os.path.dirname(
    os.path.abspath(__file__)
)

index_path = os.path.join(
    current_dir,
    "faiss_index.bin"
)

index = faiss.read_index(
    index_path
)

# Read JSON from stdin
input_data = json.loads(sys.stdin.read())

# Get embedding
query_embedding = np.array(
    [input_data["embedding"]],
    dtype=np.float32
)

# Search top 3 results
distances, indices = index.search(
    query_embedding,
    3
)

# Return JSON
result = {
    "indices": indices[0].tolist(),
    "distances": distances[0].tolist()
}

print(json.dumps(result))