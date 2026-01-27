import os
from tool import dscale

SCALE = 8
INPUT_DIR = "./input"
OUTPUT_DIR = "./output"

if __name__ == "__main__":
  for texture in os.listdir(INPUT_DIR):
      input_path = os.path.join(INPUT_DIR, texture)
      output_path = os.path.join(OUTPUT_DIR, texture)

      if not os.path.exists(OUTPUT_DIR):
          os.makedirs(OUTPUT_DIR)

      dscale(input_path, output_path, SCALE)
