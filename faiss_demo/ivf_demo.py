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
quantizer = faiss.IndexFlatL2(dimension)

nlist = 2

index = faiss.IndexIVFFlat(
    quantizer,
    dimension,
    nlist
)

index.train(embeddings)

index.add(embeddings)

print("Is Trained:", index.is_trained)
print("Vectors:", index.ntotal)

index.nprobe = 2

print("nprobe:", index.nprobe)