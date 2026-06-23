import json
import subprocess
import sys

# Load vector store
with open("../data/vectorStore.json", "r") as f:
    data = json.load(f)

vectors = data["vectors"]

# Take first embedding as test query
payload = {
    "embedding": vectors[0]["embedding"]
}

# Run search_faiss.py using the SAME Python executable
# that is currently running this script (the venv Python)
result = subprocess.run(
    [sys.executable, "search_faiss.py"],
    input=json.dumps(payload),
    text=True,
    capture_output=True
)

print("STDOUT:")
print(result.stdout)

print("\nSTDERR:")
print(result.stderr)

print("\nRETURN CODE:")
print(result.returncode)