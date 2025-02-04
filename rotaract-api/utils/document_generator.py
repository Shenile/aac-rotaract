from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from io import BytesIO
from reportlab.lib.styles import getSampleStyleSheet

def prepare_data(data, filters = None):

    pdf_buffer = BytesIO()


    # Extract the keys (excluding 'id') and format headers
    headers = [header.replace("_", " ").title() for header in data[0].keys() if header != 'id']
    print(f'Headers : {headers}')



    # Extract and process student data
    processed_data = [
        [s_data for idx, s_data in enumerate(student.values()) if idx != 0]
        for student in data
    ]

    # Add headers as the first row in the table
    processed_data.insert(0, headers)

    pdf = SimpleDocTemplate(pdf_buffer, pagesize=A4,
                            leftMargin=30, rightMargin=30,
                            topMargin=30, bottomMargin=30)

    styles = getSampleStyleSheet()
    header_style = styles['Heading1']
    para_style = styles['Normal']



    # Header for the PDF
    header = Paragraph("Rotaract Students Data", header_style)

    if filters:
        filter_explanation = "The following data is filtered based on the following criteria: ("

        filter_details = []
        if filters.get("gender"):
            filter_details.append(f"Gender: <font color='{colors.blue}'>{filters['gender']}</font>")
        if filters.get("department"):
            filter_details.append(f"Department: <font color='{colors.blue}'>{filters['department']}</font>")
        if filters.get("batch"):
            filter_details.append(f"Batch: <font color='{colors.blue}'>{filters['batch']}</font>")
        if filters.get("sortBy"):
            filter_details.append(f"Sorted By: <font color='{colors.blue}'>{filters['sortBy'].title()}</font>")

        filter_explanation += "" + (", ".join(filter_details)) + ")."
    else:
        filter_explanation = f"Showing all student data <font color='{colors.grey}'> (No filters applied) </font>"


    filter_paragraph = Paragraph(filter_explanation, para_style)

    # Create the table with the data
    table = Table(processed_data)

    # Add table styles
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.green),  # Header row background
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),  # Header text color
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),  # Center align all cells
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),  # Bold header font
        ('FONTSIZE', (0, 0), (-1, -1), 7),  # Set font size for all
        ('BOTTOMPADDING', (0, 0), (-1, 0), 6),  # Padding for header
        ('TOPPADDING', (0, 0), (-1, -1), 6),  # Padding for all rows
        ('GRID', (0, 0), (-1, -1), 0.5, colors.lightgrey),  # Grid lines for the table
        ('WORDWRAPPING', (0, 0), (-1, -1), True),  # Enable word wrapping in all cells
        ('BACKGROUND', (0, 1), (-1, -1), colors.white),  # Background for data rows
    ]))


    pdf.build([header, filter_paragraph, Spacer(1, 12), table])


    # Seek the beginning of the buffer to stream from the start
    pdf_buffer.seek(0)

    return pdf_buffer



