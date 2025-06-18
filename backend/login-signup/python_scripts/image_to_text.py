
# !pip install pytesseract pdf2image matplotlib opencv-python
import sys
import cv2
import pytesseract
from pdf2image import convert_from_path
import matplotlib.pyplot as plt
import os

# Set path to tesseract executable (only for Windows)
pytesseract.pytesseract.tesseract_cmd = r"python_scripts\Image to text via tesseract\tesseract.exe"

def img_to_string(image_path):
    """Extract text from an image file."""
    image = cv2.imread(image_path)

    # Show image
    # plt.imshow(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
    # plt.axis('off')
    # plt.show()

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    text = pytesseract.image_to_string(gray, lang='eng')
    print(text)
    return text



def pdf_to_text(pdf_path):
    """Convert PDF pages to images and extract text from each page."""
    pages = convert_from_path(pdf_path, dpi=300,poppler_path=r"C:\Users\hp\Desktop\dawa_ware\backend\login-signup\python_scripts\Poppler Release-24.08.0-0\poppler-24.08.0\Library\bin"
)
    text_all = ""

    for i, page in enumerate(pages):
        temp_img_path = f"temp_page_{i}.png"
        page.save(temp_img_path, 'PNG')

        # Show page as image
        img = cv2.imread(temp_img_path)
        # plt.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
        # plt.axis('off')
        # plt.show()

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        text = pytesseract.image_to_string(gray, lang='eng')
        text_all += f"\n--- Page {i + 1} ---\n{text}"

        os.remove(temp_img_path)
    
    print(text_all)
    return text_all


def auto_text(file_path):
    if file_path.lower().endswith('.pdf'):
        output_text = pdf_to_text(file_path)
    else:
        output_text = img_to_string(file_path)

    return output_text
file_path = sys.argv[1]

auto_text(file_path)






#WORKING DEMO FOR USECASE


# file_path = r'D:\Raghav\EVOLUTION\GOD_DEMON_IS_BACK\MEDICINE_API\files_for_test\TEXT_TEST.png'

# if file_path.lower().endswith('.pdf'):
#     output_text = pdf_to_text(file_path)
# else:
#     output_text = img_to_string(file_path)

# print("\nExtracted Text:\n", output_text)


# file_path = r'D:\Raghav\EVOLUTION\GOD_DEMON_IS_BACK\MEDICINE_API\files_for_test\Medical.pdf'

# if file_path.lower().endswith('.pdf'):
#     output_text = pdf_to_text(file_path)
# else:
#     output_text = img_to_string(file_path)

# print("\nExtracted Text:\n", output_text)