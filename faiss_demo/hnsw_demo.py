import json
import faiss

with open("../data/vectorStore.json", "r") as f:
    data = json.load(f)

vectors = data["vectors"]

print("Total Chunks:", len(vectors))

embeddings = []

for item in vectors:
    embeddings.append(item["embedding"])

print("Embeddings Loaded:", len(embeddings))

import numpy as np

embeddings = np.array(
    embeddings,
    dtype=np.float32
)

print(embeddings.shape)

dimension = embeddings.shape[1]

index = faiss.IndexHNSWFlat(
    dimension,
    4
)

print("Index Created")

index.add(embeddings)

print("Vectors:", index.ntotal)

query_vector = np.array(
    [vectors[0]["embedding"]],
    dtype=np.float32
)

distances, indices = index.search(
    query_vector,
    3
)

print(distances)
print(indices)