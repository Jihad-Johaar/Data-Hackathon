import pymupdf


def extract_pdf_text(pdf_bytes):
    document = pymupdf.open(
        stream=pdf_bytes,
        filetype="pdf"
    )

    pages = []

    for page_number in range(len(document)):
        page = document[page_number]

        pages.append({
            "page": page_number + 1,
            "text": page.get_text()
        })

    document.close()

    return pages