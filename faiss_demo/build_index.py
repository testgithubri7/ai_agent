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

index = faiss.IndexFlatL2(dimension)

print("Index Created")

index.add(embeddings)

print("Vectors Added:", index.ntotal)

faiss.write_index(
    index,
    "faiss_index.bin"
)

print("Index Saved")

