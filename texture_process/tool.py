from PIL import Image

SCALE = 8

def dscale(image_path, output_path, scale=SCALE):
    """
    将放大的像素图恢复原始大小
    """

    img = Image.open(image_path)

    width, height = img.size
    new_width = width // scale
    new_height = height // scale
    
    # 使用最近邻插值保持像素风格
    img_resized = img.resize((new_width, new_height), Image.NEAREST)
    img_resized.save(output_path)
    print(f"已保存为 {output_path}, 尺寸: {new_width}x{new_height}")
    return img_resized

