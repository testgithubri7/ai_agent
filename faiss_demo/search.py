import json
import faiss

index = faiss.read_index(
    "faiss_index.bin"
)

print("Vectors In Index:", index.ntotal)

with open("../data/vectorStore.json", "r") as f:
    data = json.load(f)

vectors = data["vectors"]

import numpy as np

query_vector = np.array(
    [vectors[0]["embedding"]],
    dtype=np.float32
)

k = 3

distances, indices = index.search(
    query_vector,
    k
)

print("Distances:")
print(distances)

print("Indices:")
print(indices)

print("\nTop Results:\n")

for idx in indices[0]:
    print("Source:", vectors[idx]["source"])
    print("Chunk:", vectors[idx]["chunk"])
    print("-" * 50)